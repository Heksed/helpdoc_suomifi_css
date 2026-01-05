import React from 'react'
import VariablePicker from './VariablePicker'

/**
 * VariableDrawer - Drawer-komponentti muuttujien valintaan
 * Avautuu oikealle puolelle ja pitää tekstieditorin näkyvillä
 * @param {Object} props - Komponentin propsit
 * @param {boolean} props.isOpen - Onko drawer auki
 * @param {Function} props.onClose - Callback kun drawer suljetaan
 * @param {Array} props.variables - Sallittujen muuttujien lista
 * @param {Function} props.onInsert - Callback kun muuttuja lisätään
 */
export default function VariableDrawer({ isOpen, onClose, variables, onInsert }) {
  if (!isOpen) return null

  const handleInsert = (key) => {
    onInsert(key)
    // Drawer pysyy auki, jotta käyttäjä voi lisätä useita muuttujia
  }

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
        aria-label="Muuttujavalitsin"
        onKeyDown={handleKeyDown}
      >
        {/* Header */}
        <div className="helpdoc-variable-drawer-header">
          <h2 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600 }}>
            Lisää muuttuja
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="helpdoc-variable-drawer-close"
            aria-label="Sulje muuttujavalitsin"
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
        <div className="helpdoc-variable-drawer-content">
          <VariablePicker variables={variables} onInsert={handleInsert} />
        </div>
      </div>
    </>
  )
}

