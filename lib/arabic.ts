/**
 * Normalizes Arabic text for search / filtering:
 * - Trims leading/trailing whitespace
 * - Removes tatweel (kashida ـ)
 * - Normalizes Alef forms (أ, إ, آ -> ا)
 * - Normalizes Alef Maqsura (ى -> ي)
 * - Normalizes Taa Marbuta (ة -> ه)
 * - Collapses repeated whitespace
 */
export function normalizeArabic(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .toString()
    .trim()
    .replace(/[\u0640]/g, '') // tatweel
    .replace(/[\u0622\u0623\u0625]/g, '\u0627') // Alef forms -> ا
    .replace(/\u0649/g, '\u064A') // ى -> ي
    .replace(/\u0629/g, '\u0647') // ة -> ه
    .replace(/\s+/g, ' ');
}

/**
 * Searches whether target text matches the query, using Arabic normalization.
 */
export function searchArabicMatch(target: string | null | undefined, query: string | null | undefined): boolean {
  if (!query) return true;
  if (!target) return false;
  return normalizeArabic(target).toLowerCase().includes(normalizeArabic(query).toLowerCase());
}

