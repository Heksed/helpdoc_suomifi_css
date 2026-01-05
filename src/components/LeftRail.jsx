import React, { useState, useEffect } from 'react'
import { contentTypeGroups } from '../data/mockData'

/**
 * LeftRail - Vasemman reunan navigaatiopalkki
 * Näyttää sisällön pääkategoriat ja alikategoriat
 * @param {Object} props - Komponentin propsit
 * @param {string|null} props.selectedContentType - Valittu sisällöntyyppi
 * @param {string|null} props.selectedCategory - Valittu kategoria
 * @param {Function} props.onContentTypeSelect - Callback kun pääkategoria valitaan
 * @param {Function} props.onCategorySelect - Callback kun alikategoria valitaan
 * @param {string|null} props.selectedGroupId - Valitun pääkategorian ID
 */
function LeftRail({ selectedContentType, selectedCategory, onContentTypeSelect, onCategorySelect, selectedGroupId }) {
  const [expandedGroupId, setExpandedGroupId] = useState(selectedGroupId || null)

  const handleContentTypeClick = (contentType, groupId) => {
    if (expandedGroupId === groupId) {
      setExpandedGroupId(null)
      onContentTypeSelect(null, null)
      onCategorySelect(null, null)
    } else {
      setExpandedGroupId(groupId)
      onContentTypeSelect(contentType, groupId)
      onCategorySelect(null, groupId)
    }
  }

  const handleCategoryClick = (category, contentType, groupId) => {
    setExpandedGroupId(groupId)
    onContentTypeSelect(contentType, groupId)
    onCategorySelect(category, groupId)
  }

  // Sync expanded state with selectedGroupId prop
  useEffect(() => {
    if (selectedGroupId !== expandedGroupId) {
      setExpandedGroupId(selectedGroupId || null)
    }
  }, [selectedGroupId])

  return (
    <nav className="helpdoc-shell-nav" aria-label="Sisällönavigaatio">
      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '2px' }} role="list">
        {contentTypeGroups.map((group) => {
          const isExpanded = expandedGroupId === group.id
          const isSelected = selectedGroupId === group.id && !selectedCategory
          const hasCategories = group.categories && group.categories.length > 0

          return (
            <li key={group.id}>
              <button
                className={isSelected ? 'selected' : ''}
                type="button"
                onClick={() => handleContentTypeClick(group.contentType, group.id)}
                aria-expanded={hasCategories ? isExpanded : undefined}
                aria-current={isSelected ? 'true' : undefined}
                style={{
                  width: '100%',
                  justifyContent: 'space-between',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                <span>{group.label}</span>
                {group.contentType && hasCategories && (
                  <img 
                    src="/baseIcons/icon-chevron-down.svg" 
                    alt="" 
                    aria-hidden="true"
                    className={`helpdoc-shell-nav-chevron ${isExpanded ? 'expanded' : ''} ${isSelected ? 'selected' : ''}`}
                    style={{ 
                      width: '16px',
                      height: '16px',
                      flexShrink: 0,
                      marginLeft: 'var(--fi-spacing-s)',
                      filter: isSelected 
                        ? 'brightness(0) saturate(100%) invert(100%)' /* Valkoinen valitussa tilassa */
                        : 'brightness(0) saturate(100%) invert(13%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(0%) contrast(100%)' /* Musta väri normaalissa tilassa */
                    }}
                  />
                )}
              </button>
              {isExpanded && hasCategories && (
                <ul style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: '2px 0 0 var(--fi-spacing-l)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2px'
                }}>
                  {group.categories.map((category) => {
                    const isSubSelected = selectedCategory === category.category && selectedGroupId === group.id
                    return (
                      <li key={category.id}>
                        <button
                          className={isSubSelected ? 'selected' : ''}
                          type="button"
                          onClick={() => handleCategoryClick(category.category, group.contentType, group.id)}
                          aria-current={isSubSelected ? 'true' : undefined}
                          style={{
                            width: '100%',
                            justifyContent: 'flex-start',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 'var(--fi-spacing-s)'
                          }}
                        >
                          <img 
                            src="/baseIcons/icon-sub-directory.svg" 
                            alt="" 
                            aria-hidden="true"
                            style={{ 
                              width: '11px', 
                              height: '11px',
                              flexShrink: 0,
                              filter: 'brightness(0) saturate(100%) invert(45%) sepia(100%) saturate(2000%) hue-rotate(10deg) brightness(0.9) contrast(1.2)' /* Oranssi #e86717 - sama kuin headerissa */
                            }}
                          />
                          {category.label}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default LeftRail

