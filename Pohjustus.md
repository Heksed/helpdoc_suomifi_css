Perustyylit (fontti, värit, typografia)
/* 1) Suomi.fi-fontti käyttöön :contentReference[oaicite:0]{index=0} */
@import url('https://designsystem.suomi.fi/fonts/source-sans-pro.css');

/* 2) Token-tyyliset muuttujat suomi.fi-väreille :contentReference[oaicite:1]{index=1} */
.helpdoc-suomifi {
  --fi-color-brand-base: #003479;      /* brandBase */
  --fi-color-text: #212121;            /* blackBase */
  --fi-color-depth-base: #a5acb1;      /* depthBase */
  --fi-color-depth-light-1: #c8cdd0;   /* depthLight1 */
  --fi-color-depth-light-3: #f7f7f8;   /* depthLight3 */
  --fi-color-highlight-base: #2a6ebb;  /* highlightBase */
  --fi-color-highlight-light-2: #d5e4f6; /* highlightLight2 */
  --fi-color-success-base: #09a580;    /* successBase */
  --fi-color-warning-base: #f6af09;    /* warningBase */
  --fi-color-alert-base: #ae332d;      /* alertBase */
  --fi-color-accent-base: #e86717;     /* accentBase */

  font-family: 'Source Sans Pro', 'Helvetica Neue', Arial, sans-serif;
  color: var(--fi-color-text);
  background-color: #ffffff;
  line-height: 1.6;
}

/* Sivun yleismarginaali (voit muokata) */
.helpdoc-suomifi {
  padding: 24px 32px;
}

/* Otsikot */

.helpdoc-suomifi h1 {
  font-size: 2.25rem;
  font-weight: 300;
  color: var(--fi-color-brand-base);
  margin: 0 0 0.75rem;
}

.helpdoc-suomifi h2 {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 1.75rem 0 0.75rem;
}

.helpdoc-suomifi h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 1.5rem 0 0.5rem;
}

/* Teksti & linkit */

.helpdoc-suomifi p,
.helpdoc-suomifi li {
  font-size: 1rem;
  color: var(--fi-color-text);
}

.helpdoc-suomifi a {
  color: var(--fi-color-highlight-base);
  text-decoration: underline;
}

.helpdoc-suomifi a:hover,
.helpdoc-suomifi a:focus {
  color: #235a9a; /* highlightDark1 */
}

/* Horizontal rule kuten kuvassa */
.helpdoc-suomifi hr {
  border: 0;
  border-top: 1px solid var(--fi-color-depth-light-1);
  margin: 24px 0;
}

2. Paneelit (Info / Warning / Error / Success / Note)

Oleta että HTML:ssä on rakenne tyyliin:

<div class="helpdoc-panel helpdoc-panel--info">
  <div class="helpdoc-panel__icon">i</div>
  <div class="helpdoc-panel__content">
    <strong>Info panel</strong><br>
    Kahdella rivillä
  </div>
</div>


CSS:

.helpdoc-suomifi .helpdoc-panel {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  background-color: #ffffff;
  border-radius: 4px;
  border: 1px solid var(--fi-color-depth-light-1);
  box-shadow: 0 1px 3px rgba(0,0,0,0.04);
  padding: 12px 16px;
  margin: 0 0 8px;
}

/* Yläreunan värillinen viiva */
.helpdoc-suomifi .helpdoc-panel::before {
  content: "";
  position: absolute;
}

/* jos et halua absolutea, tee näin: */
.helpdoc-suomifi .helpdoc-panel {
  border-top-width: 4px;
  border-top-style: solid;
}

/* Variantit liikennevalo- ja brandiväreillä :contentReference[oaicite:2]{index=2} */
.helpdoc-suomifi .helpdoc-panel--info {
  border-top-color: var(--fi-color-highlight-base);
}

.helpdoc-suomifi .helpdoc-panel--warning {
  border-top-color: var(--fi-color-warning-base);
}

.helpdoc-suomifi .helpdoc-panel--error {
  border-top-color: var(--fi-color-alert-base);
}

.helpdoc-suomifi .helpdoc-panel--success {
  border-top-color: var(--fi-color-success-base);
}

.helpdoc-suomifi .helpdoc-panel--note {
  border-top-color: var(--fi-color-accent-base);
}

/* Ikoniympyrä vasemmassa laidassa */

.helpdoc-suomifi .helpdoc-panel__icon {
  flex: 0 0 auto;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #ffffff;
}

.helpdoc-suomifi .helpdoc-panel--info .helpdoc-panel__icon {
  background-color: var(--fi-color-highlight-base);
}

.helpdoc-suomifi .helpdoc-panel--warning .helpdoc-panel__icon {
  background-color: var(--fi-color-warning-base);
}

.helpdoc-suomifi .helpdoc-panel--error .helpdoc-panel__icon {
  background-color: var(--fi-color-alert-base);
}

.helpdoc-suomifi .helpdoc-panel--success .helpdoc-panel__icon {
  background-color: var(--fi-color-success-base);
}

.helpdoc-suomifi .helpdoc-panel--note .helpdoc-panel__icon {
  background-color: var(--fi-color-accent-base);
}

.helpdoc-suomifi .helpdoc-panel__content {
  flex: 1 1 auto;
  font-size: 0.95rem;
}

3. Taulukko (kuten kuvassa: sininen header)
.helpdoc-suomifi table {
  width: 100%;
  border-collapse: collapse;
  margin: 12px 0 8px;
  font-size: 0.95rem;
}

.helpdoc-suomifi th,
.helpdoc-suomifi td {
  border: 1px solid var(--fi-color-depth-light-1);
  padding: 8px 12px;
  text-align: left;
}

/* Header-osa: brand-sininen tausta, valkoinen teksti */
.helpdoc-suomifi th {
  background-color: var(--fi-color-brand-base);
  color: #ffffff;
  font-weight: 600;
}

4. Koodilohko ja “This is code” -napit
/* Inline-koodi */
.helpdoc-suomifi code {
  font-family: "SFMono-Regular", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.9rem;
  background-color: var(--fi-color-depth-light-3);
  padding: 2px 4px;
  border-radius: 2px;
}

/* Monirivinen code-block */
.helpdoc-suomifi pre {
  font-family: inherit;
  font-size: 0.9rem;
  background-color: var(--fi-color-depth-light-3);
  padding: 8px 12px;
  border-radius: 2px;
  border: 1px solid var(--fi-color-depth-light-1);
  overflow-x: auto;
}

5. Expander-header (accordion-otsikko)
/* Rakenne:
<div class="helpdoc-expander">
  <button class="helpdoc-expander__header">
    This is an expander header
    <span class="helpdoc-expander__chevron">▾</span>
  </button>
  <div class="helpdoc-expander__content">...</div>
</div>
*/

.helpdoc-suomifi .helpdoc-expander {
  border: 1px solid var(--fi-color-depth-light-1);
  border-radius: 4px;
  margin: 8px 0 12px;
}

.helpdoc-suomifi .helpdoc-expander__header {
  width: 100%;
  background-color: #ffffff;
  border: none;
  padding: 10px 14px;
  font-size: 1rem;
  text-align: left;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
}

.helpdoc-suomifi .helpdoc-expander__header:focus-visible {
  outline: 3px solid #1a99c7; /* accentSecondary / focus :contentReference[oaicite:3]{index=3} */
  outline-offset: 2px;
}

.helpdoc-suomifi .helpdoc-expander__chevron {
  font-size: 0.9rem;
  color: var(--fi-color-depth-base);
}

.helpdoc-suomifi .helpdoc-expander__content {
  padding: 10px 14px 12px;
  border-top: 1px solid var(--fi-color-depth-light-1);
}

6. Status-badge (sininen “STATUS IS PENDING”)
/* <span class="helpdoc-status helpdoc-status--pending">STATUS IS PENDING</span> */

.helpdoc-suomifi .helpdoc-status {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  text-transform: uppercase;
}

/* sininen tila */
.helpdoc-suomifi .helpdoc-status--pending {
  background-color: var(--fi-color-highlight-base);
  color: #ffffff;
}

/* halutessa vihreä onnistumiselle */
.helpdoc-suomifi .helpdoc-status--success {
  background-color: var(--fi-color-success-base);
  color: #ffffff;
}

7. Listat ja checkboxit

Confluencen HTML tuottaa listat ja checkbox-rivit valmiiksi, joten pelkkä pieni siistiminen riittää:

.helpdoc-suomifi ul,
.helpdoc-suomifi ol {
  padding-left: 1.4rem;
  margin: 0.4rem 0 0.4rem;
}

/* Action item -rivi (task list) */
.helpdoc-suomifi .helpdoc-task {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin: 4px 0;
}

.helpdoc-suomifi .helpdoc-task input[type="checkbox"] {
  margin-top: 2px;
}
