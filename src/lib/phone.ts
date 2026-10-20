export const TELEFONO_PLACEHOLDER = '10 dígitos, ej. 9811234567'
export const TELEFONO_ERROR =
  'Escribe 10 dígitos (ej. 9811234567), +52 con 10 dígitos, o un número internacional con + y de 8 a 15 dígitos.'

/**
 * Checkout phone, aligned with the backend. Spaces, hyphens and parentheses are ignored.
 * - 10 digits, 52 + 10 digits, or +52 + 10 digits -> '+52XXXXXXXXXX'
 * - '+' with another country code and 8 to 15 digits -> kept as E.164
 * - '' when empty (the field is optional); null when invalid.
 */
export function normalizePhoneMx(raw: string): string | null {
  const compact = raw.replace(/[\s()-]/g, '')
  if (compact === '') return ''
  if (/^\d{10}$/.test(compact)) return `+52${compact}`
  if (/^52\d{10}$/.test(compact)) return `+${compact}`
  if (/^\+52\d{10}$/.test(compact)) return compact
  if (!compact.startsWith('+52') && /^\+[1-9]\d{7,14}$/.test(compact)) return compact
  return null
}
