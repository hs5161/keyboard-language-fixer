/**
 * User interface logic.
 *
 * Connects the page elements to the core fix() function. This file knows
 * about the page; the core knows nothing about it.
 */

import { fix, FixAction } from "../core/fixer.js";

/** How long the "copied" confirmation stays on the copy button. */
const COPIED_FEEDBACK_MS = 2000;

/** Status line text for each outcome of fix(). */
const STATUS_MESSAGES = Object.freeze({
  [FixAction.NONE]: "הטקסט נראה תקין, לא בוצע שינוי.",
  [FixAction.EN_TO_HE]: "זוהה טקסט שהוקלד באנגלית במקום בעברית, והוא תוקן.",
  [FixAction.HE_TO_EN]: "זוהה טקסט שהוקלד בעברית במקום באנגלית, והוא תוקן.",
  [FixAction.MIXED]: "זוהו ותוקנו שורות בשני הכיוונים.",
});

const COPY_LABEL = "העתק";
const COPIED_LABEL = "הועתק ✓";
const COPY_FAILED_MESSAGE = "ההעתקה נכשלה. אפשר לסמן את הטקסט ולהעתיק ידנית.";

/**
 * Starts the application on the current page.
 * @throws {Error} When a required page element is missing.
 */
export function initApp() {
  const input = /** @type {HTMLTextAreaElement} */ (requireElement("input-text"));
  const output = /** @type {HTMLTextAreaElement} */ (requireElement("output-text"));
  const status = requireElement("status");
  const copyButton = /** @type {HTMLButtonElement} */ (requireElement("copy-button"));
  const clearButton = /** @type {HTMLButtonElement} */ (requireElement("clear-button"));

  /** @type {number | undefined} */
  let copiedTimer;

  function resetCopyButton() {
    window.clearTimeout(copiedTimer);
    copyButton.textContent = COPY_LABEL;
  }

  /**
   * @param {string} message
   * @param {"fixed" | "unchanged" | "error" | ""} state
   */
  function showStatus(message, state) {
    status.textContent = message;
    status.dataset.state = state;
  }

  function update() {
    resetCopyButton();
    const text = input.value;

    if (text.trim() === "") {
      output.value = "";
      copyButton.disabled = true;
      showStatus("", "");
      return;
    }

    const result = fix(text);
    output.value = result.text;
    copyButton.disabled = false;
    showStatus(STATUS_MESSAGES[result.action], result.changed ? "fixed" : "unchanged");
  }

  async function copyOutput() {
    try {
      await navigator.clipboard.writeText(output.value);
      copyButton.textContent = COPIED_LABEL;
      copiedTimer = window.setTimeout(resetCopyButton, COPIED_FEEDBACK_MS);
    } catch {
      // Clipboard access can be blocked by the browser; let the user copy by hand.
      output.select();
      showStatus(COPY_FAILED_MESSAGE, "error");
    }
  }

  function clearAll() {
    input.value = "";
    update();
    input.focus();
  }

  input.addEventListener("input", update);
  copyButton.addEventListener("click", copyOutput);
  clearButton.addEventListener("click", clearAll);

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
