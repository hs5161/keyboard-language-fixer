/**
 * Keyboard layout conversion.
 *
 * Purely mechanical: the caller chooses the direction and every character is
 * replaced by the one the same physical key produces in the other layout.
 * Deciding *whether* and *in which direction* to convert is not done here.
 */

import { EN_TO_HE, HE_TO_EN } from "./layouts.js";

/**
 * Supported conversion directions.
 * @enum {string}
 */
export const Direction = Object.freeze({
  /** Text typed on an English layout that was meant to be Hebrew. */
  EN_TO_HE: "en-to-he",
  /** Text typed on a Hebrew layout that was meant to be English. */
  HE_TO_EN: "he-to-en",
});

/**
 * Converts text between keyboard layouts.
 *
 * - English → Hebrew ignores letter case, so "AKUO" and "akuo" both give "שלום".
 * - Hebrew → English produces lowercase letters; Latin capitals already in the
 *   text are kept, because Shift+letter on a Hebrew layout types a capital.
 * - Characters that are not in the layout table (digits, spaces, line breaks,
 *   emoji and so on) are returned unchanged.
 *
 * @param {string} text - The text to convert.
 * @param {Direction} direction - One of the {@link Direction} values.
 * @returns {string} The converted text.
 * @throws {TypeError} When text is not a string or the direction is unknown.
 */
export function convert(text, direction) {
  if (typeof text !== "string") {
    throw new TypeError("convert: text must be a string");
  }

  if (direction === Direction.EN_TO_HE) {
    return mapCharacters(text, (char) => EN_TO_HE.get(char.toLowerCase()));
  }
  if (direction === Direction.HE_TO_EN) {
    return mapCharacters(text, (char) => HE_TO_EN.get(char));
  }
  throw new TypeError(`convert: unknown direction "${direction}"`);
}

/**
 * Replaces each character using the lookup, keeping characters it does not know.
 * @param {string} text
 * @param {(char: string) => string | undefined} lookup
 * @returns {string}
 */
function mapCharacters(text, lookup) {
  let result = "";
  for (const char of text) {
    result += lookup(char) ?? char;
  }
  return result;
}
