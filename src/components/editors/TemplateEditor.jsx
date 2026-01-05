import React, { useState, useEffect, useRef, useMemo } from 'react'
import { LANGUAGES } from '../../data/mockData'
import { getVariableCatalogByCategory } from '../variables/variableCatalogByCategory'
import VariableDrawer from '../VariableDrawer'
import PreviewModal from '../PreviewModal'
import HistoryDrawer from '../HistoryDrawer'
import CompareDrawer from '../CompareDrawer'
import { insertPlaceholderAtCursor, validatePlaceholders, findPlaceholderAtCursor, findSimilarVariables } from '../variables/placeholder'

/**
 * TemplateEditor - Päätöspohjan editori placeholder-muuttujien tuella
 * @param {Object} props - Komponentin propsit
 * @param {Object} props.item - Muokattava kohde
 * @param {string} props.selectedLanguage - Valittu kieli
 * @param {Function} props.onContentChange - Callback kun sisältö muuttuu
 * @param {boolean} props.isPublished - Onko kohde julkaistu
 */
function TemplateEditor({ item, selectedLanguage, onContentChange, isPublished = false, onRollback, onCopy, onArchive }) {
  const supportsLanguages = item.languages !== undefined
  const currentContent = supportsLanguages
    ? (item.languages[selectedLanguage]?.content || '')
    : (item.content || '')
  
  const textareaRef = useRef(null)
  const [content, setContent] = useState(currentContent)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [cursorPosition, setCursorPosition] = useState(0)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0, visible: false })
  const [showPreview, setShowPreview] = useState(false)
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false)
  const [isCompareDrawerOpen, setIsCompareDrawerOpen] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState(null)

  useEffect(() => {
    if (supportsLanguages) {
      setContent(item.languages[selectedLanguage]?.content || '')
    } else {
      setContent(item.content || '')
    }
  }, [selectedLanguage, item, supportsLanguages])

  // Hae oikea muuttujakatalogi kategorian perusteella
  const variableCatalog = useMemo(() => getVariableCatalogByCategory(item), [item])

  // Validoidaan placeholdereita reaaliajassa
  const validation = useMemo(() => validatePlaceholders(content, variableCatalog), [content, variableCatalog])

  const handleChange = (e) => {
    const newContent = e.target.value
    setContent(newContent)
    if (onContentChange) {
      onContentChange(newContent, selectedLanguage)
    }
  }

  const handleSelectionChange = () => {
    const textarea = textareaRef.current
    if (!textarea) return
    
    const pos = textarea.selectionStart || 0
    setCursorPosition(pos)
    
    // Etsi placeholder kursorin kohdalla
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
      onContentChange(nextText, selectedLanguage)
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
      onContentChange(newContent, selectedLanguage)
    }
  }

  return (
    <section aria-label="Sisällön editori">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--fi-spacing-s)' }}>
        <label htmlFor="template-content" style={{ margin: 0, fontWeight: 600 }}>
        Päätöspohjan sisältö
      </label>
        <div style={{ display: 'flex', gap: 'var(--fi-spacing-xs)' }}>
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
          id="template-content"
          ref={textareaRef}
          placeholder="Muokkaa päätöspohjan sisältöä tässä. Käytä {{muuttujat}} dynaamiseen sisältöön..."
        value={content}
        onChange={handleChange}
          onSelect={isPublished ? undefined : handleSelectionChange}
          onKeyUp={isPublished ? undefined : handleSelectionChange}
          onClick={isPublished ? undefined : handleSelectionChange}
          readOnly={isPublished}
          aria-label={isPublished ? "Päätöspohjan editori (julkaistu versio)" : "Päätöspohjan editori"}
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
        
        {/* Inline tooltip kursorin kohdalla */}
        {tooltipPosition.visible && tooltipPosition.placeholder && (
          <div
            className="helpdoc-inline-tooltip"
            style={{
              position: 'absolute',
              top: `${tooltipPosition.top}px`,
              left: `${Math.min(tooltipPosition.left, 200)}px`,
              zIndex: 1000,
              backgroundColor: 'var(--fi-color-warning-light-2)',
              color: 'var(--fi-color-text)',
              border: '1px solid var(--fi-color-warning-base)',
              padding: 'var(--fi-spacing-xs) var(--fi-spacing-s)',
              borderRadius: '4px',
              fontSize: '0.875rem',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
              maxWidth: '350px',
              pointerEvents: 'auto',
            }}
            role="tooltip"
            aria-live="polite"
          >
            <div style={{ marginBottom: 'var(--fi-spacing-xs)', fontWeight: 600 }}>
              Tuntematon muuttuja: <code style={{ fontFamily: 'monospace', backgroundColor: 'rgba(0,0,0,0.1)', padding: '2px 4px', borderRadius: '2px' }}>{`{{${tooltipPosition.placeholder.key}}}`}</code>
            </div>
            {(() => {
              const suggestions = findSimilarVariables(tooltipPosition.placeholder.key, variableCatalog)
              if (suggestions.length === 0) return null
              return (
                <div>
                  <div style={{ fontSize: '0.8rem', marginBottom: 'var(--fi-spacing-xs)', opacity: 0.8 }}>
                    Ehdotukset:
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {suggestions.map((suggestion) => (
                      <button
                        key={suggestion.key}
                        type="button"
                        onClick={() => {
                          handleReplaceVariable(tooltipPosition.placeholder.key, suggestion.key)
                          setTooltipPosition({ top: 0, left: 0, visible: false })
                        }}
                        style={{
                          fontSize: '0.8rem',
                          padding: '4px 8px',
                          border: '1px solid var(--fi-color-warning-base)',
                          borderRadius: '3px',
                          backgroundColor: '#ffffff',
                          color: 'var(--fi-color-text)',
                          cursor: 'pointer',
                          textAlign: 'left',
                          transition: 'background-color 0.15s ease',
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--fi-color-warning-light-1)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
                        aria-label={`Korvaa ${tooltipPosition.placeholder.key} muuttujalla ${suggestion.key}`}
                      >
                        {suggestion.label} <code style={{ fontFamily: 'monospace', fontSize: '0.75rem', marginLeft: '4px', opacity: 0.8 }}>{`{{${suggestion.key}}}`}</code>
                      </button>
                    ))}
                  </div>
                </div>
              )
            })()}
          </div>
        )}
      </div>

      {/* Ohjeteksti */}
      <p style={{ marginTop: 'var(--fi-spacing-s)', fontSize: '0.9rem', color: 'var(--fi-color-text-secondary)' }}>
        Päätöspohjat tukevat muuttujia muodossa <code style={{ fontFamily: 'monospace', backgroundColor: 'var(--fi-color-depth-light-3)', padding: '2px 4px', borderRadius: '2px' }}>{'{{muuttujaNimi}}'}</code>.{' '}
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

      {/* Muuttujavalitsin drawerissa */}
      <VariableDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        variables={variableCatalog}
        onInsert={handleInsertVariable}
      />

      {/* Esikatselumodaali */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        text={content}
        variables={variableCatalog}
      />

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

export default TemplateEditor
