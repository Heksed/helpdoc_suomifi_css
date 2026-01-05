/**
 * Placeholder utilities - Parse, validate, and render placeholders
 * 
 * Placeholder format: {{variableKey}}
 * Variables must be from the whitelist (variableCatalog)
 */

/**
 * @typedef {Object} PlaceholderMatch
 * @property {string} raw - e.g. "{{customerName}}"
 * @property {string} key - e.g. "customerName"
 * @property {number} index - start index in text
 */

const PLACEHOLDER_REGEX = /\{\{([a-zA-Z0-9_.-]+)\}\}/g

/**
 * Extracts all placeholder matches from text
 * @param {string} text - Text to search
 * @returns {PlaceholderMatch[]} Array of placeholder matches
 */
export function extractPlaceholders(text) {
  const matches = []
  if (!text) return matches

  let m
  // Reset regex lastIndex to avoid issues with global regex
  PLACEHOLDER_REGEX.lastIndex = 0
  while ((m = PLACEHOLDER_REGEX.exec(text)) !== null) {
    matches.push({
      raw: m[0],
      key: m[1],
      index: m.index,
    })
  }
  return matches
}

/**
 * Calculates Levenshtein distance between two strings
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} Edit distance
 */
function levenshteinDistance(a, b) {
  if (a.length === 0) return b.length
  if (b.length === 0) return a.length

  const matrix = []
  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i]
  }
  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1]
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        )
      }
    }
  }
  return matrix[b.length][a.length]
}

/**
 * Finds similar variable keys using fuzzy matching with improved scoring
 * @param {string} unknownKey - The unknown key to find matches for
 * @param {Array} allowed - Array of allowed variable definitions
 * @param {number} maxSuggestions - Maximum number of suggestions (default: 3)
 * @param {number} maxDistance - Maximum edit distance (default: 4)
 * @returns {Array} Array of suggested variable definitions
 */
export function findSimilarVariables(unknownKey, allowed, maxSuggestions = 3, maxDistance = 4) {
  if (!unknownKey || !allowed || allowed.length === 0) {
    return []
  }

  const unknownLower = unknownKey.toLowerCase()
  
  const suggestions = allowed
    .map((v) => {
      const keyLower = v.key.toLowerCase()
      const baseDistance = levenshteinDistance(unknownLower, keyLower)
      
      // Jos täydellinen case-insensitive match, palauta heti
      if (baseDistance === 0) {
        return { variable: v, score: 0, distance: 0, priority: 0 }
      }
      
      // Priorisoi osumat:
      // Priority 1: Täydellinen osuma (case-insensitive) - jo käsitelty
      // Priority 2: Osittainen osuma (toinen sisältää toisen)
      // Priority 3: Sama alku tai loppu
      // Priority 4: Sama merkkien järjestys
      // Priority 5: Levenshtein-etäisyys
      
      let priority = 5
      let score = baseDistance
      
      // Priority 2: Jos toinen sisältää toisen (esim. "customername" sisältää "customername" tai "customerName")
      if (keyLower.includes(unknownLower) || unknownLower.includes(keyLower)) {
        priority = 2
        score = baseDistance * 0.1 // Pienennä scorea merkittävästi
      }
      
      // Priority 3: Jos sama alku (esim. "customer" -> "customerName" tai "customerId")
      else if (unknownLower.startsWith(keyLower) || keyLower.startsWith(unknownLower)) {
        priority = 3
        score = baseDistance * 0.3
      }
      
      // Priority 3: Jos sama loppu (esim. "name" -> "customerName")
      else if (unknownLower.endsWith(keyLower) || keyLower.endsWith(unknownLower)) {
        priority = 3
        score = baseDistance * 0.4
      }
      
      // Priority 4: Jos merkkien järjestys on sama (esim. "customername" vs "customerName")
      else if (hasSameCharacterOrder(unknownLower, keyLower) || hasSameCharacterOrder(keyLower, unknownLower)) {
        priority = 4
        score = baseDistance * 0.6
      }
      
      // Bonus: Jos yhteinen alkuosa on pitkä
      const commonPrefix = getCommonPrefix(unknownLower, keyLower)
      if (commonPrefix.length >= 3) {
        const minLength = Math.min(unknownLower.length, keyLower.length)
        score -= (commonPrefix.length / minLength) * 0.3
      }
      
      return { variable: v, score: Math.max(0, score), distance: baseDistance, priority }
    })
    .filter((s) => s.distance <= maxDistance && s.distance > 0)
    .sort((a, b) => {
      // Lajittele ensin priorityn mukaan, sitten scoren mukaan, sitten distancen mukaan
      if (a.priority !== b.priority) {
        return a.priority - b.priority
      }
      if (Math.abs(a.score - b.score) < 0.1) {
        return a.distance - b.distance
      }
      return a.score - b.score
    })
    .slice(0, maxSuggestions)
    .map((s) => s.variable)

  return suggestions
}

/**
 * Calculates the length of the common prefix between two strings
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} Length of common prefix
 */
function getCommonPrefix(a, b) {
  let i = 0
  while (i < a.length && i < b.length && a[i] === b[i]) {
    i++
  }
  return a.substring(0, i)
}

/**
 * Checks if two strings have the same characters in the same order (allowing extra characters)
 * @param {string} a - First string (shorter or equal)
 * @param {string} b - Second string (longer or equal)
 * @returns {boolean} True if all characters from a appear in b in the same order
 */
function hasSameCharacterOrder(a, b) {
  let aIndex = 0
  for (let i = 0; i < b.length && aIndex < a.length; i++) {
    if (b[i] === a[aIndex]) {
      aIndex++
    }
  }
  return aIndex === a.length
}

/**
 * @typedef {Object} PlaceholderValidation
 * @property {string[]} unknownKeys - Array of unknown variable keys
 * @property {string[]} allKeys - Array of all found variable keys
 * @property {Object.<string, Array>} suggestions - Map of unknown key -> suggested variables
 */

/**
 * Validates placeholders against allowed variable catalog
 * @param {string} text - Text to validate
 * @param {Array} allowed - Array of allowed variable definitions
 * @returns {PlaceholderValidation} Validation result with suggestions
 */
export function validatePlaceholders(text, allowed) {
  if (!text || !allowed) {
    return { unknownKeys: [], allKeys: [], suggestions: {} }
  }

  const allowedSet = new Set(allowed.map((v) => v.key))
  const found = extractPlaceholders(text).map((p) => p.key)
  const uniqueFound = Array.from(new Set(found))

  const unknownKeys = uniqueFound.filter((k) => !allowedSet.has(k))
  
  // Find suggestions for each unknown key
  const suggestions = {}
  unknownKeys.forEach((key) => {
    const similar = findSimilarVariables(key, allowed)
    if (similar && similar.length > 0) {
      suggestions[key] = similar
    }
  })

  return { unknownKeys, allKeys: uniqueFound, suggestions }
}

/**
 * Renders preview text by replacing placeholders with example values
 * @param {string} text - Text with placeholders
 * @param {Array} allowed - Array of allowed variable definitions
 * @returns {string} Rendered preview text
 */
export function renderPreview(text, allowed) {
  const exampleMap = new Map(allowed.map((v) => [v.key, v.exampleValue]))

  // Reset regex lastIndex
  PLACEHOLDER_REGEX.lastIndex = 0
  return (text ?? "").replace(PLACEHOLDER_REGEX, (_full, key) => {
    // If unknown, keep placeholder as-is to make the issue visible
    return exampleMap.get(key) ?? `{{${key}}}`
  })
}

/**
 * Finds the placeholder at the given cursor position
 * @param {string} text - Text to search
 * @param {number} cursorPosition - Cursor position in text
 * @returns {PlaceholderMatch|null} Placeholder match at cursor, or null
 */
export function findPlaceholderAtCursor(text, cursorPosition) {
  if (!text || cursorPosition < 0) return null
  
  const matches = extractPlaceholders(text)
  return matches.find((match) => {
    const start = match.index
    const end = start + match.raw.length
    return cursorPosition >= start && cursorPosition <= end
  }) || null
}

/**
 * Finds an incomplete placeholder at cursor position (e.g. "{{app" without closing "}}")
 * @param {string} text - Text to search
 * @param {number} cursorPosition - Cursor position in text
 * @returns {{prefix: string, startIndex: number}|null} Incomplete placeholder info or null
 */
export function findIncompletePlaceholder(text, cursorPosition) {
  if (!text || cursorPosition < 0) return null
  
  // Etsi viimeisin "{{" ennen kursorin sijaintia
  let startIndex = text.lastIndexOf('{{', cursorPosition - 1)
  if (startIndex === -1) return null
  
  // Tarkista onko tämän jälkeen jo "}}" ennen kursorin sijaintia
  const afterStart = text.substring(startIndex + 2, cursorPosition)
  if (afterStart.includes('}}')) return null
  
  // Hae merkkijono "{{" ja kursorin välillä
  const prefix = text.substring(startIndex + 2, cursorPosition)
  
  // Tarkista että prefix ei sisällä kiellettyjä merkkejä (esim. välilyönti, rivinvaihto)
  if (prefix.includes('\n') || prefix.includes('\r')) return null
  
  return { prefix, startIndex: startIndex + 2 }
}

/**
 * Finds variables that start with the given prefix
 * @param {string} prefix - Prefix to search for
 * @param {Array} allowed - Array of allowed variable definitions
 * @param {number} maxSuggestions - Maximum number of suggestions (default: 10)
 * @returns {Array} Array of variable definitions that start with prefix
 */
export function findVariablesByPrefix(prefix, allowed, maxSuggestions = 10) {
  if (!prefix || !allowed || allowed.length === 0) {
    return []
  }
  
  const prefixLower = prefix.toLowerCase()
  
  const matches = allowed
    .filter((v) => v.key.toLowerCase().startsWith(prefixLower))
    .slice(0, maxSuggestions)
  
  return matches
}

/**
 * Inserts "{{key}}" into text at the current cursor position in a textarea
 * @param {Object} args - Arguments
 * @param {string} args.text - Current text
 * @param {HTMLTextAreaElement|null} args.textarea - Textarea element reference
 * @param {string} args.key - Variable key to insert
 * @returns {{nextText: string, nextCursor: number}} New text and cursor position
 */
export function insertPlaceholderAtCursor({ text, textarea, key }) {
  const token = `{{${key}}}`
  
  if (!textarea) {
    const nextText = (text ?? "") + token
    return { nextText, nextCursor: nextText.length }
  }

  const start = textarea.selectionStart ?? text.length
  const end = textarea.selectionEnd ?? text.length

  const before = text.slice(0, start)
  const after = text.slice(end)
  const nextText = `${before}${token}${after}`
  const nextCursor = start + token.length

  return { nextText, nextCursor }
}

/**
 * Completes an incomplete placeholder by replacing the prefix with the full key
 * @param {Object} args - Arguments
 * @param {string} args.text - Current text
 * @param {number} args.startIndex - Start index of the prefix (after "{{")
 * @param {number} args.cursorPosition - Current cursor position
 * @param {string} args.key - Variable key to complete with
 * @returns {{nextText: string, nextCursor: number}} New text and cursor position
 */
export function completePlaceholder({ text, startIndex, cursorPosition, key }) {
  const before = text.substring(0, startIndex - 2) // -2 koska startIndex on "{{" jälkeen
  const after = text.substring(cursorPosition)
  const nextText = `${before}{{${key}}}${after}`
  const nextCursor = startIndex - 2 + `{{${key}}}`.length
  
  return { nextText, nextCursor }
}

