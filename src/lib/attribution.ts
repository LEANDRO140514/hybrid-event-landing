// Campaign attribution (UTMs + ad click ids): first-touch and last-touch,
// persisted in localStorage. Mirrors the pattern in affiliate.ts — plain
// functions, no framework state, never throws, safe to call on every boot.
//
// First-touch is written once and never overwritten (answers "what
// originally brought this visitor"). Last-touch is overwritten by any later
// visit that carries campaign params (answers "what closed the visit").
// Neither ever stores PII — only campaign/query-string values.

const FIRST_KEY = 'hybrid_attribution_first'
const LAST_KEY = 'hybrid_attribution_last'
const TTL_MS = 90 * 24 * 60 * 60 * 1000 // 90 days — well past any realistic consideration window.
const MAX_VALUE_LEN = 200 // defensive cap; UTM values are never legitimately this long.

const UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'] as const
type UtmKey = (typeof UTM_KEYS)[number]

// fbclid/gclid are kept internally (useful for a future server-side Meta CAPI
// id or Google Ads import) but are NOT appended to the visible
// registro.enforma.mx URL — see getInscribirUrl in data/catalogo.ts and the
// tracking report for the reasoning.
const CLICK_ID_KEYS = ['fbclid', 'gclid'] as const
type ClickIdKey = (typeof CLICK_ID_KEYS)[number]

export type AttributionParams = Partial<Record<UtmKey | ClickIdKey, string>>

type StoredAttribution = AttributionParams & {
  capturedAt: number
  referrer?: string
  landing_path?: string
}

function readParamsFromUrl(href: string): AttributionParams | null {
  try {
    const url = new URL(href)
    const out: AttributionParams = {}
    let found = false
    for (const key of UTM_KEYS) {
      const raw = url.searchParams.get(key)
      if (raw) {
        out[key] = raw.slice(0, MAX_VALUE_LEN)
        found = true
      }
    }
    for (const key of CLICK_ID_KEYS) {
      const raw = url.searchParams.get(key)
      if (raw) {
        out[key] = raw.slice(0, MAX_VALUE_LEN)
        found = true
      }
    }
    return found ? out : null
  } catch {
    return null
  }
}

function readStored(key: string): StoredAttribution | null {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<StoredAttribution>
    if (typeof parsed.capturedAt !== 'number') return null
    if (Date.now() - parsed.capturedAt > TTL_MS) return null
    return parsed as StoredAttribution
  } catch {
    return null
  }
}

function writeStored(key: string, params: AttributionParams, href: string): void {
  try {
    const url = new URL(href)
    const next: StoredAttribution = {
      ...params,
      capturedAt: Date.now(),
      referrer: (typeof document === 'undefined' ? '' : document.referrer).slice(0, MAX_VALUE_LEN) || undefined,
      landing_path: `${url.pathname}${url.search}`.slice(0, MAX_VALUE_LEN),
    }
    localStorage.setItem(key, JSON.stringify(next))
  } catch {
    /* storage unavailable — attribution continues without persistence */
  }
}

/**
 * Reads UTMs/click ids from the given URL (defaults to the current page) and
 * updates last-touch (always, when params are present) and first-touch
 * (only if not already set). Call once per real page load. Never throws.
 */
export function captureAttributionFromUrl(href?: string): void {
  const page = href ?? window.location.href
  const params = readParamsFromUrl(page)
  if (!params) return
  writeStored(LAST_KEY, params, page)
  if (!readStored(FIRST_KEY)) writeStored(FIRST_KEY, params, page)
}

function stripMeta(stored: StoredAttribution | null): AttributionParams | null {
  if (!stored) return null
  const { capturedAt: _capturedAt, ...rest } = stored
  return rest
}

export function getFirstTouchAttribution(): AttributionParams | null {
  try {
    return stripMeta(readStored(FIRST_KEY))
  } catch {
    return null
  }
}

export function getLastTouchAttribution(): AttributionParams | null {
  try {
    return stripMeta(readStored(LAST_KEY))
  } catch {
    return null
  }
}

/**
 * Appends last-touch UTM params (when present) to `href` without disturbing
 * any existing query params (e.g. `cat=...`) and without ever duplicating a
 * param the URL already has. fbclid/gclid are intentionally excluded — see
 * the module comment. Never throws — returns `href` unchanged on failure.
 */
export function appendAttributionParams(href: string): string {
  try {
    const url = new URL(href)
    const last = getLastTouchAttribution()
    if (last) {
      for (const key of UTM_KEYS) {
        const value = last[key]
        if (value && !url.searchParams.has(key)) {
          url.searchParams.set(key, value)
        }
      }
    }
    return url.toString()
  } catch {
    return href
  }
}
