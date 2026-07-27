const LEGACY_STORAGE_KEY = 'hybrid.checkout.attempt.v1'
const STORAGE_KEY_PREFIX = 'hybrid.checkout.attempt.v2:'
const LAST_PUBLIC_REF_KEY = 'hybrid.checkout.last_public_ref.v1'

export type CheckoutAttempt = {
  productCode: string
  quantity: number
  idempotencyKey: string
  publicOrderReference?: string
  createdAt: string
}

const TRACKING_REF_RE = /^trk_[0-9a-f]{32}$/

export function isValidPublicOrderReference(value: string): boolean {
  return TRACKING_REF_RE.test(value)
}

function storageKeyForProduct(productCode: string): string {
  return `${STORAGE_KEY_PREFIX}${productCode}`
}

function parseAttempt(raw: string | null): CheckoutAttempt | null {
  if (!raw) return null
  try {
    const parsed = JSON.parse(raw) as CheckoutAttempt
    if (
      !parsed ||
      typeof parsed.productCode !== 'string' ||
      typeof parsed.idempotencyKey !== 'string' ||
      typeof parsed.quantity !== 'number' ||
      typeof parsed.createdAt !== 'string'
    ) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

function readProductRaw(productCode: string): CheckoutAttempt | null {
  try {
    return parseAttempt(sessionStorage.getItem(storageKeyForProduct(productCode)))
  } catch {
    return null
  }
}

function writeProductRaw(attempt: CheckoutAttempt): void {
  sessionStorage.setItem(storageKeyForProduct(attempt.productCode), JSON.stringify(attempt))
}

function readLegacyPubVie(): CheckoutAttempt | null {
  try {
    const legacy = parseAttempt(sessionStorage.getItem(LEGACY_STORAGE_KEY))
    if (!legacy) return null
    if (legacy.productCode !== 'PUB-VIE') return null
    return legacy
  } catch {
    return null
  }
}

function writeLastPublicRef(reference: string, productCode: string): void {
  sessionStorage.setItem(
    LAST_PUBLIC_REF_KEY,
    JSON.stringify({ reference, productCode, savedAt: new Date().toISOString() }),
  )
}

function readLastPublicRef(): { reference: string; productCode: string } | null {
  try {
    const raw = sessionStorage.getItem(LAST_PUBLIC_REF_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as { reference?: string; productCode?: string }
    if (
      typeof parsed.reference !== 'string' ||
      typeof parsed.productCode !== 'string' ||
      !isValidPublicOrderReference(parsed.reference)
    ) {
      return null
    }
    return { reference: parsed.reference, productCode: parsed.productCode }
  } catch {
    return null
  }
}

export function getCheckoutAttempt(productCode: string): CheckoutAttempt | null {
  const current = readProductRaw(productCode)
  if (current) return current
  if (productCode === 'PUB-VIE') return readLegacyPubVie()
  return null
}

/**
 * Reuse pending attempt for same product+quantity; otherwise create a new key.
 * Legacy PUB-VIE v1 may be migrated into v2 on first touch.
 */
export function getOrCreateCheckoutAttempt(input: {
  productCode: string
  quantity: number
}): CheckoutAttempt {
  const existing = getCheckoutAttempt(input.productCode)
  if (
    existing &&
    existing.productCode === input.productCode &&
    existing.quantity === input.quantity &&
    !existing.publicOrderReference
  ) {
    // Ensure namespaced v2 storage for PUB-VIE legacy retries.
    writeProductRaw(existing)
    if (input.productCode === 'PUB-VIE') {
      try {
        sessionStorage.removeItem(LEGACY_STORAGE_KEY)
      } catch {
        /* ignore */
      }
    }
    return existing
  }

  const attempt: CheckoutAttempt = {
    productCode: input.productCode,
    quantity: input.quantity,
    idempotencyKey: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  writeProductRaw(attempt)
  if (input.productCode === 'PUB-VIE') {
    try {
      sessionStorage.removeItem(LEGACY_STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }
  return attempt
}

export function savePublicOrderReference(productCode: string, reference: string): void {
  const existing = getCheckoutAttempt(productCode)
  if (!existing) {
    throw new Error('Missing checkout attempt')
  }
  if (!isValidPublicOrderReference(reference)) {
    throw new Error('Invalid public order reference')
  }
  const next = { ...existing, publicOrderReference: reference }
  writeProductRaw(next)
  writeLastPublicRef(reference, productCode)
  if (productCode === 'PUB-VIE') {
    try {
      sessionStorage.removeItem(LEGACY_STORAGE_KEY)
    } catch {
      /* ignore */
    }
  }
}

export function clearCheckoutAttempt(reference?: string): void {
  const target = reference?.trim().toLowerCase() || readLastPublicRef()?.reference || null

  if (target && isValidPublicOrderReference(target)) {
    const keysToScan: string[] = []
    try {
      for (let i = 0; i < sessionStorage.length; i += 1) {
        const key = sessionStorage.key(i)
        if (key && key.startsWith(STORAGE_KEY_PREFIX)) keysToScan.push(key)
      }
    } catch {
      /* ignore */
    }
    for (const key of keysToScan) {
      const attempt = parseAttempt(sessionStorage.getItem(key))
      if (attempt?.publicOrderReference === target) {
        sessionStorage.removeItem(key)
      }
    }
    const legacy = readLegacyPubVie()
    if (legacy?.publicOrderReference === target) {
      sessionStorage.removeItem(LEGACY_STORAGE_KEY)
    }
    const last = readLastPublicRef()
    if (last?.reference === target) {
      sessionStorage.removeItem(LAST_PUBLIC_REF_KEY)
    }
    return
  }

  // Fallback: clear last-ref only (no matching attempt).
  try {
    sessionStorage.removeItem(LAST_PUBLIC_REF_KEY)
  } catch {
    /* ignore */
  }
}

export function resolvePublicOrderReference(searchRef: string | null | undefined): string | null {
  const fromQuery = (searchRef ?? '').trim().toLowerCase()
  if (fromQuery && isValidPublicOrderReference(fromQuery)) {
    return fromQuery
  }

  const last = readLastPublicRef()
  if (last) return last.reference

  // Prefer newest namespaced attempt with a reference.
  let newest: CheckoutAttempt | null = null
  try {
    for (let i = 0; i < sessionStorage.length; i += 1) {
      const key = sessionStorage.key(i)
      if (!key || !key.startsWith(STORAGE_KEY_PREFIX)) continue
      const attempt = parseAttempt(sessionStorage.getItem(key))
      if (!attempt?.publicOrderReference) continue
      if (!isValidPublicOrderReference(attempt.publicOrderReference)) continue
      if (!newest || attempt.createdAt > newest.createdAt) newest = attempt
    }
  } catch {
    /* ignore */
  }
  if (newest?.publicOrderReference) return newest.publicOrderReference

  const legacy = readLegacyPubVie()
  if (legacy?.publicOrderReference && isValidPublicOrderReference(legacy.publicOrderReference)) {
    return legacy.publicOrderReference
  }
  return null
}

/** Test helper — hash/truncate display without exposing full keys in docs. */
export function fingerprintIdempotencyKey(key: string): string {
  return `${key.slice(0, 8)}…${key.slice(-4)}`
}
