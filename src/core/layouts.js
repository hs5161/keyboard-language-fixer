/**
 * Keyboard layout tables.
 *
 * Each entry pairs the character a physical key produces in the English (US)
 * layout with the character the same key produces in the standard Hebrew
 * layout. Punctuation keys are included because several of them produce
 * letters in Hebrew (for example the "," key types "ת").
 */

/** @type {ReadonlyArray<readonly [string, string]>} */
const KEY_PAIRS = Object.freeze([
  // Top row
  ["q", "/"],
  ["w", "'"],
  ["e", "ק"],
  ["r", "ר"],
  ["t", "א"],
  ["y", "ט"],
  ["u", "ו"],
  ["i", "ן"],
  ["o", "ם"],
  ["p", "פ"],
  // Home row
  ["a", "ש"],
  ["s", "ד"],
  ["d", "ג"],
  ["f", "כ"],
  ["g", "ע"],
  ["h", "י"],
  ["j", "ח"],
  ["k", "ל"],
  ["l", "ך"],
  [";", "ף"],
  ["'", ","],
  // Bottom row
  ["z", "ז"],
  ["x", "ס"],
  ["c", "ב"],
  ["v", "ה"],
  ["b", "נ"],
  ["n", "מ"],
  ["m", "צ"],
  [",", "ת"],
  [".", "ץ"],
  ["/", "."],
  // Key to the left of "1"
  ["`", ";"],
]);

/**
 * English-layout character → Hebrew-layout character.
 * @type {ReadonlyMap<string, string>}
 */
export const EN_TO_HE = new Map(KEY_PAIRS);

/**
 * Hebrew-layout character → English-layout character.
 * @type {ReadonlyMap<string, string>}
 */
export const HE_TO_EN = new Map(KEY_PAIRS.map(([en, he]) => [he, en]));
