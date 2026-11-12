/**
 * Minimal browser test runner.
 *
 * Usage in a test file:
 *   import { test, assertEqual } from "./test-runner.js";
 *   test("describes the expected behaviour", () => {
 *     assertEqual(actual, expected);
 *   });
 *
 * tests.html imports the test files and then calls renderResults().
 */

/** @typedef {{ name: string, passed: boolean, error?: string }} TestResult */

/** @type {TestResult[]} */
const results = [];

/**
 * Registers and immediately runs a single test.
 * @param {string} name - Human-readable description of the expected behaviour.
 * @param {() => void} fn - Test body; throws when the expectation is not met.
 */
export function test(name, fn) {
  try {
    fn();
    results.push({ name, passed: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    results.push({ name, passed: false, error: message });
  }
}

/**
 * Fails the current test when the two values differ.
 * Values are compared by their JSON form, so arrays and plain objects work.
 * @param {unknown} actual
 * @param {unknown} expected
 */
export function assertEqual(actual, expected) {
  const actualText = JSON.stringify(actual);
  const expectedText = JSON.stringify(expected);
  if (actualText !== expectedText) {
    throw new Error(`expected ${expectedText} but got ${actualText}`);
  }
}

/**
 * Writes a summary line and one line per test into the given element.
 * @param {HTMLElement} container
 */
export function renderResults(container) {
  const failed = results.filter((result) => !result.passed).length;

  const summary = document.createElement("p");
  summary.id = "summary";
  summary.dataset.failed = String(failed);
  summary.textContent =
    failed === 0
      ? `All ${results.length} tests passed`
      : `${failed} of ${results.length} tests failed`;
  summary.style.color = failed === 0 ? "green" : "crimson";
  summary.style.fontWeight = "bold";
  container.append(summary);

  const list = document.createElement("ul");
  for (const result of results) {
    const item = document.createElement("li");
    item.textContent = result.passed
      ? `PASS  ${result.name}`
      : `FAIL  ${result.name} – ${result.error}`;
    item.style.color = result.passed ? "green" : "crimson";
    list.append(item);
  }
  container.append(list);
}
