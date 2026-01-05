import React, { useMemo } from 'react'
import { computeDiff, formatWithHighlighting } from './utils/diff'

/**
 * CompareDrawer - Drawer-komponentti versioiden vertailuun
 * Avautuu oikealle puolelle ja tarjoaa tilaa diff-vertailulle
 * @param {Object} props - Komponentin propsit
 * @param {boolean} props.isOpen - Onko drawer auki
 * @param {Function} props.onClose - Callback kun drawer suljetaan
 * @param {string} props.currentText - Nykyinen teksti
 * @param {Object} props.selectedVersion - Valittu versio vertailuun
 * @param {Function} props.onVersionSelect - Callback kun halutaan valita toinen versio
 * @param {Function} props.onBackToHistory - Callback kun halutaan palata takaisin historiaan
 */
export default function CompareDrawer({ isOpen, onClose, currentText, selectedVersion, onVersionSelect, onBackToHistory }) {

  const diff = useMemo(() => {
    if (!selectedVersion || !currentText) return { leftElements: [], rightElements: [], hasChanges: false }
    const segments = computeDiff(selectedVersion.content || '', currentText || '')
    const { leftElements, rightElements } = formatWithHighlighting(segments)
    const hasChanges = segments.some(s => s.type !== 'unchanged')
    return { leftElements, rightElements, hasChanges }
  }, [selectedVersion, currentText])

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

  if (!isOpen) return null

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
      
      {/* Drawer - leveämpi diff-vertailua varten */}
      <div
        className="helpdoc-compare-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Vertaile versioita"
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
            Vertaile versioita
          </h2>
          <div style={{
            display: 'flex',
            gap: 'var(--fi-spacing-s)',
            alignItems: 'flex-start',
            marginTop: '4px'
          }}>
            {onBackToHistory && selectedVersion && (
              <button
                type="button"
                onClick={onBackToHistory}
                className="helpdoc-button helpdoc-button--secondary-no-border"
                style={{ 
                  padding: '6px 12px',
                  fontSize: '0.875rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 'var(--fi-spacing-xs)'
                }}
                aria-label="Takaisin versiohistoriaan"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    d="M10 12L6 8L10 4"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Takaisin
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              className="helpdoc-variable-drawer-close"
              aria-label="Sulje vertailu"
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
        </div>

        {/* Content */}
        <div className="helpdoc-variable-drawer-content" style={{
          padding: 'var(--fi-spacing-xl)'
        }}>
          {!selectedVersion ? (
            <div style={{ 
              padding: 'var(--fi-spacing-xl)', 
              textAlign: 'center' 
            }}>
              <p style={{ 
                marginBottom: 'var(--fi-spacing-m)', 
                color: 'var(--fi-color-text-secondary)',
                fontSize: '0.875rem',
                lineHeight: '1.5'
              }}>
                Valitse versio vertailuun. Klikkaa "Historia"-painiketta valitaksesi version.
              </p>
            </div>
          ) : (
            <div>
              {/* Versioiden otsikot - selkeämpi layout */}
              <div style={{ 
                display: 'flex', 
                gap: 'var(--fi-spacing-xl)', 
                marginBottom: 'var(--fi-spacing-xl)',
                paddingBottom: 'var(--fi-spacing-l)',
                borderBottom: '1px solid var(--fi-color-depth-light-1)'
              }}>
                <div style={{ 
                  flex: 1
                }}>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: 'var(--fi-color-alert-base)', 
                    marginBottom: 'var(--fi-spacing-s)', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.5px',
                    fontWeight: 600
                  }}>
                    Vanha versio
                  </div>
                  <div style={{ 
                    fontWeight: 600, 
                    marginBottom: 'var(--fi-spacing-xs)',
                    fontSize: '1rem',
                    color: 'var(--fi-color-text)'
                  }}>
                    Versio {selectedVersion.version}
                  </div>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    color: 'var(--fi-color-text-secondary)',
                    lineHeight: '1.5'
                  }}>
                    {selectedVersion.date} • {selectedVersion.author}
                  </div>
                </div>
                <div style={{ 
                  flex: 1
                }}>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: 'var(--fi-color-success-base)', 
                    marginBottom: 'var(--fi-spacing-s)', 
                    textTransform: 'uppercase', 
                    letterSpacing: '0.5px',
                    fontWeight: 600
                  }}>
                    Nykyinen versio
                  </div>
                  <div style={{ 
                    fontWeight: 600, 
                    marginBottom: 'var(--fi-spacing-xs)',
                    fontSize: '1rem',
                    color: 'var(--fi-color-text)'
                  }}>
                    Luonnos
                  </div>
                  <div style={{ 
                    fontSize: '0.875rem', 
                    color: 'var(--fi-color-text-secondary)',
                    lineHeight: '1.5'
                  }}>
                    Muokattu nyt
                  </div>
                </div>
              </div>

              {/* Diff-näkymä - koko tekstit korostuksilla */}
              {!diff.hasChanges ? (
                <div style={{ 
                  padding: 'var(--fi-spacing-xl)', 
                  textAlign: 'center',
                  color: 'var(--fi-color-text-secondary)',
                  fontSize: '0.875rem',
                  lineHeight: '1.5'
                }}>
                  Versioiden välillä ei ole eroja.
                </div>
              ) : (
                <div style={{ 
                  display: 'flex', 
                  gap: 0,
                  border: '1px solid var(--fi-color-depth-light-1)',
                  borderRadius: '2px',
                  overflow: 'hidden',
                  backgroundColor: '#ffffff',
                  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
                }}>
                  {/* Vasen sarake - vanha versio */}
                  <div style={{ 
                    flex: 1,
                    backgroundColor: '#ffffff',
                    height: 'calc(100vh - 300px)',
                    overflowY: 'auto',
                    borderRight: '1px solid var(--fi-color-depth-light-1)'
                  }}>
                    <div style={{
                      padding: 'var(--fi-spacing-m)',
                      fontFamily: 'Source Sans Pro, sans-serif',
                      fontSize: '0.875rem',
                      lineHeight: '1.5',
                      wordBreak: 'break-word',
                      color: 'var(--fi-color-text)'
                    }}>
                      {diff.leftElements.length > 0 ? diff.leftElements : '\u00A0'}
                    </div>
                  </div>

                  {/* Oikea sarake - uusi versio */}
                  <div style={{ 
                    flex: 1,
                    backgroundColor: '#ffffff',
                    height: 'calc(100vh - 300px)',
                    overflowY: 'auto'
                  }}>
                    <div style={{
                      padding: 'var(--fi-spacing-m)',
                      fontFamily: 'Source Sans Pro, sans-serif',
                      fontSize: '0.875rem',
                      lineHeight: '1.5',
                      wordBreak: 'break-word',
                      color: 'var(--fi-color-text)'
                    }}>
                      {diff.rightElements.length > 0 ? diff.rightElements : '\u00A0'}
                    </div>
                  </div>
                </div>
              )}

              {/* Legenda */}
              {diff.hasChanges && (
                <div style={{ 
                  marginTop: 'var(--fi-spacing-xl)', 
                  paddingTop: 'var(--fi-spacing-l)',
                  borderTop: '1px solid var(--fi-color-depth-light-1)',
                  display: 'flex', 
                  gap: 'var(--fi-spacing-xl)', 
                  fontSize: '0.875rem',
                  color: 'var(--fi-color-text-secondary)',
                  lineHeight: '1.5'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'var(--fi-spacing-s)'
                  }}>
                    <span style={{ 
                      display: 'inline-block',
                      width: '18px', 
                      height: '18px', 
                      backgroundColor: 'var(--fi-color-alert-light-2)',
                      border: '1px solid var(--fi-color-alert-base)',
                      borderRadius: '2px',
                      flexShrink: 0
                    }}></span>
                    <span>Poistettu teksti</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 'var(--fi-spacing-s)'
                  }}>
                    <span style={{ 
                      display: 'inline-block',
                      width: '18px', 
                      height: '18px', 
                      backgroundColor: 'var(--fi-color-success-light-2)',
                      border: '1px solid var(--fi-color-success-base)',
                      borderRadius: '2px',
                      flexShrink: 0
                    }}></span>
                    <span>Lisätty teksti</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

