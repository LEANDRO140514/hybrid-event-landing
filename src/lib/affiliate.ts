const STORAGE_KEY = 'hex_aff'
const TTL_MS = 30 * 24 * 60 * 60 * 1000
const AFFILIATE_CODE_RE = /^[A-Z0-9]{3,12}$/

type StoredAffiliate = {
  code: string
  expiresAt: number
}

const listeners = new Set<() => void>()

function emit(): void {
  for (const listener of listeners) listener()
}

export function subscribeAffiliate(listener: () => void): () => void {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function readStored(): StoredAffiliate | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  const parsed = JSON.parse(raw) as Partial<StoredAffiliate>
  if (typeof parsed.code !== 'string' || typeof parsed.expiresAt !== 'number') return null
  if (!AFFILIATE_CODE_RE.test(parsed.code)) return null
  if (Date.now() >= parsed.expiresAt) return null
  return { code: parsed.code, expiresAt: parsed.expiresAt }
}

/** Last valid code still inside the 30-day window. Never throws. */
export function getAffiliateCode(): string | null {
  try {
    return readStored()?.code ?? null
  } catch {
    return null
  }
}

/**
 * Last-touch: a valid `?aff=` replaces the stored code and resets 30 days.
 * Missing or invalid `aff` leaves the stored code alone. Does not read `ref`.
 * Never throws.
 */
export function captureAffiliateFromUrl(href?: string): void {
  try {
    const url = new URL(href ?? window.location.href)
    const raw = url.searchParams.get('aff')
    if (raw == null) return
    const code = raw.trim().toUpperCase()
    if (!AFFILIATE_CODE_RE.test(code)) return
    const next: StoredAffiliate = { code, expiresAt: Date.now() + TTL_MS }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    emit()
  } catch {
    /* storage or URL unavailable — checkout continues without attribution */
  }
}

/** Drops the stored code. Never throws. */
export function clearAffiliateCode(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
  emit()
}
