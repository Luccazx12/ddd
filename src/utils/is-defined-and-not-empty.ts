/**
 * Checks if a string is defined and not empty.
 * @param value - The string to check.
 * @returns `true` if the string is defined and not empty, `false` otherwise.
 */
export function isDefinedAndNotEmpty(
  value: string | undefined
): value is string {
  return value !== undefined && value !== "";
}
