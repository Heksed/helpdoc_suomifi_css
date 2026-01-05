import React, { useState, useMemo } from 'react'

/**
 * HistoryDrawer - Drawer-komponentti versiohistorian näyttämiseen
 * Avautuu oikealle puolelle
 * @param {Object} props - Komponentin propsit
 * @param {boolean} props.isOpen - Onko drawer auki
 * @param {Function} props.onClose - Callback kun drawer suljetaan
 * @param {Object} props.item - Sisältökohde
 * @param {string} props.selectedLanguage - Valittu kieli
 * @param {Function} props.onVersionSelect - Callback kun versio valitaan vertailuun
 */
export default function HistoryDrawer({ isOpen, onClose, item, selectedLanguage, onVersionSelect, onRollback }) {
  if (!isOpen) return null

  // Rollback-aikaikkuna päivinä (oletus: 30 päivää)
  const ROLLBACK_DAYS = 30

  /**
   * Tarkistaa onko rollback sallittu
   */
  const canRollback = (publishedDate) => {
    if (!publishedDate) return false
    const published = new Date(publishedDate)
    const now = new Date()
    const daysDiff = (now - published) / (1000 * 60 * 60 * 24)
    return daysDiff <= ROLLBACK_DAYS
  }

  /**
   * Muotoilee päivämäärän suomenkieliseen muotoon
   */
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    return `${day}.${month}.${year} ${hours}:${minutes}`
  }

  // Mock audit trail - tulevaisuudessa haetaan API:sta
  // Sisältää sekä sisällön muutokset että tilanmuutokset
  const auditTrail = useMemo(() => {
    if (!item) return []
    
    const supportsLanguages = item.languages !== undefined && selectedLanguage !== null
    const currentContent = supportsLanguages
      ? (item.languages[selectedLanguage]?.content || '')
      : (item.content || '')
    
    const publishedDate = supportsLanguages
      ? (item.languages[selectedLanguage]?.publishedDate || item.publishedDate)
      : item.publishedDate
    
    // Luodaan versiot itemin contentType:n perusteella
    const contentType = item.contentType || 'text'
    
    const versions = []
    
    if (contentType === 'parameter') {
      // Parametreille: numeroversiot
      const currentValue = currentContent || item.content || '0'
      const numValue = parseFloat(currentValue) || 0
      versions.push(
        {
          id: 'v1',
          type: 'content_change',
          version: '1.0',
          date: '2025-01-10T09:00:00',
          author: 'Matti Meikäläinen',
          content: String(Math.max(0, numValue - 5)),
          lifecycleState: 'published',
          description: 'Alkuperäinen arvo',
          changeReason: 'Alkuperäinen julkaisu'
        },
        {
          id: 'state1',
          type: 'state_change',
          fromState: 'draft',
          toState: 'published',
          date: '2025-01-10T09:00:00',
          author: 'Matti Meikäläinen',
          changeReason: 'Alkuperäinen julkaisu'
        },
        {
          id: 'v2',
          type: 'content_change',
          version: '1.1',
          date: '2025-01-15T14:30:00',
          author: 'Liisa Esimerkki',
          content: String(Math.max(0, numValue - 2)),
          lifecycleState: 'published',
          description: 'Päivitetty arvo',
          changeReason: 'Päivitetty arvoa käyttäjätarpeiden mukaan'
        },
        {
          id: 'v3',
          type: 'content_change',
          version: '1.2',
          date: '2025-01-20T10:15:00',
          author: 'Matti Meikäläinen',
          content: String(Math.max(0, numValue - 1)),
          lifecycleState: 'draft',
          description: 'Luonnosversio',
          changeReason: 'Testausversio'
        },
        {
          id: 'v4',
          type: 'content_change',
          version: '1.3',
          date: publishedDate || '2025-01-25T16:45:00',
          author: 'Matti Meikäläinen',
          content: currentValue,
          lifecycleState: 'published',
          description: 'Nykyinen versio',
          changeReason: supportsLanguages 
            ? (item.languages[selectedLanguage]?.changeReason || 'Päivitetty versio')
            : (item.changeReason || 'Päivitetty versio')
        }
      )
    } else if (contentType === 'structure') {
      // Rakenteille: JSON-versiot
      const baseContent = currentContent || item.content || '{}'
      versions.push(
        {
          id: 'v1',
          type: 'content_change',
          version: '1.0',
          date: '2025-01-10T09:00:00',
          author: 'Matti Meikäläinen',
          content: '{}',
          lifecycleState: 'published',
          description: 'Alkuperäinen tyhjä rakenne',
          changeReason: 'Alkuperäinen julkaisu'
        },
        {
          id: 'state1',
          type: 'state_change',
          fromState: 'draft',
          toState: 'published',
          date: '2025-01-10T09:00:00',
          author: 'Matti Meikäläinen',
          changeReason: 'Alkuperäinen julkaisu'
        },
        {
          id: 'v2',
          type: 'content_change',
          version: '1.1',
          date: '2025-01-15T14:30:00',
          author: 'Liisa Esimerkki',
          content: '{\n  "field1": "value1"\n}',
          lifecycleState: 'published',
          description: 'Lisätty ensimmäinen kenttä',
          changeReason: 'Lisätty uusi kenttä'
        },
        {
          id: 'v3',
          type: 'content_change',
          version: '1.2',
          date: '2025-01-20T10:15:00',
          author: 'Matti Meikäläinen',
          content: '{\n  "field1": "value1",\n  "field2": "value2"\n}',
          lifecycleState: 'draft',
          description: 'Luonnosversio - lisätty toinen kenttä',
          changeReason: 'Testausversio'
        },
        {
          id: 'v4',
          type: 'content_change',
          version: '1.3',
          date: publishedDate || '2025-01-25T16:45:00',
          author: 'Matti Meikäläinen',
          content: baseContent,
          lifecycleState: 'published',
          description: 'Nykyinen versio',
          changeReason: supportsLanguages 
            ? (item.languages[selectedLanguage]?.changeReason || 'Päivitetty versio')
            : (item.changeReason || 'Päivitetty versio')
        }
      )
    } else {
      // Teksteille ja templateille: tekstiversiot
      const defaultContent = item.title === 'Tervetuloviesti' 
        ? 'Tervetuloa palveluumme!'
        : item.title === 'Hakemuksen tarkistusteksti'
        ? 'Tarkista hakemuksesi ennen lähettämistä.'
        : 'Päätös ansioturvahakemuksesta\n\nHakija: {{applicantName}}\nHakemusnumero: {{applicationNumber}}\n\nPäätös: Hakemus on hyväksytty.\n\nPäätöksen perusteet:\nHakemus täyttää kaikki vaatimukset ansioturvan saamiseksi.'
      
      const baseContent = currentContent || defaultContent
      
      versions.push(
        {
          id: 'v1',
          type: 'content_change',
          version: '1.0',
          date: '2025-01-10T09:00:00',
          author: 'Matti Meikäläinen',
          content: baseContent.split('\n').slice(0, 3).join('\n'),
          lifecycleState: 'published',
          description: 'Alkuperäinen julkaistu versio - lyhyempi teksti',
          changeReason: 'Alkuperäinen julkaisu'
        },
        {
          id: 'state1',
          type: 'state_change',
          fromState: 'draft',
          toState: 'published',
          date: '2025-01-10T09:00:00',
          author: 'Matti Meikäläinen',
          changeReason: 'Alkuperäinen julkaisu'
        },
        {
          id: 'v2',
          type: 'content_change',
          version: '1.1',
          date: '2025-01-15T14:30:00',
          author: 'Liisa Esimerkki',
          content: baseContent.split('\n').slice(0, 6).join('\n'),
          lifecycleState: 'published',
          description: 'Lisätty perusteluosio - osittainen teksti',
          changeReason: 'Laajennettu sisältöä'
        },
        {
          id: 'v3',
          type: 'content_change',
          version: '1.2',
          date: '2025-01-20T10:15:00',
          author: 'Matti Meikäläinen',
          content: baseContent + (baseContent.includes('{{') ? '\n\nLisätietoja:\nJos sinulla on kysymyksiä, ota yhteyttä asiakaspalveluun.' : '\n\nLisätietoja saatavilla.'),
          lifecycleState: 'draft',
          description: 'Luonnosversio - lisätty lisätietoja-osa',
          changeReason: 'Testausversio'
        },
        {
          id: 'state2',
          type: 'state_change',
          fromState: 'published',
          toState: 'draft',
          date: '2025-01-20T10:15:00',
          author: 'Matti Meikäläinen',
          changeReason: 'Muutettu luonnokseksi muokkauksia varten'
        },
        {
          id: 'v4',
          type: 'content_change',
          version: '1.3',
          date: publishedDate || '2025-01-25T16:45:00',
          author: 'Matti Meikäläinen',
          content: baseContent,
          lifecycleState: 'published',
          description: 'Nykyinen julkaistu versio',
          changeReason: supportsLanguages 
            ? (item.languages[selectedLanguage]?.changeReason || 'Päivitetty versio')
            : (item.changeReason || 'Päivitetty versio')
        },
        {
          id: 'state3',
          type: 'state_change',
          fromState: 'draft',
          toState: 'published',
          date: publishedDate || '2025-01-25T16:45:00',
          author: 'Matti Meikäläinen',
          changeReason: supportsLanguages 
            ? (item.languages[selectedLanguage]?.changeReason || 'Päivitetty versio')
            : (item.changeReason || 'Päivitetty versio')
        }
      )
    }
    
    // Järjestä kronologisesti (uusin ensin)
    return versions.sort((a, b) => new Date(b.date) - new Date(a.date))
  }, [item, selectedLanguage])

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="helpdoc-variable-drawer-overlay"
        onClick={handleOverlayClick}
        onKeyDown={handleKeyDown}
        role="presentation"
        aria-hidden="true"
      />
      
      {/* Drawer */}
      <div
        className="helpdoc-variable-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Versiohistoria"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="helpdoc-variable-drawer-header" style={{
          padding: 'var(--fi-spacing-xl)',
          borderBottom: '1px solid var(--fi-color-depth-light-1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: 'var(--fi-spacing-m)'
        }}>
          <h2 style={{ 
            margin: 0, 
            fontSize: '1.5rem', 
            fontWeight: 600,
            lineHeight: '1.3',
            color: 'var(--fi-color-text)',
            paddingBottom: 'var(--fi-spacing-l)',
            borderBottom: '2px solid var(--fi-color-accent-base)',
            flex: 1
          }}>
            Versiohistoria
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="helpdoc-variable-drawer-close"
            aria-label="Sulje versiohistoria"
            style={{
              marginTop: '4px'
            }}
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M15 5L5 15M5 5L15 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="helpdoc-variable-drawer-content" style={{
          padding: 'var(--fi-spacing-xl)'
        }}>
          {auditTrail.length === 0 ? (
            <div style={{ 
              padding: 'var(--fi-spacing-xl)', 
              textAlign: 'center', 
              color: 'var(--fi-color-text-secondary)',
              fontSize: '0.875rem'
            }}>
              Versiohistoriaa ei saatavilla
            </div>
          ) : (
            <ul style={{ 
              listStyle: 'none', 
              padding: 0, 
              margin: 0, 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 'var(--fi-spacing-m)' 
            }}>
              {auditTrail.map((entry) => {
                const isStateChange = entry.type === 'state_change'
                const isPublished = entry.lifecycleState === 'published' || entry.toState === 'published'
                const entryPublishedDate = isPublished ? entry.date : null
                const allowRollback = isPublished && entryPublishedDate && canRollback(entryPublishedDate)
                
                return (
                  <li
                    key={entry.id}
                    style={{
                      padding: 'var(--fi-spacing-m)',
                      border: '1px solid var(--fi-color-depth-light-1)',
                      borderRadius: '2px',
                      backgroundColor: '#ffffff',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
                    }}
                  >
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'flex-start', 
                      gap: 'var(--fi-spacing-m)' 
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {isStateChange ? (
                          <>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 'var(--fi-spacing-s)', 
                              flexWrap: 'wrap', 
                              marginBottom: 'var(--fi-spacing-s)'
                            }}>
                              <span style={{ 
                                fontSize: '0.75rem', 
                                fontWeight: 600, 
                                color: 'var(--fi-color-highlight-base)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                              }}>
                                Tilanmuutos
                              </span>
                              <span style={{ 
                                fontSize: '0.875rem', 
                                fontWeight: 600,
                                color: 'var(--fi-color-text)'
                              }}>
                                {entry.fromState === 'draft' ? 'Luonnos' : 
                                 entry.fromState === 'pending_review' ? 'Tarkistuksessa' :
                                 entry.fromState === 'published' ? 'Julkaistu' : entry.fromState}
                              </span>
                              <span style={{ 
                                fontSize: '0.875rem',
                                color: 'var(--fi-color-text-secondary)'
                              }}>→</span>
                              <span style={{ 
                                fontSize: '0.875rem', 
                                fontWeight: 600,
                                color: 'var(--fi-color-text)'
                              }}>
                                {entry.toState === 'draft' ? 'Luonnos' : 
                                 entry.toState === 'pending_review' ? 'Tarkistuksessa' :
                                 entry.toState === 'published' ? 'Julkaistu' : entry.toState}
                              </span>
                            </div>
                            <div style={{ 
                              fontSize: '0.875rem', 
                              color: 'var(--fi-color-text-secondary)', 
                              marginTop: 'var(--fi-spacing-xs)',
                              lineHeight: '1.5'
                            }}>
                              {formatDate(entry.date)} • {entry.author}
                            </div>
                            {entry.changeReason && (
                              <div style={{ 
                                fontSize: '0.875rem', 
                                color: 'var(--fi-color-text-secondary)', 
                                marginTop: 'var(--fi-spacing-s)',
                                padding: 'var(--fi-spacing-s)',
                                backgroundColor: 'var(--fi-color-depth-light-3)',
                                borderRadius: '2px',
                                borderLeft: '3px solid var(--fi-color-highlight-base)'
                              }}>
                                <strong>Perustelu:</strong> {entry.changeReason}
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <div style={{ 
                              display: 'flex', 
                              alignItems: 'center', 
                              gap: 'var(--fi-spacing-s)', 
                              flexWrap: 'wrap', 
                              marginBottom: 'var(--fi-spacing-s)'
                            }}>
                              <span style={{ 
                                fontSize: '0.75rem', 
                                fontWeight: 600, 
                                color: 'var(--fi-color-text-secondary)',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px'
                              }}>
                                Sisällön muutos
                              </span>
                              <span style={{ 
                                fontWeight: 600, 
                                fontSize: '0.875rem',
                                color: 'var(--fi-color-text)'
                              }}>
                                Versio {entry.version}
                              </span>
                              {entry.lifecycleState && (
                                <span
                                  className={`helpdoc-status helpdoc-status--${entry.lifecycleState === 'published' ? 'success' : entry.lifecycleState === 'pending_review' ? 'warning' : 'pending'}`}
                                  style={{ 
                                    flexShrink: 0, 
                                    fontSize: '0.75rem', 
                                    padding: '4px 8px',
                                    borderRadius: '2px'
                                  }}
                                >
                                  {entry.lifecycleState === 'published' ? 'Julkaistu' : 
                                   entry.lifecycleState === 'pending_review' ? 'Tarkistuksessa' : 'Luonnos'}
                                </span>
                              )}
                            </div>
                            <div style={{ 
                              fontSize: '0.875rem', 
                              color: 'var(--fi-color-text-secondary)', 
                              marginTop: 'var(--fi-spacing-xs)',
                              lineHeight: '1.5'
                            }}>
                              {formatDate(entry.date)} • {entry.author}
                            </div>
                            {entry.description && (
                              <div style={{ 
                                fontSize: '0.875rem', 
                                color: 'var(--fi-color-text)', 
                                marginTop: 'var(--fi-spacing-s)',
                                lineHeight: '1.5'
                              }}>
                                {entry.description}
                              </div>
                            )}
                            {entry.changeReason && (
                              <div style={{ 
                                fontSize: '0.875rem', 
                                color: 'var(--fi-color-text-secondary)', 
                                marginTop: 'var(--fi-spacing-s)',
                                padding: 'var(--fi-spacing-s)',
                                backgroundColor: 'var(--fi-color-depth-light-3)',
                                borderRadius: '2px',
                                borderLeft: '3px solid var(--fi-color-accent-base)'
                              }}>
                                <strong>Perustelu:</strong> {entry.changeReason}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                      <div style={{
                        display: 'flex',
                        gap: 'var(--fi-spacing-s)',
                        flexShrink: 0
                      }}>
                        {!isStateChange && entry.content && (
                          <button
                            type="button"
                            onClick={() => {
                              if (onVersionSelect) {
                                onVersionSelect(entry)
                              }
                            }}
                            className="helpdoc-button helpdoc-button--secondary"
                            style={{ 
                              flexShrink: 0,
                              fontSize: '0.875rem', 
                              padding: '6px 12px',
                              minHeight: 'auto'
                            }}
                            aria-label={`Vertaa versiota ${entry.version} nykyiseen versioon`}
                          >
                            Vertaa
                          </button>
                        )}
                        {allowRollback && !isStateChange && (
                          <button
                            type="button"
                            onClick={() => {
                              if (onRollback) {
                                onRollback(entry)
                              }
                            }}
                            className="helpdoc-button helpdoc-button--secondary"
                            style={{ 
                              flexShrink: 0,
                              fontSize: '0.875rem', 
                              padding: '6px 12px',
                              minHeight: 'auto'
                            }}
                            aria-label={`Palauta versio ${entry.version}`}
                          >
                            Palauta
                          </button>
                        )}
                      </div>
                    </div>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </>
  )
}

