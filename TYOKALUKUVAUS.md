Konfiguraatiopalvelun käyttöliittymän suunnittelu

Tämän työpajan tavoitteena on suunnitella uusi käyttöliittymä, jonka avulla te voitte itse ylläpitää järjestelmän asetuksia ja tekstejä

Käyttöliittymän on tarkoitus tukea arjen tarpeitanne, kuten:

- tekstien ja viestipohjien muokkaamista
- päätöstekstien ylläpitoa
- tarkistus- ja ohjetekstien päivittämistä
- erilaisten arvojen ja asetusten hallintaa

Työpajassa emme keskity tekniikkaan. Emme puhu järjestelmäarkkitehtuurista tai toteutustavoista, vaan teidän työstänne:

- mitä teette nyt
- mikä on hankalaa
- missä on riskejä
- mikä auttaisi teitä toimimaan sujuvammin

Jotta työpajasta saadaan mahdollisimman hyödyllinen, pyydämme teitä pohtimaan alla olevia kysymyksiä etukäteen.

Kysymykset pohdittavaksi

1. Mitä te nykyään joudutte muuttamaan?

Miettikää konkreettisia esimerkkejä viimeisen 6–12 kuukauden ajalta.

- Mitä tekstejä tai sisältöjä on pitänyt muuttaa?
- Kuinka usein näitä muutoksia tapahtuu?
- Millaisia muutokset yleensä ovat:
  - pieniä sanamuutoksia
  - kokonaan uusia tekstejä
  - vanhojen tekstien korvaamista

Pohdittavaksi:

- Onko muutoksia, joita ei uskalleta tehdä helposti virheriskin takia?

Kirjatkaa ylös muutama todellinen esimerkki.

2. Milloin muutos on kiireellinen?

Kaikki muutokset eivät ole samanlaisia.

Miettikää:

- Mitkä muutokset pitäisi saada voimaan välittömästi?
- Mitkä voivat odottaa?
- Onko tilanteita, joissa muutos pitäisi tehdä etukäteen, mutta sen tulisi astua voimaan vasta myöhemmin?

3. Mitä voi mennä pieleen?


Miettikää:

- Mitä seurauksia väärällä tekstillä tai asetuksella voi olla?
- Mitkä muutokset ovat "herkkiä" tai korkean riskin muutoksia?
- Missä tilanteissa pitäisi pystyä palaamaan nopeasti takaisin vanhaan versioon?

4. Kuka saa tehdä mitä?


- Kuka yleensä kirjoittaa tai muokkaa tekstiä?
- Kuka tarkistaa tai hyväksyy sen?
- Onko asioita, joita yksi henkilö ei saisi muuttaa yksin?

Lisäksi:

- Onko teillä jo sovittuja käytäntöjä tähän?
- Vai tapahtuuko tämä tällä hetkellä epävirallisesti?

5. Mistä tiedätte, että muokkaatte oikeaa asiaa?

Ajatelkaa tilannetta, jossa järjestelmässä on paljon tekstejä ja asetuksia.

- Miten tunnistatte oikean tekstin tai sisällön?
- Mistä tiedätte, missä kohtaa prosessia se näkyy?
- Onko samanlaisia tekstejä, jotka menevät helposti sekaisin?

Pohdittavaksi:

- Auttaisiko, jos näkisi esimerkin siitä, miltä teksti näyttää asiakkaalle?

6. Mitä järjestelmän ei pitäisi antaa tehdä?

- Onko asioita, joita ei pitäisi voida muuttaa lainkaan?
- Onko asioita, jotka pitäisi olla suojattuja tai piilossa?
- Onko sisältöä, jonka muuttaminen vaatii aina erityisen syyn?

7. Jos saisitte toivoa vapaasti

- Mikä tekisi työstäne helpompaa?
- Mikä nykyisessä tavassa on raskasta tai turhauttavaa?
- Mikä olisi pieni asia, joka säästäisi aikaa joka viikko?

---

Työkalun kuvaus – mitä voisi olla mahdollista?

Alla on kuvaus työkalusta, joka voisi vastata yllä oleviin tarpeisiin. Tämä on alustava ehdotus, joka muokataan työpajassa yhdessä.

Konfiguraatiopalvelu on hallintatyökalu, jonka avulla liiketoimintakäyttäjät voivat ylläpitää ja muokata järjestelmän sisältöjä itsenäisesti ilman teknistä osaamista. Työkalu mahdollistaa turvallisen, hallitun ja jäljitettävän muutosten tekemisen.

Työkalu tarjoaa mahdollisuuden tehdä muutoksia ilman kehittäjien apua, varmistaa turvallisuuden vaatimalla että kaikki muutokset kulkevat tarkistusprosessin läpi ennen julkaisua, mahdollistaa jäljitettävyyden tallentamalla jokaisen muutoksen historiaan ja sen palauttamisen tarvittaessa, sekä tarjoaa hallitun julkaisun muutosten ajastamisen ja vaatimalla muutosperustelun.

Mitä sisältöjä työkalulla voidaan hallita?

Työkalu tukee erilaisia sisällöntyyppejä. Esimerkkejä sisällöistä voivat olla:

- Tekstisisällöt, kuten ohjeet, tarkistustekstit tai virheilmoitukset
- Viestipohjat, kuten asiakkaalle lähetettävät sähköpostit tai tekstiviestit
- Päätöspohjat, kuten automaattisesti generoitavat päätökset
- Parametrit, kuten raja-arvot, prosenttiosuudet tai muut konfiguraatioarvot
- Rakenteelliset tiedot, kuten lomakkeiden määrittelyt tai prosessien asetukset

Jokaiselle sisällöntyypille on oma editori, joka on räätälöity kyseisen sisällön muokkaamiseen. Esimerkiksi tekstisisällöille on tekstieditori, parametreille on lomake jossa voidaan syöttää numeroita ja tarkistaa että arvot ovat sallittujen rajojen sisällä.

Sisällöt voidaan organisoida kategorioihin, jotka auttavat löytämään oikean sisällön nopeasti.

Miten työnkulku toimii?

Kaikki muutokset kulkevat turvallisen prosessin läpi:

1. Luonnos

Uusi sisältö luodaan aina luonnoksena. Luonnosta voi muokata vapaasti, ja se ei näy asiakkaalle ennen julkaisua. Tämä antaa mahdollisuuden työstää sisältöä rauhassa ja testata sitä ennen julkaisua.

2. Tarkistus (valinnainen)

Luonnos voidaan lähettää tarkistettavaksi ennen julkaisua. Tarkistuspyyntö vaatii muutosperustelun, joka selittää miksi muutos tehdään. Tarkistuksessa oleva sisältö näkyy erityisellä merkillä, jotta se on helppo tunnistaa.

3. Julkaisu

Julkaisu vaatii muutosperustelun, joka tallennetaan historiaan. Julkaisu voidaan tehdä välittömästi tai ajastaa tulevaisuuteen. Ajastettu julkaisu näkyy luonnoksessa erityisellä merkillä, jotta on helppo nähdä milloin muutos astuu voimaan.

4. Palautus

Julkaistun sisällön voi palauttaa aiempaan versioon tarvittaessa. Palautus on mahdollista rajoitetun ajan sisällä julkaisun jälkeen, ja se vaatii myös muutosperustelun.

Mitä ominaisuuksia palvelussa voisi olla?

Sisällön hallinta

Työkalulla voi luoda uusia sisältöjä, kopioida olemassa olevia sisältöjä pohjaksi uusien luomiseen, arkistoida sisältöjä piilottamalla ne normaalista näkymästä, sekä poistaa sisältöjä pysyvästi tarvittaessa.

Muokkaus ja tarkistus

Esikatselutoiminnolla voi nähdä miltä sisältö näyttää asiakkaalle ennen julkaisua. Versiovertailulla voi vertailla eri versioita keskenään nähdäkseen mitä on muuttunut. Versiohistoriassa näkyvät kaikki aiemmat versiot ja niiden muutokset. Muutosperustelu on pakollinen selitys jokaiselle julkaisulle ja tarkistuspyynnölle.

Ajastus

Julkaisun voi ajastaa tulevaisuuteen määrittämällä päivämäärän ja kellonajan, jolloin muutos astuu voimaan. Ajastettu julkaisu näkyy luonnoksessa erityisellä merkillä, jotta on helppo nähdä milloin muutos tulee voimaan.

Monikielisyys

Sisällöt voidaan ylläpitää useilla kielillä. Jokainen kieli voidaan julkaista erikseen, ja kieliä voi muokata ja julkaista itsenäisesti. Tämä mahdollistaa esimerkiksi sen, että suomenkielinen versio julkaistaan heti, mutta ruotsinkielinen versio julkaistaan vasta kun se on valmis.

Dynaamiset muuttujat

Joissain sisällöissä, kuten viestipohjissa tai päätöspohjissa, voidaan käyttää dynaamisia muuttujia. Muuttujat täyttyvät automaattisesti, kun sisältö näytetään asiakkaalle. Esimerkiksi muuttuja asiakkaan nimelle täyttyy automaattisesti oikealla arvolla.

Työkalu varoittaa, jos käytetään virheellistä muuttujaa, ja ehdottaa oikeaa muuttujaa, jos kirjoitusvirhe on todennäköinen. Tämä auttaa välttämään virheitä ja varmistaa että sisältö toimii oikein.

Ehdotus sisällön organisoinnista:

Sisällöt on järjestetty vasemman reunan navigaatiossa.

Pääryhmät

Sisällöt voidaan organisoida pääryhmiin, jotka edustavat eri sisällöntyyppejä tai käyttötarkoituksia. Esimerkkejä voivat olla viestit, ohjeet, päätökset tai parametrit

Alaryhmät

Jokaisella pääryhmällä voi olla alakategorioita, jotka auttavat löytämään oikean sisällön nopeasti. Alakategoriat voivat olla esimerkiksi eri viestityypit, eri prosessivaiheet tai eri etuusmuodot.

Haku ja suodatus

Työkalulla voi etsiä sisältöjä otsikon, avaimen tai sisällön perusteella. Tilan suodatuksella voi näyttää vain luonnokset, julkaistut tai tarkistuksessa olevat sisällöt. Arkistoidut sisällöt voidaan näyttää erillisessä näkymässä.

Työkalun käyttöliittymä

Työkalu on jaettu kolmeen osaan, jotka auttavat hahmottamaan ja muokkaamaan sisältöjä:

Vasen paneeli – Navigaatio

Vasemman reunan paneeli näyttää kaikki sisältöryhmät ja kategoriat. Se auttaa hahmottamaan, mitä sisältöjä järjestelmässä on ja missä ne sijaitsevat. Valitsemalla ryhmän tai kategorian näet vain kyseiseen ryhmään kuuluvat sisällöt.

Keskimmäinen paneeli – Sisältölista

Keskimmäinen paneeli näyttää valitun kategorian sisällöt listana. Jokainen sisältö näytetään otsikolla, tunnisteella ja tilalla, joka kertoo onko sisältö luonnos, julkaistu vai tarkistuksessa. Valitsemalla sisällön listasta se avautuu oikeaan editoriin. Lista päivittyy automaattisesti, kun käytät hakua tai suodattimia.

Oikea paneeli – Editori

Oikea paneeli on editori, jossa muokataan valittua sisältöä. Editori näyttää selkeästi, onko sisältö luonnos vai julkaistu, ja tarjoaa toiminnot julkaisemiseen, luonnoksen tallentamiseen ja tarkistuspyynnön lähettämiseen. Editorissa on myös aputoiminnot, kuten esikatselu, historia ja versiovertailu.

Turvallisuus ja hallinta

Muutosperustelu

Jokainen julkaisu ja tarkistuspyyntö vaatii muutosperustelun, joka selittää miksi muutos tehdään. Muutosperustelu tallennetaan historiaan, jotta voidaan jäljittää miksi muutoksia on tehty ja milloin. Tämä auttaa ymmärtämään muutosten taustaa ja varmistaa että muutokset ovat perusteltuja.

Versiohistoria

Kaikki muutokset tallennetaan automaattisesti historiaan. Historia näyttää kuka teki muutoksen, milloin muutos tehtiin, mikä versio on kyseessä ja onko versio julkaistu vai luonnos. Aiempiin versioihin voi palata tarvittaessa, mikä mahdollistaa virheiden korjaamisen tai aiemman version palauttamisen.

Audit trail

Kaikki muutokset ja tilanmuutokset tallennetaan audit trail -näkymään. Tämä näyttää koko muutoshistorian yhdellä katsauksella, mukaan lukien kaikki siirtymät luonnoksesta tarkistukseen ja tarkistuksesta julkaisuun. Tämä auttaa jäljittämään mitä on tapahtunut ja kuka on tehnyt muutokset, mikä on tärkeää turvallisuuden ja vastuun kannalta.

Käyttöesimerkkejä

Esimerkki 1: Uuden sisällön luominen

1. Valitse vasemmalta navigaatiosta haluamasi sisältöryhmä ja kategoria
2. Klikkaa "Luo uusi sisältökohde" -painiketta
3. Täytä sisällön tiedot editorissa
4. Tarkista esikatselusta, miltä sisältö näyttää
5. Tallenna luonnoksena
6. Kun olet tyytyväinen, pyydä tarkistusta tai julkaise suoraan
7. Kirjoita muutosperustelu, joka selittää miksi muutos tehdään

Esimerkki 2: Olemassa olevan sisällön muuttaminen

1. Valitse vasemmalta navigaatiosta haluamasi sisältöryhmä ja kategoria
2. Etsi haluamasi sisältö listasta
3. Valitse sisältö klikkaamalla sitä
4. Muokkaa sisältöä editorissa
5. Tarkista muutokset esikatselusta
6. Tallenna luonnoksena
7. Julkaise muutos muutosperustelun kera

Esimerkki 3: Aiemman version palauttaminen

1. Valitse sisältö, jonka haluat palauttaa
2. Klikkaa "Historia" -painiketta
3. Selaa historiaa ja valitse haluamasi versio
4. Klikkaa "Palauta" -painiketta
5. Kirjoita muutosperustelu, joka selittää miksi versio palautetaan
6. Vahvista palautus

Esimerkki 4: Ajastettu julkaisu

1. Valitse ja muokkaa sisältöä normaalisti
2. Tallenna luonnoksena
3. Klikkaa "Ajasta julkaisu" -painiketta
4. Valitse päivämäärä ja kellonaika, jolloin muutos astuu voimaan
5. Kirjoita muutosperustelu
6. Vahvista ajastus

Ajastettu julkaisu näkyy luonnoksessa erityisellä merkillä, jotta on helppo nähdä milloin muutos tulee voimaan.


