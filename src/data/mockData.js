// Content types (ylätaso - määrittää editorityypin)
export const CONTENT_TYPES = {
  TEXT: 'text',
  TEMPLATE: 'template',
  PARAMETER: 'parameter',
  STRUCTURE: 'structure'
}

// Categories (alataso - ryhmittely sisällön luonteen mukaan)
export const CATEGORIES = {
  PARAMETER_VALUES: 'parameter_values',
  TEXT_CONTENT: 'text_content',
  // Viestipohjien tyypit (Viestipohjat on pääkategoria)
  MESSAGE_PAYMENT_NOTIFICATION: 'message_payment_notification', // Maksuilmoitus
  MESSAGE_PAYMENT_REMINDER_1: 'message_payment_reminder_1', // Maksumuistutus 1
  MESSAGE_PAYMENT_REMINDER_2: 'message_payment_reminder_2', // Maksumuistutus 2
  MESSAGE_ADDITIONAL_INFO_REQUEST: 'message_additional_info_request', // Lisäselvityspyyntö
  MESSAGE_CORRECTION_CASE: 'message_correction_case', // Korjausasia
  MESSAGE_APPEAL_CASE: 'message_appeal_case', // Muutoksenhakuasia
  MESSAGE_OTHER_ADVANCE_NOTICE: 'message_other_advance_notice', // Muut viestit: Ennakkoilmoitus
  MESSAGE_OTHER_RECEIVABLE_GROSS: 'message_other_receivable_gross', // Muut viestit: Saatavan brutotus
  // Vanhat kategoriat säilytetään yhteensopivuuden vuoksi
  MESSAGE_WELCOME: 'message_welcome',
  MESSAGE_REJECTION: 'message_rejection',
  MESSAGE_APPROVAL: 'message_approval',
  MESSAGE_NOTIFICATION: 'message_notification',
  // Vanha kategoria säilytetään yhteensopivuuden vuoksi
  MESSAGE_TEMPLATES: 'message_templates',
  DECISION_TEMPLATES: 'decision_templates',
  REVIEW_TEXTS: 'review_texts',
  GUIDE_TEXTS: 'guide_texts',
  DECISION_ADDITIONAL_TEXTS: 'decision_additional_texts', // Päätösten lisätekstit
  // Päätöspohjien alakategoriat
  ANSIOTURVA: 'ansioturva',
  LIIKKUVUUSAVUSTUS: 'liikkuvuusavustus',
  MUUTOSTURVA: 'muutosturva',
  KORJAUS: 'korjaus'
}

// Parameter Templates - Määritetään konfiguraatiopalvelussa (vain adminit)
// Käyttäjät valitsevat näistä luodessaan uuden parametrin
export const PARAMETER_TEMPLATES = {
  AGE: {
    id: 'age-parameter-template',
    name: 'Ikäparametri',
    type: 'integer',
    min: 0,
    max: 120,
    step: 1,
    unit: 'vuotta',
    defaultDescription: 'Ikäraja-parametri',
    validationRules: {
      required: true,
      integerOnly: true
    }
  },
  INCOME: {
    id: 'income-parameter-template',
    name: 'Tuloparametri',
    type: 'integer',
    min: 0,
    max: 100000,
    step: 100,
    unit: 'euroa/kk',
    defaultDescription: 'Tuloraja-parametri',
    validationRules: {
      required: true,
      integerOnly: true
    }
  },
  PERCENTAGE: {
    id: 'percentage-parameter-template',
    name: 'Prosenttiparametri',
    type: 'number',
    min: 0,
    max: 100,
    step: 0.1,
    unit: '%',
    defaultDescription: 'Prosentti-parametri',
    validationRules: {
      required: true,
      decimalAllowed: true
    }
  },
  TEXT: {
    id: 'text-parameter-template',
    name: 'Tekstiparametri',
    type: 'text',
    defaultDescription: 'Teksti-parametri',
    validationRules: {
      required: true
    }
  },
  COUNT: {
    id: 'count-parameter-template',
    name: 'Lukumääräparametri',
    type: 'integer',
    min: 0,
    max: 10000,
    step: 1,
    unit: 'kpl',
    defaultDescription: 'Lukumäärä-parametri',
    validationRules: {
      required: true,
      integerOnly: true
    }
  }
}

// Languages
export const LANGUAGES = {
  FI: 'fi',
  SV: 'sv',
  EN: 'en'
}

export const LANGUAGE_LABELS = {
  [LANGUAGES.FI]: 'Suomi',
  [LANGUAGES.SV]: 'Svenska',
  [LANGUAGES.EN]: 'English'
}

// Lifecycle states
export const LIFECYCLE_STATES = {
  DRAFT: 'draft',
  PENDING_REVIEW: 'pending_review',
  APPROVED: 'approved',
  SCHEDULED: 'scheduled',
  PUBLISHED: 'published'
}

export const mockItems = [
  {
    id: '1',
    title: 'Tervetuloviesti',
    key: 'msg-welcome-001',
    description: 'Tervetuloviesti, joka lähetetään uusille käyttäjille rekisteröitymisen jälkeen.',
    status: 'published',
    lifecycleState: LIFECYCLE_STATES.PUBLISHED,
    contentType: CONTENT_TYPES.TEXT,
    category: CATEGORIES.MESSAGE_WELCOME,
    messageChannel: 'Sähköposti',
    validFrom: '2024-01-01T00:00:00Z',
    validTo: '2024-12-31T23:59:59Z',
    publishedDate: '2024-01-15T10:00:00Z',
    createdAt: '2024-01-10T09:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    createdBy: 'Matti Meikäläinen',
    updatedBy: 'Matti Meikäläinen',
    publishedBy: 'Matti Meikäläinen',
    languages: {
      [LANGUAGES.FI]: {
        content: 'Tervetuloa palveluumme!',
        lifecycleState: LIFECYCLE_STATES.PUBLISHED,
        publishedDate: '2024-01-15T10:00:00Z'
      },
      [LANGUAGES.SV]: {
        content: 'Välkommen till vår tjänst!',
        lifecycleState: LIFECYCLE_STATES.PUBLISHED,
        publishedDate: '2024-01-15T10:00:00Z'
      },
      [LANGUAGES.EN]: {
        content: 'Welcome to our service!',
        lifecycleState: LIFECYCLE_STATES.DRAFT
      }
    }
  },
  {
    id: '1b',
    title: 'Maksuilmoitus - Ansioturva',
    key: 'msg-payment-notification-001',
    description: 'Maksuilmoitus, joka lähetetään kun maksu on myönnetty.',
    status: 'published',
    lifecycleState: LIFECYCLE_STATES.PUBLISHED,
    contentType: CONTENT_TYPES.TEXT,
    category: CATEGORIES.MESSAGE_PAYMENT_NOTIFICATION,
    // Voimassaoloajat ovat samat kaikille kanaville (ylätasolla)
    validFrom: '2024-01-01T00:00:00Z',
    validTo: '2024-12-31T23:59:59Z',
    // Jokaisella kanavalla on oma sisältönsä (järjestys: Sähköinen asiointi, Sähköposti, Tekstiviesti)
    channels: {
      'Sähköinen asiointi': {
        languages: {
          [LANGUAGES.FI]: {
            content: 'Maksuilmoitus\n\nHyvä {applicantName},\n\nMaksu on myönnetty summa {amount} euroa. Maksu tulee tilillesi eräpäivänä {dueDate}.\n\nVoit tarkistaa maksun tiedot sähköisessä asioinnissa.',
            lifecycleState: LIFECYCLE_STATES.DRAFT
          }
        }
      },
      'Sähköposti': {
        languages: {
          [LANGUAGES.FI]: {
            content: 'Maksuilmoitus\n\nHyvä {applicantName},\n\nMaksu on myönnetty summa {amount} euroa. Maksu tulee tilillesi eräpäivänä {dueDate}.',
            lifecycleState: LIFECYCLE_STATES.PUBLISHED,
            publishedDate: '2024-01-20T10:00:00Z'
          },
          [LANGUAGES.SV]: {
            content: 'Betalningsmeddelande\n\nHej {applicantName},\n\nBetalningen på {amount} euro har beviljats. Betalningen kommer till ditt konto på förfallodagen {dueDate}.',
            lifecycleState: LIFECYCLE_STATES.PUBLISHED,
            publishedDate: '2024-01-20T10:00:00Z'
          }
        }
      },
      'Tekstiviesti': {
        languages: {
          [LANGUAGES.FI]: {
            content: 'Maksu {amount}€ myönnetty. Tulee tilillesi {dueDate}.',
            lifecycleState: LIFECYCLE_STATES.PUBLISHED,
            publishedDate: '2024-01-20T10:00:00Z'
          },
          [LANGUAGES.SV]: {
            content: 'Betalning {amount}€ beviljad. Kommer till ditt konto {dueDate}.',
            lifecycleState: LIFECYCLE_STATES.DRAFT
          }
        }
      }
    },
    publishedDate: '2024-01-20T10:00:00Z',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    createdBy: 'Liisa Esimerkki',
    updatedBy: 'Liisa Esimerkki',
    publishedBy: 'Liisa Esimerkki'
  },
  {
    id: '2',
    title: 'Maksimi-ikäraja',
    key: 'param-max-age',
    description: 'Maksimi-ikäraja hakemuksille. Arvo määrittää yläikärajan, jota vanhemmat hakijat eivät voi ylittää.',
    status: 'published',
    lifecycleState: LIFECYCLE_STATES.PUBLISHED,
    contentType: CONTENT_TYPES.PARAMETER,
    category: CATEGORIES.PARAMETER_VALUES,
    content: '65',
    publishedDate: '2024-01-20T14:30:00Z',
    createdAt: '2024-01-18T08:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
    createdBy: 'Matti Meikäläinen',
    updatedBy: 'Matti Meikäläinen',
    publishedBy: 'Matti Meikäläinen',
    parameterTemplateId: PARAMETER_TEMPLATES.AGE.id,
    parameterMeta: {
      type: 'integer',
      min: 0,
      max: 120,
      step: 1,
      unit: 'vuotta',
      description: 'Maksimi-ikäraja hakemuksille. Arvo määrittää yläikärajan, jota vanhemmat hakijat eivät voi ylittää.'
    }
  },
  {
    id: '3',
    title: 'Hakemuksen tarkistusteksti',
    key: 'text-review-app',
    status: 'draft',
    lifecycleState: LIFECYCLE_STATES.DRAFT,
    contentType: CONTENT_TYPES.TEXT,
    category: CATEGORIES.REVIEW_TEXTS,
    createdAt: '2024-01-25T10:00:00Z',
    updatedAt: '2024-01-25T10:00:00Z',
    createdBy: 'Matti Meikäläinen',
    updatedBy: 'Matti Meikäläinen',
    languages: {
      [LANGUAGES.FI]: {
        content: 'Hakemuksesi on tarkistuksessa...',
        lifecycleState: LIFECYCLE_STATES.DRAFT
      },
      [LANGUAGES.SV]: {
        content: 'Din ansökan granskas...',
        lifecycleState: LIFECYCLE_STATES.DRAFT
      }
      // EN not yet created
    }
  },
  {
    id: '4',
    title: 'Päätöspohja A',
    key: 'template-decision-a',
    description: 'Yleinen päätöspohja, jota käytetään eri tyyppisissä päätöksissä.',
    status: 'published',
    lifecycleState: LIFECYCLE_STATES.PUBLISHED,
    contentType: CONTENT_TYPES.TEMPLATE,
    category: CATEGORIES.DECISION_TEMPLATES,
    publishedDate: '2024-01-12T09:15:00Z',
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-12T09:15:00Z',
    createdBy: 'Matti Meikäläinen',
    updatedBy: 'Matti Meikäläinen',
    publishedBy: 'Matti Meikäläinen',
    languages: {
      [LANGUAGES.FI]: {
        content: 'Tarkastelun perusteella hakemuksesi on...',
        lifecycleState: LIFECYCLE_STATES.PUBLISHED,
        publishedDate: '2024-01-12T09:15:00Z'
      },
      [LANGUAGES.SV]: {
        content: 'Baserat på granskningen har din ansökan...',
        lifecycleState: LIFECYCLE_STATES.PUBLISHED,
        publishedDate: '2024-01-12T09:15:00Z'
      },
      [LANGUAGES.EN]: {
        content: 'Based on the review, your application has been...',
        lifecycleState: LIFECYCLE_STATES.PUBLISHED,
        publishedDate: '2024-01-12T09:15:00Z'
      }
    }
  },
  {
    id: '5a',
    title: 'Päätöksen lisäteksti - Oikeusvalitus',
    key: 'text-decision-additional-appeal',
    status: 'draft',
    lifecycleState: LIFECYCLE_STATES.DRAFT,
    contentType: CONTENT_TYPES.TEXT,
    category: CATEGORIES.DECISION_ADDITIONAL_TEXTS,
    description: 'Lisäteksti, joka voidaan upottaa päätöspohjiin oikeusvalituksen ohjeistukseen liittyen.',
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z',
    languages: {
      [LANGUAGES.FI]: {
        content: 'Jos olet tyytymätön päätökseen, sinulla on oikeus tehdä oikeusvalitus. Oikeusvalitus tulee tehdä 30 päivän kuluessa päätöksen tiedoksisaannista.',
        lifecycleState: LIFECYCLE_STATES.DRAFT
      },
      [LANGUAGES.SV]: {
        content: 'Om du är missnöjd med beslutet har du rätt att överklaga. Överklagan ska göras inom 30 dagar från att beslutet har meddelats.',
        lifecycleState: LIFECYCLE_STATES.DRAFT
      }
      // EN not yet created
    }
  },
  {
    id: '5',
    title: 'Käyttöohjeen johdanto',
    key: 'text-guide-intro',
    status: 'draft',
    lifecycleState: LIFECYCLE_STATES.PENDING_REVIEW,
    contentType: CONTENT_TYPES.TEXT,
    category: CATEGORIES.GUIDE_TEXTS,
    createdAt: '2024-01-28T13:00:00Z',
    updatedAt: '2024-01-29T16:45:00Z',
    createdBy: 'Liisa Esimerkki',
    updatedBy: 'Liisa Esimerkki',
    languages: {
      [LANGUAGES.FI]: {
        content: 'Tämä opas auttaa sinua...',
        lifecycleState: LIFECYCLE_STATES.PENDING_REVIEW
      }
      // SV and EN not yet created
    }
  },
  {
    id: '6',
    title: 'Minimituloraja',
    key: 'param-min-income',
    status: 'published',
    lifecycleState: LIFECYCLE_STATES.PUBLISHED,
    contentType: CONTENT_TYPES.PARAMETER,
    category: CATEGORIES.PARAMETER_VALUES,
    content: '1500',
    publishedDate: '2024-01-22T11:20:00Z',
    createdAt: '2024-01-19T09:00:00Z',
    updatedAt: '2024-01-22T11:20:00Z',
    createdBy: 'Matti Meikäläinen',
    updatedBy: 'Matti Meikäläinen',
    publishedBy: 'Matti Meikäläinen',
    parameterTemplateId: PARAMETER_TEMPLATES.INCOME.id,
    parameterMeta: {
      type: 'integer',
      min: 0,
      max: 100000,
      step: 100,
      unit: 'euroa/kk',
      description: 'Minimituloraja hakemuksille. Arvo määrittää vähimmäistulon, joka vaaditaan hakemuksen hyväksymiseen.'
    }
  },
  {
    id: '7',
    title: 'Hylkäysviesti',
    key: 'msg-rejection-001',
    status: 'published',
    lifecycleState: LIFECYCLE_STATES.PUBLISHED,
    contentType: CONTENT_TYPES.TEXT,
    category: CATEGORIES.MESSAGE_REJECTION,
    messageChannel: 'Sähköposti',
    validFrom: '2024-01-01T00:00:00Z',
    validTo: '2024-12-31T23:59:59Z',
    publishedDate: '2024-01-18T14:00:00Z',
    createdAt: '2024-01-15T09:00:00Z',
    updatedAt: '2024-01-18T14:00:00Z',
    createdBy: 'Matti Meikäläinen',
    updatedBy: 'Liisa Esimerkki',
    publishedBy: 'Liisa Esimerkki',
    languages: {
      [LANGUAGES.FI]: {
        content: 'Valitettavasti hakemuksesi ei voida hyväksyä...',
        lifecycleState: LIFECYCLE_STATES.PUBLISHED
      },
      [LANGUAGES.SV]: {
        content: 'Tyvärr kan din ansökan inte godkännas...',
        lifecycleState: LIFECYCLE_STATES.PUBLISHED
      },
      [LANGUAGES.EN]: {
        content: 'Unfortunately, your application cannot be approved...',
        lifecycleState: LIFECYCLE_STATES.PUBLISHED
      }
    }
  },
  {
    id: '19',
    title: 'Hyväksymisviesti',
    key: 'msg-approval-001',
    status: 'published',
    lifecycleState: LIFECYCLE_STATES.PUBLISHED,
    contentType: CONTENT_TYPES.TEXT,
    category: CATEGORIES.MESSAGE_APPROVAL,
    messageChannel: 'SMS',
    validFrom: '2024-01-01T00:00:00Z',
    validTo: '2024-12-31T23:59:59Z',
    publishedDate: '2024-01-19T12:00:00Z',
    createdAt: '2024-01-16T09:00:00Z',
    updatedAt: '2024-01-19T12:00:00Z',
    createdBy: 'Matti Meikäläinen',
    updatedBy: 'Matti Meikäläinen',
    publishedBy: 'Matti Meikäläinen',
    languages: {
      [LANGUAGES.FI]: {
        content: 'Hakemuksesi on hyväksytty! Onnittelut!',
        lifecycleState: LIFECYCLE_STATES.PUBLISHED
      },
      [LANGUAGES.SV]: {
        content: 'Din ansökan har godkänts! Grattis!',
        lifecycleState: LIFECYCLE_STATES.PUBLISHED
      },
      [LANGUAGES.EN]: {
        content: 'Your application has been approved! Congratulations!',
        lifecycleState: LIFECYCLE_STATES.PUBLISHED
      }
    }
  },
  {
    id: '20',
    title: 'Ilmoitusviesti - Tarkistus',
    key: 'msg-notification-review-001',
    status: 'published',
    lifecycleState: LIFECYCLE_STATES.PUBLISHED,
    contentType: CONTENT_TYPES.TEXT,
    category: CATEGORIES.MESSAGE_NOTIFICATION,
    messageChannel: 'Sähköposti',
    validFrom: '2024-01-01T00:00:00Z',
    validTo: null, // Ei määritelty
    publishedDate: '2024-01-19T13:00:00Z',
    createdAt: '2024-01-16T10:00:00Z',
    updatedAt: '2024-01-19T13:00:00Z',
    createdBy: 'Liisa Esimerkki',
    updatedBy: 'Liisa Esimerkki',
    publishedBy: 'Liisa Esimerkki',
    languages: {
      [LANGUAGES.FI]: {
        content: 'Hakemuksesi on vastaanotettu ja se on nyt tarkistuksessa.',
        lifecycleState: LIFECYCLE_STATES.PUBLISHED
      },
      [LANGUAGES.SV]: {
        content: 'Din ansökan har mottagits och granskas nu.',
        lifecycleState: LIFECYCLE_STATES.PUBLISHED
      },
      [LANGUAGES.EN]: {
        content: 'Your application has been received and is now under review.',
        lifecycleState: LIFECYCLE_STATES.PUBLISHED
      }
    }
  },
  {
    id: '8',
    title: 'Päätöspohja B',
    key: 'template-decision-b',
    status: 'draft',
    lifecycleState: LIFECYCLE_STATES.DRAFT,
    contentType: CONTENT_TYPES.TEMPLATE,
    category: CATEGORIES.DECISION_TEMPLATES,
    createdAt: '2024-01-20T11:00:00Z',
    updatedAt: '2024-01-22T15:30:00Z',
    createdBy: 'Matti Meikäläinen',
    updatedBy: 'Matti Meikäläinen',
    languages: {
      [LANGUAGES.FI]: {
        content: 'Huolellisen harkinnan jälkeen...',
        lifecycleState: LIFECYCLE_STATES.DRAFT
      }
      // SV and EN not yet created
    }
  },
  {
    id: '9',
    title: 'Virheviestin muoto',
    key: 'text-error-format',
    status: 'published',
    lifecycleState: LIFECYCLE_STATES.PUBLISHED,
    contentType: CONTENT_TYPES.TEXT,
    category: CATEGORIES.GUIDE_TEXTS,
    publishedDate: '2024-01-30T10:00:00Z',
    createdAt: '2024-01-25T08:00:00Z',
    updatedAt: '2024-01-30T10:00:00Z',
    createdBy: 'Liisa Esimerkki',
    updatedBy: 'Liisa Esimerkki',
    publishedBy: 'Liisa Esimerkki',
    languages: {
      [LANGUAGES.FI]: {
        content: 'Tarkista seuraavat kentät...',
        lifecycleState: LIFECYCLE_STATES.PUBLISHED
      },
      [LANGUAGES.SV]: {
        content: 'Kontrollera följande fält...',
        lifecycleState: LIFECYCLE_STATES.PUBLISHED
      }
      // EN not yet created
    }
  },
  {
    id: '10',
    title: 'Tarkistuslista',
    key: 'text-review-checklist',
    status: 'draft',
    lifecycleState: LIFECYCLE_STATES.DRAFT,
    contentType: CONTENT_TYPES.TEXT,
    category: CATEGORIES.REVIEW_TEXTS,
    createdAt: '2024-01-26T09:00:00Z',
    updatedAt: '2024-01-26T09:00:00Z',
    createdBy: 'Matti Meikäläinen',
    updatedBy: 'Matti Meikäläinen',
    languages: {
      [LANGUAGES.FI]: {
        content: '1. Tarkista henkilöllisyys\n2. Tarkista asiakirjat\n3. Vahvista tiedot',
        lifecycleState: LIFECYCLE_STATES.DRAFT
      }
      // SV and EN not yet created
    }
  },
  {
    id: '11',
    title: 'Ansioturva - Hyväksymispäätös',
    key: 'template-ansioturva-hyvaksyminen',
    status: 'published',
    lifecycleState: LIFECYCLE_STATES.PUBLISHED,
    contentType: CONTENT_TYPES.TEMPLATE,
    category: CATEGORIES.ANSIOTURVA,
    publishedDate: '2024-01-10T09:00:00Z',
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z',
    createdBy: 'Matti Meikäläinen',
    updatedBy: 'Matti Meikäläinen',
    publishedBy: 'Matti Meikäläinen',
    languages: {
      [LANGUAGES.FI]: {
        content: 'Päätös ansioturvahakemuksesta\n\nHakija: {applicantName}\nHakemusnumero: {applicationNumber}\nPäivämäärä: {currentDate}\n\nTarkastelun perusteella hakemuksesi ansioturvaan on hyväksytty. Päätös perustuu seuraaviin seikkoihin:\n- Ansioehtojen täyttyminen: {earningsRequirement}\n- Kelpoisuus: {eligibility}\n- Maksu: {payment} euroa/kk\n\nPäätös astuu voimaan {effectiveDate}.',
        lifecycleState: LIFECYCLE_STATES.PUBLISHED
      },
      [LANGUAGES.SV]: {
        content: 'Beslut om förvärvsstöd\n\nSökande: {applicantName}\nAnsökningsnummer: {applicationNumber}\nDatum: {currentDate}\n\nBaserat på granskningen har din ansökan om förvärvsstöd godkänts.',
        lifecycleState: LIFECYCLE_STATES.PUBLISHED
      },
      [LANGUAGES.EN]: {
        content: 'Decision on earnings-related allowance\n\nApplicant: {applicantName}\nApplication number: {applicationNumber}\nDate: {currentDate}\n\nBased on the review, your application for earnings-related allowance has been approved.',
        lifecycleState: LIFECYCLE_STATES.PUBLISHED
      }
    }
  },
  {
    id: '12',
    title: 'Ansioturva - Hylkäyspäätös',
    key: 'template-ansioturva-hylkays',
    status: 'published',
    lifecycleState: LIFECYCLE_STATES.PUBLISHED,
    contentType: CONTENT_TYPES.TEMPLATE,
    category: CATEGORIES.ANSIOTURVA,
    publishedDate: '2024-01-10T09:00:00Z',
    createdAt: '2024-01-05T10:00:00Z',
    updatedAt: '2024-01-10T09:00:00Z',
    createdBy: 'Matti Meikäläinen',
    updatedBy: 'Matti Meikäläinen',
    publishedBy: 'Matti Meikäläinen',
    languages: {
      [LANGUAGES.FI]: {
        content: 'Päätös ansioturvahakemuksesta\n\nHakija: {applicantName}\nHakemusnumero: {applicationNumber}\nPäivämäärä: {currentDate}\n\nValitettavasti hakemuksesi ansioturvaan on hylätty seuraavista syistä:\n- {reason1}\n- {reason2}\n\nOikeutesi valittaa päätöksestä: {appealInstructions}',
        lifecycleState: LIFECYCLE_STATES.PUBLISHED
      },
      [LANGUAGES.SV]: {
        content: 'Beslut om förvärvsstöd\n\nSökande: {applicantName}\nAnsökningsnummer: {applicationNumber}\nDatum: {currentDate}\n\nTyvärr har din ansökan om förvärvsstöd avslagits.',
        lifecycleState: LIFECYCLE_STATES.PUBLISHED
      }
    }
  },
  {
    id: '13',
    title: 'Liikkuvuusavustus - Hyväksymispäätös',
    key: 'template-liikkuvuusavustus-hyvaksyminen',
    status: 'published',
    lifecycleState: LIFECYCLE_STATES.PUBLISHED,
    contentType: CONTENT_TYPES.TEMPLATE,
    category: CATEGORIES.LIIKKUVUUSAVUSTUS,
    publishedDate: '2024-01-11T09:00:00Z',
    createdAt: '2024-01-06T10:00:00Z',
    updatedAt: '2024-01-11T09:00:00Z',
    createdBy: 'Matti Meikäläinen',
    updatedBy: 'Matti Meikäläinen',
    publishedBy: 'Matti Meikäläinen',
    languages: {
      [LANGUAGES.FI]: {
        content: 'Päätös liikkuvuusavustushakemuksesta\n\nHakija: {applicantName}\nHakemusnumero: {applicationNumber}\nPäivämäärä: {currentDate}\n\nHakemuksesi liikkuvuusavustukseen on hyväksytty.\n\nMyönnetty avustus: {allowanceAmount} euroa\nAvustuksen käyttötarkoitus: {purpose}\nMaksu: {paymentMethod}\n\nPäätös astuu voimaan {effectiveDate}.',
        lifecycleState: LIFECYCLE_STATES.PUBLISHED
      },
      [LANGUAGES.SV]: {
        content: 'Beslut om rörlighetsstöd\n\nSökande: {applicantName}\nAnsökningsnummer: {applicationNumber}\nDatum: {currentDate}\n\nDin ansökan om rörlighetsstöd har godkänts.',
        lifecycleState: LIFECYCLE_STATES.PUBLISHED
      },
      [LANGUAGES.EN]: {
        content: 'Decision on mobility allowance\n\nApplicant: {applicantName}\nApplication number: {applicationNumber}\nDate: {currentDate}\n\nYour application for mobility allowance has been approved.',
        lifecycleState: LIFECYCLE_STATES.PUBLISHED
      }
    }
  },
  {
    id: '14',
    title: 'Muutosturva - Hyväksymispäätös',
    key: 'template-muutosturva-hyvaksyminen',
    status: 'published',
    lifecycleState: LIFECYCLE_STATES.PUBLISHED,
    contentType: CONTENT_TYPES.TEMPLATE,
    category: CATEGORIES.MUUTOSTURVA,
    publishedDate: '2024-01-11T09:00:00Z',
    createdAt: '2024-01-06T10:00:00Z',
    updatedAt: '2024-01-11T09:00:00Z',
    createdBy: 'Matti Meikäläinen',
    updatedBy: 'Matti Meikäläinen',
    publishedBy: 'Matti Meikäläinen',
    languages: {
      [LANGUAGES.FI]: {
        content: 'Päätös muutosturvahakemuksesta\n\nHakija: {applicantName}\nHakemusnumero: {applicationNumber}\nPäivämäärä: {currentDate}\n\nHakemuksesi muutosturvaan on hyväksytty.\n\nMyönnetty turva: {securityAmount} euroa\nMuuton syy: {relocationReason}\nMaksu: {paymentMethod}\n\nPäätös astuu voimaan {effectiveDate}.',
        lifecycleState: LIFECYCLE_STATES.PUBLISHED
      },
      [LANGUAGES.SV]: {
        content: 'Beslut om flyttstöd\n\nSökande: {applicantName}\nAnsökningsnummer: {applicationNumber}\nDatum: {currentDate}\n\nDin ansökan om flyttstöd har godkänts.',
        lifecycleState: LIFECYCLE_STATES.PUBLISHED
      },
      [LANGUAGES.EN]: {
        content: 'Decision on relocation allowance\n\nApplicant: {applicantName}\nApplication number: {applicationNumber}\nDate: {currentDate}\n\nYour application for relocation allowance has been approved.',
        lifecycleState: LIFECYCLE_STATES.PUBLISHED
      }
    }
  },
  {
    id: '15',
    title: 'Muutosturva - Hylkäyspäätös',
    key: 'template-muutosturva-hylkays',
    status: 'draft',
    lifecycleState: LIFECYCLE_STATES.DRAFT,
    contentType: CONTENT_TYPES.TEMPLATE,
    category: CATEGORIES.MUUTOSTURVA,
    createdAt: '2024-01-20T10:00:00Z',
    updatedAt: '2024-01-22T14:00:00Z',
    createdBy: 'Liisa Esimerkki',
    updatedBy: 'Liisa Esimerkki',
    languages: {
      [LANGUAGES.FI]: {
        content: 'Päätös muutosturvahakemuksesta\n\nHakija: {applicantName}\nHakemusnumero: {applicationNumber}\nPäivämäärä: {currentDate}\n\nValitettavasti hakemuksesi muutosturvaan on hylätty seuraavista syistä:\n- {reason1}\n- {reason2}\n\nOikeutesi valittaa päätöksestä: {appealInstructions}',
        lifecycleState: LIFECYCLE_STATES.DRAFT
      }
    }
  },
  {
    id: '16',
    title: 'Korjaus - Hyväksymispäätös',
    key: 'template-korjaus-hyvaksyminen',
    status: 'published',
    lifecycleState: LIFECYCLE_STATES.PUBLISHED,
    contentType: CONTENT_TYPES.TEMPLATE,
    category: CATEGORIES.KORJAUS,
    publishedDate: '2024-01-12T09:00:00Z',
    createdAt: '2024-01-07T10:00:00Z',
    updatedAt: '2024-01-12T09:00:00Z',
    createdBy: 'Matti Meikäläinen',
    updatedBy: 'Matti Meikäläinen',
    publishedBy: 'Matti Meikäläinen',
    languages: {
      [LANGUAGES.FI]: {
        content: 'Korjauspäätös\n\nHakija: {applicantName}\nAlkuperäinen hakemusnumero: {originalApplicationNumber}\nKorjaushakemusnumero: {correctionApplicationNumber}\nPäivämäärä: {currentDate}\n\nAiempi päätös on korjattu seuraavasti:\n\nAlkuperäinen päätös: {originalDecision}\nKorjattu päätös: {correctedDecision}\nKorjauksen syy: {correctionReason}\n\nPäätös astuu voimaan {effectiveDate}.',
        lifecycleState: LIFECYCLE_STATES.PUBLISHED
      },
      [LANGUAGES.SV]: {
        content: 'Korrigeringsbeslut\n\nSökande: {applicantName}\nUrsprungligt ansökningsnummer: {originalApplicationNumber}\nKorrigeringsansökningsnummer: {correctionApplicationNumber}\nDatum: {currentDate}\n\nTidigare beslut har korrigerats.',
        lifecycleState: LIFECYCLE_STATES.PUBLISHED
      },
      [LANGUAGES.EN]: {
        content: 'Correction decision\n\nApplicant: {applicantName}\nOriginal application number: {originalApplicationNumber}\nCorrection application number: {correctionApplicationNumber}\nDate: {currentDate}\n\nThe previous decision has been corrected.',
        lifecycleState: LIFECYCLE_STATES.PUBLISHED
      }
    }
  },
  {
    id: '17',
    title: 'Korjaus - Hylkäyspäätös',
    key: 'template-korjaus-hylkays',
    status: 'draft',
    lifecycleState: LIFECYCLE_STATES.DRAFT,
    contentType: CONTENT_TYPES.TEMPLATE,
    category: CATEGORIES.KORJAUS,
    createdAt: '2024-01-21T10:00:00Z',
    updatedAt: '2024-01-23T11:00:00Z',
    createdBy: 'Liisa Esimerkki',
    updatedBy: 'Liisa Esimerkki',
    languages: {
      [LANGUAGES.FI]: {
        content: 'Korjauspäätös\n\nHakija: {applicantName}\nAlkuperäinen hakemusnumero: {originalApplicationNumber}\nKorjaushakemusnumero: {correctionApplicationNumber}\nPäivämäärä: {currentDate}\n\nKorjaushakemuksesi on hylätty seuraavista syistä:\n- {reason1}\n- {reason2}\n\nAlkuperäinen päätös pysyy voimassa.',
        lifecycleState: LIFECYCLE_STATES.DRAFT
      }
    }
  },
  {
    id: '18',
    title: 'Liikkuvuusavustus - Osittainen hyväksyminen',
    key: 'template-liikkuvuusavustus-osittainen',
    status: 'published',
    lifecycleState: LIFECYCLE_STATES.PUBLISHED,
    contentType: CONTENT_TYPES.TEMPLATE,
    category: CATEGORIES.LIIKKUVUUSAVUSTUS,
    publishedDate: '2024-01-13T09:00:00Z',
    createdAt: '2024-01-08T10:00:00Z',
    updatedAt: '2024-01-13T09:00:00Z',
    createdBy: 'Matti Meikäläinen',
    updatedBy: 'Matti Meikäläinen',
    publishedBy: 'Matti Meikäläinen',
    languages: {
      [LANGUAGES.FI]: {
        content: 'Päätös liikkuvuusavustushakemuksesta\n\nHakija: {applicantName}\nHakemusnumero: {applicationNumber}\nPäivämäärä: {currentDate}\n\nHakemuksesi liikkuvuusavustukseen on osittain hyväksytty.\n\nHakemasi summa: {requestedAmount} euroa\nMyönnetty summa: {grantedAmount} euroa\nPerustelu: {justification}',
        lifecycleState: LIFECYCLE_STATES.PUBLISHED
      },
      [LANGUAGES.SV]: {
        content: 'Beslut om rörlighetsstöd\n\nSökande: {applicantName}\nAnsökningsnummer: {applicationNumber}\nDatum: {currentDate}\n\nDin ansökan om rörlighetsstöd har delvis godkänts.',
        lifecycleState: LIFECYCLE_STATES.PUBLISHED
      }
    }
  }
]

// Content type groups for left rail navigation - categories shown directly
export const contentTypeGroups = [
  {
    id: 'all',
    label: 'Kaikki',
    contentType: null,
    categories: []
  },
  {
    id: 'messages',
    label: 'Viestipohjat',
    contentType: CONTENT_TYPES.TEXT,
    categories: [
      { id: 'all-messages', label: 'Kaikki viestipohjat', category: null },
      { id: 'payment-notification', label: 'Maksuilmoitus', category: CATEGORIES.MESSAGE_PAYMENT_NOTIFICATION },
      { id: 'payment-reminder-1', label: 'Maksumuistutus 1', category: CATEGORIES.MESSAGE_PAYMENT_REMINDER_1 },
      { id: 'payment-reminder-2', label: 'Maksumuistutus 2', category: CATEGORIES.MESSAGE_PAYMENT_REMINDER_2 },
      { id: 'additional-info-request', label: 'Lisäselvityspyyntö', category: CATEGORIES.MESSAGE_ADDITIONAL_INFO_REQUEST },
      { id: 'correction-case', label: 'Korjausasia', category: CATEGORIES.MESSAGE_CORRECTION_CASE },
      { id: 'appeal-case', label: 'Muutoksenhakuasia', category: CATEGORIES.MESSAGE_APPEAL_CASE },
      { id: 'other-advance-notice', label: 'Muut viestit: Ennakkoilmoitus', category: CATEGORIES.MESSAGE_OTHER_ADVANCE_NOTICE },
      { id: 'other-receivable-gross', label: 'Muut viestit: Saatavan brutotus', category: CATEGORIES.MESSAGE_OTHER_RECEIVABLE_GROSS }
    ]
  },
  {
    id: 'text',
    label: 'Tekstisisältö',
    contentType: CONTENT_TYPES.TEXT,
    categories: [
      { id: 'all-text', label: 'Kaikki tekstit', category: null },
      { id: 'reviews', label: 'Tarkistustekstit', category: CATEGORIES.REVIEW_TEXTS },
      { id: 'guides', label: 'Ohjetekstit', category: CATEGORIES.GUIDE_TEXTS },
      { id: 'decision-additional-texts', label: 'Päätösten lisätekstit', category: CATEGORIES.DECISION_ADDITIONAL_TEXTS }
    ]
  },
  {
    id: 'template',
    label: 'Päätöspohjat',
    contentType: CONTENT_TYPES.TEMPLATE,
    categories: [
      { id: 'all-template', label: 'Kaikki päätöspohjat', category: null },
      { id: 'ansioturva', label: 'Ansioturva', category: CATEGORIES.ANSIOTURVA },
      { id: 'liikkuvuusavustus', label: 'Liikkuvuusavustus', category: CATEGORIES.LIIKKUVUUSAVUSTUS },
      { id: 'muutosturva', label: 'Muutosturva', category: CATEGORIES.MUUTOSTURVA },
      { id: 'korjaus', label: 'Korjaus', category: CATEGORIES.KORJAUS }
    ]
  },
  {
    id: 'parameter',
    label: 'Parametrit',
    contentType: CONTENT_TYPES.PARAMETER,
    categories: [
      { id: 'all-parameter', label: 'Kaikki parametrit', category: null },
      { id: 'values', label: 'Parametriarvot', category: CATEGORIES.PARAMETER_VALUES }
    ]
  },
]
