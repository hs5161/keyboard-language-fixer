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

// --- Everyday examples ---

test("fix: everyday Hebrew typed on an English layout", () => {
  const cases = [
    ["cuer yuc", "בוקר טוב"],
    ["nv eurv", "מה קורה"],
    ["nv vagv?", "מה השעה?"],
    ["tbh mrhl gzrv", "אני צריך עזרה"],
    ["t,v hfuk kakuj kh t, veuc./", "אתה יכול לשלוח לי את הקובץ."],
  ];
  for (const [wrong, expected] of cases) {
    assertEqual(fix(wrong).text, expected);
  }
});

test("fix: everyday English typed on a Hebrew layout", () => {
  const cases = [
    ["מם", "no"],
    ["אישמל טםו", "thank you"],
    ["עםםג צםרמןמע", "good morning"],
    ["ישהק ש מןבק גשט", "have a nice day"],
    ["ןצ םמ צט 'שט", "im on my way"],
    ["ן 'ןךך דקמג ןא ךשאקר", "i will send it later"],
    ["פךקשדק בשךך צק אםצםררם'", "please call me tomorrow"],
  ];
  for (const [wrong, expected] of cases) {
    assertEqual(fix(wrong).text, expected);
  }
});

test("fix: short everyday words and replies are unchanged", () => {
  assertUnchanged(["כן", "לא", "yes", "no", "OK", "Hi!", "תודה!", "a", "I", "lol", "asap"]);
});

test("fix: names, brands and capitalised words are unchanged", () => {
  assertUnchanged(["Dana", "דנה", "Tel Aviv", "ירושלים", "Python", "Excel", "iPhone", "USB", "ABC"]);
});

test("fix: addresses, paths and file names are unchanged", () => {
  assertUnchanged([
    "dana@example.com",
    "https://www.example.com/page",
    "file.txt",
    "C:\\Users\\docs",
    "html css",
  ]);
});

test("fix: text with numbers and symbols is unchanged", () => {
  assertUnchanged(["wifi password: 12345", "פגישה ב-10:30", "Windows 11", "5 kg", "20%"]);
});

test("fix: Hebrew with apostrophes and abbreviation marks is unchanged", () => {
  assertUnchanged(["ג'ירפה", "צ'יפס", 'ד"ר כהן', '10 ש"ח']);
});

test("fix: ordinary sentences are unchanged", () => {
  assertUnchanged([
    "מה קורה?",
    "בוקר טוב",
    "I love you",
    "see you tomorrow",
    "it's ok",
    "e.g. this",
  ]);
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
