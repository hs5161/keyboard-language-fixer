import { test, assertEqual } from "./test-runner.js";
import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  isSupportedLanguage,
  translate,
} from "../src/ui/i18n.js";

test("i18n: every language has exactly the same text keys", () => {
  const expectedKeys = Object.keys(LANGUAGES[DEFAULT_LANGUAGE].texts).sort();
  for (const [language, pack] of Object.entries(LANGUAGES)) {
    assertEqual([language, Object.keys(pack.texts).sort()], [language, expectedKeys]);
  }
});

test("i18n: no text is empty", () => {
  for (const pack of Object.values(LANGUAGES)) {
    const emptyKeys = Object.entries(pack.texts)
      .filter(([, text]) => text.trim() === "")
      .map(([key]) => key);
    assertEqual(emptyKeys, []);
  }
});

test("i18n: Hebrew reads right-to-left and English left-to-right", () => {
  assertEqual(LANGUAGES.he.direction, "rtl");
  assertEqual(LANGUAGES.en.direction, "ltr");
});

test("i18n: translate returns the text for the language", () => {
  assertEqual(translate("he", "copy"), "העתק");
  assertEqual(translate("en", "copy"), "Copy");
});

test("i18n: unknown language falls back to the default language", () => {
  assertEqual(translate("fr", "copy"), translate(DEFAULT_LANGUAGE, "copy"));
});

test("i18n: unknown key falls back to the key itself", () => {
  assertEqual(translate("en", "noSuchKey"), "noSuchKey");
});

test("i18n: isSupportedLanguage accepts only known languages", () => {
  assertEqual(isSupportedLanguage("he"), true);
  assertEqual(isSupportedLanguage("en"), true);
  assertEqual(isSupportedLanguage("fr"), false);
  assertEqual(isSupportedLanguage(null), false);
  assertEqual(isSupportedLanguage("toString"), false);
});
