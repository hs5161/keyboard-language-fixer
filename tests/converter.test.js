import { test, assertEqual } from "./test-runner.js";
import { convert, Direction } from "../src/core/converter.js";
import { EN_TO_HE, HE_TO_EN } from "../src/core/layouts.js";

const { EN_TO_HE: TO_HEBREW, HE_TO_EN: TO_ENGLISH } = Direction;

/**
 * Returns true when calling fn throws a TypeError.
 * @param {() => unknown} fn
 */
function throwsTypeError(fn) {
  try {
    fn();
    return false;
  } catch (error) {
    return error instanceof TypeError;
  }
}

// --- Layout table ---

test("layout table covers 32 keys in both directions", () => {
  assertEqual(EN_TO_HE.size, 32);
  assertEqual(HE_TO_EN.size, 32);
});

// --- English → Hebrew ---

test("en→he: converts a single word", () => {
  assertEqual(convert("akuo", TO_HEBREW), "שלום");
});

test("en→he: ignores letter case", () => {
  assertEqual(convert("AKUO", TO_HEBREW), "שלום");
  assertEqual(convert("Akuo", TO_HEBREW), "שלום");
});

test("en→he: punctuation keys that are Hebrew letters or punctuation", () => {
  assertEqual(convert("vhh' nv bang", TO_HEBREW), "היי, מה נשמע");
  assertEqual(convert("tbh kt nchi/", TO_HEBREW), "אני לא מבין.");
});

test("en→he: leaves Hebrew text unchanged", () => {
  assertEqual(convert("שלום", TO_HEBREW), "שלום");
});

// --- Hebrew → English ---

test("he→en: converts a single word", () => {
  assertEqual(convert("יקךךם", TO_ENGLISH), "hello");
});

test("he→en: Hebrew punctuation maps back to letters", () => {
  assertEqual(convert("'יקרק", TO_ENGLISH), "where");
  assertEqual(convert("/וןבל", TO_ENGLISH), "quick");
});

test("he→en: keeps Latin capitals typed with Shift", () => {
  assertEqual(convert("Hקךךם", TO_ENGLISH), "Hello");
});

// --- Both directions ---

test("digits, spaces and line breaks are unchanged", () => {
  assertEqual(convert("12 34\n56\t", TO_HEBREW), "12 34\n56\t");
  assertEqual(convert("12 34\n56\t", TO_ENGLISH), "12 34\n56\t");
});

test("characters outside the table are unchanged", () => {
  assertEqual(convert("😀 @#!", TO_HEBREW), "😀 @#!");
  assertEqual(convert("😀 @#!", TO_ENGLISH), "😀 @#!");
});

test("empty text gives empty text", () => {
  assertEqual(convert("", TO_HEBREW), "");
  assertEqual(convert("", TO_ENGLISH), "");
});

test("round trip returns the original lowercase text", () => {
  const english = "hello world, it's me; a quick/slow `test`.";
  assertEqual(convert(convert(english, TO_HEBREW), TO_ENGLISH), english);

  const hebrew = "שלום עולם, מה נשמע? הכול טוב.";
  assertEqual(convert(convert(hebrew, TO_ENGLISH), TO_HEBREW), hebrew);
});

// --- Invalid input ---

test("unknown direction throws TypeError", () => {
  assertEqual(throwsTypeError(() => convert("abc", "sideways")), true);
});

test("non-string text throws TypeError", () => {
  assertEqual(throwsTypeError(() => convert(null, TO_HEBREW)), true);
  assertEqual(throwsTypeError(() => convert(42, TO_ENGLISH)), true);
});
