import React, { useState, useEffect, useMemo } from 'react'
import { CONTENT_TYPES, LANGUAGES, LANGUAGE_LABELS, PARAMETER_TEMPLATES, CATEGORIES, LIFECYCLE_STATES } from '../data/mockData'
import { VARIABLE_CATALOG } from './variables/variableCatalog'
import TextEditor from './editors/TextEditor'
import ParameterEditor from './editors/ParameterEditor'
import TemplateEditor from './editors/TemplateEditor'
import StructureEditor from './editors/StructureEditor'
import PreviewPanel from './PreviewPanel'

/**
 * RightEditor - Oikean reunan editori-paneeli
 * Näyttää valitun kohteen muokkauslomakkeen
 * @param {Object} props - Komponentin propsit
 * @param {Object|null} props.selectedItem - Valittu sisältökohde
 */
function RightEditor({ selectedItem, onItemUpdate, onItemCopy, onItemArchive, onItemDelete, selectedContentType, selectedCategory, onItemCreate }) {
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGES.FI)
  const [isEditingTitle, setIsEditingTitle] = useState(false)
  const [editedTitle, setEditedTitle] = useState(selectedItem?.title || '')
  const [isEditingKey, setIsEditingKey] = useState(false)
  const [editedKey, setEditedKey] = useState(selectedItem?.key || '')
  const [showPreview, setShowPreview] = useState(false)
  const [templateContent, setTemplateContent] = useState('')
  const [localItemVersion, setLocalItemVersion] = useState(0) // Paikallinen versio - pakottaa re-renderin kun status muuttuu
  const [toast, setToast] = useState(null) // Toast-ilmoitus
  const [showScheduleModal, setShowScheduleModal] = useState(false) // Ajastusmodaali
  const [showChangeReasonModal, setShowChangeReasonModal] = useState(false) // Muutosperustelu-modaali
  const [changeReason, setChangeReason] = useState('') // Muutosperustelu
  const [pendingAction, setPendingAction] = useState(null) // Odottava toiminto (publish/review)
  const [scheduledDate, setScheduledDate] = useState('') // Ajastettu päivämäärä
  const [scheduledTime, setScheduledTime] = useState('') // Ajastettu aika
  const [showTemplateModal, setShowTemplateModal] = useState(false) // Template-valinta modaali parametreille
  const [showConfirmModal, setShowConfirmModal] = useState(false) // Vahvistusmodaali
  const [confirmConfig, setConfirmConfig] = useState(null) // { message, onConfirm, onCancel }
  const [messageChannel, setMessageChannel] = useState(selectedItem?.messageChannel || '')
  const [validFrom, setValidFrom] = useState('')
  const [validTo, setValidTo] = useState('')
  const [selectedChannel, setSelectedChannel] = useState(null)

  /**
   * Määritellyt viestikanavat (järjestys: Sähköinen asiointi, Sähköposti, Tekstiviesti)
   */
  const MESSAGE_CHANNELS = ['Sähköinen asiointi', 'Sähköposti', 'Tekstiviesti']

  /**
   * Tarkistaa onko kohde viestipohja-kategoria
   * TÄRKEÄ: Määritellään ennen useEffect-hookkeja, jotta sitä voidaan käyttää niissä
   */
  const isMessageTemplate = useMemo(() => {
    if (!selectedItem || !selectedItem.category) return false
    return selectedItem.category === CATEGORIES.MESSAGE_PAYMENT_NOTIFICATION ||
           selectedItem.category === CATEGORIES.MESSAGE_PAYMENT_REMINDER_1 ||
           selectedItem.category === CATEGORIES.MESSAGE_PAYMENT_REMINDER_2 ||
           selectedItem.category === CATEGORIES.MESSAGE_ADDITIONAL_INFO_REQUEST ||
           selectedItem.category === CATEGORIES.MESSAGE_CORRECTION_CASE ||
           selectedItem.category === CATEGORIES.MESSAGE_APPEAL_CASE ||
           selectedItem.category === CATEGORIES.MESSAGE_OTHER_ADVANCE_NOTICE ||
           selectedItem.category === CATEGORIES.MESSAGE_OTHER_RECEIVABLE_GROSS ||
           selectedItem.category === CATEGORIES.MESSAGE_WELCOME ||
           selectedItem.category === CATEGORIES.MESSAGE_REJECTION ||
           selectedItem.category === CATEGORIES.MESSAGE_APPROVAL ||
           selectedItem.category === CATEGORIES.MESSAGE_NOTIFICATION
  }, [selectedItem])

  /**
   * Automaattisesti valitsee ensimmäisen saatavilla olevan kielen kun kohde muuttuu
   * Suosii järjestystä: FI > SV > EN
   */
  useEffect(() => {
    if (selectedItem && selectedItem.languages) {
      const availableLanguages = Object.keys(selectedItem.languages)
      if (availableLanguages.length > 0) {
        // Prefer FI, then SV, then EN, or first available
        const preferredOrder = [LANGUAGES.FI, LANGUAGES.SV, LANGUAGES.EN]
        const preferredLang = preferredOrder.find(lang => availableLanguages.includes(lang))
        setSelectedLanguage(preferredLang || availableLanguages[0])
      }
    }
  }, [selectedItem])

  /**
   * Nollaa muokattavat arvot kun kohde muuttuu
   */
  useEffect(() => {
    if (selectedItem) {
      setEditedTitle(selectedItem.title || '')
      setEditedKey(selectedItem.key || '')
      setIsEditingTitle(false)
      setIsEditingKey(false)
      setShowPreview(false)
      
      // Päivitä viestipohjien kanavat
      if (isMessageTemplate) {
        // Jos käytetään channels-rakennetta
        if (selectedItem.channels) {
          // Tarkista että valittu kanava on olemassa, muuten valitse ensimmäinen
          const availableChannels = Object.keys(selectedItem.channels)
          if (availableChannels.length > 0) {
            if (!selectedChannel || !availableChannels.includes(selectedChannel)) {
              setSelectedChannel(availableChannels[0])
            }
          } else {
            // Jos ei ole kanavia, valitse ensimmäinen määritellyistä
            setSelectedChannel(MESSAGE_CHANNELS[0])
            // Varmista että kanava on olemassa channels-objektissa
            if (!selectedItem.channels[MESSAGE_CHANNELS[0]]) {
              selectedItem.channels[MESSAGE_CHANNELS[0]] = {
                languages: {}
              }
            }
          }
        } else {
          // Vanha rakenne (yhteensopivuus) - muunna uuteen rakenteeseen
          if (!selectedItem.channels) {
            selectedItem.channels = {}
          }
          // Valitse ensimmäinen kanava
          setSelectedChannel(MESSAGE_CHANNELS[0])
          // Varmista että kanava on olemassa
          if (!selectedItem.channels[MESSAGE_CHANNELS[0]]) {
            selectedItem.channels[MESSAGE_CHANNELS[0]] = {
              languages: selectedItem.languages || {}
            }
          }
        }
        
        // Päivitä voimassaoloajat (sama kaikille kanaville)
        if (selectedItem.validFrom) {
          setValidFrom(formatDate(selectedItem.validFrom))
        } else {
          setValidFrom('')
        }
        
        if (selectedItem.validTo) {
          setValidTo(formatDate(selectedItem.validTo))
        } else {
          setValidTo('')
        }
      } else {
        setValidFrom('')
        setValidTo('')
        setSelectedChannel(null)
      }
      
      // Päivitä template-sisältö jos kohde on template
      if (selectedItem.contentType === CONTENT_TYPES.TEMPLATE) {
        const supportsLanguages = selectedItem.languages !== undefined
        const currentContent = supportsLanguages
          ? (selectedItem.languages[selectedLanguage]?.content || '')
          : (selectedItem.content || '')
        setTemplateContent(currentContent)
      }
    }
  }, [selectedItem, selectedLanguage, localItemVersion, isMessageTemplate, selectedChannel])

  /**
   * Tallentaa muokatun otsikon
   * TODO: Toteuta backend-tallennus
   */
  const handleTitleSave = () => {
    if (editedTitle.trim() && editedTitle !== selectedItem.title) {
      // In real implementation, save to backend
      selectedItem.title = editedTitle.trim()
    }
    setIsEditingTitle(false)
  }

  /**
   * Peruuttaa otsikon muokkauksen ja palauttaa alkuperäisen arvon
   */
  const handleTitleCancel = () => {
    setEditedTitle(selectedItem.title || '')
    setIsEditingTitle(false)
  }

  /**
   * Tallentaa muokatun avaimen
   * TODO: Toteuta backend-tallennus
   */
  const handleKeySave = () => {
    if (editedKey.trim() && editedKey !== selectedItem.key) {
      // In real implementation, save to backend
      selectedItem.key = editedKey.trim()
    }
    setIsEditingKey(false)
  }

  /**
   * Peruuttaa avaimen muokkauksen ja palauttaa alkuperäisen arvon
   */
  const handleKeyCancel = () => {
    if (!selectedItem) return
    setEditedKey(selectedItem.key || '')
    setIsEditingKey(false)
  }

  /**
   * Tarkistaa onko kohde julkaistu
   * Käyttää useMemo hookia jotta päivittyy automaattisesti kun tila muuttuu
   * HUOM: Hookit täytyy olla ennen ehdollista returnia
   */
  const published = useMemo(() => {
    if (!selectedItem) return false
    
    // Tarkista tukevatko kohde useita kieliä
    const supportsLangs = selectedItem?.languages && (
      selectedItem?.contentType === CONTENT_TYPES.TEXT ||
      selectedItem?.contentType === CONTENT_TYPES.TEMPLATE
    )
    
    // Jos tukee kieliä, tarkista kielikohtainen status ENSIN
    // TÄRKEÄ: Tämä on tärkein tarkistus kielitukisille tyypeille
    if (supportsLangs && selectedItem.languages?.[selectedLanguage]) {
      const langState = selectedItem.languages[selectedLanguage].lifecycleState
      // Jos kielikohtainen status on 'published', kohde on julkaistu
      if (langState === 'published') {
        return true
      }
      // Jos kielikohtainen status on 'draft' tai muu, kohde EI ole julkaistu
      // Älä tarkista yleistä statusta tässä tapauksessa
      return false
    }
    
    // Jos ei tue kieliä TAI kieliversiota ei ole, tarkista yleinen status
    // Tarkista lifecycleState ensin, koska se on tarkempi kuin status
    if (selectedItem.lifecycleState === 'published') {
      return true
    }
    if (selectedItem.status === 'published') {
      return true
    }
    
    return false
  }, [selectedItem, selectedLanguage, localItemVersion])

  /**
   * Tarkistaa onko kohde tarkistuksessa
   * Käyttää useMemo hookia jotta päivittyy automaattisesti kun tila muuttuu
   */
  const pendingReview = useMemo(() => {
    if (!selectedItem) return false
    
    // Tarkista yleinen status
    if (selectedItem.lifecycleState === 'pending_review') {
      return true
    }
    
    // Jos tukee kieliä, tarkista kielikohtainen status
    const supportsLangs = selectedItem?.languages && (
      selectedItem?.contentType === CONTENT_TYPES.TEXT ||
      selectedItem?.contentType === CONTENT_TYPES.TEMPLATE
    )
    if (supportsLangs && selectedItem.languages?.[selectedLanguage]?.lifecycleState === 'pending_review') {
      return true
    }
    
    return false
  }, [selectedItem, selectedLanguage, localItemVersion])

  /**
   * Tarkistaa onko kohde ajastettu
   * Käyttää useMemo hookia jotta päivittyy automaattisesti kun tila muuttuu
   */
  const scheduled = useMemo(() => {
    if (!selectedItem) return false
    
    // Tarkista yleinen status
    if (selectedItem.lifecycleState === 'scheduled') {
      return true
    }
    
    // Jos tukee kieliä, tarkista kielikohtainen status
    const supportsLangs = selectedItem?.languages && (
      selectedItem?.contentType === CONTENT_TYPES.TEXT ||
      selectedItem?.contentType === CONTENT_TYPES.TEMPLATE
    )
    if (supportsLangs && selectedItem.languages?.[selectedLanguage]?.lifecycleState === 'scheduled') {
      return true
    }
    
    return false
  }, [selectedItem, selectedLanguage, localItemVersion])

  if (!selectedItem) {
    return (
      <aside className="helpdoc-shell-aside">
        <div className="helpdoc-shell-editor-content" style={{ 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center', 
          justifyContent: 'center', 
          color: 'var(--fi-color-text-secondary)',
          padding: 'var(--fi-spacing-xl)',
          gap: 'var(--fi-spacing-m)',
          minHeight: '400px'
        }}>
          <p style={{ fontSize: '0.875rem', textAlign: 'center', margin: 0 }}>
            Valitse kohde muokattavaksi vasemmalta listasta.
          </p>
          {selectedContentType && selectedCategory && onItemCreate && (
            <button
              type="button"
              className="helpdoc-button helpdoc-button--primary"
              onClick={() => {
                // Jos luodaan parametri, näytetään template-valinta modaali
                if (selectedContentType === CONTENT_TYPES.PARAMETER) {
                  setShowTemplateModal(true)
                } else {
                  onItemCreate(selectedContentType, selectedCategory)
                }
              }}
              aria-label="Luo uusi sisältökohde"
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 'var(--fi-spacing-s)',
                fontSize: '0.875rem',
                padding: 'var(--fi-spacing-s) var(--fi-spacing-m)'
              }}
            >
              <span style={{ fontSize: '1rem' }}>+</span>
              <span>Luo uusi sisältökohde</span>
            </button>
          )}
        </div>
      </aside>
    )
  }

  /**
   * Tarkistaa tukevatko kohde useita kieliä
   * TEXT ja TEMPLATE tyypit tukevat useita kieliä
   */
  const supportsLanguages = selectedItem?.languages && (
    selectedItem?.contentType === CONTENT_TYPES.TEXT ||
    selectedItem?.contentType === CONTENT_TYPES.TEMPLATE
  )

  const availableLanguages = supportsLanguages && selectedItem?.languages ? Object.keys(selectedItem.languages) : []
  const missingLanguages = supportsLanguages
    ? Object.values(LANGUAGES).filter(lang => !availableLanguages.includes(lang))
    : []

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language)
  }

  /**
   * Luo uuden kieliversion kohdetta varten
   * TODO: Toteuta backend-tallennus
   * @param {string} language - Luotavan kieliversion kieli
   */
  const handleCreateLanguage = (language) => {
    // In real implementation, this would create a new language version
    // For now, just switch to that language
    if (!selectedItem.languages) {
      selectedItem.languages = {}
    }
    if (!selectedItem.languages[language]) {
      selectedItem.languages[language] = {
        content: '',
        lifecycleState: 'draft'
      }
    }
    setSelectedLanguage(language)
  }

  /**
   * Palauttaa status-luokan CSS-luokkanimen
   * @param {string} status - Status
   * @param {string} lifecycleState - Elinkaaren tila
   * @returns {string} CSS-luokkanimi
   */
  const getStatusClass = (status, lifecycleState) => {
    // Tarkista ensin lifecycleState, koska se on tarkempi kuin status
    if (lifecycleState === 'published') {
      return 'success'
    }
    if (lifecycleState === 'pending_review') {
      return 'warning'
    }
    if (lifecycleState === 'scheduled') {
      return 'pending'
    }
    if (lifecycleState === 'draft') {
      return 'pending' // Sininen luonnokselle
    }
    // Fallback: tarkista status
    if (status === 'published') {
      return 'success'
    }
    // Oletus: pending (sininen)
    return 'pending'
  }

  /**
   * Palauttaa suomenkielisen status-otsikon
   * @param {string} status - Status
   * @param {string} lifecycleState - Elinkaaren tila
   * @returns {string} Suomenkielinen otsikko
   */
  const getStatusLabel = (status, lifecycleState) => {
    // Käytetään lifecycleStatea jos se on saatavilla
    const stateToCheck = lifecycleState || status
    
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

  /**
   * Palauttaa nykyisen itemin statuksen ottaen huomioon kieliversiot
   * @returns {Object} { status, lifecycleState }
   */
  const getCurrentStatus = () => {
    if (!selectedItem) return { status: null, lifecycleState: null }
    
    // Tarkista tukevatko kohde useita kieliä
    const supportsLangs = selectedItem?.languages && (
      selectedItem?.contentType === CONTENT_TYPES.TEXT ||
      selectedItem?.contentType === CONTENT_TYPES.TEMPLATE
    )
    
    // Jos tukee kieliä, käytetään kielikohtaista statusta
    if (supportsLangs && selectedItem.languages?.[selectedLanguage]) {
      const langState = selectedItem.languages[selectedLanguage].lifecycleState
      return {
        status: selectedItem.status,
        lifecycleState: langState || selectedItem.lifecycleState
      }
    }
    
    // Muuten käytetään yleistä statusta
    return {
      status: selectedItem.status,
      lifecycleState: selectedItem.lifecycleState
    }
  }

  /**
   * Näyttää toast-ilmoituksen
   * @param {string} message - Ilmoituksen viesti
   * @param {string} type - Ilmoituksen tyyppi: 'success' | 'info'
   */
  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 4000) // Piilota 4 sekunnin jälkeen
  }

  /**
   * Näyttää vahvistusmodaalin
   * @param {string} message - Vahvistusviesti
   * @param {Function} onConfirm - Funktio, joka suoritetaan vahvistuksen jälkeen
   * @param {Function|null} onCancel - Vapaaehtoinen funktio, joka suoritetaan peruutuksen jälkeen
   */
  const showConfirm = (message, onConfirm, onCancel = null) => {
    setConfirmConfig({ message, onConfirm, onCancel })
    setShowConfirmModal(true)
  }

  /**
   * Julkaisee kohteen (demo)
   * Frontend-demo: muuttaa vain paikallisen objektin tilan
   * TODO: Backend-integraatio - lähetä PUT/PATCH pyyntö
   */
  const handlePublish = () => {
    if (!selectedItem) return
    
    // Tarkista muutosperustelu
    if (!changeReason.trim()) {
      setPendingAction('publish')
      setShowChangeReasonModal(true)
      return
    }
    
    // Jos tukee kieliä, julkaise kielikohtainen versio
    if (supportsLanguages && selectedItem.languages?.[selectedLanguage]) {
      selectedItem.languages[selectedLanguage].lifecycleState = 'published'
      selectedItem.languages[selectedLanguage].publishedDate = new Date().toISOString()
      selectedItem.languages[selectedLanguage].changeReason = changeReason
      
      // Päivitä myös yleinen status jos kaikki kielet ovat julkaistuja
      const allPublished = Object.values(selectedItem.languages).every(
        lang => lang.lifecycleState === 'published'
      )
      if (allPublished) {
        selectedItem.lifecycleState = 'published'
        selectedItem.status = 'published'
        selectedItem.publishedDate = new Date().toISOString()
      }
    } else {
      // Muuta yleinen status
      selectedItem.lifecycleState = 'published'
      selectedItem.status = 'published'
      selectedItem.publishedDate = new Date().toISOString()
      selectedItem.changeReason = changeReason
    }
    
    // Force re-render
    setLocalItemVersion(prev => prev + 1)
    if (onItemUpdate) onItemUpdate() // Ilmoita AppShellille että item päivittyi
    showToast('Sisältö julkaistu onnistuneesti', 'success')
    setChangeReason('')
    setShowChangeReasonModal(false)
    
    // TODO: Backend-integraatio
    // await publishItem(selectedItem.id, { lifecycleState: 'published', changeReason })
  }

  /**
   * Vahvistaa julkaisun muutosperustelun jälkeen
   */
  const confirmPublish = () => {
    if (!changeReason.trim()) {
      showToast('Muutosperustelu on pakollinen', 'info')
      return
    }
    setShowChangeReasonModal(false)
    handlePublish()
  }

  /**
   * Pyytää tarkistusta (demo)
   */
  const handleRequestReview = () => {
    if (!selectedItem) return
    
    // Tarkista muutosperustelu
    if (!changeReason.trim()) {
      setPendingAction('review')
      setShowChangeReasonModal(true)
      return
    }
    
    // Jos tukee kieliä, aseta kielikohtainen versio tarkistukseen
    if (supportsLanguages && selectedItem.languages?.[selectedLanguage]) {
      selectedItem.languages[selectedLanguage].lifecycleState = 'pending_review'
      selectedItem.languages[selectedLanguage].changeReason = changeReason
      
      // Päivitä myös yleinen status
      selectedItem.lifecycleState = 'pending_review'
      selectedItem.status = 'pending_review'
    } else {
      // Muuta yleinen status
      selectedItem.lifecycleState = 'pending_review'
      selectedItem.status = 'pending_review'
      selectedItem.changeReason = changeReason
    }
    
    // Force re-render
    setLocalItemVersion(prev => prev + 1)
    if (onItemUpdate) onItemUpdate()
    showToast('Tarkistuspyyntö lähetetty', 'success')
    setChangeReason('')
    setShowChangeReasonModal(false)
  }

  /**
   * Vahvistaa tarkistuspyynnön muutosperustelun jälkeen
   */
  const confirmRequestReview = () => {
    if (!changeReason.trim()) {
      showToast('Muutosperustelu on pakollinen', 'info')
      return
    }
    setShowChangeReasonModal(false)
    handleRequestReview()
  }

  /**
   * Kopioi itemin pohjaksi
   */
  const handleCopy = () => {
    if (!selectedItem || !onItemCopy) return
    onItemCopy(selectedItem)
    showToast('Kohde kopioitu onnistuneesti', 'success')
  }

  /**
   * Arkistoi itemin
   */
  const handleArchive = () => {
    if (!selectedItem || !onItemArchive) return
    showConfirm(
      `Haluatko varmasti arkistoida "${selectedItem.title}"?`,
      () => {
        onItemArchive(selectedItem)
        showToast('Kohde arkistoitu', 'success')
      }
    )
  }

  /**
   * Poista itemin pysyvästi
   */
  const handleDelete = () => {
    if (!selectedItem || !onItemDelete) return
    
    showConfirm(
      `Haluatko varmasti poistaa "${selectedItem.title}" pysyvästi? Tätä toimintoa ei voi perua.`,
      () => {
        onItemDelete(selectedItem)
        showToast('Kohde poistettu', 'success')
      }
    )
  }

  /**
   * Ajastaa julkaisun
   */
  const handleSchedule = () => {
    if (!selectedItem) return
    setShowScheduleModal(true)
  }

  /**
   * Muuntaa suomen päivämäärämuodon (dd.mm.yyyy) ISO-muotoon (yyyy-mm-dd)
   */
  const parseFinnishDate = (dateString) => {
    if (!dateString) return null
    const parts = dateString.split('.')
    if (parts.length !== 3) return null
    const day = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10)
    const year = parseInt(parts[2], 10)
    
    if (isNaN(day) || isNaN(month) || isNaN(year)) return null
    if (day < 1 || day > 31 || month < 1 || month > 12 || year < 2000 || year > 2100) return null
    
    // Muodosta ISO-muotoinen päivämäärä
    const isoDate = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    return isoDate
  }

  /**
   * Validoi suomen päivämäärämuodon
   */
  const validateFinnishDate = (dateString) => {
    if (!dateString) return false
    const parsed = parseFinnishDate(dateString)
    if (!parsed) return false
    
    // Tarkista että päivämäärä on oikea (esim. ei 32. päivää)
    const date = new Date(parsed)
    const parts = dateString.split('.')
    const day = parseInt(parts[0], 10)
    const month = parseInt(parts[1], 10)
    const year = parseInt(parts[2], 10)
    
    return date.getDate() === day && 
           date.getMonth() + 1 === month && 
           date.getFullYear() === year
  }

  /**
   * Vahvistaa ajastuksen
   */
  const confirmSchedule = () => {
    if (!selectedItem || !scheduledDate || !scheduledTime) {
      showToast('Valitse päivämäärä ja aika', 'info')
      return
    }
    
    // Validoi päivämäärä
    if (!validateFinnishDate(scheduledDate)) {
      showToast('Päivämäärän tulee olla muodossa dd.mm.yyyy', 'info')
      return
    }
    
    // Muunna suomen päivämäärä ISO-muotoon
    const isoDate = parseFinnishDate(scheduledDate)
    if (!isoDate) {
      showToast('Virheellinen päivämäärä', 'info')
      return
    }
    
    const scheduledDateTime = new Date(`${isoDate}T${scheduledTime}`)
    if (scheduledDateTime <= new Date()) {
      showToast('Ajastettu aika pitää olla tulevaisuudessa', 'info')
      return
    }
    
    // Jos tukee kieliä, aseta kielikohtainen versio ajastetuksi
    if (supportsLanguages && selectedItem.languages?.[selectedLanguage]) {
      selectedItem.languages[selectedLanguage].lifecycleState = 'scheduled'
      selectedItem.languages[selectedLanguage].scheduledDate = scheduledDateTime.toISOString()
      
      // Päivitä myös yleinen status
      selectedItem.lifecycleState = 'scheduled'
      selectedItem.status = 'scheduled'
      selectedItem.scheduledDate = scheduledDateTime.toISOString()
    } else {
      // Muuta yleinen status
      selectedItem.lifecycleState = 'scheduled'
      selectedItem.status = 'scheduled'
      selectedItem.scheduledDate = scheduledDateTime.toISOString()
    }
    
    // Force re-render
    setLocalItemVersion(prev => prev + 1)
    if (onItemUpdate) onItemUpdate()
    showToast(`Julkaisu ajastettu ${scheduledDate} klo ${scheduledTime}`, 'success')
    setShowScheduleModal(false)
    setScheduledDate('')
    setScheduledTime('')
  }

  /**
   * Palauttaa version (rollback)
   */
  const handleRollback = (version) => {
    if (!selectedItem || !version) return
    
    const ROLLBACK_DAYS = 30
    const publishedDate = version.date
    if (!publishedDate) {
      showToast('Versiota ei voi palauttaa - päivämäärä puuttuu', 'info')
      return
    }
    
    const published = new Date(publishedDate)
    const now = new Date()
    const daysDiff = (now - published) / (1000 * 60 * 60 * 24)
    
    if (daysDiff > ROLLBACK_DAYS) {
      showToast(`Rollback ei ole enää sallittu. Julkaisu on yli ${ROLLBACK_DAYS} päivää vanha.`, 'info')
      return
    }
    
    showConfirm(
      `Haluatko varmasti palauttaa version ${version.version}? Tämä korvaa nykyisen sisällön.`,
      () => {
        // Palauta sisältö
        if (supportsLanguages && selectedItem.languages?.[selectedLanguage]) {
          selectedItem.languages[selectedLanguage].content = version.content
          selectedItem.languages[selectedLanguage].lifecycleState = 'published'
          selectedItem.languages[selectedLanguage].publishedDate = new Date().toISOString()
          selectedItem.languages[selectedLanguage].changeReason = `Palautettu versio ${version.version}`
        } else {
          selectedItem.content = version.content
          selectedItem.lifecycleState = 'published'
          selectedItem.status = 'published'
          selectedItem.publishedDate = new Date().toISOString()
          selectedItem.changeReason = `Palautettu versio ${version.version}`
        }
        
        // Force re-render
        setLocalItemVersion(prev => prev + 1)
        if (onItemUpdate) onItemUpdate()
        showToast(`Versio ${version.version} palautettu onnistuneesti`, 'success')
      }
    )
  }

  /**
   * Muuttaa julkaistun kohteen luonnokseksi (demo)
   */
  const handleConvertToDraft = () => {
    if (!selectedItem) return
    
    showConfirm(
      'Haluatko varmasti muuttaa julkaistun version luonnokseksi? Tämä mahdollistaa muokkaukset, mutta muutokset eivät näy asiakkaalle ennen uutta julkaisua.',
      () => {
        // Luodaan syvä kopio objektista jotta React tunnistaa muutoksen
        const updatedItem = JSON.parse(JSON.stringify(selectedItem))
        
        // Määritä supportsLanguages tässä funktiossa
        const supportsLangs = updatedItem?.languages && (
          updatedItem?.contentType === CONTENT_TYPES.TEXT ||
          updatedItem?.contentType === CONTENT_TYPES.TEMPLATE
        )
        
        // Jos tukee kieliä, muuta kielikohtainen versio
        if (supportsLangs && updatedItem.languages?.[selectedLanguage]) {
          updatedItem.languages[selectedLanguage].lifecycleState = 'draft'
          
          // Päivitä myös yleinen status jos kaikki kielet ovat luonnoksia
          const allDrafts = Object.values(updatedItem.languages).every(
            lang => lang.lifecycleState === 'draft'
          )
          if (allDrafts) {
            updatedItem.lifecycleState = 'draft'
            updatedItem.status = 'draft'
          }
        } else {
          // Muuta yleinen status
          updatedItem.lifecycleState = 'draft'
          updatedItem.status = 'draft'
        }
        
        // Ilmoita AppShellille että item päivittyi - anna päivitetty item parametrina
        // TÄRKEÄ: Tämä luo uuden kopion ja päivittää selectedItem propin oikein
        if (onItemUpdate) {
          onItemUpdate(updatedItem)
        }
        
        // Force re-render - tämä pakottaa useMemo-hookit laskemaan uudelleen
        // TÄRKEÄ: Kutsu tämä JÄLKEEN kun onItemUpdate on kutsuttu
        setLocalItemVersion(prev => prev + 1)
        
        showToast('Julkaistu versio muutettu luonnokseksi. Voit nyt muokata sisältöä vapaasti.', 'success')
      }
    )
  }

  /**
   * Luo uuden version julkaistusta kohteesta (demo)
   * Kopioi nykyisen sisällön uudeksi luonnokseksi
   */
  const handleCreateNewVersion = () => {
    if (!selectedItem) return
    
    showConfirm(
      'Luodaan uusi versio julkaistusta sisällöstä. Nykyinen julkaistu versio säilyy ennallaan, ja uusi versio luodaan luonnoksena muokattavaksi.',
      () => {
        // Luodaan syvä kopio objektista jotta React tunnistaa muutoksen
        const updatedItem = JSON.parse(JSON.stringify(selectedItem))
        
        // Määritä supportsLanguages tässä funktiossa
        const supportsLangs = updatedItem?.languages && (
          updatedItem?.contentType === CONTENT_TYPES.TEXT ||
          updatedItem?.contentType === CONTENT_TYPES.TEMPLATE
        )
        
        // Jos tukee kieliä, luo uusi kieliversio
        if (supportsLangs) {
          const currentContent = updatedItem.languages?.[selectedLanguage]?.content || ''
          
          // Varmista että kieliversio on olemassa
          if (!updatedItem.languages[selectedLanguage]) {
            updatedItem.languages[selectedLanguage] = {}
          }
          
          // Kopioi sisältö mutta aseta luonnokseksi
          updatedItem.languages[selectedLanguage] = {
            ...updatedItem.languages[selectedLanguage],
            content: currentContent,
            lifecycleState: 'draft'
          }
          
          // Päivitä myös yleinen status jos kaikki ovat luonnoksia
          const allDrafts = Object.values(updatedItem.languages).every(
            lang => lang.lifecycleState === 'draft'
          )
          if (allDrafts) {
            updatedItem.lifecycleState = 'draft'
            updatedItem.status = 'draft'
          }
        } else {
          // Ei-kieliversioille: aseta luonnokseksi
          updatedItem.lifecycleState = 'draft'
          updatedItem.status = 'draft'
        }
        
        // Ilmoita AppShellille että item päivittyi - anna päivitetty item parametrina
        // TÄRKEÄ: Tämä luo uuden kopion ja päivittää selectedItem propin oikein
        if (onItemUpdate) {
          onItemUpdate(updatedItem)
        }
        
        // Force re-render - tämä pakottaa useMemo-hookit laskemaan uudelleen
        // TÄRKEÄ: Kutsu tämä JÄLKEEN kun onItemUpdate on kutsuttu
        setLocalItemVersion(prev => prev + 1)
        
        showToast('Uusi versio luotu luonnoksena. Voit nyt muokata sisältöä vapaasti.', 'success')
      }
    )
  }

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
   * Hakee itemin julkaisun ajankohdan ottaen huomioon kieliversiot
   * @returns {string|null} Julkaisun ajankohta ISO-muodossa tai null
   */
  const getPublishedDate = () => {
    if (!selectedItem) return null
    
    // Tarkista tukevatko kohde useita kieliä
    const supportsLangs = selectedItem?.languages && (
      selectedItem?.contentType === CONTENT_TYPES.TEXT ||
      selectedItem?.contentType === CONTENT_TYPES.TEMPLATE
    )
    
    // Jos tukee kieliä, hae kielikohtainen julkaisun ajankohta
    if (supportsLangs && selectedItem.languages?.[selectedLanguage]?.publishedDate) {
      return selectedItem.languages[selectedLanguage].publishedDate
    }
    
    // Muuten käytetään yleistä julkaisun ajankohtaa
    return selectedItem.publishedDate || null
  }

  /**
   * Hakee ajastetun päivämäärän ja muuntaa sen suomen muotoon
   * @returns {string|null} Ajastettu päivämäärä suomen muodossa (dd.mm.yyyy klo hh:mm) tai null
   */
  const getScheduledDateTime = () => {
    if (!selectedItem) return null
    
    // Tarkista tukevatko kohde useita kieliä
    const supportsLangs = selectedItem?.languages && (
      selectedItem?.contentType === CONTENT_TYPES.TEXT ||
      selectedItem?.contentType === CONTENT_TYPES.TEMPLATE
    )
    
    let scheduledDateISO = null
    
    // Jos tukee kieliä, hae kielikohtainen ajastettu päivämäärä
    if (supportsLangs && selectedItem.languages?.[selectedLanguage]?.scheduledDate) {
      scheduledDateISO = selectedItem.languages[selectedLanguage].scheduledDate
    } else if (selectedItem.scheduledDate) {
      scheduledDateISO = selectedItem.scheduledDate
    }
    
    if (!scheduledDateISO) return null
    
    const date = new Date(scheduledDateISO)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const hours = String(date.getHours()).padStart(2, '0')
    const minutes = String(date.getMinutes()).padStart(2, '0')
    
    return `${day}.${month}.${year} klo ${hours}:${minutes}`
  }

  /**
   * Palauttaa kategorian suomenkielisen nimen
   * @param {string} category - Kategorian avain
   * @returns {string} Suomenkielinen nimi
   */
  const getCategoryLabel = (category) => {
    const categoryLabels = {
      [CATEGORIES.MESSAGE_PAYMENT_NOTIFICATION]: 'Maksuilmoitus',
      [CATEGORIES.MESSAGE_PAYMENT_REMINDER_1]: 'Maksumuistutus 1',
      [CATEGORIES.MESSAGE_PAYMENT_REMINDER_2]: 'Maksumuistutus 2',
      [CATEGORIES.MESSAGE_ADDITIONAL_INFO_REQUEST]: 'Lisäselvityspyyntö',
      [CATEGORIES.MESSAGE_CORRECTION_CASE]: 'Korjausasia',
      [CATEGORIES.MESSAGE_APPEAL_CASE]: 'Muutoksenhakuasia',
      [CATEGORIES.MESSAGE_OTHER_ADVANCE_NOTICE]: 'Muut viestit: Ennakkoilmoitus',
      [CATEGORIES.MESSAGE_OTHER_RECEIVABLE_GROSS]: 'Muut viestit: Saatavan brutotus',
      [CATEGORIES.MESSAGE_WELCOME]: 'Tervetuloviestit',
      [CATEGORIES.MESSAGE_REJECTION]: 'Hylkäysviestit',
      [CATEGORIES.MESSAGE_APPROVAL]: 'Hyväksymisviestit',
      [CATEGORIES.MESSAGE_NOTIFICATION]: 'Ilmoitusviestit'
    }
    return categoryLabels[category] || category
  }

  /**
   * Tallentaa viestikanavan muutoksen
   */
  const handleMessageChannelChange = (e) => {
    const newChannel = e.target.value
    setSelectedChannel(newChannel)
    
    // Ei tarvitse päivittää validFrom/validTo, koska ne ovat ylätasolla
    // TextEditor päivittyy automaattisesti selectedChannel-muutoksen perusteella
  }

  /**
   * Tallentaa voimassaolo-alkupäivän muutoksen
   */
  const handleValidFromChange = (e) => {
    // Salli vain numeroita ja pisteitä
    const value = e.target.value.replace(/[^\d.]/g, '')
    // Rajoita pituus (dd.mm.yyyy = 10 merkkiä)
    if (value.length <= 10) {
      setValidFrom(value)
      
      if (selectedItem && isMessageTemplate) {
        if (value && validateFinnishDate(value)) {
          // Muunna suomen päivämäärämuoto (dd.mm.yyyy) ISO-muotoon
          const isoDate = parseFinnishDate(value)
          if (isoDate) {
            selectedItem.validFrom = new Date(isoDate + 'T00:00:00Z').toISOString()
          }
        } else if (!value) {
          selectedItem.validFrom = null
        }
        if (onItemUpdate) {
          onItemUpdate()
        }
      }
    }
  }

  /**
   * Tallentaa voimassaolo-loppupäivän muutoksen
   */
  const handleValidToChange = (e) => {
    // Salli vain numeroita ja pisteitä
    const value = e.target.value.replace(/[^\d.]/g, '')
    // Rajoita pituus (dd.mm.yyyy = 10 merkkiä)
    if (value.length <= 10) {
      setValidTo(value)
      
      if (selectedItem && isMessageTemplate) {
        if (value && validateFinnishDate(value)) {
          // Muunna suomen päivämäärämuoto (dd.mm.yyyy) ISO-muotoon
          const isoDate = parseFinnishDate(value)
          if (isoDate) {
            selectedItem.validTo = new Date(isoDate + 'T23:59:59Z').toISOString()
          }
        } else if (!value) {
          selectedItem.validTo = null
        }
        if (onItemUpdate) {
          onItemUpdate()
        }
      }
    }
  }

  /**
   * Renderöi oikean editorin valitun kohteen tyypin perusteella
   * @returns {JSX.Element} Editori-komponentti
   */
  const renderEditor = () => {
    if (!selectedItem || !selectedItem.contentType) {
      return null
    }
    
    switch (selectedItem.contentType) {
      case CONTENT_TYPES.TEXT:
        return (
          <TextEditor
            item={selectedItem}
            selectedLanguage={selectedLanguage}
            selectedChannel={isMessageTemplate ? selectedChannel : null}
            onContentChange={(content, lang, channel) => {
              if (isMessageTemplate && channel && selectedItem.channels) {
                // Uusi rakenne: channels
                if (!selectedItem.channels[channel]) {
                  selectedItem.channels[channel] = { languages: {} }
                }
                if (!selectedItem.channels[channel].languages) {
                  selectedItem.channels[channel].languages = {}
                }
                if (!selectedItem.channels[channel].languages[lang]) {
                  selectedItem.channels[channel].languages[lang] = {}
                }
                selectedItem.channels[channel].languages[lang].content = content
              } else if (selectedItem.languages) {
                // Vanha rakenne: languages
                if (!selectedItem.languages[lang]) {
                  selectedItem.languages[lang] = {}
                }
                selectedItem.languages[lang].content = content
              } else {
                // Yksinkertainen rakenne
                selectedItem.content = content
              }
              if (onItemUpdate) {
                onItemUpdate()
              }
            }}
            isPublished={published}
            onRollback={handleRollback}
            onCopy={handleCopy}
            onArchive={handleArchive}
          />
        )
      case CONTENT_TYPES.PARAMETER:
        return (
          <ParameterEditor 
            item={selectedItem} 
            isPublished={published} 
            onRollback={handleRollback}
            onCopy={handleCopy}
            onArchive={handleArchive}
          />
        )
      case CONTENT_TYPES.TEMPLATE:
        return (
          <TemplateEditor
            item={selectedItem}
            selectedLanguage={selectedLanguage}
            onLanguageChange={handleLanguageSelect}
            onContentChange={(content) => {
              setTemplateContent(content)
              // Päivitä myös item
              if (selectedItem.languages) {
                if (!selectedItem.languages[selectedLanguage]) {
                  selectedItem.languages[selectedLanguage] = {}
                }
                selectedItem.languages[selectedLanguage].content = content
              } else {
                selectedItem.content = content
              }
            }}
            onRollback={handleRollback}
            onCopy={handleCopy}
            onArchive={handleArchive}
          />
        )
      case CONTENT_TYPES.STRUCTURE:
        return (
          <StructureEditor 
            item={selectedItem} 
            isPublished={published} 
            onRollback={handleRollback}
            onCopy={handleCopy}
            onArchive={handleArchive}
          />
        )
      default:
        return (
          <textarea
            placeholder="Muokkaa sisältöä tässä..."
            style={{ 
              width: '100%', 
              minHeight: '400px',
              border: '1px solid var(--fi-color-depth-light-1)',
              borderRadius: '4px',
              padding: 'var(--fi-spacing-s)',
              fontSize: '0.875rem',
              fontFamily: 'Source Sans Pro, sans-serif',
              boxSizing: 'border-box'
            }}
            defaultValue={selectedItem.content || ''}
          />
        )
    }
  }

  return (
    <aside className="helpdoc-shell-aside">
      <div className="helpdoc-shell-editor-header" style={{
        padding: 'var(--fi-spacing-xl)',
        borderBottom: '1px solid var(--fi-color-depth-light-1)',
        backgroundColor: '#ffffff',
        flexShrink: 0
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          gap: 'var(--fi-spacing-xl)', 
          marginBottom: 'var(--fi-spacing-l)'
        }}>
          <div className="helpdoc-editable-field-wrapper" style={{ flex: 1 }}>
            {isEditingTitle ? (
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                onBlur={handleTitleSave}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleTitleSave()
                  }
                  if (e.key === 'Escape') {
                    handleTitleCancel()
                  }
                }}
                className="helpdoc-editable-title"
                aria-label="Muokkaa otsikkoa"
                autoFocus
              />
            ) : (
              <button
                type="button"
                className="helpdoc-editable-field"
                onClick={() => {
                  if (!published) {
                    setEditedTitle(selectedItem.title || '')
                    setIsEditingTitle(true)
                  }
                }}
                disabled={published}
                aria-label={published ? "Otsikko (julkaistu versio)" : "Muokkaa otsikkoa"}
                style={{
                  ...(published && {
                    cursor: 'not-allowed',
                    opacity: 0.9
                  })
                }}
              >
                <h2 style={{ 
                  margin: 0, 
                  fontSize: '1.5rem', 
                  fontWeight: 600,
                  lineHeight: '1.3',
                  color: 'var(--fi-color-text)'
                }}>
                  {selectedItem.title}
                </h2>
                {!published && (
                  <img 
                    src="/baseIcons/icon-edit.svg" 
                    alt="" 
                    aria-hidden="true"
                    className="helpdoc-editable-field__icon"
                  />
                )}
              </button>
            )}
          </div>
          <div style={{ 
            display: 'flex', 
            gap: 'var(--fi-spacing-s)', 
            alignItems: 'center', 
            flexWrap: 'wrap' 
          }}>
            {selectedItem.contentType && (
              <span style={{ 
                fontSize: '0.75rem', 
                color: 'var(--fi-color-text-secondary)', 
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                padding: '6px 12px',
                backgroundColor: 'var(--fi-color-depth-light-3)',
                borderRadius: '2px',
                alignSelf: 'flex-start',
                lineHeight: '1.2',
                display: 'inline-flex',
                alignItems: 'center',
                fontWeight: 500,
                border: '1px solid var(--fi-color-depth-light-2)'
              }}>
                {selectedItem.contentType}
              </span>
            )}
            {(() => {
              const currentStatus = getCurrentStatus()
              const statusClass = getStatusClass(currentStatus.status, currentStatus.lifecycleState)
              return (
                <span
                  key={`status-${localItemVersion}-${selectedLanguage}`}
                  className={`helpdoc-status helpdoc-status--${statusClass}`}
                  style={{
                    fontSize: '0.75rem',
                    padding: '6px 12px',
                    borderRadius: '2px',
                    alignSelf: 'flex-start',
                    fontWeight: 600,
                    lineHeight: '1.2',
                    display: 'inline-flex',
                    alignItems: 'center',
                    letterSpacing: '0.03em',
                    ...(published && {
                      boxShadow: '0 0 0 2px var(--fi-color-success-light-2)',
                      border: '1px solid var(--fi-color-success-base)'
                    })
                  }}
                  aria-label={`Tila: ${getStatusLabel(currentStatus.status, currentStatus.lifecycleState)}`}
                >
                  {getStatusLabel(currentStatus.status, currentStatus.lifecycleState)}
                </span>
              )
            })()}
          </div>
        </div>
        {/* Metadata: julkaisun ajankohta, luomisen ajankohta, viimeisin muokkaus */}
        {(() => {
          const publishedDate = getPublishedDate()
          const metadata = []
          
          // Näytä luomisen ajankohta (aina näytetään jos saatavilla)
          if (selectedItem.createdAt) {
            const createdBy = selectedItem.createdBy ? ` ${selectedItem.createdBy}` : ''
            metadata.push({
              label: 'Luotu',
              content: `${formatDate(selectedItem.createdAt)}${createdBy}`
            })
          }
          
          // Näytä viimeisin muokkaus (aina näytetään jos saatavilla)
          if (selectedItem.updatedAt) {
            const updatedBy = selectedItem.updatedBy ? ` ${selectedItem.updatedBy}` : ''
            metadata.push({
              label: 'Viimeksi muokattu',
              content: `${formatDate(selectedItem.updatedAt)}${updatedBy}`
            })
          }
          
          // Näytä julkaisun ajankohta jos julkaistu
          if (published && publishedDate) {
            const publishedBy = selectedItem.publishedBy ? ` ${selectedItem.publishedBy}` : ''
            metadata.push({
              label: 'Julkaistu',
              content: `${formatDate(publishedDate)}${publishedBy}`
            })
          }
          
          return metadata.length > 0 ? (
            <div style={{ 
              fontSize: '0.875rem', 
              color: 'var(--fi-color-text-secondary)', 
              display: 'flex', 
              gap: 'var(--fi-spacing-l)', 
              alignItems: 'center', 
              flexWrap: 'wrap', 
              marginBottom: 'var(--fi-spacing-l)',
              paddingBottom: 'var(--fi-spacing-l)',
              borderBottom: '2px solid var(--fi-color-accent-base)',
              lineHeight: '1.5'
            }}>
              {metadata.map((item, index) => (
                <span 
                  key={index}
                  style={{ 
                    fontSize: '0.875rem', 
                    lineHeight: '1.5',
                    padding: '4px 0',
                    position: 'relative',
                    paddingLeft: index > 0 ? 'var(--fi-spacing-l)' : 0
                  }}
                >
                  {index > 0 && (
                    <span style={{
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      color: 'var(--fi-color-depth-base)',
                      fontSize: '0.875rem'
                    }}>•</span>
                  )}
                  <span style={{ color: 'var(--fi-color-text)', fontWeight: '600' }}>{item.label} </span>
                  <span style={{ color: 'var(--fi-color-text-secondary)' }}>{item.content}</span>
                </span>
              ))}
            </div>
          ) : (
            <div style={{
              marginBottom: 'var(--fi-spacing-l)',
              paddingBottom: 'var(--fi-spacing-l)',
              borderBottom: '2px solid var(--fi-color-accent-base)'
            }}></div>
          )
        })()}
        {/* Viestipohjien lisätiedot */}
        {isMessageTemplate && (
          <div style={{ 
            marginTop: 'var(--fi-spacing-xl)',
            padding: 'var(--fi-spacing-xl)',
            backgroundColor: '#ffffff',
            borderRadius: '2px',
            border: '1px solid var(--fi-color-depth-light-1)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.06)'
          }}>
            <h3 style={{ 
              fontSize: '1rem', 
              fontWeight: 600, 
              marginTop: 0,
              marginBottom: 'var(--fi-spacing-xl)',
              color: 'var(--fi-color-text)',
              lineHeight: '1.5',
              letterSpacing: '0.01em',
              paddingBottom: 'var(--fi-spacing-s)',
              borderBottom: '1px solid var(--fi-color-depth-light-2)'
            }}>
              {getCategoryLabel(selectedItem.category)}
            </h3>
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', 
              gap: 'var(--fi-spacing-xl)',
            }}>
              <div>
                <label htmlFor="message-channel" style={{ 
                  display: 'block',
                  fontWeight: 500, 
                  marginBottom: 'var(--fi-spacing-s)', 
                  color: 'var(--fi-color-text)',
                  fontSize: '14px',
                  lineHeight: '20px'
                }}>
                  Viestikanava
                </label>
                <div className="helpdoc-select-wrapper">
                  <select
                    id="message-channel"
                    value={selectedChannel || ''}
                    onChange={handleMessageChannelChange}
                    disabled={published}
                    style={{
                      ...(published && {
                        backgroundColor: 'var(--fi-color-depth-light-3)',
                        cursor: 'not-allowed',
                        opacity: 0.9
                      })
                    }}
                  >
                    <option value="">Valitse kanava</option>
                    {MESSAGE_CHANNELS.map(channel => (
                      <option key={channel} value={channel}>{channel}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label htmlFor="valid-from" style={{ 
                  display: 'block',
                  fontWeight: 500, 
                  marginBottom: 'var(--fi-spacing-s)', 
                  color: 'var(--fi-color-text)',
                  fontSize: '14px',
                  lineHeight: '20px'
                }}>
                  Voimassa alkupäivä
                </label>
                <input
                  id="valid-from"
                  type="text"
                  value={validFrom}
                  onChange={handleValidFromChange}
                  placeholder="dd.mm.yyyy"
                  readOnly={published}
                  disabled={published}
                  style={{
                    ...(published && {
                      backgroundColor: 'var(--fi-color-depth-light-3)',
                      cursor: 'not-allowed',
                      opacity: 0.9
                    })
                  }}
                />
              </div>
              <div>
                <label htmlFor="valid-to" style={{ 
                  display: 'block',
                  fontWeight: 500, 
                  marginBottom: 'var(--fi-spacing-s)', 
                  color: 'var(--fi-color-text)',
                  fontSize: '14px',
                  lineHeight: '20px'
                }}>
                  Loppupäivä
                </label>
                <input
                  id="valid-to"
                  type="text"
                  value={validTo}
                  onChange={handleValidToChange}
                  placeholder="dd.mm.yyyy"
                  readOnly={published}
                  disabled={published}
                  style={{
                    ...(published && {
                      backgroundColor: 'var(--fi-color-depth-light-3)',
                      cursor: 'not-allowed',
                      opacity: 0.9
                    })
                  }}
                />
              </div>
            </div>
          </div>
        )}
      </div>
      <div 
        className="helpdoc-shell-editor-content"
        role="tabpanel"
        id={`editor-content-${selectedLanguage}`}
        aria-labelledby={`language-tab-${selectedLanguage}`}
      >
        {supportsLanguages && (
          <div className="helpdoc-shell-language-tabs" role="tablist" aria-label="Kielivalinnat" style={{ marginBottom: 'var(--fi-spacing-m)' }}>
            {Object.values(LANGUAGES).map((lang) => {
              const exists = availableLanguages.includes(lang)
              const isSelected = selectedLanguage === lang
              return (
                <button
                  key={lang}
                  id={`language-tab-${lang}`}
                  className={`helpdoc-language-tab ${isSelected ? 'helpdoc-language-tab--active' : ''} ${!exists ? 'helpdoc-language-tab--missing' : ''}`}
                  type="button"
                  role="tab"
                  aria-selected={isSelected}
                  aria-controls={`editor-content-${lang}`}
                  onClick={() => exists ? handleLanguageSelect(lang) : handleCreateLanguage(lang)}
                  aria-label={exists ? `Muokkaa ${LANGUAGE_LABELS[lang]} versiota` : `Luo ${LANGUAGE_LABELS[lang]} versio`}
                >
                  {LANGUAGE_LABELS[lang]}
                  {!exists && <span className="helpdoc-language-tab-plus" aria-label="Luo uusi versio">+</span>}
                </button>
              )
            })}
          </div>
        )}
        {renderEditor()}
        {showPreview && selectedItem?.contentType === CONTENT_TYPES.TEMPLATE && (
          <PreviewPanel text={templateContent} variables={VARIABLE_CATALOG} />
        )}
      </div>
      {/* Banneri julkaistulle sisällölle */}
      {published && !pendingReview && (
        <div style={{
          backgroundColor: 'var(--fi-color-success-base)',
          color: '#ffffff',
          padding: 'var(--fi-spacing-s) var(--fi-spacing-m)',
          borderTopLeftRadius: '4px',
          borderTopRightRadius: '4px',
          borderBottomLeftRadius: '0',
          borderBottomRightRadius: '0',
          marginBottom: '0',
          fontSize: '0.875rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--fi-spacing-xs)',
          width: '100%'
        }} role="alert" aria-live="polite">
          <span style={{ fontSize: '1rem' }}>✓</span>
          <span>Julkaistu versio - Muutokset tallennetaan uudeksi luonnokseksi</span>
        </div>
      )}
      {/* Banneri tarkistuksessa olevalle sisällölle */}
      {pendingReview && (
        <div style={{
          backgroundColor: 'var(--fi-color-warning-base)',
          color: '#ffffff',
          padding: 'var(--fi-spacing-s) var(--fi-spacing-m)',
          borderTopLeftRadius: '4px',
          borderTopRightRadius: '4px',
          borderBottomLeftRadius: '0',
          borderBottomRightRadius: '0',
          marginBottom: '0',
          fontSize: '0.875rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--fi-spacing-xs)',
          width: '100%'
        }} role="alert" aria-live="polite">
          <span style={{ fontSize: '1rem' }}>⏳</span>
          <span>Tarkistuksessa - Odota hyväksyntää ennen julkaisua</span>
        </div>
      )}
      {/* Banneri luonnokselle */}
      {!published && !pendingReview && (
        <div style={{
          backgroundColor: 'var(--fi-color-highlight-base)',
          color: '#ffffff',
          padding: 'var(--fi-spacing-s) var(--fi-spacing-m)',
          borderTopLeftRadius: '4px',
          borderTopRightRadius: '4px',
          borderBottomLeftRadius: '0',
          borderBottomRightRadius: '0',
          marginBottom: '0',
          fontSize: '0.875rem',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--fi-spacing-xs)',
          width: '100%'
        }} role="alert" aria-live="polite">
          <span style={{ fontSize: '1rem' }}>✎</span>
          <span>
            Luonnos - Muokkaa sisältöä vapaasti
            {scheduled && getScheduledDateTime() && (
              <span style={{ marginLeft: 'var(--fi-spacing-s)', fontWeight: 400 }}>
                • Julkaistaan {getScheduledDateTime()}
              </span>
            )}
          </span>
        </div>
      )}
      <div className="helpdoc-shell-action-bar">
        <div className="helpdoc-shell-action-bar-main">
          {published ? (
            <>
              {/* Julkaistulle: eri painikkeet */}
              <button 
                className="helpdoc-button helpdoc-button--secondary" 
                type="button" 
                aria-label="Muokkaa luonnokseksi"
                onClick={handleConvertToDraft}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--fi-spacing-s)' }}
              >
                <img 
                  src="/baseIcons/icon-edit.svg" 
                  alt="" 
                  aria-hidden="true" 
                  style={{ 
                    width: '16px', 
                    height: '16px',
                    filter: 'brightness(0) saturate(100%)' // Musta ikoni valkoiselle taustalle
                  }} 
                />
                <span>Muokkaa luonnokseksi</span>
              </button>
              <button 
                className="helpdoc-button helpdoc-button--secondary-no-border" 
                type="button" 
                aria-label="Luo uusi versio"
                onClick={handleCreateNewVersion}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--fi-spacing-s)' }}
              >
                <img 
                  src="/baseIcons/icon-plus.svg" 
                  alt="" 
                  aria-hidden="true" 
                  style={{ 
                    width: '16px', 
                    height: '16px',
                    filter: 'brightness(0) saturate(100%)' // Musta ikoni
                  }} 
                />
                <span>Luo uusi versio</span>
              </button>
            </>
          ) : (
            <>
              {/* Luonnokselle: normaalit painikkeet */}
              <button 
                className="helpdoc-button helpdoc-button--primary" 
                type="button" 
                aria-label="Julkaise sisältö"
                onClick={handlePublish}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--fi-spacing-s)' }}
              >
                <img 
                  src="/baseIcons/icon-send.svg" 
                  alt="" 
                  aria-hidden="true" 
                  style={{ 
                    width: '16px', 
                    height: '16px',
                    filter: 'brightness(0) invert(1)' // Valkoinen ikoni mustalle taustalle
                  }} 
                />
                <span>Julkaise</span>
              </button>
              <button 
                className="helpdoc-button helpdoc-button--secondary" 
                type="button" 
                aria-label="Tallenna luonnos"
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--fi-spacing-s)' }}
              >
                <span>Tallenna luonnos</span>
              </button>
              <button 
                className="helpdoc-button helpdoc-button--secondary-no-border" 
                type="button" 
                aria-label="Pyydä tarkistusta"
                onClick={handleRequestReview}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--fi-spacing-s)' }}
              >
                <img 
                  src="/baseIcons/icon-check.svg" 
                  alt="" 
                  aria-hidden="true" 
                  style={{ 
                    width: '16px', 
                    height: '16px',
                    filter: 'brightness(0) saturate(100%) invert(45%) sepia(100%) saturate(2000%) hue-rotate(10deg) brightness(0.9) contrast(1.2)' // Oranssi #e86717
                  }} 
                />
                <span>Pyydä tarkistusta</span>
              </button>
              <button 
                className="helpdoc-button helpdoc-button--secondary-no-border" 
                type="button" 
                aria-label="Ajasta julkaisu"
                onClick={handleSchedule}
                style={{ display: 'flex', alignItems: 'center', gap: 'var(--fi-spacing-s)' }}
              >
                <img 
                  src="/baseIcons/icon-calendar.svg" 
                  alt="" 
                  aria-hidden="true" 
                  style={{ 
                    width: '16px', 
                    height: '16px',
                    filter: 'brightness(0) saturate(100%) invert(45%) sepia(100%) saturate(2000%) hue-rotate(10deg) brightness(0.9) contrast(1.2)' // Oranssi #e86717
                  }} 
                />
                <span>Ajasta julkaisu</span>
              </button>
            </>
          )}
          {/* Yhteiset toiminnot */}
          <div style={{ display: 'flex', gap: 'var(--fi-spacing-xs)', marginLeft: 'auto' }}>
            <button 
              className="helpdoc-icon-button" 
              type="button" 
              aria-label="Poista"
              onClick={handleDelete}
              style={{ padding: 'var(--fi-spacing-xs) var(--fi-spacing-s)' }}
            >
              <img 
                src="/baseIcons/icon-remove.svg" 
                alt="" 
                aria-hidden="true" 
                className="helpdoc-icon-button__icon"
                style={{ 
                  width: '16px', 
                  height: '16px',
                  filter: 'brightness(0) saturate(100%) invert(19%) sepia(95%) saturate(2000%) hue-rotate(340deg) brightness(0.85) contrast(1.1)' // Suomi.fi punainen (alert-base)
                }}
              />
              <span className="helpdoc-icon-button__text" style={{ fontSize: '0.875rem', lineHeight: '1.2', color: 'var(--fi-color-alert-base)' }}>Poista</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Muutosperustelu-modaali */}
      {showChangeReasonModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowChangeReasonModal(false)
              setPendingAction(null)
            }
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '4px',
              padding: 'var(--fi-spacing-l)',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0, marginBottom: 'var(--fi-spacing-m)', fontSize: '1.125rem', fontWeight: 600 }}>
              Muutosperustelu
            </h3>
            <p style={{ marginBottom: 'var(--fi-spacing-m)', fontSize: '0.875rem', color: 'var(--fi-color-text-secondary)' }}>
              Kirjoita perustelu muutokselle. Tämä kenttä on pakollinen.
            </p>
            <textarea
              value={changeReason}
              onChange={(e) => setChangeReason(e.target.value)}
              placeholder="Kirjoita muutosperustelu tähän..."
              style={{
                width: '100%',
                minHeight: '120px',
                border: '1px solid var(--fi-color-depth-light-1)',
                borderRadius: '4px',
                padding: 'var(--fi-spacing-s)',
                fontSize: '0.875rem',
                fontFamily: 'Source Sans Pro, sans-serif',
                resize: 'vertical',
                marginBottom: 'var(--fi-spacing-m)'
              }}
              autoFocus
            />
            <div style={{ display: 'flex', gap: 'var(--fi-spacing-s)', justifyContent: 'flex-end' }}>
              <button
                className="helpdoc-button helpdoc-button--secondary"
                type="button"
                onClick={() => {
                  setShowChangeReasonModal(false)
                  setPendingAction(null)
                  setChangeReason('')
                }}
              >
                Peruuta
              </button>
              <button
                className="helpdoc-button helpdoc-button--primary"
                type="button"
                onClick={() => {
                  if (pendingAction === 'publish') {
                    confirmPublish()
                  } else if (pendingAction === 'review') {
                    confirmRequestReview()
                  }
                }}
                disabled={!changeReason.trim()}
              >
                {pendingAction === 'publish' ? 'Julkaise' : 'Lähetä tarkistuspyyntö'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ajastusmodaali */}
      {showScheduleModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowScheduleModal(false)
            }
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '4px',
              padding: 'var(--fi-spacing-l)',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0, marginBottom: 'var(--fi-spacing-m)', fontSize: '1.125rem', fontWeight: 600 }}>
              Ajasta julkaisu
            </h3>
            <p style={{ marginBottom: 'var(--fi-spacing-m)', fontSize: '0.875rem', color: 'var(--fi-color-text-secondary)' }}>
              Valitse päivämäärä ja aika, jolloin sisältö julkaistaan automaattisesti.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--fi-spacing-m)', marginBottom: 'var(--fi-spacing-m)' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                Päivämäärä
                <input
                  type="text"
                  value={scheduledDate}
                  onChange={(e) => {
                    // Salli vain numeroita ja pisteitä
                    const value = e.target.value.replace(/[^\d.]/g, '')
                    // Rajoita pituus (dd.mm.yyyy = 10 merkkiä)
                    if (value.length <= 10) {
                      setScheduledDate(value)
                    }
                  }}
                  placeholder="dd.mm.yyyy"
                  style={{
                    width: '100%',
                    marginTop: 'var(--fi-spacing-xs)',
                    padding: 'var(--fi-spacing-xs) var(--fi-spacing-s)',
                    border: '1px solid var(--fi-color-depth-light-1)',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    fontFamily: 'Source Sans Pro, sans-serif'
                  }}
                />
                <div style={{ fontSize: '0.75rem', color: 'var(--fi-color-text-secondary)', marginTop: 'var(--fi-spacing-xs)' }}>
                  Syötä päivämäärä muodossa dd.mm.yyyy (esim. {(() => {
                    const tomorrow = new Date()
                    tomorrow.setDate(tomorrow.getDate() + 1)
                    const day = String(tomorrow.getDate()).padStart(2, '0')
                    const month = String(tomorrow.getMonth() + 1).padStart(2, '0')
                    const year = tomorrow.getFullYear()
                    return `${day}.${month}.${year}`
                  })()})
                </div>
              </label>
              <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                Aika
                <input
                  type="time"
                  value={scheduledTime}
                  onChange={(e) => setScheduledTime(e.target.value)}
                  style={{
                    width: '100%',
                    marginTop: 'var(--fi-spacing-xs)',
                    padding: 'var(--fi-spacing-xs) var(--fi-spacing-s)',
                    border: '1px solid var(--fi-color-depth-light-1)',
                    borderRadius: '4px',
                    fontSize: '0.875rem',
                    fontFamily: 'Source Sans Pro, sans-serif'
                  }}
                />
              </label>
            </div>
            <div style={{ display: 'flex', gap: 'var(--fi-spacing-s)', justifyContent: 'flex-end' }}>
              <button
                className="helpdoc-button helpdoc-button--secondary"
                type="button"
                onClick={() => {
                  setShowScheduleModal(false)
                  setScheduledDate('')
                  setScheduledTime('')
                }}
              >
                Peruuta
              </button>
              <button
                className="helpdoc-button helpdoc-button--primary"
                type="button"
                onClick={confirmSchedule}
                disabled={!scheduledDate || !scheduledTime}
              >
                Ajasta julkaisu
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Toast-ilmoitus Suomi.fi -tyylillä */}
      {toast && (
        <div
          role="alert"
          aria-live="polite"
          style={{
            position: 'fixed',
            bottom: 'var(--fi-spacing-l)',
            right: 'var(--fi-spacing-l)',
            backgroundColor: toast.type === 'success' 
              ? 'var(--fi-color-success-base)' 
              : 'var(--fi-color-highlight-base)',
            color: '#ffffff',
            padding: 'var(--fi-spacing-m) var(--fi-spacing-l)',
            borderRadius: '4px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            zIndex: 10000,
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--fi-spacing-s)',
            fontSize: '0.875rem',
            fontWeight: 400,
            maxWidth: '400px',
            animation: 'slideIn 0.3s ease-out'
          }}
        >
          {toast.type === 'success' && (
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 20 20" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              style={{ flexShrink: 0 }}
            >
              <path 
                d="M16.6667 5L7.50004 14.1667L3.33337 10" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
          )}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Vahvistusmodaali */}
      {showConfirmModal && confirmConfig && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowConfirmModal(false)
              if (confirmConfig.onCancel) {
                confirmConfig.onCancel()
              }
              setConfirmConfig(null)
            }
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '4px',
              padding: 'var(--fi-spacing-l)',
              maxWidth: '500px',
              width: '90%',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0, marginBottom: 'var(--fi-spacing-m)', fontSize: '1.125rem', fontWeight: 600 }}>
              Vahvista toiminto
            </h3>
            <p style={{ marginBottom: 'var(--fi-spacing-l)', fontSize: '0.875rem', color: 'var(--fi-color-text-base)', lineHeight: '1.5' }}>
              {confirmConfig.message}
            </p>
            <div style={{ display: 'flex', gap: 'var(--fi-spacing-s)', justifyContent: 'flex-end' }}>
              <button
                className="helpdoc-button helpdoc-button--secondary"
                type="button"
                onClick={() => {
                  setShowConfirmModal(false)
                  if (confirmConfig.onCancel) {
                    confirmConfig.onCancel()
                  }
                  setConfirmConfig(null)
                }}
              >
                Peruuta
              </button>
              <button
                className="helpdoc-button helpdoc-button--primary"
                type="button"
                onClick={() => {
                  if (confirmConfig.onConfirm) {
                    confirmConfig.onConfirm()
                  }
                  setShowConfirmModal(false)
                  setConfirmConfig(null)
                }}
              >
                Vahvista
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template-valinta modaali parametreille */}
      {showTemplateModal && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowTemplateModal(false)
            }
          }}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '4px',
              padding: 'var(--fi-spacing-l)',
              maxWidth: '600px',
              width: '90%',
              maxHeight: '80vh',
              overflowY: 'auto',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ marginTop: 0, marginBottom: 'var(--fi-spacing-m)', fontSize: '1.125rem', fontWeight: 600 }}>
              Valitse parametripohja
            </h3>
            <p style={{ marginBottom: 'var(--fi-spacing-m)', fontSize: '0.875rem', color: 'var(--fi-color-text-secondary)' }}>
              Valitse parametripohja, jota käytetään uuden parametrin luomiseen. Pohja määrittää parametrin tyypin, validoinnit ja muut tekniset asetukset.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--fi-spacing-s)' }}>
              {Object.values(PARAMETER_TEMPLATES).map((template) => (
                <button
                  key={template.id}
                  type="button"
                  className="helpdoc-button helpdoc-button--secondary"
                  onClick={() => {
                    setShowTemplateModal(false)
                    onItemCreate(selectedContentType, selectedCategory, template.id)
                  }}
                  style={{
                    textAlign: 'left',
                    padding: 'var(--fi-spacing-m)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    gap: 'var(--fi-spacing-xs)'
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{template.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--fi-color-text-secondary)' }}>
                    {template.type === 'integer' || template.type === 'number' ? (
                      <>
                        Tyyppi: {template.type === 'integer' ? 'Kokonaisluku' : 'Desimaaliluku'}
                        {template.min !== undefined && template.max !== undefined && (
                          <> • Alue: {template.min}–{template.max}</>
                        )}
                        {template.unit && <> • Yksikkö: {template.unit}</>}
                      </>
                    ) : (
                      <>Tyyppi: Teksti</>
                    )}
                  </div>
                </button>
              ))}
            </div>
            <div style={{ marginTop: 'var(--fi-spacing-m)', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="helpdoc-button helpdoc-button--secondary"
                type="button"
                onClick={() => setShowTemplateModal(false)}
              >
                Peruuta
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}

export default RightEditor
