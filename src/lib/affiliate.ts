const STORAGE_KEY = 'hex_aff'
const BENEFIT_KEY = 'hex_aff_benefit'
const TTL_MS = 30 * 24 * 60 * 60 * 1000
const AFFILIATE_CODE_RE = /^[A-Z0-9]{3,12}$/

/**
 * Two different facts:
 *
 * Attribution (`hex_aff`, localStorage, 30 days). Last valid `?aff=` code.
 * A later checkout may send it so the order can credit the Community Partner.
 * By itself it does not select the launch price.
 *
 * Benefit session (`hex_aff_benefit`, sessionStorage). Set only when this
 * document load's URL contains a valid `aff` (QR or partner link). It survives
 * reload and in-page navigation in the same tab. A new top-level visit whose
 * URL has no `aff` (`performance` navigation type `navigate`, including opening
 * the installed app at `/`) clears it. The 30-day attribution window is not
 * the benefit's lifetime.
 *
 * The server still decides the cents. Checkout sends `affiliate_entry: LINK`
 * only while this benefit session is active, and `STORED` when the code is
 * attribution alone. `locks_launch_price` on an active competitor affiliate
 * is what authorizes the launch amount.
 */

type StoredAffiliate = {
  code: string
  expiresAt: number
}

export type DocumentNavigation = 'navigate' | 'reload' | 'back_forward' | 'prerender'

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

function readBenefit(): string | null {
  const raw = sessionStorage.getItem(BENEFIT_KEY)
  if (!raw) return null
  const parsed = JSON.parse(raw) as { code?: unknown }
  if (typeof parsed.code !== 'string' || !AFFILIATE_CODE_RE.test(parsed.code)) return null
  return parsed.code
}

function writeBenefit(code: string): void {
  sessionStorage.setItem(BENEFIT_KEY, JSON.stringify({ code }))
}

function clearBenefit(): void {
  sessionStorage.removeItem(BENEFIT_KEY)
}

/**
 * Benefit code after this document load.
 * A valid URL code always starts or replaces the session.
 * A direct entry (`navigate` without `aff`) ends it.
 * Reload, back/forward, or an unknown navigation keeps the current session.
 */
export function nextBenefitCode(input: {
  urlCode: string | null
  navigation: DocumentNavigation | null
  currentBenefitCode: string | null
}): string | null {
  if (input.urlCode) return input.urlCode
  if (input.navigation === 'navigate') return null
  return input.currentBenefitCode
}

function readNavigationKind(): DocumentNavigation | null {
  try {
    const entry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    const type = entry?.type
    if (type === 'navigate' || type === 'reload' || type === 'back_forward' || type === 'prerender') {
      return type
    }
    return null
  } catch {
    return null
  }
}

function codeFromUrl(href: string): string | null {
  const url = new URL(href)
  const raw = url.searchParams.get('aff')
  if (raw == null) return null
  const code = raw.trim().toUpperCase()
  if (!AFFILIATE_CODE_RE.test(code)) return null
  return code
}

/**
 * Last-touch attribution: a valid `?aff=` replaces the stored code and resets
 * 30 days, and starts the benefit session. An invalid `aff` changes nothing.
 * A URL without `aff` does not touch attribution. On a direct document entry
 * it ends the benefit session. Does not read `ref`. Never throws.
 */
export function captureAffiliateFromUrl(href?: string): void {
  try {
    const urlCode = codeFromUrl(href ?? window.location.href)
    if (urlCode) {
      const next: StoredAffiliate = { code: urlCode, expiresAt: Date.now() + TTL_MS }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      writeBenefit(urlCode)
      emit()
      return
    }
    const benefit = nextBenefitCode({
      urlCode: null,
      navigation: readNavigationKind(),
      currentBenefitCode: readBenefit(),
    })
    if (benefit == null) clearBenefit()
    emit()
  } catch {
    /* storage or URL unavailable — checkout continues without attribution */
  }
}

/**
 * True only when this tab's benefit session names the same code as the
 * stored attribution. A recovered `hex_aff` without that session is false.
 */
export function isLaunchBenefitActive(): boolean {
  try {
    const benefit = readBenefit()
    const attribution = getAffiliateCode()
    return benefit != null && attribution != null && benefit === attribution
  } catch {
    return false
  }
}

/** Drops attribution and the benefit session. Never throws. */
export function clearAffiliateCode(): void {
  try {
    localStorage.removeItem(STORAGE_KEY)
    clearBenefit()
  } catch {
    /* ignore */
  }
  emit()
}
