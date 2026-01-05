import React, { useMemo } from 'react'
import { renderPreview } from './variables/placeholder'

/**
 * PreviewPanel - Näyttää tekstin esimerkkitiedoilla renderöitynä
 * @param {Object} props - Komponentin propsit
 * @param {string} props.text - Teksti placeholdereilla
 * @param {Array} props.variables - Sallittujen muuttujien lista
 */
export default function PreviewPanel({ text, variables, showTitle = false }) {
  const preview = useMemo(() => renderPreview(text, variables), [text, variables])

  return (
    <section aria-label="Esikatselu">
      {showTitle && (
        <h3 style={{ marginTop: 0, marginBottom: 'var(--fi-spacing-m)', fontSize: '1.1rem', fontWeight: 600 }}>
          Esikatselu
        </h3>
      )}
      <pre style={{ 
        margin: 0, 
        padding: 'var(--fi-spacing-m)', 
        backgroundColor: '#ffffff', 
        borderRadius: '4px',
        border: '1px solid var(--fi-color-depth-light-1)',
        whiteSpace: 'pre-wrap',
        wordWrap: 'break-word',
        fontFamily: 'Source Sans Pro, Helvetica Neue, Arial, sans-serif',
        fontSize: '16px',
        lineHeight: '1.5'
      }}>
        {preview || '(tyhjä)'}
      </pre>
    </section>
  )
}

