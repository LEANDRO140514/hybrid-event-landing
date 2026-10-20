export const TELEFONO_PLACEHOLDER = '10 dígitos, ej. 9811234567'
export const TELEFONO_ERROR = 'Escribe 10 dígitos (ej. 9811234567) o +52 seguido de 10 dígitos.'

/**
 * Mexican phone for the checkout. Spaces and hyphens are ignored.
 * Returns '+52XXXXXXXXXX', '' when empty (the field is optional), or null when invalid.
 */
export function normalizePhoneMx(raw: string): string | null {
  const compact = raw.replace(/[\s-]/g, '')
  if (compact === '') return ''
  if (/^\d{10}$/.test(compact)) return `+52${compact}`
  if (/^\+52\d{10}$/.test(compact)) return compact
  return null
}
