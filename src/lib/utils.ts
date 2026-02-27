import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Toggles a value in a comma-separated string.
 * If the value exists (exact match, trimmed), it is removed.
 * If it does not exist, it is appended.
 * Returns the new comma-separated string.
 */
export function toggleCommaSeparatedValue(currentVal: string, valueToToggle: string): string {
  if (!currentVal) return valueToToggle;

  const parts = currentVal.split(',');
  const newParts: string[] = [];
  let found = false;

  for (let i = 0; i < parts.length; i++) {
    const p = parts[i].trim();
    if (!p) continue;

    if (p === valueToToggle) {
      found = true;
    } else {
      newParts.push(p);
    }
  }

  if (!found) {
    newParts.push(valueToToggle);
  }

  return newParts.join(', ');
}
