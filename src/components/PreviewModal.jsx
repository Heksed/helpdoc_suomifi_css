import React, { useEffect } from 'react'
import PreviewPanel from './PreviewPanel'

/**
 * PreviewModal - Modaali esikatselun näyttämiseen
 * @param {Object} props - Komponentin propsit
 * @param {boolean} props.isOpen - Onko modaali auki
 * @param {Function} props.onClose - Callback kun modaali suljetaan
 * @param {string} props.text - Teksti placeholdereilla
 * @param {Array} props.variables - Sallittujen muuttujien lista
 */
export default function PreviewModal({ isOpen, onClose, text, variables }) {
  if (!isOpen) return null

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

  // Estä scrollaus kun modaali on auki
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = ''
      }
    }
  }, [isOpen])

  return (
    <>
      {/* Overlay */}
      <div
        className="helpdoc-preview-modal-overlay"
        onClick={handleOverlayClick}
        onKeyDown={handleKeyDown}
        role="presentation"
        aria-hidden="true"
      />
      
      {/* Modaali */}
      <div
        className="helpdoc-preview-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Esikatselu"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="helpdoc-preview-modal-header">
          <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>
            Esikatselu
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="helpdoc-preview-modal-close"
            aria-label="Sulje esikatselu"
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
        <div className="helpdoc-preview-modal-content">
          <PreviewPanel text={text} variables={variables} showTitle={false} />
        </div>
      </div>
    </>
  )
}

