/**
 * Interface texts in every supported interface language.
 *
 * "i18n" is the common short name for internationalization. Adding an
 * interface language means adding one more entry to LANGUAGES with the same
 * keys.
 */

/** Interface language used on a first visit. */
export const DEFAULT_LANGUAGE = "he";

/**
 * @typedef {Object} LanguagePack
 * @property {"rtl" | "ltr"} direction - Page direction for this language.
 * @property {Readonly<Record<string, string>>} texts - Text for each key.
 */

/** @type {Readonly<Record<string, LanguagePack>>} */
export const LANGUAGES = Object.freeze({
  he: {
    direction: "rtl",
    texts: Object.freeze({
      title: "מתקן שפת מקלדת",
      tagline: "הקלדתם בשפה הלא נכונה? הדביקו את הטקסט וקבלו אותו מתוקן.",
      switchLanguage: "English",
      inputLabel: "הטקסט שלך",
      inputPlaceholder: "הדביקו או הקלידו כאן, למשל: akuo",
      clear: "נקה",
      outputLabel: "הטקסט המתוקן",
      copy: "העתק",
      copied: "הועתק ✓",
      copyFailed: "ההעתקה נכשלה. אפשר לסמן את הטקסט ולהעתיק ידנית.",
      manualHint: "הזיהוי טעה?",
      toHebrew: "המר לעברית",
      toEnglish: "המר לאנגלית",
      showOriginal: "החזר מקור",
      statusNone: "הטקסט נראה תקין, לא בוצע שינוי.",
      statusEnToHe: "זוהה טקסט שהוקלד באנגלית במקום בעברית, והוא תוקן.",
      statusHeToEn: "זוהה טקסט שהוקלד בעברית במקום באנגלית, והוא תוקן.",
      statusMixed: "זוהו ותוקנו שורות בשני הכיוונים.",
      statusManualToHebrew: "הטקסט הומר לעברית ידנית.",
      statusManualToEnglish: "הטקסט הומר לאנגלית ידנית.",
      statusOriginal: "מוצג הטקסט המקורי, ללא שינוי.",
      footer: "הטקסט מעובד בדפדפן שלך בלבד ואינו נשלח לשום מקום.",
    }),
  },
  en: {
    direction: "ltr",
    texts: Object.freeze({
      title: "Keyboard Language Fixer",
      tagline: "Typed in the wrong language? Paste your text and get it fixed.",
      switchLanguage: "עברית",
      inputLabel: "Your text",
      inputPlaceholder: "Paste or type here, for example: akuo",
      clear: "Clear",
      outputLabel: "Fixed text",
      copy: "Copy",
      copied: "Copied ✓",
      copyFailed: "Copying failed. You can select the text and copy it manually.",
      manualHint: "Detected wrong?",
      toHebrew: "Convert to Hebrew",
      toEnglish: "Convert to English",
      showOriginal: "Restore original",
      statusNone: "The text looks correct. Nothing was changed.",
      statusEnToHe: "Detected Hebrew typed on an English keyboard, and fixed it.",
      statusHeToEn: "Detected English typed on a Hebrew keyboard, and fixed it.",
      statusMixed: "Fixed lines in both directions.",
      statusManualToHebrew: "The text was converted to Hebrew manually.",
      statusManualToEnglish: "The text was converted to English manually.",
      statusOriginal: "Showing the original text, unchanged.",
      footer: "Your text is processed in your browser only and is never sent anywhere.",
    }),
  },
});

/**
 * @param {unknown} language
 * @returns {boolean} True when the value names a supported interface language.
 */
export function isSupportedLanguage(language) {
  return typeof language === "string" && Object.hasOwn(LANGUAGES, language);
}

/**
 * Returns the interface text for a key.
 * Falls back to the default language, and then to the key itself, so a
 * missing translation never leaves an empty spot on the page.
 *
 * @param {string} language
 * @param {string} key
 * @returns {string}
 */
export function translate(language, key) {
  const pack = isSupportedLanguage(language) ? LANGUAGES[language] : LANGUAGES[DEFAULT_LANGUAGE];
  return pack.texts[key] ?? LANGUAGES[DEFAULT_LANGUAGE].texts[key] ?? key;
}
