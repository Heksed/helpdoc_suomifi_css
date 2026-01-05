import React, { useState } from 'react'
import HistoryDrawer from '../HistoryDrawer'
import CompareDrawer from '../CompareDrawer'

function StructureEditor({ item, onContentChange, isPublished = false, onRollback, onCopy, onArchive }) {
  const [content, setContent] = useState(item.content || '{}')
  const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false)
  const [isCompareDrawerOpen, setIsCompareDrawerOpen] = useState(false)
  const [selectedVersion, setSelectedVersion] = useState(null)

  const handleChange = (e) => {
    const newContent = e.target.value
    setContent(newContent)
    if (onContentChange) {
      onContentChange(newContent)
    }
  }

  return (
    <section aria-label="Sisällön editori">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--fi-spacing-s)' }}>
        <label htmlFor="structure-content" style={{ margin: 0, fontWeight: 600 }}>
        Rakenteen määrittely
      </label>
        <div style={{ display: 'flex', gap: 'var(--fi-spacing-xs)' }}>
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
      <textarea
        id="structure-content"
        placeholder='Muokkaa rakenteen määrittelyä (JSON-muoto)...'
        value={content}
        onChange={handleChange}
        readOnly={isPublished}
        aria-label={isPublished ? "Rakenteen editori (julkaistu versio)" : "Rakenteen editori"}
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
      <p style={{ marginTop: 'var(--fi-spacing-s)', fontSize: '0.9rem', color: 'var(--fi-color-text-secondary)' }}>
        Määritä rakenteinen data JSON-muodossa.
      </p>

      {/* Versiohistoria drawer */}
      <HistoryDrawer
        isOpen={isHistoryDrawerOpen}
        onClose={() => setIsHistoryDrawerOpen(false)}
        item={item}
        selectedLanguage={null}
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

export default StructureEditor
