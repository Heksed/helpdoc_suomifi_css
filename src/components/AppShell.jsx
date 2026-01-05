import React, { useState, useMemo } from 'react'
import { mockItems as initialMockItems, CATEGORIES, CONTENT_TYPES, LIFECYCLE_STATES, LANGUAGES, PARAMETER_TEMPLATES } from '../data/mockData'
import ShellLayout from './ShellLayout'

/**
 * AppShell - Pääkomponentti joka hallinnoi sovelluksen tilaa ja filtteröintiä
 * Yhdistää kaikki komponentit yhteen ja hoitaa valintojen logiikan
 */
function AppShell() {
  // Viestipohjien kategoriat - käytetään filtteröinnissä
  const MESSAGE_CATEGORIES = [
    CATEGORIES.MESSAGE_PAYMENT_NOTIFICATION,
    CATEGORIES.MESSAGE_PAYMENT_REMINDER_1,
    CATEGORIES.MESSAGE_PAYMENT_REMINDER_2,
    CATEGORIES.MESSAGE_ADDITIONAL_INFO_REQUEST,
    CATEGORIES.MESSAGE_CORRECTION_CASE,
    CATEGORIES.MESSAGE_APPEAL_CASE,
    CATEGORIES.MESSAGE_OTHER_ADVANCE_NOTICE,
    CATEGORIES.MESSAGE_OTHER_RECEIVABLE_GROSS,
    // Vanhat kategoriat säilytetään yhteensopivuuden vuoksi
    CATEGORIES.MESSAGE_WELCOME,
    CATEGORIES.MESSAGE_REJECTION,
    CATEGORIES.MESSAGE_APPROVAL,
    CATEGORIES.MESSAGE_NOTIFICATION,
    CATEGORIES.MESSAGE_TEMPLATES
  ]

  const [items, setItems] = useState([...initialMockItems]) // Käytetään statea jotta voidaan muokata itemeitä
  const [selectedItem, setSelectedItem] = useState(null)
  const [itemVersion, setItemVersion] = useState(0) // Pakottaa re-renderin kun item muuttuu
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedContentType, setSelectedContentType] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedGroupId, setSelectedGroupId] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState(null) // Filtteri tilan mukaan
  const [showArchived, setShowArchived] = useState(false) // Näytä arkistoidut kohteet

  /**
   * Filtteröi sisältökohteet valitun tyypin, kategorian ja hakukyselyn perusteella
   * @returns {Array} Filtteröidyt sisältökohteet
   */
  const filteredItems = useMemo(() => {
    // Jos showArchived on true, näytetään vain arkistoidut. Muuten suodatetaan arkistoidut pois
    let filtered = showArchived 
      ? items.filter(item => item.archived) 
      : items.filter(item => !item.archived)

    // Filter by content type
    if (selectedContentType) {
      filtered = filtered.filter(item => item.contentType === selectedContentType)
      
      // Special handling for "Viestipohjat" group - filter only message categories
      if (selectedGroupId === 'messages' && !selectedCategory) {
        filtered = filtered.filter(item => MESSAGE_CATEGORIES.includes(item.category))
      }
      
      // Special handling for "Tekstisisältö" group - exclude message categories
      if (selectedGroupId === 'text' && !selectedCategory) {
        filtered = filtered.filter(item => !MESSAGE_CATEGORIES.includes(item.category))
      }
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory)
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter((item) => {
        // Search in title, key, and description
        if (item.title.toLowerCase().includes(query) || 
            item.key.toLowerCase().includes(query) ||
            (item.description && item.description.toLowerCase().includes(query))) {
          return true
        }
        // Search in content (for parameters) or languages (for text/template)
        if (item.languages) {
          return Object.values(item.languages).some(langData =>
            langData.content && langData.content.toLowerCase().includes(query)
          )
        }
        if (item.content && item.content.toLowerCase().includes(query)) {
          return true
        }
        return false
      })
    }

    // Filter by status
    if (selectedStatus) {
      filtered = filtered.filter((item) => {
        const statusToCheck = item.lifecycleState || item.status
        return statusToCheck === selectedStatus
      })
    }

    return filtered
  }, [items, searchQuery, selectedContentType, selectedCategory, itemVersion, selectedStatus, selectedGroupId, showArchived])

  const handleItemSelect = (item) => {
    setSelectedItem(item)
  }

  const handleSearchChange = (value) => {
    setSearchQuery(value)
  }

  const handleContentTypeSelect = (contentType, groupId) => {
    setSelectedContentType(contentType)
    setSelectedCategory(null)
    setSelectedGroupId(groupId || null)
    // Clear selection if filtering changes
    if (selectedItem && contentType && selectedItem.contentType !== contentType) {
      setSelectedItem(null)
    }
  }

  const handleCategorySelect = (category, groupId) => {
    setSelectedCategory(category)
    setSelectedGroupId(groupId || null)
    // Clear selection if filtering changes
    if (selectedItem && category && selectedItem.category !== category) {
      setSelectedItem(null)
    }
  }

  const handleStatusFilterChange = (status) => {
    setSelectedStatus(status || null)
  }

  /**
   * Luo uuden itemin
   * @param {string} contentType - Sisällöntyyppi
   * @param {string} category - Kategoria
   * @param {string} [templateId] - Parametripohjan ID (vain parametreille)
   */
  const handleCreateItem = (contentType, category, templateId = null) => {
    const newId = String(Math.max(...items.map(i => parseInt(i.id) || 0)) + 1)
    const baseKey = contentType === CONTENT_TYPES.TEXT ? 'text' :
                    contentType === CONTENT_TYPES.TEMPLATE ? 'template' :
                    contentType === CONTENT_TYPES.PARAMETER ? 'param' : 'structure'
    const newKey = `${baseKey}-new-${newId}`
    
    // Jos parametri, haetaan template ja kopioidaan parameterMeta
    let parameterMeta = null
    let parameterTemplateId = null
    let initialContent = ''
    
    if (contentType === CONTENT_TYPES.PARAMETER && templateId) {
      const template = Object.values(PARAMETER_TEMPLATES).find(t => t.id === templateId)
      if (template) {
        parameterTemplateId = template.id
        parameterMeta = {
          type: template.type,
          min: template.min,
          max: template.max,
          step: template.step,
          unit: template.unit,
          description: template.defaultDescription
        }
        // Aseta oletusarvo tyypin mukaan
        if (template.type === 'integer' || template.type === 'number') {
          initialContent = template.min !== undefined ? String(template.min) : '0'
        } else {
          initialContent = ''
        }
      }
    }
    
    const newItem = {
      id: newId,
      title: 'Uusi sisältö',
      key: newKey,
      description: '',
      status: 'draft',
      lifecycleState: LIFECYCLE_STATES.DRAFT,
      contentType: contentType,
      category: category,
      archived: false,
      createdAt: new Date().toISOString(),
      ...(contentType === CONTENT_TYPES.TEXT || contentType === CONTENT_TYPES.TEMPLATE ? {
        languages: {
          [LANGUAGES.FI]: {
            content: '',
            lifecycleState: LIFECYCLE_STATES.DRAFT
          }
        }
      } : {
        content: contentType === CONTENT_TYPES.PARAMETER ? initialContent : '{}'
      }),
      ...(contentType === CONTENT_TYPES.PARAMETER && parameterMeta ? {
        parameterTemplateId: parameterTemplateId,
        parameterMeta: parameterMeta
      } : {})
    }
    
    setItems(prev => [...prev, newItem])
    setSelectedItem(newItem)
    setItemVersion(prev => prev + 1)
  }

  /**
   * Kopioi itemin
   */
  const handleCopyItem = (item) => {
    const newId = String(Math.max(...items.map(i => parseInt(i.id) || 0)) + 1)
    const copiedItem = {
      ...JSON.parse(JSON.stringify(item)), // Deep copy
      id: newId,
      key: `${item.key}-copy-${newId}`,
      title: `${item.title} (kopio)`,
      status: 'draft',
      lifecycleState: LIFECYCLE_STATES.DRAFT,
      archived: false,
      createdAt: new Date().toISOString()
    }
    
    // Aseta kaikki kieliversiot luonnokseksi
    if (copiedItem.languages) {
      Object.keys(copiedItem.languages).forEach(lang => {
        copiedItem.languages[lang].lifecycleState = LIFECYCLE_STATES.DRAFT
      })
    }
    
    setItems(prev => [...prev, copiedItem])
    setSelectedItem(copiedItem)
    setItemVersion(prev => prev + 1)
  }

  /**
   * Arkistoi itemin
   */
  const handleArchiveItem = (item) => {
    setItems(prev => prev.map(i => 
      i.id === item.id ? { ...i, archived: true } : i
    ))
    if (selectedItem?.id === item.id) {
      setSelectedItem(null)
    }
    setItemVersion(prev => prev + 1)
  }

  /**
   * Poista itemin pysyvästi
   */
  const handleDeleteItem = (item) => {
    if (window.confirm(`Haluatko varmasti poistaa "${item.title}" pysyvästi?`)) {
      setItems(prev => prev.filter(i => i.id !== item.id))
      if (selectedItem?.id === item.id) {
        setSelectedItem(null)
      }
      setItemVersion(prev => prev + 1)
    }
  }

  /**
   * Päivittää itemin (kun item muuttuu editorissa)
   * @param {Object} updatedItem - Päivitetty item (valinnainen, jos ei anneta, luodaan kopio selectedItem:sta)
   * TÄRKEÄ: Tämä funktio luo täysin uuden kopion jotta React tunnistaa muutoksen
   */
  const handleItemUpdate = (updatedItem = null) => {
    if (selectedItem) {
      // Jos päivitetty item annettiin parametrina, käytä sitä
      // Muuten luo kopio selectedItem:sta
      const itemToUpdate = updatedItem || JSON.parse(JSON.stringify(selectedItem))
      
      // Luodaan syvä kopio jotta varmistetaan uusi referenssi
      const newItem = JSON.parse(JSON.stringify(itemToUpdate))
      
      // Päivitä items-array
      setItems(prev => prev.map(item => {
        if (item.id === selectedItem.id) {
          return newItem
        }
        return item
      }))
      
      // Päivitä myös selectedItem jotta se päivittyy oikein
      // TÄRKEÄ: Aseta uusi objekti, ei sama referenssi - tämä pakottaa Reactin tunnistamaan muutoksen
      setSelectedItem(newItem)
    }
    setItemVersion(prev => prev + 1)
  }

  return (
    <ShellLayout
      selectedItem={selectedItem}
      onItemSelect={handleItemSelect}
      onItemUpdate={handleItemUpdate}
      onItemCreate={handleCreateItem}
      onItemCopy={handleCopyItem}
      onItemArchive={handleArchiveItem}
      onItemDelete={handleDeleteItem}
      searchQuery={searchQuery}
      onSearchChange={handleSearchChange}
      items={items}
      filteredItems={filteredItems}
      selectedContentType={selectedContentType}
      selectedCategory={selectedCategory}
      onContentTypeSelect={handleContentTypeSelect}
      onCategorySelect={handleCategorySelect}
      selectedGroupId={selectedGroupId}
      selectedStatus={selectedStatus}
      onStatusFilterChange={handleStatusFilterChange}
      showArchived={showArchived}
      onShowArchivedChange={setShowArchived}
    />
  )
}

export default AppShell
