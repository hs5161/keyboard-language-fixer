/**
 * Automatic text fixing.
 *
 * The main entry point of the core. For every line it builds candidate
 * versions (the original and each layout conversion), scores them, and keeps
 * the original unless a candidate is clearly better.
 *
 * Guiding rule: never change text without strong evidence. A wrong "fix" of
 * correct text is worse than a missed fix, because the user can still convert
 * manually.
 */

import { convert, Direction } from "./converter.js";
import { analyze } from "./scorer.js";

/**
 * What fix() did to the text.
 * @enum {string}
 */
export const FixAction = Object.freeze({
  /** Nothing was changed. */
  NONE: "none",
  /** Text typed on an English layout was converted to Hebrew. */
  EN_TO_HE: Direction.EN_TO_HE,
  /** Text typed on a Hebrew layout was converted to English. */
  HE_TO_EN: Direction.HE_TO_EN,
  /** Different lines were fixed in different ways. */
  MIXED: "mixed",
});

/**
 * @typedef {Object} FixResult
 * @property {string} text - The fixed text, or the original when unchanged.
 * @property {FixAction} action - What was done.
 * @property {boolean} changed - True when text differs from the input.
 */

/** A candidate must beat the original score by at least this much. */
const MIN_IMPROVEMENT = 0.25;
/** A candidate needs at least this share of its letters in known words. */
const MIN_KNOWN_RATIO = 0.3;
/** At or below this score the original is impossible as real text. */
const IMPOSSIBLE_SCORE = 0.05;
/** Score an unknown-word candidate needs when the original is impossible. */
const PLAUSIBLE_SCORE = 0.35;

const LINE_BREAK = /(\r?\n)/;
const HAS_HEBREW = /[א-ת]/;
const HAS_LATIN = /[A-Za-z]/;

/**
 * Detects and fixes text typed with the wrong keyboard layout.
 * Each line is examined on its own, so a text may be fixed only in part.
 *
 * @param {string} text
 * @returns {FixResult}
 * @throws {TypeError} When text is not a string.
 */
export function fix(text) {
  if (typeof text !== "string") {
    throw new TypeError("fix: text must be a string");
  }

  /** @type {Set<FixAction>} */
  const actions = new Set();

  // Splitting with a capturing group keeps the line breaks at odd indexes,
  // so the original line endings are restored exactly when joining.
  const parts = text.split(LINE_BREAK).map((part, index) => {
    if (index % 2 === 1) {
      return part;
    }
    const line = fixLine(part);
    if (line.action !== FixAction.NONE) {
      actions.add(line.action);
    }
    return line.text;
  });

  return {
    text: parts.join(""),
    action: summarize(actions),
    changed: actions.size > 0,
  };
}

/**
 * @param {string} line - A single line without its line break.
 * @returns {{ text: string, action: FixAction }}
 */
function fixLine(line) {
  const original = analyze(line);
  let best = { text: line, action: FixAction.NONE, score: original.score };

  for (const direction of applicableDirections(line)) {
    const candidateText = convert(line, direction);
    const candidate = analyze(candidateText);
    if (isClearlyBetter(candidate, original) && candidate.score > best.score) {
      best = { text: candidateText, action: direction, score: candidate.score };
    }
  }

  return { text: best.text, action: best.action };
}

/**
 * A conversion is only worth trying when the line has letters it would change.
 * @param {string} line
 * @returns {Direction[]}
 */
function applicableDirections(line) {
  const directions = [];
  if (HAS_LATIN.test(line)) {
    directions.push(Direction.EN_TO_HE);
  }
  if (HAS_HEBREW.test(line)) {
    directions.push(Direction.HE_TO_EN);
  }
  return directions;
}

/**
 * Decides whether a candidate is strong enough to replace the original.
 *
 * Either the candidate contains known words and scores clearly higher, or the
 * original cannot be real text at all and the candidate at least looks like
 * plausible words.
 *
 * @param {import("./scorer.js").TextAnalysis} candidate
 * @param {import("./scorer.js").TextAnalysis} original
 * @returns {boolean}
 */
function isClearlyBetter(candidate, original) {
  if (candidate.score < original.score + MIN_IMPROVEMENT) {
    return false;
  }
  const hasKnownWords = candidate.knownRatio >= MIN_KNOWN_RATIO;
  const originalIsImpossible =
    original.score <= IMPOSSIBLE_SCORE && candidate.score >= PLAUSIBLE_SCORE;
  return hasKnownWords || originalIsImpossible;
}

/**
 * @param {Set<FixAction>} actions - Actions applied to the individual lines.
 * @returns {FixAction}
 */
function summarize(actions) {
  if (actions.size === 0) {
    return FixAction.NONE;
  }
  if (actions.size === 1) {
    return [...actions][0];
  }
  return FixAction.MIXED;
}
