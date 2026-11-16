# Keyboard Language Fixer

Fixes text that was typed with the wrong keyboard layout, for example `akuo` → `שלום`.
The tool detects the correction direction automatically and runs entirely in the browser: no server, and your text never leaves your computer.

**Status:** in early development.

## Features

- Hebrew ↔ English keyboard layout correction with automatic direction detection
- Correct text is left untouched
- Simple interface in Hebrew and English (English interface coming)

## Running locally

The project is plain HTML and JavaScript with no build step. It only needs a local web server, for example the one built into Python:

```bash
python -m http.server 5173
```

Then open <http://localhost:5173> for the app, or <http://localhost:5173/tests/tests.html> to run the tests.

## Project structure

```
index.html     page shell
src/main.js    entry point
src/core/      text-fixing logic, independent of the interface
src/ui/        user interface
tests/         browser-based tests
```

---

<div dir="rtl">

# מתקן שפת מקלדת

כלי לתיקון טקסט שהוקלד בשפת מקלדת שגויה, למשל `akuo` ← `שלום`.
הכלי מזהה את כיוון התיקון באופן אוטומטי ורץ כולו בדפדפן: אין שרת, והטקסט לא יוצא מהמחשב שלך.

**מצב:** בתחילת הפיתוח.

</div>
