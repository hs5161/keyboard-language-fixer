/**
 * User interface logic.
 *
 * Connects the page elements to the core functions. This file knows about
 * the page; the core knows nothing about it.
 */

import { fix, FixAction } from "../core/fixer.js";
import { convert, Direction } from "../core/converter.js";
import { DEFAULT_LANGUAGE, LANGUAGES, isSupportedLanguage, translate } from "./i18n.js";

/** How long the "copied" confirmation stays on the copy button. */
const COPIED_FEEDBACK_MS = 2000;

/** Browser storage key for the chosen interface language. */
const LANGUAGE_STORAGE_KEY = "keyboard-language-fixer.language";

/**
 * How the output is produced from the input.
 * @enum {string}
 */
const Mode = Object.freeze({
  /** Automatic detection with fix(). */
  AUTO: "auto",
  /** The user forced a conversion to Hebrew. */
  TO_HEBREW: "to-hebrew",
  /** The user forced a conversion to English. */
  TO_ENGLISH: "to-english",
  /** The user asked to see the input unchanged. */
  ORIGINAL: "original",
});

/** Status text key for each outcome of fix(). */
const AUTO_STATUS_KEYS = Object.freeze({
  [FixAction.NONE]: "statusNone",
  [FixAction.EN_TO_HE]: "statusEnToHe",
  [FixAction.HE_TO_EN]: "statusHeToEn",
  [FixAction.MIXED]: "statusMixed",
});

/**
 * @typedef {Object} Output
 * @property {string} text - Text for the output box.
 * @property {string} statusKey - i18n key of the status message.
 * @property {"fixed" | "unchanged"} state - Visual style of the status line.
 */

/**
 * Produces the output for the given input and mode. Pure: no page access.
 * @param {string} text
 * @param {Mode} mode
 * @returns {Output}
 */
function computeOutput(text, mode) {
  switch (mode) {
    case Mode.TO_HEBREW:
      return {
        text: convert(text, Direction.EN_TO_HE),
        statusKey: "statusManualToHebrew",
        state: "fixed",
      };
    case Mode.TO_ENGLISH:
      return {
        text: convert(text, Direction.HE_TO_EN),
        statusKey: "statusManualToEnglish",
        state: "fixed",
      };
    case Mode.ORIGINAL:
      return { text, statusKey: "statusOriginal", state: "unchanged" };
    default: {
      const result = fix(text);
      return {
        text: result.text,
        statusKey: AUTO_STATUS_KEYS[result.action],
        state: result.changed ? "fixed" : "unchanged",
      };
    }
  }
}

/**
 * Reads the saved interface language. Storage can be unavailable (for example
 * in private browsing), in which case the default language is used.
 * @returns {string}
 */
function loadLanguage() {
  try {
    const saved = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return isSupportedLanguage(saved) ? saved : DEFAULT_LANGUAGE;
  } catch {
    return DEFAULT_LANGUAGE;
  }
}

/** @param {string} language */
function saveLanguage(language) {
  try {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {
    // Not being able to remember the choice is harmless.
  }
}

/**
 * Starts the application on the current page.
 * @throws {Error} When a required page element is missing.
 */
export function initApp() {
  const input = /** @type {HTMLTextAreaElement} */ (requireElement("input-text"));
  const output = /** @type {HTMLTextAreaElement} */ (requireElement("output-text"));
  const status = requireElement("status");
  const copyButton = /** @type {HTMLButtonElement} */ (requireElement("copy-button"));
  const copyAnnouncement = requireElement("copy-announcement");
  const clearButton = /** @type {HTMLButtonElement} */ (requireElement("clear-button"));
  const languageButton = /** @type {HTMLButtonElement} */ (requireElement("language-button"));
  const manualButtons = /** @type {Array<[HTMLButtonElement, Mode]>} */ ([
    [requireElement("to-hebrew-button"), Mode.TO_HEBREW],
    [requireElement("to-english-button"), Mode.TO_ENGLISH],
    [requireElement("original-button"), Mode.ORIGINAL],
  ]);

  let language = loadLanguage();
  /** @type {Mode} */
  let mode = Mode.AUTO;
  /** @type {{ key: string, state: string } | null} */
  let currentStatus = null;
  /** @type {number | undefined} */
  let copiedTimer;

  function renderStatus() {
    const text = currentStatus ? translate(language, currentStatus.key) : "";
    // Rewriting the same text would make screen readers announce it again
    // on every keystroke.
    if (status.textContent !== text) {
      status.textContent = text;
    }
    status.dataset.state = currentStatus ? currentStatus.state : "";
  }

  /**
   * @param {string} key - i18n key of the message.
   * @param {"fixed" | "unchanged" | "error"} state
   */
  function showStatus(key, state) {
    currentStatus = { key, state };
    renderStatus();
  }

  function clearStatus() {
    currentStatus = null;
    renderStatus();
  }

  function resetCopyButton() {
    window.clearTimeout(copiedTimer);
    copyButton.textContent = translate(language, "copy");
    copyAnnouncement.textContent = "";
  }

  /** Fills every translatable element and sets the page direction. */
  function applyLanguage() {
    document.documentElement.lang = language;
    document.documentElement.dir = LANGUAGES[language].direction;
    document.title = translate(language, "title");
    // The button shows the name of the other language, in that language.
    languageButton.lang = language === "he" ? "en" : "he";

    for (const element of document.querySelectorAll("[data-i18n]")) {
      element.textContent = translate(language, element.getAttribute("data-i18n") ?? "");
    }
    for (const element of document.querySelectorAll("[data-i18n-placeholder]")) {
      element.setAttribute(
        "placeholder",
        translate(language, element.getAttribute("data-i18n-placeholder") ?? ""),
      );
    }
    for (const element of document.querySelectorAll("[data-i18n-content]")) {
      element.setAttribute(
        "content",
        translate(language, element.getAttribute("data-i18n-content") ?? ""),
      );
    }
    renderStatus();
  }

  function update() {
    resetCopyButton();
    const text = input.value;
    const isEmpty = text.trim() === "";

    copyButton.disabled = isEmpty;
    for (const [button, buttonMode] of manualButtons) {
      button.disabled = isEmpty;
      button.setAttribute("aria-pressed", String(!isEmpty && mode === buttonMode));
    }

    if (isEmpty) {
      output.value = "";
      clearStatus();
      return;
    }

    const result = computeOutput(text, mode);
    output.value = result.text;
    showStatus(result.statusKey, result.state);
  }

  async function copyOutput() {
    try {
      await navigator.clipboard.writeText(output.value);
      copyButton.textContent = translate(language, "copied");
      copyAnnouncement.textContent = translate(language, "copied");
      copiedTimer = window.setTimeout(resetCopyButton, COPIED_FEEDBACK_MS);
    } catch {
      // Clipboard access can be blocked by the browser; let the user copy by hand.
      output.select();
      showStatus("copyFailed", "error");
    }
  }

  // New input always goes back to automatic detection.
  input.addEventListener("input", () => {
    mode = Mode.AUTO;
    update();
  });

  for (const [button, buttonMode] of manualButtons) {
    button.addEventListener("click", () => {
      mode = buttonMode;
      update();
    });
  }

  copyButton.addEventListener("click", copyOutput);

  clearButton.addEventListener("click", () => {
    input.value = "";
    mode = Mode.AUTO;
    update();
    input.focus();
  });

  languageButton.addEventListener("click", () => {
    language = language === "he" ? "en" : "he";
    saveLanguage(language);
    applyLanguage();
  });

  applyLanguage();
  // The browser may restore text into the field after a page reload.
  update();
}

/**
 * @param {string} id
 * @returns {HTMLElement}
 */
function requireElement(id) {
  const element = document.getElementById(id);
  if (!element) {
    throw new Error(`Missing page element: #${id}`);
  }
  return element;
}
