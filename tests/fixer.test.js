import { test, assertEqual } from "./test-runner.js";
import { fix, FixAction } from "../src/core/fixer.js";

/**
 * Asserts that fix() leaves every given text exactly as it is.
 * @param {string[]} texts
 */
function assertUnchanged(texts) {
  for (const text of texts) {
    assertEqual(fix(text), { text, action: FixAction.NONE, changed: false });
  }
}

// --- English layout → Hebrew ---

test("fix: a Hebrew word typed on an English layout", () => {
  assertEqual(fix("akuo"), { text: "שלום", action: FixAction.EN_TO_HE, changed: true });
});

test("fix: letter case does not matter for English → Hebrew", () => {
  assertEqual(fix("Akuo").text, "שלום");
  assertEqual(fix("AKUO").text, "שלום");
});

test("fix: Hebrew sentences with punctuation", () => {
  assertEqual(fix("vhh' nv bang").text, "היי, מה נשמע");
  assertEqual(fix("tbh kt nchi/").text, "אני לא מבין.");
});

// --- Hebrew layout → English ---

test("fix: an English word typed on a Hebrew layout", () => {
  assertEqual(fix("יקךךם"), { text: "hello", action: FixAction.HE_TO_EN, changed: true });
});

test("fix: an English sentence typed on a Hebrew layout", () => {
  assertEqual(fix("'יקרק ןד איק צקקאןמע").text, "where is the meeting");
});

test("fix: capitals typed with Shift on a Hebrew layout are kept", () => {
  assertEqual(fix("Hקךךם").text, "Hello");
});

test("fix: an unknown English word is fixed when the Hebrew is impossible", () => {
  assertEqual(fix("ךםךןפםפ").text, "lolipop");
});

// --- Text that must stay as it is ---

test("fix: correct Hebrew is unchanged", () => {
  assertUnchanged(["שלום מה נשמע", "מקרר חדש", "הכלב רץ בגינה"]);
});

test("fix: correct English is unchanged", () => {
  assertUnchanged(["hello how are you", "banana", "the quick brown fox jumps"]);
});

test("fix: correct text mixing both languages is unchanged", () => {
  assertUnchanged(["שלום world", "אני אוהב JavaScript"]);
});

test("fix: abbreviations, numbers and addresses are unchanged", () => {
  assertUnchanged(["pkg", "3.5 kg", "12.5", "www.google.com"]);
});

test("fix: empty and blank text is unchanged", () => {
  assertUnchanged(["", "   ", "\n\n"]);
});

// --- Partial fixes ---

test("fix: a wrong-layout part inside a correct Hebrew line", () => {
  assertEqual(fix("אני רוצה kakuj nhhk").text, "אני רוצה לשלוח מייל");
});

test("fix: surrounding spaces are preserved", () => {
  assertEqual(fix("  akuo  ").text, "  שלום  ");
});

test("fix: each line is fixed on its own and line breaks are preserved", () => {
  assertEqual(fix("שלום\nakuo\r\nhello\nיקךךם"), {
    text: "שלום\nשלום\r\nhello\nhello",
    action: FixAction.MIXED,
    changed: true,
  });
});

test("fix: several lines fixed the same way report that direction", () => {
  assertEqual(fix("akuo\nnv bang"), {
    text: "שלום\nמה נשמע",
    action: FixAction.EN_TO_HE,
    changed: true,
  });
});

// --- Invalid input ---

test("fix: non-string input throws TypeError", () => {
  let threw = false;
  try {
    fix(undefined);
  } catch (error) {
    threw = error instanceof TypeError;
  }
  assertEqual(threw, true);
});
