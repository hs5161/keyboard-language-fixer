/**
 * Language plausibility scoring.
 *
 * Answers one question: "how much does this text look like real Hebrew or
 * English?" It does not convert anything and does not decide what to fix;
 * the fixer compares the scores of several candidate texts.
 */

import {
  ENGLISH_WORDS,
  HEBREW_WORDS,
  ENGLISH_COMMON_BIGRAMS,
  HEBREW_PREFIX_LETTERS,
  ENGLISH_SUFFIXES,
} from "./language-data.js";

/**
 * @typedef {Object} TextAnalysis
 * @property {number} score - Plausibility from 0 (gibberish) to 1 (real text).
 * @property {number} knownRatio - Share of letters (0–1) that belong to words
 *   found in the word lists. Tells the caller how strong the evidence is.
 * @property {number} letterCount - Number of letters that were scored.
 */

// Scores given to a single word.
const SCORE_KNOWN = 1;
const SCORE_DERIVED = 0.9; // known word plus a prefix or suffix
const SCORE_UNKNOWN_HEBREW = 0.5;
const SCORE_UNKNOWN_ENGLISH_MIN = 0.1;
const SCORE_UNKNOWN_ENGLISH_RANGE = 0.5;
const SCORE_SINGLE_LETTER = 0.2;
const SCORE_NO_VOWEL = 0.15;
const SCORE_REPEATED_LETTER = 0.1;
const SCORE_WRONG_ENDING = 0.15;
const SCORE_LOANWORD_ENDING = 0.4;
const SCORE_IMPOSSIBLE = 0;

/** Each suspicious punctuation mark counts like this many gibberish letters. */
const PUNCTUATION_PENALTY_WEIGHT = 2;

const LETTERS = "A-Za-z\\u05D0-\\u05EA";
const WORD_PATTERN = new RegExp(
  `[${LETTERS}]+(?:['’"״׳][${LETTERS}]+)*`,
  "g",
);
const HAS_HEBREW = /[א-ת]/;
const HAS_LATIN = /[A-Za-z]/;
const NOT_A_LETTER = new RegExp(`[^${LETTERS}]`, "g");

/** A comma, period or semicolon glued to the letter after it, as in ",usv". */
const PUNCTUATION_BEFORE_LETTER = new RegExp(`[,.;](?=[${LETTERS}])`, "g");
/** An apostrophe or slash opening a Hebrew word, as in "'יקרק". */
const QUOTE_OPENING_HEBREW_WORD = /(?:^|\s)['/](?=[א-ת])/g;

/** A final-form letter anywhere except the last position. */
const FINAL_FORM_BEFORE_END = /[םןץףך]./;
/** Letters that must switch to their final form at the end of a word. */
const NEEDS_FINAL_FORM_AT_END = /[מנצכ]$/;
/** "פ" may end a word only in loanwords such as "קליפ". */
const LOANWORD_ENDING = /פ$/;
const SAME_LETTER_THREE_TIMES = /(.)\1\1/;
const ENGLISH_VOWEL = /[aeiouy]/;

/**
 * Analyses how plausible a text is as real Hebrew or English.
 *
 * Every word is scored on its own and the result is the average, weighted by
 * word length. Text without any letters gets a score of 0.
 *
 * @param {string} text
 * @returns {TextAnalysis}
 * @throws {TypeError} When text is not a string.
 */
export function analyze(text) {
  if (typeof text !== "string") {
    throw new TypeError("analyze: text must be a string");
  }

  let weightedScore = 0;
  let letterCount = 0;
  let knownLetters = 0;

  for (const word of text.match(WORD_PATTERN) ?? []) {
    const letters = word.replace(NOT_A_LETTER, "");
    const wordScore = scoreWord(word, letters);
    weightedScore += wordScore * letters.length;
    letterCount += letters.length;
    if (wordScore >= SCORE_DERIVED) {
      knownLetters += letters.length;
    }
  }

  if (letterCount === 0) {
    return { score: 0, knownRatio: 0, letterCount: 0 };
  }

  const penaltyWeight = countSuspiciousPunctuation(text) * PUNCTUATION_PENALTY_WEIGHT;
  return {
    score: weightedScore / (letterCount + penaltyWeight),
    knownRatio: knownLetters / letterCount,
    letterCount,
  };
}

/**
 * @param {string} word - The word as written, possibly with inner quotes.
 * @param {string} letters - The same word with only its letters.
 * @returns {number} Score from 0 to 1.
 */
function scoreWord(word, letters) {
  const hasHebrew = HAS_HEBREW.test(letters);
  const hasLatin = HAS_LATIN.test(letters);

  if (hasHebrew && hasLatin) {
    return SCORE_IMPOSSIBLE;
  }
  return hasHebrew ? scoreHebrewWord(letters) : scoreEnglishWord(word.toLowerCase());
}

/**
 * @param {string} letters - Hebrew letters only.
 * @returns {number}
 */
function scoreHebrewWord(letters) {
  if (FINAL_FORM_BEFORE_END.test(letters)) {
    return SCORE_IMPOSSIBLE;
  }
  if (HEBREW_WORDS.has(letters)) {
    return SCORE_KNOWN;
  }
  if (isKnownHebrewWordWithPrefix(letters)) {
    return SCORE_DERIVED;
  }
  if (letters.length === 1) {
    return SCORE_SINGLE_LETTER;
  }
  if (SAME_LETTER_THREE_TIMES.test(letters)) {
    return SCORE_REPEATED_LETTER;
  }
  if (NEEDS_FINAL_FORM_AT_END.test(letters)) {
    return SCORE_WRONG_ENDING;
  }
  if (LOANWORD_ENDING.test(letters)) {
    return SCORE_LOANWORD_ENDING;
  }
  return SCORE_UNKNOWN_HEBREW;
}

/**
 * Checks for a known word behind one or two prefix letters, as in "והבית".
 * @param {string} letters
 * @returns {boolean}
 */
function isKnownHebrewWordWithPrefix(letters) {
  for (let prefixLength = 1; prefixLength <= 2; prefixLength++) {
    const rest = letters.slice(prefixLength);
    if (rest.length < 2 || !HEBREW_PREFIX_LETTERS.has(letters[prefixLength - 1])) {
      return false;
    }
    if (HEBREW_WORDS.has(rest)) {
      return true;
    }
  }
  return false;
}

/**
 * @param {string} word - Lowercase Latin word, possibly with an apostrophe.
 * @returns {number}
 */
function scoreEnglishWord(word) {
  const normalized = word.replace(/’/g, "'");
  if (ENGLISH_WORDS.has(normalized)) {
    return SCORE_KNOWN;
  }
  if (isKnownEnglishWordWithSuffix(normalized)) {
    return SCORE_DERIVED;
  }

  const letters = normalized.replace(/[^a-z]/g, "");
  if (letters.length === 1) {
    return SCORE_SINGLE_LETTER;
  }
  if (SAME_LETTER_THREE_TIMES.test(letters)) {
    return SCORE_REPEATED_LETTER;
  }
  if (!ENGLISH_VOWEL.test(letters)) {
    return SCORE_NO_VOWEL;
  }
  return SCORE_UNKNOWN_ENGLISH_MIN + SCORE_UNKNOWN_ENGLISH_RANGE * commonBigramShare(letters);
}

/**
 * Checks for a known word behind a common ending, as in "books" or "don't".
 * @param {string} word
 * @returns {boolean}
 */
function isKnownEnglishWordWithSuffix(word) {
  return ENGLISH_SUFFIXES.some(
    (suffix) =>
      word.length > suffix.length &&
      word.endsWith(suffix) &&
      ENGLISH_WORDS.has(word.slice(0, -suffix.length)),
  );
}

/**
 * @param {string} letters - Lowercase Latin letters, at least two.
 * @returns {number} Share (0–1) of adjacent letter pairs that are common in English.
 */
function commonBigramShare(letters) {
  let common = 0;
  for (let i = 0; i < letters.length - 1; i++) {
    if (ENGLISH_COMMON_BIGRAMS.has(letters.slice(i, i + 2))) {
      common++;
    }
  }
  return common / (letters.length - 1);
}

/**
 * Counts punctuation that sits where a letter key was probably intended.
 * @param {string} text
 * @returns {number}
 */
function countSuspiciousPunctuation(text) {
  const glued = text.match(PUNCTUATION_BEFORE_LETTER)?.length ?? 0;
  const opening = text.match(QUOTE_OPENING_HEBREW_WORD)?.length ?? 0;
  return glued + opening;
}
