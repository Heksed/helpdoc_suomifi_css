/**
 * Variable catalog - Whitelist of allowed placeholder variables
 * 
 * This catalog is read-only in the editor.
 * Users can only insert variables from this whitelist.
 * In the future, this will be fetched from an API.
 */

/**
 * @typedef {Object} VariableDef
 * @property {string} key - Used in {{key}}
 * @property {string} label - Human-friendly label for picker
 * @property {string} [description] - Optional help text
 * @property {string} exampleValue - Used in preview
 */

/**
 * Variable catalog is read-only in this editor.
 * Users can only insert variables from this whitelist.
 */
// Re-export from variableCatalogByCategory for backwards compatibility
export { VARIABLE_CATALOG } from './variableCatalogByCategory'

