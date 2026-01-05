import React, { useState, useEffect, useRef, useMemo } from 'react'
import { LANGUAGES, CATEGORIES } from '../../data/mockData'
import { getVariableCatalogByCategory } from '../variables/variableCatalogByCategory'
import VariableDrawer from '../VariableDrawer'
import PreviewModal from '../PreviewModal'
import HistoryDrawer from '../HistoryDrawer'
import CompareDrawer from '../CompareDrawer'
import { insertPlaceholderAtCursor, validatePlaceholders, findPlaceholderAtCursor, findSimilarVariables, findIncompletePlaceholder, findVariablesByPrefix, completePlaceholder } from '../variables/placeholder'

function TextEditor({ item, selectedLanguage, onContentChange, selectedChannel, isPublished = false, onRollback, onCopy, onArchive }) {
  const supportsChannels = item.channels !== undefined && selectedChannel
  const supportsLanguages = item.languages !== undefined
  
  let currentContent = ''
  if (supportsChannels) {
    // Uusi rakenne: channels -> channel -> languages -> language -> content
    currentContent = item.channels[selectedChannel]?.languages?.[selectedLanguage]?.content || ''
  } else if (supportsLanguages) {
    // Vanha rakenne: languages -> language -> content
    currentContent = item.languages[selectedLanguage]?.content || ''
  } else {
    // Yksinkertainen rakenne: content
    currentContent = item.content || ''
  }
  
  const textareaRef = useRef(null)
  const [content, setContent] = useState(currentContent)
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false)
  const [isCompareDrawerOpen, setIsCompareDrawerOpen] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [cursorPosition, setCursorPosition] = useState(0)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0, visible: false })
  const [showPreview, setShowPreview] = useState(false)
  const [autocompleteState, setAutocompleteState] = useState({ 
    visible: false, 
    suggestions: [], 
    selectedIndex: 0, 
    prefix: '', 
    startIndex: 0,
    position: { top: 0, left: 0 }
  })

  // Tarkista onko tämä viestipohja-kategoria
  const isMessageTemplate = useMemo(() => {
    if (!item || !item.category) return false
    return item.category === CATEGORIES.MESSAGE_PAYMENT_NOTIFICATION ||
           item.category === CATEGORIES.MESSAGE_PAYMENT_REMINDER_1 ||
           item.category === CATEGORIES.MESSAGE_PAYMENT_REMINDER_2 ||
           item.category === CATEGORIES.MESSAGE_ADDITIONAL_INFO_REQUEST ||
           item.category === CATEGORIES.MESSAGE_CORRECTION_CASE ||
           item.category === CATEGORIES.MESSAGE_APPEAL_CASE ||
           item.category === CATEGORIES.MESSAGE_OTHER_ADVANCE_NOTICE ||
           item.category === CATEGORIES.MESSAGE_OTHER_RECEIVABLE_GROSS ||
           // Vanhat kategoriat säilytetään yhteensopivuuden vuoksi
           item.category === CATEGORIES.MESSAGE_WELCOME ||
           item.category === CATEGORIES.MESSAGE_REJECTION ||
           item.category === CATEGORIES.MESSAGE_APPROVAL ||
           item.category === CATEGORIES.MESSAGE_NOTIFICATION
  }, [item])

  // Hae oikea muuttujakatalogi kategorian perusteella (vain viestipohjille)
  const variableCatalog = useMemo(() => {
    if (!isMessageTemplate) return []
    return getVariableCatalogByCategory(item)
  }, [item, isMessageTemplate])

  // Validoidaan placeholdereita reaaliajassa (vain viestipohjille)
  const validation = useMemo(() => {
    if (!isMessageTemplate) return { isValid: true, invalid: [] }
    return validatePlaceholders(content, variableCatalog)
  }, [content, variableCatalog, isMessageTemplate])

  useEffect(() => {
    if (supportsChannels) {
      setContent(item.channels[selectedChannel]?.languages?.[selectedLanguage]?.content || '')
    } else if (supportsLanguages) {
      setContent(item.languages[selectedLanguage]?.content || '')
    } else {
      setContent(item.content || '')
    }
    setSelectedVersion(null) // Reset selected version when item changes
  }, [selectedLanguage, selectedChannel, item, supportsLanguages, supportsChannels])

  const handleChange = (e) => {
    const newContent = e.target.value
    setContent(newContent)
    if (onContentChange) {
      onContentChange(newContent, selectedLanguage, selectedChannel)
    }
    
    // Tarkista autocomplete (vain viestipohjille)
    if (isMessageTemplate) {
      checkAutocomplete(newContent, e.target.selectionStart || 0)
    }
  }
  
  /**
   * Tarkistaa onko kursorin kohdalla keskeneräinen muuttuja ja näyttää autocomplete-ehdotukset
   */
  function checkAutocomplete(text, cursorPos) {
    const incomplete = findIncompletePlaceholder(text, cursorPos)
    
    if (incomplete && incomplete.prefix.length > 0) {
      // Etsi muuttujat jotka alkavat prefixillä
      const suggestions = findVariablesByPrefix(incomplete.prefix, variableCatalog, 10)
      
      if (suggestions.length > 0) {
        // Laske autocomplete-dropdownin sijainti
        const textarea = textareaRef.current
        if (textarea) {
          const textBeforeCursor = text.substring(0, cursorPos)
          const lines = textBeforeCursor.split('\n')
          const lineNumber = lines.length - 1
          const lineStart = textBeforeCursor.lastIndexOf('\n') + 1
          const charInLine = cursorPos - lineStart
          
          const computedStyle = window.getComputedStyle(textarea)
          const lineHeight = parseFloat(computedStyle.lineHeight) || 20
          const fontSize = parseFloat(computedStyle.fontSize) || 14
          const charWidth = fontSize * 0.6
          
          const top = lineNumber * lineHeight + lineHeight + 4
          const left = charInLine * charWidth
          
          setAutocompleteState({
            visible: true,
            suggestions,
            selectedIndex: 0,
            prefix: incomplete.prefix,
            startIndex: incomplete.startIndex,
            position: { top, left }
          })
        }
      } else {
        setAutocompleteState({ 
          visible: false, 
          suggestions: [], 
          selectedIndex: 0, 
          prefix: '', 
          startIndex: 0,
          position: { top: 0, left: 0 }
        })
      }
    } else {
      setAutocompleteState({ 
        visible: false, 
        suggestions: [], 
        selectedIndex: 0, 
        prefix: '', 
        startIndex: 0,
        position: { top: 0, left: 0 }
      })
    }
  }

  const handleSelectionChange = () => {
    if (!isMessageTemplate) return
    
    const textarea = textareaRef.current
    if (!textarea) return
    
    const pos = textarea.selectionStart || 0
    setCursorPosition(pos)
    
    // Tarkista ensin onko keskeneräinen placeholder (autocomplete)
    const incomplete = findIncompletePlaceholder(content, pos)
    
    if (incomplete && incomplete.prefix.length > 0) {
      // Jos on keskeneräinen placeholder, näytä autocomplete ja piilota virhetooltip
      checkAutocomplete(content, pos)
      setTooltipPosition({ top: 0, left: 0, visible: false })
      return
    }
    
    // Jos ei ole keskeneräistä placeholderia, piilota autocomplete
    setAutocompleteState({ 
      visible: false, 
      suggestions: [], 
      selectedIndex: 0, 
      prefix: '', 
      startIndex: 0,
      position: { top: 0, left: 0 }
    })
    
    // Tarkista vain valmiit placeholdereita (joissa on }})
    const placeholder = findPlaceholderAtCursor(content, pos)
    
    if (placeholder) {
      // Tarkista onko placeholder virheellinen
      const allowedSet = new Set(variableCatalog.map((v) => v.key))
      const isInvalid = !allowedSet.has(placeholder.key)
      
      if (isInvalid) {
        // Laske tooltipin sijainti suhteessa textarea-elementtiin
        const textBeforePlaceholder = content.substring(0, placeholder.index)
        const lines = textBeforePlaceholder.split('\n')
        const lineNumber = lines.length - 1
        const lineStart = textBeforePlaceholder.lastIndexOf('\n') + 1
        const charInLine = placeholder.index - lineStart
        
        // Arvioi tooltipin sijainti
        const computedStyle = window.getComputedStyle(textarea)
        const lineHeight = parseFloat(computedStyle.lineHeight) || 20
        const fontSize = parseFloat(computedStyle.fontSize) || 14
        const charWidth = fontSize * 0.6 // Arvio monospace-fontille
        
        const top = lineNumber * lineHeight + lineHeight + 4
        const left = charInLine * charWidth
        
        setTooltipPosition({ top, left, visible: true, placeholder })
      } else {
        setTooltipPosition({ top: 0, left: 0, visible: false })
      }
    } else {
      setTooltipPosition({ top: 0, left: 0, visible: false })
    }
  }
  
  /**
   * Käsittelee keyboard-navigoinnin autocomplete-dropdownissa
   */
  function handleAutocompleteKeyDown(e) {
    if (!autocompleteState.visible || autocompleteState.suggestions.length === 0) {
      return
    }
    
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setAutocompleteState(prev => ({
        ...prev,
        selectedIndex: Math.min(prev.selectedIndex + 1, prev.suggestions.length - 1)
      }))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setAutocompleteState(prev => ({
        ...prev,
        selectedIndex: Math.max(prev.selectedIndex - 1, 0)
      }))
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault()
      const selected = autocompleteState.suggestions[autocompleteState.selectedIndex]
      if (selected) {
        handleCompleteVariable(selected.key)
      }
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setAutocompleteState({ 
        visible: false, 
        suggestions: [], 
        selectedIndex: 0, 
        prefix: '', 
        startIndex: 0,
        position: { top: 0, left: 0 }
      })
    }
  }
  
  /**
   * Valitsee muuttujan autocomplete-ehdotuksista
   */
  function handleCompleteVariable(key) {
    const textarea = textareaRef.current
    if (!textarea) return
    
    const cursorPos = textarea.selectionStart || 0
    const { nextText, nextCursor } = completePlaceholder({
      text: content,
      startIndex: autocompleteState.startIndex,
      cursorPosition: cursorPos,
      key
    })
    
    setContent(nextText)
    if (onContentChange) {
      onContentChange(nextText, selectedLanguage, selectedChannel)
    }
    
    setAutocompleteState({ 
      visible: false, 
      suggestions: [], 
      selectedIndex: 0, 
      prefix: '', 
      startIndex: 0,
      position: { top: 0, left: 0 }
    })
    
    // Palauta fokus ja kursorin sijainti
    requestAnimationFrame(() => {
      const el = textareaRef.current
      if (!el) return
      el.focus()
      el.setSelectionRange(nextCursor, nextCursor)
    })
  }

  /**
   * Lisää placeholder-muuttujan tekstikenttään kursorin kohdalle
   * @param {string} key - Muuttujan avain
   */
  function handleInsertVariable(key) {
    const { nextText, nextCursor } = insertPlaceholderAtCursor({
      text: content,
      textarea: textareaRef.current,
      key,
    })

    setContent(nextText)
    
    // Päivitä parent-komponentti
    if (onContentChange) {
      onContentChange(nextText, selectedLanguage, selectedChannel)
    }

    // Palauta fokus ja kursorin sijainti state-päivityksen jälkeen
    requestAnimationFrame(() => {
      const el = textareaRef.current
      if (!el) return
      el.focus()
      el.setSelectionRange(nextCursor, nextCursor)
    })
  }

  /**
   * Korvaa väärän muuttujan oikealla kaikissa esiintymissä
   * @param {string} oldKey - Väärä muuttujakey
   * @param {string} newKey - Oikea muuttujakey
   */
  function handleReplaceVariable(oldKey, newKey) {
    const oldPlaceholder = `{{${oldKey}}}`
    const newPlaceholder = `{{${newKey}}}`
    
    // Korvaa kaikki esiintymät (escape special regex characters)
    const escapedOld = oldPlaceholder.replace(/[{}]/g, '\\$&')
    const newContent = content.replace(new RegExp(escapedOld, 'g'), newPlaceholder)
    
    setContent(newContent)
    if (onContentChange) {
      onContentChange(newContent, selectedLanguage, selectedChannel)
    }
  }

  return (
    <section aria-label="Sisällön editori">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--fi-spacing-s)' }}>
        <label htmlFor="text-content" style={{ margin: 0, fontWeight: 600 }}>
          {isMessageTemplate ? 'Viestipohjan sisältö' : 'Tekstisisällön sisältö'}
        </label>
        <div style={{ display: 'flex', gap: 'var(--fi-spacing-xs)' }}>
          {isMessageTemplate && (
            <button 
              className="helpdoc-icon-button" 
              type="button" 
              aria-label={showPreview ? 'Piilota esikatselu' : 'Näytä esikatselu'}
              aria-pressed={showPreview}
              onClick={() => setShowPreview(!showPreview)}
              style={{ padding: 'var(--fi-spacing-xs) var(--fi-spacing-s)' }}
            >
              <img src="/baseIcons/icon-peek.svg" alt="" aria-hidden="true" className="helpdoc-icon-button__icon" style={{ width: '16px', height: '16px', filter: 'brightness(0) saturate(100%) invert(45%) sepia(100%) saturate(2000%) hue-rotate(10deg) brightness(0.9) contrast(1.2)' }} />
              <span className="helpdoc-icon-button__text" style={{ fontSize: '0.875rem', lineHeight: '1.2' }}>Esikatselu</span>
            </button>
          )}
          <button 
            className="helpdoc-icon-button" 
            type="button" 
            aria-label="Näytä historia"
            onClick={() => {
              setIsHistoryDrawerOpen(true)
              setIsCompareDrawerOpen(false)
            }}
            style={{ padding: 'var(--fi-spacing-xs) var(--fi-spacing-s)' }}
          >
            <img src="/baseIcons/icon-history.svg" alt="" aria-hidden="true" className="helpdoc-icon-button__icon" style={{ width: '16px', height: '16px', filter: 'brightness(0) saturate(100%) invert(45%) sepia(100%) saturate(2000%) hue-rotate(10deg) brightness(0.9) contrast(1.2)' }} />
            <span className="helpdoc-icon-button__text" style={{ fontSize: '0.875rem', lineHeight: '1.2' }}>Historia</span>
          </button>
          {onCopy && (
            <button 
              className="helpdoc-icon-button" 
              type="button" 
              aria-label="Kopioi pohjaksi"
              onClick={onCopy}
              style={{ padding: 'var(--fi-spacing-xs) var(--fi-spacing-s)' }}
            >
              <img src="/baseIcons/icon-copy.svg" alt="" aria-hidden="true" className="helpdoc-icon-button__icon" style={{ width: '16px', height: '16px', filter: 'brightness(0) saturate(100%) invert(45%) sepia(100%) saturate(2000%) hue-rotate(10deg) brightness(0.9) contrast(1.2)' }} />
              <span className="helpdoc-icon-button__text" style={{ fontSize: '0.875rem', lineHeight: '1.2' }}>Kopioi</span>
            </button>
          )}
          {onArchive && (
            <button 
              className="helpdoc-icon-button" 
              type="button" 
              aria-label="Arkistoi"
              onClick={onArchive}
              style={{ padding: 'var(--fi-spacing-xs) var(--fi-spacing-s)' }}
            >
              <img src="/baseIcons/icon-archive.svg" alt="" aria-hidden="true" className="helpdoc-icon-button__icon" style={{ width: '16px', height: '16px', filter: 'brightness(0) saturate(100%) invert(45%) sepia(100%) saturate(2000%) hue-rotate(10deg) brightness(0.9) contrast(1.2)' }} />
              <span className="helpdoc-icon-button__text" style={{ fontSize: '0.875rem', lineHeight: '1.2' }}>Arkistoi</span>
            </button>
          )}
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        <textarea
          id="text-content"
          ref={textareaRef}
          placeholder={isMessageTemplate ? "Muokkaa viestipohjan sisältöä tässä. Käytä {{muuttujat}} dynaamiseen sisältöön..." : "Muokkaa tekstisisältöä tässä..."}
          value={content}
          onChange={handleChange}
          onSelect={isMessageTemplate && !isPublished ? handleSelectionChange : undefined}
          onKeyUp={isMessageTemplate && !isPublished ? handleSelectionChange : undefined}
          onKeyDown={isMessageTemplate && !isPublished ? handleAutocompleteKeyDown : undefined}
          onClick={isMessageTemplate && !isPublished ? handleSelectionChange : undefined}
          readOnly={isPublished}
          aria-label={isMessageTemplate ? (isPublished ? "Viestipohjan editori (julkaistu versio)" : "Viestipohjan editori") : (isPublished ? "Tekstieditori (julkaistu versio)" : "Tekstieditori")}
          style={{ 
            width: '100%', 
            minHeight: '400px',
            border: '1px solid var(--fi-color-depth-light-1)',
            borderRadius: '4px',
            padding: 'var(--fi-spacing-s)',
            fontSize: '0.875rem',
            fontFamily: 'Source Sans Pro, sans-serif',
            boxSizing: 'border-box',
            ...(isPublished && {
              backgroundColor: 'var(--fi-color-depth-light-3)',
              cursor: 'not-allowed',
              opacity: 0.9
            })
          }}
        />
        
        {/* Autocomplete-dropdown (vain viestipohjille, ei julkaistussa tilassa) */}
        {isMessageTemplate && !isPublished && autocompleteState.visible && autocompleteState.suggestions.length > 0 && (
          <div
            style={{
              position: 'absolute',
              top: `${autocompleteState.position.top}px`,
              left: `${autocompleteState.position.left}px`,
              backgroundColor: '#ffffff',
              color: 'var(--fi-color-text)',
              padding: 'var(--fi-spacing-s) var(--fi-spacing-m)',
              borderRadius: '2px',
              fontSize: '0.875rem',
              lineHeight: '20px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
              zIndex: 1001,
              minWidth: '280px',
              maxWidth: '400px',
              maxHeight: '300px',
              overflowY: 'auto',
              border: '1px solid var(--fi-color-depth-light-1)',
              borderTopWidth: '4px',
              borderTopColor: 'var(--fi-color-highlight-base)',
              borderTopStyle: 'solid'
            }}
            role="listbox"
            aria-label="Muuttujaehdotukset"
          >
            <div style={{ 
              marginBottom: 'var(--fi-spacing-xs)',
              fontWeight: 400,
              color: 'var(--fi-color-text)',
              fontSize: '0.875rem'
            }}>
              <strong style={{ color: 'var(--fi-color-highlight-base)', fontWeight: 600 }}>
                Muuttujaehdotukset:
              </strong>
            </div>
            {autocompleteState.suggestions.map((sug, index) => (
              <button
                key={sug.key}
                type="button"
                role="option"
                aria-selected={index === autocompleteState.selectedIndex}
                onClick={() => handleCompleteVariable(sug.key)}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: 'var(--fi-spacing-xs) var(--fi-spacing-s)',
                  marginBottom: 'var(--fi-spacing-xs)',
                  backgroundColor: index === autocompleteState.selectedIndex 
                    ? 'var(--fi-color-highlight-light-3)' 
                    : '#ffffff',
                  border: '1px solid var(--fi-color-depth-light-1)',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                  lineHeight: '20px',
                  color: 'var(--fi-color-text)',
                  transition: 'background-color 0.2s ease, border-color 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  if (index !== autocompleteState.selectedIndex) {
                    e.target.style.backgroundColor = 'var(--fi-color-depth-light-3)'
                    e.target.style.borderColor = 'var(--fi-color-highlight-base)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (index !== autocompleteState.selectedIndex) {
                    e.target.style.backgroundColor = '#ffffff'
                    e.target.style.borderColor = 'var(--fi-color-depth-light-1)'
                  }
                }}
                aria-label={`Valitse muuttuja ${sug.key}`}
              >
                <code style={{ 
                  fontFamily: 'monospace',
                  fontSize: '0.875rem',
                  backgroundColor: 'var(--fi-color-depth-light-3)',
                  padding: '2px 4px',
                  borderRadius: '2px',
                  color: 'var(--fi-color-text)',
                  fontWeight: index === autocompleteState.selectedIndex ? 600 : 400
                }}>
                  {`{{${sug.key}}}`}
                </code>{' '}
                <span style={{ color: 'var(--fi-color-text-secondary)' }}>- {sug.label}</span>
              </button>
            ))}
          </div>
        )}
        
        {/* Inline tooltip virheellisille muuttujille (vain viestipohjille, ei julkaistussa tilassa) */}
        {isMessageTemplate && !isPublished && tooltipPosition.visible && tooltipPosition.placeholder && (
          <div
            style={{
              position: 'absolute',
              top: `${tooltipPosition.top}px`,
              left: `${tooltipPosition.left}px`,
              backgroundColor: '#ffffff',
              color: 'var(--fi-color-text)',
              padding: 'var(--fi-spacing-s) var(--fi-spacing-m)',
              borderRadius: '2px',
              fontSize: '0.875rem',
              lineHeight: '20px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)',
              zIndex: 1000,
              maxWidth: '300px',
              border: '1px solid var(--fi-color-depth-light-1)',
              borderTopWidth: '4px',
              borderTopColor: 'var(--fi-color-alert-base)',
              borderTopStyle: 'solid'
            }}
            role="alert"
            aria-live="polite"
          >
            <div style={{ 
              marginBottom: 'var(--fi-spacing-xs)',
              fontWeight: 400,
              color: 'var(--fi-color-text)'
            }}>
              <strong style={{ color: 'var(--fi-color-alert-base)', fontWeight: 600 }}>
                Tuntematon muuttuja:
              </strong>{' '}
              <code style={{ 
                fontFamily: 'monospace',
                fontSize: '0.875rem',
                backgroundColor: 'var(--fi-color-depth-light-3)',
                padding: '2px 4px',
                borderRadius: '2px',
                color: 'var(--fi-color-text)'
              }}>
                {`{{${tooltipPosition.placeholder.key}}}`}
              </code>
            </div>
            {(() => {
              const suggestions = findSimilarVariables(tooltipPosition.placeholder.key, variableCatalog)
              if (suggestions.length > 0) {
                return (
                  <div style={{ marginTop: 'var(--fi-spacing-xs)' }}>
                    <div style={{ 
                      marginBottom: 'var(--fi-spacing-xs)', 
                      fontSize: '0.875rem',
                      color: 'var(--fi-color-text-secondary)',
                      fontWeight: 400
                    }}>
                      Ehdota:
                    </div>
                    {suggestions.map((sug) => (
                      <button
                        key={sug.key}
                        type="button"
                        onClick={() => {
                          handleReplaceVariable(tooltipPosition.placeholder.key, sug.key)
                          setTooltipPosition({ top: 0, left: 0, visible: false })
                        }}
                        style={{
                          display: 'block',
                          width: '100%',
                          textAlign: 'left',
                          padding: 'var(--fi-spacing-xs) var(--fi-spacing-s)',
                          marginBottom: 'var(--fi-spacing-xs)',
                          backgroundColor: '#ffffff',
                          border: '1px solid var(--fi-color-depth-light-1)',
                          borderRadius: '2px',
                          cursor: 'pointer',
                          fontSize: '0.875rem',
                          lineHeight: '20px',
                          color: 'var(--fi-color-text)',
                          transition: 'background-color 0.2s ease, border-color 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = 'var(--fi-color-depth-light-3)'
                          e.target.style.borderColor = 'var(--fi-color-alert-base)'
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#ffffff'
                          e.target.style.borderColor = 'var(--fi-color-depth-light-1)'
                        }}
                        aria-label={`Korvaa ${tooltipPosition.placeholder.key} muuttujalla ${sug.key}`}
                      >
                        <code style={{ 
                          fontFamily: 'monospace',
                          fontSize: '0.875rem',
                          backgroundColor: 'var(--fi-color-depth-light-3)',
                          padding: '2px 4px',
                          borderRadius: '2px',
                          color: 'var(--fi-color-text)'
                        }}>
                          {`{{${sug.key}}}`}
                        </code>{' '}
                        <span style={{ color: 'var(--fi-color-text-secondary)' }}>- {sug.label}</span>
                      </button>
                    ))}
                  </div>
                )
              }
              return null
            })()}
          </div>
        )}
      </div>

      {/* Ohjeteksti (vain viestipohjille, ei julkaistussa tilassa) */}
      {isMessageTemplate && !isPublished && (
        <p style={{ marginTop: 'var(--fi-spacing-s)', fontSize: '0.9rem', color: 'var(--fi-color-text-secondary)' }}>
          Viestipohjat tukevat muuttujia muodossa <code style={{ fontFamily: 'monospace', backgroundColor: 'var(--fi-color-depth-light-3)', padding: '2px 4px', borderRadius: '2px' }}>{'{{muuttujaNimi}}'}</code>.{' '}
          <button
            type="button"
            onClick={() => setIsDrawerOpen(true)}
            className="helpdoc-button helpdoc-button--tertiary"
            aria-label="Avaa muuttujavalitsin"
            style={{ display: 'inline', marginLeft: 'var(--fi-spacing-xs)' }}
          >
            Lisää muuttuja
          </button>
        </p>
      )}

      {/* Muuttujavalitsin drawerissa (vain viestipohjille, ei julkaistussa tilassa) */}
      {isMessageTemplate && !isPublished && (
        <VariableDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          variables={variableCatalog}
          onInsert={handleInsertVariable}
        />
      )}

      {/* Esikatselumodaali (vain viestipohjille) */}
      {isMessageTemplate && (
        <PreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          text={content}
          variables={variableCatalog}
        />
      )}

      {/* Versiohistoria drawer */}
      <HistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        item={item}
        selectedLanguage={selectedLanguage}
        onVersionSelect={(version) => {
          setSelectedVersion(version)
          setIsHistoryDrawerOpen(false)
          setIsCompareDrawerOpen(true)
        }}
        onRollback={onRollback}
      />

      {/* Vertailu drawer */}
      <CompareDrawer
        isOpen={isCompareDrawerOpen}
        onClose={() => {
          setIsCompareDrawerOpen(false)
          setSelectedVersion(null)
        }}
        currentText={content}
        selectedVersion={selectedVersion}
        onVersionSelect={(version) => {
          setSelectedVersion(version)
          setIsHistoryDrawerOpen(false)
        }}
        onBackToHistory={() => {
          setIsCompareDrawerOpen(false)
          setIsHistoryDrawerOpen(true)
        }}
      />
    </section>
  )
}

export default TextEditor
