import { expect, test, describe } from "bun:test";
import { toggleCommaSeparatedValue } from "./utils";

describe("toggleCommaSeparatedValue", () => {
  test("should add value to empty string", () => {
    expect(toggleCommaSeparatedValue("", "New")).toBe("New");
  });

  test("should add value to existing string", () => {
    expect(toggleCommaSeparatedValue("Existing", "New")).toBe("Existing, New");
  });

  test("should remove existing value", () => {
    expect(toggleCommaSeparatedValue("Existing, New", "New")).toBe("Existing");
  });

  test("should handle multiple values correctly", () => {
    expect(toggleCommaSeparatedValue("One, Two, Three", "Two")).toBe("One, Three");
  });

  test("should trim spaces correctly", () => {
    expect(toggleCommaSeparatedValue("One,  Two , Three", "Two")).toBe("One, Three");
  });

  test("should handle single item removal", () => {
    expect(toggleCommaSeparatedValue("Only", "Only")).toBe("");
  });

  test("should handle duplicate items in input (cleanup)", () => {
    // If input is "A, A, B" and we toggle "A", it removes "A" (both if logic follows strict single removal or all).
    // Our implementation removes ALL occurrences of the toggled value because it rebuilds the list excluding the match.
    // Let's verify this behavior.
    expect(toggleCommaSeparatedValue("A, A, B", "A")).toBe("B");
  });
});
