Placeholder-muuttujat (insert + validate + preview)
1) Lisää placeholder-formaatti ja sääntö

Käytä placeholder-muotoa: {{variableKey}}

variableKey tulee whitelististä (valmiiksi määritelty lista)

Käyttäjä voi kirjoittaa placeholderin käsin, mutta editori:

validoi sen listaa vasten

näyttää virheen, jos placeholder ei ole sallittu

2) Luo tiedostot ja tyypit

Luo tiedostot:

src/features/configShell/variables/variableCatalog.ts

src/features/configShell/variables/placeholder.ts

src/features/configShell/components/VariablePicker.tsx

src/features/configShell/components/PreviewPanel.tsx

Päivitä tyyppi:

src/features/configShell/types.ts → lisää kenttä content?: string (mockin editoritekstiä varten)

3) Tee whitelist-katalogi (ei luontia editorissa)

Tiedosto: src/features/configShell/variables/variableCatalog.ts

export type VariableDef = {
  key: string; // Used in {{key}}
  label: string; // Human-friendly label for picker
  description?: string; // Optional help text
  exampleValue: string; // Used in preview
};

/**
 * Variable catalog is read-only in this editor.
 * Users can only insert variables from this whitelist.
 */
export const VARIABLE_CATALOG: VariableDef[] = [
  { key: "customerName", label: "Customer name", exampleValue: "Matti Meikäläinen" },
  { key: "customerId", label: "Customer ID", exampleValue: "123456-7" },
  { key: "caseId", label: "Case ID", exampleValue: "CASE-2025-00012" },
  { key: "decisionDate", label: "Decision date", exampleValue: "28.12.2025" },
  { key: "amount", label: "Amount", exampleValue: "123,45 €" },
  { key: "dueDate", label: "Due date", exampleValue: "15.01.2026" },
];


✅ Tärkeää: katalogi on kovakoodattu mockina nyt. Myöhemmin tämä haetaan API:sta, mutta editori ei salli luontia.

4) Placeholder-utils: parse, validate, render preview

Tiedosto: src/features/configShell/variables/placeholder.ts

import { VariableDef } from "./variableCatalog";

const PLACEHOLDER_REGEX = /\{\{([a-zA-Z0-9_.-]+)\}\}/g;

export type PlaceholderMatch = {
  raw: string; // e.g. "{{customerName}}"
  key: string; // e.g. "customerName"
  index: number; // start index in text
};

export function extractPlaceholders(text: string): PlaceholderMatch[] {
  const matches: PlaceholderMatch[] = [];
  if (!text) return matches;

  let m: RegExpExecArray | null;
  while ((m = PLACEHOLDER_REGEX.exec(text)) !== null) {
    matches.push({
      raw: m[0],
      key: m[1],
      index: m.index,
    });
  }
  return matches;
}

export type PlaceholderValidation = {
  unknownKeys: string[];
  allKeys: string[];
};

export function validatePlaceholders(text: string, allowed: VariableDef[]): PlaceholderValidation {
  const allowedSet = new Set(allowed.map((v) => v.key));
  const found = extractPlaceholders(text).map((p) => p.key);
  const uniqueFound = Array.from(new Set(found));

  const unknownKeys = uniqueFound.filter((k) => !allowedSet.has(k));
  return { unknownKeys, allKeys: uniqueFound };
}

export function renderPreview(text: string, allowed: VariableDef[]): string {
  const exampleMap = new Map(allowed.map((v) => [v.key, v.exampleValue]));

  return (text ?? "").replace(PLACEHOLDER_REGEX, (_full, key: string) => {
    // If unknown, keep placeholder as-is to make the issue visible.
    return exampleMap.get(key) ?? `{{${key}}}`;
  });
}

/**
 * Inserts "{{key}}" into text at the current cursor position in a textarea.
 */
export function insertPlaceholderAtCursor(args: {
  text: string;
  textarea: HTMLTextAreaElement | null;
  key: string;
}): { nextText: string; nextCursor: number } {
  const { text, textarea, key } = args;
  const token = `{{${key}}}`;

  if (!textarea) {
    const nextText = (text ?? "") + token;
    return { nextText, nextCursor: nextText.length };
  }

  const start = textarea.selectionStart ?? text.length;
  const end = textarea.selectionEnd ?? text.length;

  const before = text.slice(0, start);
  const after = text.slice(end);
  const nextText = `${before}${token}${after}`;
  const nextCursor = start + token.length;

  return { nextText, nextCursor };
}

5) VariablePicker-komponentti (valitse ja lisää)

Tiedosto: src/features/configShell/components/VariablePicker.tsx

import React, { useMemo, useState } from "react";
import { VariableDef } from "../variables/variableCatalog";

type VariablePickerProps = {
  variables: VariableDef[];
  onInsert: (key: string) => void;
};

/**
 * VariablePicker allows selecting from an approved whitelist.
 * Users cannot create new variables here.
 */
export default function VariablePicker({ variables, onInsert }: VariablePickerProps) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return variables;
    return variables.filter((v) => (v.label + " " + v.key).toLowerCase().includes(query));
  }, [q, variables]);

  return (
    <section aria-label="Variables">
      <div>
        <label>
          Variable search
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search variables..." />
        </label>
      </div>

      <ul>
        {filtered.map((v) => (
          <li key={v.key}>
            <button type="button" onClick={() => onInsert(v.key)} aria-label={`Insert ${v.label}`}>
              Insert
            </button>
            <div>
              <div>{v.label}</div>
              <div>
                <code>{`{{${v.key}}}`}</code>
              </div>
              {v.description && <div>{v.description}</div>}
            </div>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && <div>No variables found.</div>}
    </section>
  );
}


Ei tyylejä. Suomi.fi CSS hoitaa perusulkoasun.

6) PreviewPanel (näytä renderöity esimerkillä)

Tiedosto: src/features/configShell/components/PreviewPanel.tsx

import React, { useMemo } from "react";
import { VariableDef } from "../variables/variableCatalog";
import { renderPreview } from "../variables/placeholder";

type PreviewPanelProps = {
  text: string;
  variables: VariableDef[];
};

/**
 * PreviewPanel renders the text with example values for allowed variables.
 */
export default function PreviewPanel({ text, variables }: PreviewPanelProps) {
  const preview = useMemo(() => renderPreview(text, variables), [text, variables]);

  return (
    <section aria-label="Preview">
      <h3>Preview</h3>
      {/* Use <pre> for readable formatting without custom styles */}
      <pre>{preview}</pre>
    </section>
  );
}

7) Kytke tämä RightEditor-paneeliin

Tiedosto: src/features/configShell/components/RightEditor.tsx

Tee nämä muutokset:

Lisää importit

import React, { useMemo, useRef, useState } from "react";
import { ConfigItem } from "../types";
import { VARIABLE_CATALOG } from "../variables/variableCatalog";
import VariablePicker from "./VariablePicker";
import PreviewPanel from "./PreviewPanel";
import { insertPlaceholderAtCursor, validatePlaceholders } from "../variables/placeholder";


Lisää textareaRef ja preview toggle

Lisää useRef

Lisää showPreview state

Kun käyttäjä painaa “Insert” variable pickerissä:

lisää placeholder kursoriin textarea:ssa

aseta kursori oikein takaisin textarea:an

Korvaa RightEditor:in textarea-osio seuraavalla logiikalla (pidä muu sisältö ennallaan):

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [localText, setLocalText] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const validation = useMemo(() => validatePlaceholders(localText, VARIABLE_CATALOG), [localText]);

  function handleInsertVariable(key: string) {
    const { nextText, nextCursor } = insertPlaceholderAtCursor({
      text: localText,
      textarea: textareaRef.current,
      key,
    });

    setLocalText(nextText);

    // Restore focus and cursor position after state update.
    requestAnimationFrame(() => {
      const el = textareaRef.current;
      if (!el) return;
      el.focus();
      el.setSelectionRange(nextCursor, nextCursor);
    });
  }


Lisää UI-elementit editoriin (ei uusia tyylejä)

Näytä validointivirhe jos unknownKeys löytyy

Lisää VariablePicker

Lisää preview toggle ja PreviewPanel

Lisää textarea:n ympärille tämä rakenne:

      <section aria-label="Content editor">
        <label>
          Content
          <textarea
            ref={textareaRef}
            value={localText}
            onChange={(e) => setLocalText(e.target.value)}
            placeholder="Edit content here..."
          />
        </label>

        {validation.unknownKeys.length > 0 && (
          <div role="alert" aria-live="polite">
            Unknown variables:{" "}
            {validation.unknownKeys.map((k) => (
              <code key={k}>{`{{${k}}}`}</code>
            ))}
          </div>
        )}

        <VariablePicker variables={VARIABLE_CATALOG} onInsert={handleInsertVariable} />

        <div>
          <button type="button" onClick={() => setShowPreview((v) => !v)}>
            {showPreview ? "Hide preview" : "Show preview"}
          </button>
        </div>

        {showPreview && <PreviewPanel text={localText} variables={VARIABLE_CATALOG} />}
      </section>

8) Estä muuttujien luonti eksplisiittisesti (UX + copy)

Lisää VariablePickerin alaosaan teksti (ei tyylejä) joka tekee rajan selväksi:

VariablePicker.tsx loppuun ennen returnin sulkua:

      <p>
        Variables are predefined. If you need a new variable, request it through the normal change process.
      </p>