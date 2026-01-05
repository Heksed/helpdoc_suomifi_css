# Editor Shell - Hierarkia ja Laajennettavuus

## Hierarkian rakenne

Editor Shell käyttää **kaksitasoista hierarkiaa** sisällön organisointiin:

### Ylätaso: Content Type (Editorityyppi)
Määrittää **minkä tyyppinen editori** käytetään itemin muokkaamiseen:

- **Text** - Tekstisisällöt (TextEditor)
- **Template** - Viestipohjat (TemplateEditor)
- **Parameter** - Parametrimaiset arvot (ParameterEditor)
- **Structure** - Rakenteelliset tiedot (StructureEditor)

### Alataso: Category (Kategoria)
Ryhmittelee sisällön **luonteen mukaan** saman editorityypin sisällä:

- **Message Templates** - Viestipohjat (Text)
- **Review Texts** - Tarkistus- ja tehtävätekstit (Text)
- **Guide Texts** - Ohje- ja virhetekstit (Text)
- **Decision Templates** - Päätöspohjat (Template)
- **Parameter Values** - Parametrimaiset arvot (Parameter)

## Miksi kaksitasoinen hierarkia?

### 1. Editorityypin määritys
Content Type määrittää suoraan minkä editori-komponentin käytetään. Tämä on tekninen valinta joka vaikuttaa käyttöliittymään.

### 2. Sisällön ryhmittely
Category mahdollistaa loogisen ryhmittelyn saman editorityypin sisällä. Käyttäjät voivat ajatella "mitä asiaa olen muokkaamassa" ilman että heidän tarvitsee tietää teknisiä yksityiskohtia.

### 3. Joustavuus
- Sama editorityyppi voi olla useissa kategorioissa
- Kategoriat voidaan muuttaa ilman että editorityyppi muuttuu
- Uusia kategorioita voidaan lisätä helposti

## Tarvitaanko vielä ylätaso?

**Ei tarvita.** Kaksitasoinen hierarkia on riittävä:

### Nykyinen rakenne riittää:
- Content Type määrittää editorityypin (tekninen)
- Category ryhmittelee sisällön (liiketoiminnallinen)
- Vasemman reunan paneeli tukee kaksitasoista navigaatiota

### Kolmitasoinen hierarkia olisi liian monimutkainen:
- Vaikeuttaisi navigaatiota
- Lisäisi kognitiivista kuormaa
- Ei tarjoa selkeää lisäarvoa

### Jos tarvetta tulee:
Jos tulevaisuudessa tarvitaan vielä ylempi taso (esim. "Domain" tai "Area"), se voidaan lisätä:
- **Ylätaso**: Domain/Area (esim. "Hakemuksen käsittely", "Tarkistukset")
- **Keskitaso**: Content Type
- **Alataso**: Category

Mutta tämä olisi vasta kun selviää että kaksitasoinen hierarkia ei riitä.

## Laajennettavuus

### Uusien editorityyppien lisääminen:
1. Lisää uusi CONTENT_TYPE `mockData.js`:ään
2. Luo uusi editori-komponentti `editors/`-kansioon
3. Lisää case `RightEditor.jsx`:ään

### Uusien kategorioiden lisääminen:
1. Lisää uusi CATEGORY `mockData.js`:ään
2. Lisää kategoria `categoryGroups`-objektiin oikeaan content typeen
3. Päivitä mock-data itemit käyttämään uutta kategoriaa

### Uusien ryhmittelylogiikkojen lisääminen:
Vasemman reunan paneeli voidaan laajentaa tukemaan:
- Prosessipohjaista ryhmittelyä
- Riskipohjaista ryhmittelyä
- Ylläpidonäkökulmaa

Nämä voidaan toteuttaa vaihtamalla `contentTypeGroups` ja `categoryGroups` -tietorakenteet.

## Toteutus

### Tiedostorakenne:
```
src/
  components/
    editors/
      TextEditor.jsx
      TemplateEditor.jsx
      ParameterEditor.jsx
      StructureEditor.jsx
    LeftRail.jsx (kaksitasoinen navigaatio)
    RightEditor.jsx (editori-valinta)
  data/
    mockData.js (hierarkian määrittely)
```

### Tietomalli:
```javascript
{
  contentType: CONTENT_TYPES.TEXT,  // Ylätaso
  category: CATEGORIES.MESSAGE_TEMPLATES,  // Alataso
  // ... muut kentät
}
```

## Yhteenveto

**Kaksitasoinen hierarkia on optimaalinen:**
- ✅ Selkeä ja ymmärrettävä
- ✅ Riittävän joustava
- ✅ Helppo laajentaa
- ✅ Ei liian monimutkainen

**Ei tarvita kolmatta tasoa** ellei selkeää liiketoiminnallista tarvetta tule esiin.
