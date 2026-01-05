import React from 'react'
import { CONTENT_TYPES } from '../data/mockData'

/**
 * MiddleList - Keskimmäinen lista, joka näyttää suodatetut sisältökohteet
 * @param {Object} props - Komponentin propsit
 * @param {Array} props.items - Näytettävät sisältökohteet
 * @param {Object|null} props.selectedItem - Valittu kohde
 * @param {Function} props.onItemSelect - Callback kun kohde valitaan
 * @param {string} props.searchQuery - Hakukysely
 * @param {Function} props.onSearchChange - Callback kun hakukysely muuttuu
 * @param {string|null} props.selectedStatus - Valittu status-filtteri
 * @param {Function} props.onStatusFilterChange - Callback kun status-filtteri muuttuu
 */
function MiddleList({ items, selectedItem, onItemSelect, searchQuery, onSearchChange, selectedStatus, onStatusFilterChange, selectedContentType, selectedCategory, onItemCreate, selectedGroupId, showArchived, onShowArchivedChange }) {
  /**
   * Muotoilee päivämäärän suomenkieliseen muotoon (dd.mm.yyyy)
   * @param {string} dateString - ISO-muotoinen päivämäärä
   * @returns {string} Muotoiltu päivämäärä
   */
  const formatDate = (dateString) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return ''
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      return `${day}.${month}.${year}`
    } catch (e) {
      return ''
    }
  }

  /**
   * Muotoilee päivämäärän ja ajan suomenkieliseen muotoon (dd.mm.yyyy klo hh:mm)
   * @param {string} dateString - ISO-muotoinen päivämäärä
   * @returns {string} Muotoiltu päivämäärä ja aika
   */
  const formatDateTime = (dateString) => {
    if (!dateString) return ''
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return ''
      const day = String(date.getDate()).padStart(2, '0')
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const year = date.getFullYear()
      const hours = String(date.getHours()).padStart(2, '0')
      const minutes = String(date.getMinutes()).padStart(2, '0')
      return `${day}.${month}.${year} klo ${hours}:${minutes}`
    } catch (e) {
      return ''
    }
  }

  /**
   * Hakee itemin julkaisun ajankohdan ottaen huomioon kieliversiot
   * @param {Object} item - Item josta haetaan julkaisun ajankohta
   * @returns {string|null} Julkaisun ajankohta ISO-muodossa tai null
   */
  const getPublishedDate = (item) => {
    // Tarkista tukevatko kohde useita kieliä
    const supportsLangs = item?.languages && (
      item?.contentType === CONTENT_TYPES.TEXT ||
      item?.contentType === CONTENT_TYPES.TEMPLATE
    )
    
    // Jos tukee kieliä, hae kielikohtainen julkaisun ajankohta
    if (supportsLangs && item.languages) {
      const preferredOrder = ['fi', 'sv', 'en']
      const availableLanguages = Object.keys(item.languages)
      const preferredLang = preferredOrder.find(lang => availableLanguages.includes(lang)) || availableLanguages[0]
      
      if (preferredLang && item.languages[preferredLang]?.publishedDate) {
        return item.languages[preferredLang].publishedDate
      }
    }
    
    // Muuten käytetään yleistä julkaisun ajankohtaa
    return item.publishedDate || null
  }

  /**
   * Hakee itemin nykyisen statuksen ottaen huomioon kieliversiot
   * @param {Object} item - Item josta haetaan status
   * @returns {Object} { status, lifecycleState }
   */
  const getItemStatus = (item) => {
    // Tarkista tukevatko kohde useita kieliä
    const supportsLangs = item?.languages && (
      item?.contentType === CONTENT_TYPES.TEXT ||
      item?.contentType === CONTENT_TYPES.TEMPLATE
    )
    
    // Jos tukee kieliä, käytetään kielikohtaista statusta
    // Tarkista ensin FI, sitten SV, sitten EN, sitten ensimmäinen saatavilla oleva
    if (supportsLangs && item.languages) {
      const preferredOrder = ['fi', 'sv', 'en']
      const availableLanguages = Object.keys(item.languages)
      
      // Etsi ensimmäinen saatavilla oleva kieli preferenssijärjestyksessä
      const preferredLang = preferredOrder.find(lang => availableLanguages.includes(lang)) || availableLanguages[0]
      
      if (preferredLang && item.languages[preferredLang]) {
        const langState = item.languages[preferredLang].lifecycleState
        return {
          status: item.status,
          lifecycleState: langState || item.lifecycleState
        }
      }
    }
    
    // Muuten käytetään yleistä statusta
    return {
      status: item.status,
      lifecycleState: item.lifecycleState
    }
  }

  /**
   * Palauttaa status-luokan CSS-luokkanimen
   * @param {Object} item - Item josta haetaan status
   * @returns {string} CSS-luokkanimi
   */
  const getStatusClass = (item) => {
    const currentStatus = getItemStatus(item)
    const lifecycleState = currentStatus.lifecycleState
    const status = currentStatus.status
    
    // TÄRKEÄ: Tarkista lifecycleState ENSIN, koska se on tarkempi kuin status
    // Jos lifecycleState on 'draft', palauta 'pending' vaikka status olisi 'published'
    if (lifecycleState === 'draft') {
      return 'pending' // Sininen luonnokselle
    }
    if (lifecycleState === 'pending_review') {
      return 'warning'
    }
    if (lifecycleState === 'scheduled') {
      return 'pending'
    }
    if (lifecycleState === 'published') {
      return 'success'
    }
    
    // Fallback: tarkista status vain jos lifecycleState ei ole määritelty
    if (status === 'published') {
      return 'success'
    }
    
    return 'pending'
  }

  /**
   * Palauttaa suomenkielisen status-otsikon
   * @param {Object} item - Item josta haetaan status
   * @returns {string} Suomenkielinen otsikko
   */
  const getStatusLabel = (item) => {
    const currentStatus = getItemStatus(item)
    // Käytetään lifecycleStatea jos se on saatavilla
    const stateToCheck = currentStatus.lifecycleState || currentStatus.status
    
    // Suomenkieliset labelit
    if (stateToCheck === 'published') return 'Julkaistu'
    if (stateToCheck === 'draft') return 'Luonnos'
    if (stateToCheck === 'pending_review') return 'Tarkistuksessa'
    if (stateToCheck === 'scheduled') return 'Ajastettu'
    if (stateToCheck === 'approved') return 'Hyväksytty'
    
    // Jos on underscore-merkkejä, korvataan ne välilyönneillä ja käännetään
    const label = stateToCheck.replace(/_/g, ' ')
    
    // Yritetään kääntää yleisimmät termit
    const translations = {
      'published': 'Julkaistu',
      'draft': 'Luonnos',
      'pending review': 'Tarkistuksessa',
      'scheduled': 'Ajastettu',
      'approved': 'Hyväksytty'
    }
    
    if (translations[label.toLowerCase()]) {
      return translations[label.toLowerCase()]
    }
    
    // Fallback: capitalize ensimmäinen kirjain
    return label.charAt(0).toUpperCase() + label.slice(1).toLowerCase()
  }

  const itemCount = items.length

  return (
    <section className="helpdoc-shell-section">
      <div style={{ padding: 'var(--fi-spacing-m) var(--fi-spacing-l)', borderBottom: '1px solid var(--fi-color-depth-light-1)', flexShrink: 0 }}>
        <label htmlFor="content-search" className="sr-only">
          Hae sisältökohteita
        </label>
        <input
          id="content-search"
          type="search"
          placeholder="Hae..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Hae sisältökohteita"
          style={{ 
            width: '100%', 
            marginBottom: 'var(--fi-spacing-s)',
            border: '1px solid var(--fi-color-depth-light-1)',
            borderRadius: '4px',
            padding: 'var(--fi-spacing-xs) var(--fi-spacing-s)',
            fontSize: '0.875rem'
          }}
        />
        <div style={{ display: 'flex', gap: 'var(--fi-spacing-s)', alignItems: 'center', flexWrap: 'wrap', marginBottom: 'var(--fi-spacing-s)' }}>
          <label htmlFor="status-filter" className="sr-only">
            Suodata tilan mukaan
          </label>
          <div className="helpdoc-select-wrapper" style={{ minWidth: '150px' }}>
            <select
              id="status-filter"
              value={selectedStatus || ''}
              onChange={(e) => onStatusFilterChange(e.target.value || null)}
              aria-label="Suodata tilan mukaan"
              style={{
                padding: 'var(--fi-spacing-xs) var(--fi-spacing-s)',
                paddingRight: 'calc(var(--fi-spacing-s) + 10px + var(--fi-spacing-xs))',
                border: '1px solid var(--fi-color-depth-light-1)',
                borderRadius: '4px',
                fontSize: '0.875rem',
                fontFamily: 'Source Sans Pro, sans-serif',
                backgroundColor: '#ffffff',
                color: 'var(--fi-color-text)',
                cursor: 'pointer',
                appearance: 'none',
                WebkitAppearance: 'none',
                MozAppearance: 'none'
              }}
            >
              <option value="">Kaikki tilat</option>
              <option value="draft">Luonnos</option>
              <option value="pending_review">Tarkistuksessa</option>
              <option value="published">Julkaistu</option>
              <option value="scheduled">Ajastettu</option>
              <option value="approved">Hyväksytty</option>
            </select>
          </div>
          <label 
            htmlFor="show-archived"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--fi-spacing-xs)', 
              fontSize: '0.875rem',
              cursor: 'pointer',
              color: 'var(--fi-color-text)',
              userSelect: 'none'
            }}
          >
            <input
              id="show-archived"
              type="checkbox"
              checked={showArchived}
              onChange={(e) => onShowArchivedChange(e.target.checked)}
              style={{ 
                cursor: 'pointer',
                width: '16px',
                height: '16px'
              }}
              aria-label="Näytä arkistoidut kohteet"
            />
            <span>Näytä arkistoidut</span>
          </label>
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--fi-color-text-secondary)', fontWeight: 400 }}>
          <span aria-live="polite" aria-atomic="true">
            {itemCount === 0 ? 'Ei kohteita' : itemCount === 1 ? '1 kohde' : `${itemCount} kohdetta`}
          </span>
        </div>
      </div>
      <div className="helpdoc-shell-scrollable">
        {items.length === 0 ? (
          <div 
            role="status" 
            aria-live="polite"
            style={{ padding: 'var(--fi-spacing-xl)', textAlign: 'center', color: 'var(--fi-color-text-secondary)' }}
          >
            {!selectedContentType ? (
              <>
                <p style={{ marginBottom: 'var(--fi-spacing-m)', fontSize: '0.875rem', margin: '0 0 var(--fi-spacing-m) 0' }}>
                  Valitse vasemmalta sisällöntyyppi ja kategoria luodaksesi uutta sisältöä.
                </p>
              </>
            ) : !selectedCategory ? (
              <>
                <p style={{ marginBottom: 'var(--fi-spacing-m)', fontSize: '0.875rem', margin: '0 0 var(--fi-spacing-m) 0' }}>
                  Valitse kategoria luodaksesi uutta sisältöä.
                </p>
              </>
            ) : (
              <>
                <p style={{ marginBottom: 'var(--fi-spacing-m)', fontSize: '0.875rem', margin: '0 0 var(--fi-spacing-m) 0' }}>
                  Ei kohteita tässä kategoriassa. Luo uusi sisältökohde oikealta.
                </p>
              </>
            )}
          </div>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }} role="listbox" aria-label="Sisältökohteet">
            {items.map((item) => (
              <li
                key={item.id}
                className={`helpdoc-shell-list-item ${selectedItem?.id === item.id ? 'selected' : ''}`}
                onClick={() => onItemSelect(item)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onItemSelect(item)
                  }
                }}
                tabIndex={0}
                role="option"
                aria-label={`Valitse kohde: ${item.title}`}
                aria-selected={selectedItem?.id === item.id}
              >
                <div style={{ fontWeight: 600, marginBottom: '2px', fontSize: '14px', lineHeight: '1.4' }}>{item.title}</div>
                <div style={{ fontSize: '13px', color: 'var(--fi-color-text-secondary)', marginBottom: '2px', display: 'flex', gap: 'var(--fi-spacing-s)', alignItems: 'center', lineHeight: '1.4', justifyContent: 'flex-end' }}>
                  <span className={`helpdoc-status helpdoc-status--${getStatusClass(item)}`} aria-label={`Tila: ${getStatusLabel(item)}`} style={{ flexShrink: 0, borderRadius: '4px' }}>
                    {getStatusLabel(item)}
                  </span>
                </div>
                {/* Metadata: julkaisun ajankohta, luomisen ajankohta, viimeisin muokkaus */}
                <div style={{ fontSize: '11px', color: 'var(--fi-color-text-secondary)', display: 'flex', gap: 'var(--fi-spacing-m)', alignItems: 'center', flexWrap: 'wrap', marginTop: '4px' }}>
                  {(() => {
                    const currentStatus = getItemStatus(item)
                    const publishedDate = getPublishedDate(item)
                    
                    // Määritä viimeisin muutos: julkaistu > muokattu > luotu
                    let lastAction = null
                    let lastDate = null
                    let lastBy = null
                    
                    if (currentStatus.lifecycleState === 'published' && publishedDate) {
                      lastAction = 'Julkaistu'
                      lastDate = publishedDate
                      lastBy = item.publishedBy
                    } else if (item.updatedAt) {
                      lastAction = 'Muokattu'
                      lastDate = item.updatedAt
                      lastBy = item.updatedBy
                    } else if (item.createdAt) {
                      lastAction = 'Luotu'
                      lastDate = item.createdAt
                      lastBy = item.createdBy
                    }
                    
                    if (lastAction && lastDate) {
                      const byText = lastBy ? ` (${lastBy})` : ''
                      return (
                        <span style={{ fontSize: '11px', lineHeight: '1.3' }}>
                          {`${lastAction}: ${formatDate(lastDate)}${byText}`}
                        </span>
                      )
                    }
                    
                    return null
                  })()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}

export default MiddleList
