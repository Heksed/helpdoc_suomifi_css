import React, { useMemo, useState } from 'react'

/**
 * VariablePicker - Komponentti muuttujien valintaan ja lisäämiseen
 * Sallii vain whitelististä valitut muuttujat
 * @param {Object} props - Komponentin propsit
 * @param {Array} props.variables - Sallittujen muuttujien lista
 * @param {Function} props.onInsert - Callback kun muuttuja lisätään
 */
export default function VariablePicker({ variables, onInsert }) {
  const [searchQuery, setSearchQuery] = useState('')

  const filtered = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return variables
    return variables.filter((v) => 
      (v.label + ' ' + v.key + (v.description || '')).toLowerCase().includes(query)
    )
  }, [searchQuery, variables])

  return (
    <section aria-label="Muuttujat">
      <div style={{ marginBottom: 'var(--fi-spacing-s)' }}>
        <input
          id="variable-search"
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Hae muuttujia..."
          aria-label="Hae muuttujia"
          style={{ 
            width: '100%', 
            padding: 'var(--fi-spacing-xs) var(--fi-spacing-s)',
            fontSize: '0.875rem',
            border: '1px solid var(--fi-color-depth-light-1)',
            borderRadius: '4px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {filtered.length > 0 ? (
        <ul 
          style={{ 
            listStyle: 'none', 
            padding: 0, 
            margin: 0, 
            display: 'flex', 
            flexDirection: 'column'
          }}
        >
          {filtered.map((v, index) => (
            <React.Fragment key={v.key}>
              {index > 0 && (
                <li 
                  style={{ 
                    height: '1px',
                    backgroundColor: 'var(--fi-color-depth-light-1)',
                    margin: 'var(--fi-spacing-xs) 0'
                  }}
                  aria-hidden="true"
                />
              )}
              <li 
                style={{ 
                  display: 'flex', 
                  gap: 'var(--fi-spacing-xs)', 
                  alignItems: 'center', 
                  padding: '4px 6px',
                  borderRadius: '2px',
                  transition: 'background-color 0.15s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--fi-color-depth-light-3)'}
                onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                <button
                  type="button"
                  onClick={() => onInsert(v.key)}
                  aria-label={`Lisää muuttuja: ${v.label}`}
                  className="helpdoc-button helpdoc-button--secondary-no-border"
                  style={{ 
                    flexShrink: 0,
                    padding: '2px 8px',
                    fontSize: '0.75rem',
                    lineHeight: '1.4',
                    minHeight: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span style={{ fontSize: '0.875rem', lineHeight: 1 }}>+</span>
                  <span>Lisää</span>
                </button>
              <span 
                style={{ 
                  fontWeight: 500, 
                  fontSize: '0.875rem',
                  color: 'var(--fi-color-text)',
                  flexShrink: 0
                }}
              >
                {v.label}
              </span>
              <span 
                style={{ 
                  fontFamily: 'monospace', 
                  fontSize: '0.75rem', 
                  color: 'var(--fi-color-text-secondary)',
                  backgroundColor: 'var(--fi-color-depth-light-3)',
                  padding: '1px 4px',
                  borderRadius: '2px',
                  flexShrink: 0
                }}
              >
                {`{{${v.key}}}`}
              </span>
              {v.description && (
                <span 
                  style={{ 
                    fontSize: '0.75rem', 
                    color: 'var(--fi-color-text-secondary)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    flex: 1,
                    minWidth: 0
                  }}
                  title={v.description}
                >
                  {v.description}
                </span>
              )}
              </li>
            </React.Fragment>
          ))}
        </ul>
      ) : (
        <div 
          role="status" 
          aria-live="polite" 
          style={{ 
            padding: 'var(--fi-spacing-s)', 
            textAlign: 'center', 
            color: 'var(--fi-color-text-secondary)',
            fontSize: '0.875rem'
          }}
        >
          Muuttujia ei löytynyt
        </div>
      )}

      <p style={{ marginTop: 'var(--fi-spacing-s)', fontSize: '0.75rem', color: 'var(--fi-color-text-secondary)', fontStyle: 'italic' }}>
        Muuttujat on määritelty etukäteen. Jos tarvitset uuden muuttujan, pyydä sitä normaalin muutosprosessin kautta.
      </p>
    </section>
  )
}

