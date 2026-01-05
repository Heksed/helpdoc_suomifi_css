import React, { useState } from 'react'

/**
 * HeaderBar - Pääotsikkopalkki editorin yläosassa
 * Suomi.fi -tyylinen header tummalla sinisellä taustalla ja oranssilla raidalla
 * @param {Object} props - Komponentin propsit
 * @param {Object|null} props.selectedItem - Valittu sisältökohde
 */
function HeaderBar({ selectedItem }) {
  // Mock-käyttäjätiedot - korvataan myöhemmin oikealla autentikoinnilla
  const [user] = useState({
    name: 'Matti Meikäläinen',
    email: 'matti.meikalainen@example.fi',
    role: 'Pääkäyttäjä'
  })
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)

  return (
    <header className="helpdoc-shell-header" role="banner">
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: 'var(--fi-spacing-l)',
        width: '100%'
      }}>
        {/* Vasen puoli: Logo ja palvelun nimi */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 'var(--fi-spacing-l)',
          flex: 1
        }}>
          {/* Puzzle-ikoni */}
          <div style={{ flexShrink: 0 }}>
            <img 
              src="/illustrativeIcons/icon-puzzle.svg" 
              alt="" 
              aria-hidden="true"
              style={{ 
                height: '48px',
                width: 'auto',
                display: 'block'
              }}
            />
          </div>
          
          {/* Palvelun nimi */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <h1 style={{ 
              margin: 0, 
              fontSize: '40px', /* heading1 - Suomi.fi design system */
              fontWeight: 300, /* heading1 - Suomi.fi design system */
              color: '#ffffff',
              lineHeight: '48px' /* 1.2 * 40px = 48px - Suomi.fi design system */
            }}>
              Konfiguraatiopalvelu
            </h1>
          </div>
        </div>

        {/* Oikea puoli: Käyttäjäprofiili */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 'var(--fi-spacing-s)',
          position: 'relative',
          flexShrink: 0
        }}>
          <button
            type="button"
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            aria-label="Käyttäjäprofiili"
            aria-expanded={isProfileMenuOpen}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--fi-spacing-s)',
              padding: 'var(--fi-spacing-xs) var(--fi-spacing-s)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              color: '#ffffff',
              fontFamily: 'inherit',
              fontSize: '16px',
              lineHeight: '24px'
            }}
          >
            <img 
              src="/baseIcons/icon-person.svg" 
              alt="" 
              aria-hidden="true"
              style={{ 
                width: '24px',
                height: '24px',
                filter: 'brightness(0) invert(1)' // Valkoinen ikoni
              }}
            />
            <span style={{ fontWeight: 400 }}>{user.name}</span>
            <img 
              src="/baseIcons/icon-chevron-down.svg" 
              alt="" 
              aria-hidden="true"
              style={{ 
                width: '16px',
                height: '16px',
                filter: 'brightness(0) invert(1)', // Valkoinen ikoni
                transform: isProfileMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }}
            />
          </button>

          {/* Profiilivalikko dropdown */}
          {isProfileMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: 'var(--fi-spacing-xs)',
                backgroundColor: '#ffffff',
                borderRadius: '4px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                minWidth: '240px',
                padding: 'var(--fi-spacing-s) 0',
                zIndex: 1000,
                border: '1px solid var(--fi-color-depth-light-1)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Käyttäjän tiedot */}
              <div style={{
                padding: 'var(--fi-spacing-s) var(--fi-spacing-m)',
                borderBottom: '1px solid var(--fi-color-depth-light-1)',
                marginBottom: 'var(--fi-spacing-xs)'
              }}>
                <div style={{
                  fontSize: '16px',
                  fontWeight: 600,
                  color: 'var(--fi-color-text)',
                  marginBottom: '2px'
                }}>
                  {user.name}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: 'var(--fi-color-text-secondary)',
                  marginBottom: '2px'
                }}>
                  {user.email}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: 'var(--fi-color-text-secondary)'
                }}>
                  {user.role}
                </div>
              </div>

              {/* Valikkokohteet */}
              <div style={{ padding: 'var(--fi-spacing-xs) 0' }}>
                <button
                  type="button"
                  onClick={() => {
                    // TODO: Toteuta tuleva toiminto
                    setIsProfileMenuOpen(false)
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--fi-spacing-s)',
                    padding: 'var(--fi-spacing-s) var(--fi-spacing-m)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    justifyContent: 'flex-start',
                    fontFamily: 'inherit',
                    fontSize: '16px',
                    lineHeight: '24px',
                    color: 'var(--fi-color-text)',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--fi-color-depth-light-3)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <img 
                    src="/baseIcons/icon-settings.svg" 
                    alt="" 
                    aria-hidden="true"
                    style={{ 
                      width: '20px',
                      height: '20px',
                      flexShrink: 0
                    }}
                  />
                  <span style={{ textAlign: 'left' }}>Asetukset</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    // TODO: Toteuta uloskirjautuminen
                    setIsProfileMenuOpen(false)
                  }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--fi-spacing-s)',
                    padding: 'var(--fi-spacing-s) var(--fi-spacing-m)',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    justifyContent: 'flex-start',
                    fontFamily: 'inherit',
                    fontSize: '16px',
                    lineHeight: '24px',
                    color: 'var(--fi-color-text)',
                    transition: 'background-color 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--fi-color-depth-light-3)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <img 
                    src="/baseIcons/icon-logout.svg" 
                    alt="" 
                    aria-hidden="true"
                    style={{ 
                      width: '20px',
                      height: '20px',
                      flexShrink: 0
                    }}
                  />
                  <span style={{ textAlign: 'left' }}>Kirjaudu ulos</span>
                </button>
              </div>
          </div>
        )}
      </div>
      </div>

      {/* Sulje dropdown kun klikataan ulkopuolelle */}
      {isProfileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setIsProfileMenuOpen(false)}
        />
      )}
    </header>
  )
}

export default HeaderBar
