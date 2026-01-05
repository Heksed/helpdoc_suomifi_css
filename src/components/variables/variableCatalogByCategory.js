/**
 * Variable catalogs by category - Whitelist of allowed placeholder variables per category
 * 
 * Each category has its own set of variables.
 * In the future, this will be fetched from an API.
 */

import { CATEGORIES } from '../../data/mockData'

/**
 * @typedef {Object} VariableDef
 * @property {string} key - Used in {{key}}
 * @property {string} label - Human-friendly label for picker
 * @property {string} [description] - Optional help text
 * @property {string} exampleValue - Used in preview
 */

// Yleiset muuttujat (käytössä kaikissa kategorioissa)
const COMMON_VARIABLES = [
  { key: "customerName", label: "Asiakkaan nimi", description: "Asiakkaan koko nimi", exampleValue: "Matti Meikäläinen" },
  { key: "customerId", label: "Asiakkaan ID", description: "Asiakkaan henkilötunnus", exampleValue: "123456-7" },
  { key: "caseId", label: "Tapausnumero", description: "Hakemuksen tapausnumero", exampleValue: "CASE-2025-00012" },
  { key: "currentDate", label: "Päivämäärä", description: "Nykyinen päivämäärä", exampleValue: "15.01.2026" },
]

// Päätöspohjien muuttujat
const DECISION_TEMPLATE_VARIABLES = [
  ...COMMON_VARIABLES,
  { key: "applicantName", label: "Hakijan nimi", description: "Hakemuksen tekijän nimi", exampleValue: "Liisa Esimerkki" },
  { key: "applicationNumber", label: "Hakemusnumero", description: "Hakemuksen yksilöllinen numero", exampleValue: "HAK-2025-12345" },
  { key: "decisionDate", label: "Päätöspäivä", description: "Päätöksen tekemispäivä", exampleValue: "28.12.2025" },
  { key: "effectiveDate", label: "Voimaantulopäivä", description: "Päätöksen voimaantulopäivä", exampleValue: "01.02.2026" },
  { key: "amount", label: "Summa", description: "Rahamäärä", exampleValue: "123,45 €" },
  { key: "dueDate", label: "Eräpäivä", description: "Maksun eräpäivä", exampleValue: "15.01.2026" },
  { key: "earningsRequirement", label: "Ansioehto", description: "Ansioehtojen täyttyminen", exampleValue: "Täyttyy" },
  { key: "eligibility", label: "Kelpoisuus", description: "Hakijan kelpoisuus", exampleValue: "Kelvollinen" },
  { key: "payment", label: "Maksu", description: "Myönnetty maksu", exampleValue: "850,00" },
  { key: "allowanceAmount", label: "Avustussumma", description: "Myönnetty avustussumma", exampleValue: "500,00 €" },
  { key: "purpose", label: "Käyttötarkoitus", description: "Avustuksen käyttötarkoitus", exampleValue: "Liikkumiseen" },
  { key: "paymentMethod", label: "Maksutapa", description: "Maksun toteutustapa", exampleValue: "Tilisiirto" },
  { key: "securityAmount", label: "Turvasumma", description: "Myönnetty turvasumma", exampleValue: "750,00 €" },
  { key: "relocationReason", label: "Muuton syy", description: "Muuton perustelu", exampleValue: "Työn perässä" },
  { key: "originalApplicationNumber", label: "Alkuperäinen hakemusnumero", description: "Alkuperäisen hakemuksen numero", exampleValue: "HAK-2024-98765" },
  { key: "correctionApplicationNumber", label: "Korjaushakemusnumero", description: "Korjaushakemuksen numero", exampleValue: "KOR-2025-00001" },
  { key: "originalDecision", label: "Alkuperäinen päätös", description: "Alkuperäisen päätöksen sisältö", exampleValue: "Hylätty" },
  { key: "correctedDecision", label: "Korjattu päätös", description: "Korjatun päätöksen sisältö", exampleValue: "Hyväksytty" },
  { key: "correctionReason", label: "Korjauksen syy", description: "Päätöksen korjauksen perustelu", exampleValue: "Uusi tieto saatu" },
  { key: "requestedAmount", label: "Haettu summa", description: "Hakemassa haettu summa", exampleValue: "1000,00 €" },
  { key: "grantedAmount", label: "Myönnetty summa", description: "Myönnetty summa", exampleValue: "800,00 €" },
  { key: "justification", label: "Perustelu", description: "Päätöksen perustelu", exampleValue: "Hakemus täyttää vaatimukset" },
  { key: "reason1", label: "Syy 1", description: "Ensimmäinen perustelu", exampleValue: "Tuloraja ylitetty" },
  { key: "reason2", label: "Syy 2", description: "Toinen perustelu", exampleValue: "Asiakirjat puuttuvat" },
  { key: "appealInstructions", label: "Valitusohje", description: "Ohje valituksen tekemiseen", exampleValue: "Valitus tehdään 30 päivän kuluessa" }
]

// Tervetuloviestin muuttujat
const MESSAGE_WELCOME_VARIABLES = [
  ...COMMON_VARIABLES,
  { key: "serviceName", label: "Palvelun nimi", description: "Palvelun nimi", exampleValue: "Ansioturva" },
  { key: "welcomeMessage", label: "Tervetuloviesti", description: "Henkilökohtainen tervetuloviesti", exampleValue: "Tervetuloa palveluumme!" },
  { key: "nextSteps", label: "Seuraavat askeleet", description: "Ohjeet seuraaviin askeleisiin", exampleValue: "Täytä hakemus" }
]

// Hylkäysviestin muuttujat
const MESSAGE_REJECTION_VARIABLES = [
  ...COMMON_VARIABLES,
  { key: "applicantName", label: "Hakijan nimi", description: "Hakemuksen tekijän nimi", exampleValue: "Liisa Esimerkki" },
  { key: "applicationNumber", label: "Hakemusnumero", description: "Hakemuksen yksilöllinen numero", exampleValue: "HAK-2025-12345" },
  { key: "rejectionDate", label: "Hylkäyspäivä", description: "Päätöksen tekemispäivä", exampleValue: "28.12.2025" },
  { key: "reason1", label: "Syy 1", description: "Ensimmäinen perustelu", exampleValue: "Tuloraja ylitetty" },
  { key: "reason2", label: "Syy 2", description: "Toinen perustelu", exampleValue: "Asiakirjat puuttuvat" },
  { key: "appealInstructions", label: "Valitusohje", description: "Ohje valituksen tekemiseen", exampleValue: "Valitus tehdään 30 päivän kuluessa" },
  { key: "contactInfo", label: "Yhteystiedot", description: "Yhteystiedot lisätietoja varten", exampleValue: "asiakaspalvelu@example.fi" }
]

// Hyväksyntäviestin muuttujat
const MESSAGE_APPROVAL_VARIABLES = [
  ...COMMON_VARIABLES,
  { key: "applicantName", label: "Hakijan nimi", description: "Hakemuksen tekijän nimi", exampleValue: "Liisa Esimerkki" },
  { key: "applicationNumber", label: "Hakemusnumero", description: "Hakemuksen yksilöllinen numero", exampleValue: "HAK-2025-12345" },
  { key: "approvalDate", label: "Hyväksymispäivä", description: "Päätöksen tekemispäivä", exampleValue: "28.12.2025" },
  { key: "amount", label: "Summa", description: "Myönnetty summa", exampleValue: "850,00 €" },
  { key: "dueDate", label: "Eräpäivä", description: "Maksun eräpäivä", exampleValue: "15.01.2026" },
  { key: "nextSteps", label: "Seuraavat askeleet", description: "Ohjeet seuraaviin askeleisiin", exampleValue: "Odotamme vahvistusta" }
]

// Ilmoitusviestin muuttujat
const MESSAGE_NOTIFICATION_VARIABLES = [
  ...COMMON_VARIABLES,
  { key: "applicantName", label: "Hakijan nimi", description: "Hakemuksen tekijän nimi", exampleValue: "Liisa Esimerkki" },
  { key: "applicationNumber", label: "Hakemusnumero", description: "Hakemuksen yksilöllinen numero", exampleValue: "HAK-2025-12345" },
  { key: "notificationType", label: "Ilmoituksen tyyppi", description: "Ilmoituksen tyyppi", exampleValue: "Päivitys" },
  { key: "notificationDate", label: "Ilmoituspäivä", description: "Ilmoituksen päivämäärä", exampleValue: "28.12.2025" },
  { key: "message", label: "Viesti", description: "Ilmoituksen viesti", exampleValue: "Hakemuksesi on käsitelty" },
  { key: "actionRequired", label: "Vaadittu toimenpide", description: "Tarvittaessa vaadittu toimenpide", exampleValue: "Tarkista tiedot" }
]

/**
 * Returns the appropriate variable catalog based on the item's category
 * @param {Object} item - The content item
 * @returns {VariableDef[]} Array of variable definitions
 */
export function getVariableCatalogByCategory(item) {
  if (!item || !item.category) {
    // Default: päätöspohjien muuttujat
    return DECISION_TEMPLATE_VARIABLES
  }

  const category = item.category

  // Päätöspohjien kategoriat
  if (category === CATEGORIES.ANSIOTURVA || 
      category === CATEGORIES.LIIKKUVUUSAVUSTUS || 
      category === CATEGORIES.MUUTOSTURVA || 
      category === CATEGORIES.KORJAUS ||
      category === CATEGORIES.DECISION_TEMPLATES) {
    return DECISION_TEMPLATE_VARIABLES
  }

  // Viestipohjien kategoriat - uudet kategoriat
  if (category === CATEGORIES.MESSAGE_PAYMENT_NOTIFICATION ||
      category === CATEGORIES.MESSAGE_PAYMENT_REMINDER_1 ||
      category === CATEGORIES.MESSAGE_PAYMENT_REMINDER_2 ||
      category === CATEGORIES.MESSAGE_ADDITIONAL_INFO_REQUEST ||
      category === CATEGORIES.MESSAGE_CORRECTION_CASE ||
      category === CATEGORIES.MESSAGE_APPEAL_CASE ||
      category === CATEGORIES.MESSAGE_OTHER_ADVANCE_NOTICE ||
      category === CATEGORIES.MESSAGE_OTHER_RECEIVABLE_GROSS ||
      category === CATEGORIES.MESSAGE_NOTIFICATION) {
    return MESSAGE_NOTIFICATION_VARIABLES
  }

  // Vanhat viestipohjien kategoriat
  if (category === CATEGORIES.MESSAGE_WELCOME) {
    return MESSAGE_WELCOME_VARIABLES
  }

  if (category === CATEGORIES.MESSAGE_REJECTION) {
    return MESSAGE_REJECTION_VARIABLES
  }

  if (category === CATEGORIES.MESSAGE_APPROVAL) {
    return MESSAGE_APPROVAL_VARIABLES
  }

  // Default: päätöspohjien muuttujat
  return DECISION_TEMPLATE_VARIABLES
}

// Export all catalogs for backwards compatibility
export const VARIABLE_CATALOG = DECISION_TEMPLATE_VARIABLES

