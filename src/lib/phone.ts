export const TELEFONO_PLACEHOLDER = '10 dígitos'
export const TELEFONO_ERROR =
  'Escribe 10 dígitos (ej. 9811234567), +52 con 10 dígitos, o un número internacional con + y de 8 a 15 dígitos.'

/**
 * Checkout phone, aligned with the backend. Spaces, hyphens and parentheses are ignored.
 * - 10 digits, 52 + 10 digits, or +52 + 10 digits -> '+52XXXXXXXXXX'
 * - old mobile format '+52 1 XXXXXXXXXX' or '521XXXXXXXXXX' (the 1 is dropped) -> '+52XXXXXXXXXX'
 * - a Mexican number never starts with 0 or 1 (no area code does), so its first digit must be 2-9
 * - '+' with another country code and 8 to 15 digits -> kept as E.164
 * - '' when empty (the field is optional); null when invalid.
 */
export function normalizePhoneMx(raw: string): string | null {
  const compact = raw.replace(/[\s()-]/g, '')
  if (compact === '') return ''
  if (/^[2-9]\d{9}$/.test(compact)) return `+52${compact}`
  if (/^52[2-9]\d{9}$/.test(compact)) return `+${compact}`
  if (/^\+52[2-9]\d{9}$/.test(compact)) return compact
  const oldMobile = compact.match(/^\+?521([2-9]\d{9})$/)
  if (oldMobile) return `+52${oldMobile[1]}`
  if (!compact.startsWith('+52') && /^\+[1-9]\d{7,14}$/.test(compact)) return compact
  return null
}
