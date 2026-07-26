const STORAGE_KEY = 'hybrid.checkout.attempt.v1'

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

function readRaw(): CheckoutAttempt | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return null
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

function writeRaw(attempt: CheckoutAttempt): void {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attempt))
}

export function getCheckoutAttempt(): CheckoutAttempt | null {
  return readRaw()
}

export function getOrCreateCheckoutAttempt(input: {
  productCode: string
  quantity: number
}): CheckoutAttempt {
  const existing = readRaw()
  if (
    existing &&
    existing.productCode === input.productCode &&
    existing.quantity === input.quantity &&
    !existing.publicOrderReference
  ) {
    return existing
  }

  const attempt: CheckoutAttempt = {
    productCode: input.productCode,
    quantity: input.quantity,
    idempotencyKey: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  }
  writeRaw(attempt)
  return attempt
}

export function savePublicOrderReference(reference: string): void {
  const existing = readRaw()
  if (!existing) {
    throw new Error('Missing checkout attempt')
  }
  if (!isValidPublicOrderReference(reference)) {
    throw new Error('Invalid public order reference')
  }
  writeRaw({ ...existing, publicOrderReference: reference })
}

export function clearCheckoutAttempt(): void {
  sessionStorage.removeItem(STORAGE_KEY)
}

export function resolvePublicOrderReference(searchRef: string | null | undefined): string | null {
  const fromQuery = (searchRef ?? '').trim().toLowerCase()
  if (fromQuery && isValidPublicOrderReference(fromQuery)) {
    return fromQuery
  }
  const fromSession = readRaw()?.publicOrderReference
  if (fromSession && isValidPublicOrderReference(fromSession)) {
    return fromSession
  }
  return null
}
