import React from 'react'

/**
 * Simple diff utility for comparing two text strings
 * Returns array of diff segments with type: 'added', 'removed', or 'unchanged'
 */

/**
 * @typedef {Object} DiffSegment
 * @property {string} type - 'added', 'removed', or 'unchanged'
 * @property {string} text - The text content
 */

/**
 * Simple line-based diff algorithm
 * @param {string} oldText - Old version text
 * @param {string} newText - New version text
 * @returns {DiffSegment[]} Array of diff segments
 */
export function computeDiff(oldText, newText) {
  const oldLines = (oldText || '').split('\n')
  const newLines = (newText || '').split('\n')
  
  const segments = []
  let oldIndex = 0
  let newIndex = 0
  
  while (oldIndex < oldLines.length || newIndex < newLines.length) {
    if (oldIndex >= oldLines.length) {
      // Only new lines left
      segments.push({ type: 'added', text: newLines[newIndex] })
      newIndex++
    } else if (newIndex >= newLines.length) {
      // Only old lines left
      segments.push({ type: 'removed', text: oldLines[oldIndex] })
      oldIndex++
    } else if (oldLines[oldIndex] === newLines[newIndex]) {
      // Lines match
      segments.push({ type: 'unchanged', text: oldLines[oldIndex] })
      oldIndex++
      newIndex++
    } else {
      // Lines differ - check if it's an addition or removal
      const nextOldMatch = newLines.slice(newIndex + 1).indexOf(oldLines[oldIndex])
      const nextNewMatch = oldLines.slice(oldIndex + 1).indexOf(newLines[newIndex])
      
      if (nextOldMatch !== -1 && (nextNewMatch === -1 || nextOldMatch < nextNewMatch)) {
        // New line was added
        segments.push({ type: 'added', text: newLines[newIndex] })
        newIndex++
      } else if (nextNewMatch !== -1 && (nextOldMatch === -1 || nextNewMatch < nextOldMatch)) {
        // Old line was removed
        segments.push({ type: 'removed', text: oldLines[oldIndex] })
        oldIndex++
      } else {
        // Both changed
        segments.push({ type: 'removed', text: oldLines[oldIndex] })
        segments.push({ type: 'added', text: newLines[newIndex] })
        oldIndex++
        newIndex++
      }
    }
  }
  
  return segments
}

/**
 * Formats diff segments for side-by-side display
 * @param {DiffSegment[]} segments - Diff segments
 * @returns {Array} Array of {left, right} objects
 */
export function formatSideBySide(segments) {
  const result = []
  
  segments.forEach((segment) => {
    if (segment.type === 'unchanged') {
      result.push({ left: segment.text, right: segment.text, type: 'unchanged' })
    } else if (segment.type === 'removed') {
      result.push({ left: segment.text, right: null, type: 'removed' })
    } else if (segment.type === 'added') {
      result.push({ left: null, right: segment.text, type: 'added' })
    }
  })
  
  return result
}

/**
 * Formats diff segments for inline highlighting with React elements
 * Returns React elements with highlighted changes
 * @param {DiffSegment[]} segments - Diff segments
 * @returns {Object} Object with leftElements and rightElements arrays
 */
export function formatWithHighlighting(segments) {
  const leftElements = []
  const rightElements = []
  
  segments.forEach((segment, index) => {
    if (segment.type === 'unchanged') {
      // Muuttumaton teksti - molemmat puolet
      leftElements.push(
        <span key={`left-${index}`} style={{ whiteSpace: 'pre-wrap' }}>
          {segment.text}
        </span>
      )
      rightElements.push(
        <span key={`right-${index}`} style={{ whiteSpace: 'pre-wrap' }}>
          {segment.text}
        </span>
      )
    } else if (segment.type === 'removed') {
      // Poistettu teksti - vain vasemmalla, korostettu
      leftElements.push(
        <span
          key={`left-${index}`}
          style={{
            backgroundColor: 'var(--fi-color-alert-light-2)',
            textDecoration: 'line-through',
            whiteSpace: 'pre-wrap'
          }}
        >
          {segment.text}
        </span>
      )
      rightElements.push(
        <span key={`right-${index}`} style={{ whiteSpace: 'pre-wrap' }}>
          {'\n'}
        </span>
      )
    } else if (segment.type === 'added') {
      // Lisätty teksti - vain oikealla, korostettu
      leftElements.push(
        <span key={`left-${index}`} style={{ whiteSpace: 'pre-wrap' }}>
          {'\n'}
        </span>
      )
      rightElements.push(
        <span
          key={`right-${index}`}
          style={{
            backgroundColor: 'var(--fi-color-success-light-2)',
            whiteSpace: 'pre-wrap'
          }}
        >
          {segment.text}
        </span>
      )
    }
  })
  
  return { leftElements, rightElements }
}

