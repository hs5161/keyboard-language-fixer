import { test, assertEqual } from "./test-runner.js";
import { analyze } from "../src/core/scorer.js";
import { convert, Direction } from "../src/core/converter.js";

/**
 * Fails unless `higher` exceeds `lower` by at least `margin`.
 * @param {number} higher
 * @param {number} lower
 * @param {number} margin
 * @param {string} label - Shown in the failure message.
 */
function assertHigherBy(higher, lower, margin, label) {
  if (!(higher >= lower + margin)) {
    throw new Error(
      `${label}: expected ${higher.toFixed(2)} to exceed ${lower.toFixed(2)} by ${margin}`,
    );
  }
}

// --- Known words ---

test("scorer: a known Hebrew word scores 1", () => {
  assertEqual(analyze("שלום"), { score: 1, knownRatio: 1, letterCount: 4 });
});

test("scorer: a known English word scores 1 in any letter case", () => {
  assertEqual(analyze("hello").score, 1);
  assertEqual(analyze("HELLO").score, 1);
});

test("scorer: Hebrew prefixes and English suffixes are recognised", () => {
  assertEqual(analyze("והבית").score, 0.9);
  assertEqual(analyze("books").score, 0.9);
  assertEqual(analyze("don't").score, 0.9);
});

// --- Clear gibberish ---

test("scorer: a final-form letter in the middle of a word scores 0", () => {
  assertEqual(analyze("יקךךם").score, 0);
});

test("scorer: a word mixing Hebrew and Latin letters scores 0", () => {
  assertEqual(analyze("Hקךךם").score, 0);
});

test("scorer: a Hebrew word ending in a non-final form scores low", () => {
  assertEqual(analyze("שלומ").score, 0.15);
});

test("scorer: an English word without vowels scores low", () => {
  assertEqual(analyze("pkg").score, 0.15);
});

// --- Unknown but possible words ---

test("scorer: an unknown but well-formed Hebrew word gets a middle score", () => {
  assertEqual(analyze("מקרר"), { score: 0.5, knownRatio: 0, letterCount: 4 });
});

// --- Punctuation ---

test("scorer: punctuation glued to the next letter lowers the score", () => {
  assertHigherBy(analyze("usv").score, analyze(",usv").score, 0.05, "comma");
});

test("scorer: an apostrophe opening a Hebrew word lowers the score", () => {
  assertHigherBy(analyze("יקרק").score, analyze("'יקרק").score, 0.05, "apostrophe");
});

// --- Edge cases ---

test("scorer: text without letters scores 0", () => {
  const empty = { score: 0, knownRatio: 0, letterCount: 0 };
  assertEqual(analyze(""), empty);
  assertEqual(analyze("123 !? 45.6"), empty);
});

test("scorer: non-string input throws TypeError", () => {
  let threw = false;
  try {
    analyze(null);
  } catch (error) {
    threw = error instanceof TypeError;
  }
  assertEqual(threw, true);
});

// --- Real text against its wrong-layout form ---

const HEBREW_SAMPLES = [
  "שלום",
  "תודה",
  "שלום מה שלומך היום",
  "אני רוצה לשלוח לך מייל",
  "תודה רבה על העזרה",
  "איפה הפגישה מחר בבוקר",
  "הקובץ נמצא במחשב שלי",
];

const ENGLISH_SAMPLES = [
  "hello",
  "thanks",
  "hello how are you today",
  "please send me the file",
  "thank you very much for your help",
  "where is the meeting tomorrow",
  "i think this is a good idea",
  "what's the password",
];

test("scorer: real Hebrew scores well above its wrong-layout form", () => {
  for (const sample of HEBREW_SAMPLES) {
    const wrongLayout = convert(sample, Direction.HE_TO_EN);
    assertHigherBy(analyze(sample).score, analyze(wrongLayout).score, 0.3, sample);
  }
});

test("scorer: real English scores well above its wrong-layout form", () => {
  for (const sample of ENGLISH_SAMPLES) {
    const wrongLayout = convert(sample, Direction.EN_TO_HE);
    assertHigherBy(analyze(sample).score, analyze(wrongLayout).score, 0.3, sample);
  }
});
