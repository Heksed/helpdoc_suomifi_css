import React, { useState, useEffect } from 'react'
import HistoryDrawer from '../HistoryDrawer'
import { PARAMETER_TEMPLATES } from '../../data/mockData'

function ParameterEditor({ item, onContentChange, isPublished = false, onRollback, onCopy, onArchive }) {
  const [value, setValue] = useState(item.content || '')
  const [error, setError] = useState('')
  const [isValid, setIsValid] = useState(true)
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState(null)

  // Päivitä arvo kun item muuttuu
  useEffect(() => {
    setValue(item.content || '')
    setError('')
    setIsValid(true)
  }, [item])

  const meta = item.parameterMeta || {}
  const type = meta.type || 'text'
  const min = meta.min !== undefined ? meta.min : undefined
  const max = meta.max !== undefined ? meta.max : undefined
  const step = meta.step !== undefined ? meta.step : (type === 'integer' ? 1 : 0.01)
  const unit = meta.unit || ''
  const description = meta.description || 'Tätä parametria käytetään järjestelmän laskennassa ja validoinnissa.'

  const validateValue = (val) => {
    if (!val && val !== '0') {
      return { valid: false, error: 'Arvo on pakollinen' }
    }

    if (type === 'integer' || type === 'number') {
      const numValue = type === 'integer' ? parseInt(val, 10) : parseFloat(val)
      
      if (isNaN(numValue)) {
        return { valid: false, error: 'Arvon on oltava numero' }
      }

      if (min !== undefined && numValue < min) {
        return { valid: false, error: `Arvon on oltava vähintään ${min}${unit ? ' ' + unit : ''}` }
      }

      if (max !== undefined && numValue > max) {
        return { valid: false, error: `Arvon on oltava enintään ${max}${unit ? ' ' + unit : ''}` }
      }

      if (type === 'integer' && !Number.isInteger(numValue)) {
        return { valid: false, error: 'Arvon on oltava kokonaisluku' }
      }
    }

    return { valid: true, error: '' }
  }

  const handleChange = (e) => {
    const newValue = e.target.value
    setValue(newValue)

    // Validointi reaaliajassa
    if (newValue === '') {
      setError('')
      setIsValid(true)
      if (onContentChange) {
        onContentChange(newValue)
      }
      return
    }

    const validation = validateValue(newValue)
    setError(validation.error)
    setIsValid(validation.valid)

    if (validation.valid && onContentChange) {
      onContentChange(newValue)
    }
  }

  const handleIncrement = () => {
    if (type === 'integer' || type === 'number') {
      const currentNum = type === 'integer' ? parseInt(value || 0, 10) : parseFloat(value || 0)
      const newNum = currentNum + step
      const clampedValue = max !== undefined ? Math.min(newNum, max) : newNum
      const finalValue = type === 'integer' ? Math.round(clampedValue).toString() : clampedValue.toString()
      
      setValue(finalValue)
      const validation = validateValue(finalValue)
      setError(validation.error)
      setIsValid(validation.valid)
      
      if (validation.valid && onContentChange) {
        onContentChange(finalValue)
      }
    }
  }

  const handleDecrement = () => {
    if (type === 'integer' || type === 'number') {
      const currentNum = type === 'integer' ? parseInt(value || 0, 10) : parseFloat(value || 0)
      const newNum = currentNum - step
      const clampedValue = min !== undefined ? Math.max(newNum, min) : newNum
      const finalValue = type === 'integer' ? Math.round(clampedValue).toString() : clampedValue.toString()
      
      setValue(finalValue)
      const validation = validateValue(finalValue)
      setError(validation.error)
      setIsValid(validation.valid)
      
      if (validation.valid && onContentChange) {
        onContentChange(finalValue)
      }
    }
  }

  const getHelperText = () => {
    const parts = []
    if (min !== undefined && max !== undefined) {
      parts.push(`Sallittu arvoväli: ${min}–${max}${unit ? ' ' + unit : ''}`)
    } else if (min !== undefined) {
      parts.push(`Vähintään: ${min}${unit ? ' ' + unit : ''}`)
    } else if (max !== undefined) {
      parts.push(`Enintään: ${max}${unit ? ' ' + unit : ''}`)
    }
    if (step !== undefined && step !== 1) {
      parts.push(`Askel: ${step}`)
    }
    return parts.length > 0 ? parts.join('. ') : ''
  }

  const helperText = getHelperText()

  return (
    <section aria-label="Sisällön editori">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--fi-spacing-s)' }}>
        <label style={{ margin: 0, fontWeight: 600 }}>
        Parametrin arvo
      </label>
        <div style={{ display: 'flex', gap: 'var(--fi-spacing-xs)' }}>
          <button 
            className="helpdoc-icon-button" 
            type="button" 
            aria-label="Näytä historia"
            onClick={() => {
              setIsHistoryDrawerOpen(true)
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
      
      {/* Nykyinen arvo näyttö */}
      {item.content && (
        <div style={{ 
          marginBottom: 'var(--fi-spacing-s)', 
          padding: 'var(--fi-spacing-s)', 
          backgroundColor: 'var(--fi-color-depth-light-3)',
          borderRadius: '4px',
          fontSize: '14px',
          color: 'var(--fi-color-text-secondary)'
        }}>
          <strong>Nykyinen arvo:</strong> {item.content}{unit ? ' ' + unit : ''}
        </div>
      )}

      {/* Input-kenttä spin-nappien kanssa */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--fi-spacing-s)' }}>
        {(type === 'integer' || type === 'number') && (
          <button
            type="button"
            onClick={handleDecrement}
            disabled={isPublished || (min !== undefined && parseFloat(value || 0) <= min)}
            style={{
              padding: 'var(--fi-spacing-s)',
              minWidth: '44px',
              minHeight: '44px',
              border: '1px solid var(--fi-color-depth-light-1)',
              borderRadius: '4px',
              backgroundColor: '#ffffff',
              cursor: (min !== undefined && parseFloat(value || 0) <= min) ? 'not-allowed' : 'pointer',
              opacity: (min !== undefined && parseFloat(value || 0) <= min) ? 0.5 : 1,
              fontSize: '18px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Vähennä arvoa"
          >
            −
          </button>
        )}
        
        <div style={{ flex: 1, position: 'relative' }}>
          <input
            type={type === 'integer' || type === 'number' ? 'number' : 'text'}
            value={value}
            onChange={handleChange}
            placeholder="Syötä parametrin arvo..."
            min={min}
            max={max}
            step={step}
            readOnly={isPublished}
            disabled={isPublished}
            style={{
              width: '100%',
              padding: 'var(--fi-spacing-s) var(--fi-spacing-m)',
              border: `1px solid ${isValid ? 'var(--fi-color-depth-light-1)' : 'var(--fi-color-alert-base)'}`,
              borderRadius: '4px',
              fontSize: '16px',
              boxSizing: 'border-box',
              ...(isPublished && {
                backgroundColor: 'var(--fi-color-depth-light-3)',
                cursor: 'not-allowed',
                opacity: 0.9
              })
            }}
            aria-invalid={!isValid}
            aria-describedby={error ? 'parameter-error' : helperText ? 'parameter-helper' : undefined}
            aria-label={isPublished ? "Parametrin arvo (julkaistu versio)" : "Parametrin arvo"}
          />
          {unit && (
            <span style={{
              position: 'absolute',
              right: 'var(--fi-spacing-m)',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--fi-color-text-secondary)',
              fontSize: '14px',
              pointerEvents: 'none'
            }}>
              {unit}
            </span>
          )}
        </div>

        {(type === 'integer' || type === 'number') && (
          <button
            type="button"
            onClick={handleIncrement}
            disabled={isPublished || (max !== undefined && parseFloat(value || 0) >= max)}
            style={{
              padding: 'var(--fi-spacing-s)',
              minWidth: '44px',
              minHeight: '44px',
              border: '1px solid var(--fi-color-depth-light-1)',
              borderRadius: '4px',
              backgroundColor: '#ffffff',
              cursor: (max !== undefined && parseFloat(value || 0) >= max) ? 'not-allowed' : 'pointer',
              opacity: (max !== undefined && parseFloat(value || 0) >= max) ? 0.5 : 1,
              fontSize: '18px',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            aria-label="Lisää arvoa"
          >
            +
          </button>
        )}
      </div>

      {/* Virheilmoitus */}
      {error && (
        <div
          id="parameter-error"
          style={{
            marginTop: 'var(--fi-spacing-xs)',
            fontSize: '14px',
            color: 'var(--fi-color-alert-base)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--fi-spacing-xs)'
          }}
          role="alert"
        >
          <span>⚠</span>
          <span>{error}</span>
        </div>
      )}

      {/* Helper-teksti */}
      {helperText && !error && (
        <p
          id="parameter-helper"
          style={{
            marginTop: 'var(--fi-spacing-xs)',
            fontSize: '14px',
            color: 'var(--fi-color-text-secondary)'
          }}
        >
          {helperText}
        </p>
      )}

      {/* Template-tiedot (lukutilassa) */}
      {item.parameterTemplateId && (() => {
        const template = Object.values(PARAMETER_TEMPLATES).find(t => t.id === item.parameterTemplateId)
        return template ? (
          <div style={{
            marginTop: 'var(--fi-spacing-m)',
            padding: 'var(--fi-spacing-s)',
            backgroundColor: 'var(--fi-color-depth-light-3)',
            borderRadius: '4px',
            border: '1px solid var(--fi-color-depth-light-1)'
          }}>
            <div style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: 'var(--fi-color-text-secondary)',
              marginBottom: 'var(--fi-spacing-xs)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Parametripohja (lukutilassa)
            </div>
            <div style={{
              fontSize: '0.875rem',
              color: 'var(--fi-color-text)',
              fontWeight: 600,
              marginBottom: 'var(--fi-spacing-xs)'
            }}>
              {template.name}
            </div>
            <div style={{
              fontSize: '0.75rem',
              color: 'var(--fi-color-text-secondary)',
              display: 'flex',
              flexDirection: 'column',
              gap: '2px'
            }}>
              <div>Tyyppi: {template.type === 'integer' ? 'Kokonaisluku' : template.type === 'number' ? 'Desimaaliluku' : 'Teksti'}</div>
              {template.min !== undefined && template.max !== undefined && (
                <div>Alue: {template.min}–{template.max}</div>
              )}
              {template.step !== undefined && (template.type === 'integer' || template.type === 'number') && (
                <div>Askel: {template.step}</div>
              )}
              {template.unit && (
                <div>Yksikkö: {template.unit}</div>
              )}
            </div>
          </div>
        ) : null
      })()}

      {/* Kuvaus */}
      <p style={{
        marginTop: 'var(--fi-spacing-m)',
        fontSize: '14px',
        color: 'var(--fi-color-text-secondary)',
        lineHeight: '1.5'
      }}>
        {description}
      </p>

      {/* Versiohistoria drawer */}
      <HistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => {
          setIsHistoryDrawerOpen(false)
          setSelectedVersion(null)
        }}
        item={item}
        selectedLanguage={null}
        onVersionSelect={(version) => {
          setSelectedVersion(version)
          setIsHistoryDrawerOpen(false)
        }}
        onRollback={onRollback}
      />

      {/* Inline-vertailu parametreille */}
      {selectedVersion && (
        <div style={{
          marginTop: 'var(--fi-spacing-m)',
          padding: 'var(--fi-spacing-s)',
          border: '1px solid var(--fi-color-depth-light-1)',
          borderRadius: '4px',
          backgroundColor: 'var(--fi-color-depth-light-3)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 'var(--fi-spacing-xs)'
          }}>
            <div style={{ fontSize: '0.875rem', fontWeight: 600 }}>
              Versioiden vertailu
            </div>
            <button
              type="button"
              onClick={() => setSelectedVersion(null)}
              className="helpdoc-button helpdoc-button--secondary-no-border"
              style={{ 
                padding: '2px 8px',
                fontSize: '0.75rem'
              }}
              aria-label="Sulje vertailu"
            >
              Sulje
            </button>
          </div>
          <div style={{ 
            display: 'flex', 
            gap: 'var(--fi-spacing-m)', 
            alignItems: 'center',
            fontSize: '0.875rem'
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontSize: '0.75rem', 
                color: 'var(--fi-color-text-secondary)', 
                marginBottom: 'var(--fi-spacing-xs)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Versio {selectedVersion.version}
              </div>
              <div style={{ 
                padding: 'var(--fi-spacing-xs) var(--fi-spacing-s)',
                backgroundColor: selectedVersion.content !== value ? 'var(--fi-color-alert-light-2)' : 'transparent',
                borderRadius: '3px',
                textDecoration: selectedVersion.content !== value ? 'line-through' : 'none'
              }}>
                {selectedVersion.content}{unit ? ' ' + unit : ''}
              </div>
            </div>
            <div style={{ fontSize: '1.25rem', color: 'var(--fi-color-text-secondary)' }}>→</div>
            <div style={{ flex: 1 }}>
              <div style={{ 
                fontSize: '0.75rem', 
                color: 'var(--fi-color-text-secondary)', 
                marginBottom: 'var(--fi-spacing-xs)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Nykyinen
              </div>
              <div style={{ 
                padding: 'var(--fi-spacing-xs) var(--fi-spacing-s)',
                backgroundColor: selectedVersion.content !== value ? 'var(--fi-color-success-light-2)' : 'transparent',
                borderRadius: '3px'
              }}>
                {value}{unit ? ' ' + unit : ''}
              </div>
            </div>
          </div>
    </div>
      )}
    </section>
  )
}

export default ParameterEditor
