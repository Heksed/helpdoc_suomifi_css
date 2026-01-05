1) Editorin tarkoitus (kontekstikuvaus)

Editor Shell on liiketoimintakäyttäjille tarkoitettu hallintanäkymä, jonka avulla he voivat ylläpitää ja muokata järjestelmän konfiguraatiosisältöjä ilman teknistä osaamista.

Editorin ensisijainen tarkoitus on:

mahdollistaa tekstien, pohjien ja parametrien hallinta turvallisesti

vähentää riippuvuutta teknisistä julkaisuista ja kehittäjistä

varmistaa, että muutokset ovat hallittuja, jäljitettäviä ja palautettavia

Editor ei ole vain lomake, vaan:

sisällön elinkaaren hallintatyökalu (luonnos → tarkistus → julkaisu)

kontekstuaalinen editori, joka kertoo käyttäjälle:

mitä he ovat muokkaamassa

missä sitä käytetään

milloin muutos astuu voimaan

turvallinen muutosympäristö, jossa virheiden riskiä minimoidaan previewn, validointien ja roolien avulla

Teknisesti editori on rakennettu geneeriseksi kuoreksi, johon voidaan liittää eri tyyppisiä editoreita (teksti, pohja, parametri, rakenne) ilman että käyttöliittymän perusrakenne muuttuu.

2) Editor Shellin rakenne – miksi tämä malli

Vasen paneeli
→ auttaa käyttäjää hahmottamaan mitä kokonaisuutta hän on muokkaamassa

Keskipaneeli
→ vastaa kysymykseen mikä yksittäinen asia on valittuna

Oikea editori
→ keskittyy yhteen asiaan kerrallaan: muokkaus, tarkistus, julkaisu

Tämä malli tukee:

suuria sisältömääriä

eritasoisia käyttäjiä

myöhempää laajennettavuutta (uudet sisältötyypit)

3) Vasemman reunan paneeli – arvioivia esimerkkejä sisällöistä

⚠️ Nämä eivät ole lopullisia nimiä tai rakenteita, vaan suunnitteluarvioita, jotka pohjautuvat keskusteluumme ja tyypillisiin konfiguraatiopalveluihin.

Mahdollinen ryhmittelylogiikka 1: Sisällön luonteen mukaan

Parametrimaiset arvot

Tekstisisällöt

Viestipohjat

Päätöspohjat

Tarkistus- ja tehtävätekstit

Ohje- ja virhetekstit

➡️ Hyvä, jos käyttäjät ajattelevat “mitä asiaa olen muokkaamassa”.

Mahdollinen ryhmittelylogiikka 2: Prosessin tai käyttökohteen mukaan

Hakemuksen käsittely

Tarkistukset

Päätöksenteko

Viestintä asiakkaalle

Maksatus / jatkotoimet

➡️ Hyvä, jos käyttäjät ajattelevat “missä kohtaa prosessia tämä näkyy”.

Mahdollinen ryhmittelylogiikka 3: Muutoksen riskin tai luonteen mukaan

Korkean riskin sisällöt
(päätöstekstit, lakiviittaukset)

Usein muuttuvat sisällöt
(viestit, ohjetekstit)

Harvoin muuttuvat asetukset
(raja-arvot, parametrit)

➡️ Hyvä, jos halutaan ohjata käyttäjää varovaisuuteen.

Mahdollinen ryhmittelylogiikka 4: Ylläpidon näkökulma

Luonnokset

Julkaistut

Ajastetut muutokset

Äskettäin muutetut

Odottaa hyväksyntää

➡️ Hyvä, jos editoria käytetään päivittäin operatiivisesti.

4) Miten tämä näkyy UI:ssa (ilman lukitsemista)

Vasemman reunan paneelin rooli on:

tarjota raamit ja suunta, ei kaikkia yksityiskohtia

toimia ensisijaisena suodattimena / kontekstinvaihtajana

olla helposti muutettavissa, kun työpajoissa oikea malli selviää

Siksi:

alkuvaiheessa se voi sisältää vain nimettömiä tai geneerisiä ryhmiä

lopulliset otsikot ja rakenteet päätetään vasta liiketoiminnan kanssa




Build a neutral Editor Shell UI for a configuration service using React.
The project already includes suomi.fi design system CSS globally.
Do NOT create any new CSS files, classes, or inline styles.
Use only semantic HTML and existing suomi.fi styles.

Layout requirements

Create a full-height application shell with:

Top header

Contains:

Application title (generic, e.g. “Editor”)

Selected item information (title + status)

Action buttons (Save, Publish) as placeholders

Main content area divided into three columns:

Left column (navigation rail)

Acts as a placeholder navigation

Do NOT name or label sections

Render a vertical list of neutral buttons or list items

Purpose is structural only; content will be defined later

Middle column (list view)

Contains:

Search input

Placeholder filter/sort actions

Scrollable list of items

Items show:

Title

Key or identifier

Status (draft / published)

Selecting an item highlights it and opens it in the editor panel

Right column (editor panel)

Shows:

Selected item header (title + key)

Action bar (Save draft, Request review, Publish)

Generic editable area (textarea or form placeholder)

Placeholder buttons for Preview, Compare, History

No domain-specific editor logic yet

Functional requirements

Use local mock data (array in code) for list items

Keep state locally (useState)

Selecting an item updates the editor panel

Search filters the middle list

No routing needed

No backend calls

Technical constraints

React functional components only

No external UI libraries

No custom CSS or inline styles

Rely on:

semantic HTML (header, nav, main, section, aside, ul, li, button, input, etc.)

suomi.fi CSS already present in the project

File structure

Create components with clear separation:

AppShell

ShellLayout

HeaderBar

LeftRail

MiddleList

RightEditor

Keep naming neutral; do NOT introduce domain or category names.

Important

Do NOT invent navigation labels or section names

Do NOT assume final content structure

The goal is a stable editor shell that can later host different editor plugins

When finished, ensure the UI:

Feels consistent with suomi.fi styling

Is readable and usable without any custom CSS

Can be extended later without restructuring the layout