import { getFirstTouchAttribution, getLastTouchAttribution, type AttributionParams } from './attribution'
import { getOrCreateSessionId, getOrCreateVisitorId } from './visitor'

const TOUCH_KEYS = [
  'utm_source',
  'utm_medium',
  'utm_campaign',
  'utm_content',
  'utm_term',
  'fbclid',
  'gclid',
  'referrer',
  'landing_path',
] as const

export type MarketingTouch = Partial<Record<(typeof TOUCH_KEYS)[number], string>>

export type MarketingContext = {
  visitor_id: string
  session_id: string
  first_touch: MarketingTouch | null
  last_touch: MarketingTouch | null
}

function touchFrom(raw: AttributionParams | null): MarketingTouch | null {
  if (!raw) return null
  const source = raw as Record<string, unknown>
  const out: MarketingTouch = {}
  for (const key of TOUCH_KEYS) {
    const value = source[key]
    if (typeof value === 'string' && value) out[key] = value
  }
  return out
}

/**
 * Sanitized object a later checkout submit may send.
 * Buyer email, phone, and name stay on the buyer-contact payload.
 * Not called by checkout in this phase.
 */
export function buildMarketingContext(
  visitorStorage: Storage = localStorage,
  sessionStorageRef: Storage = sessionStorage,
): MarketingContext {
  return {
    visitor_id: getOrCreateVisitorId(visitorStorage),
    session_id: getOrCreateSessionId(sessionStorageRef),
    first_touch: touchFrom(getFirstTouchAttribution()),
    last_touch: touchFrom(getLastTouchAttribution()),
  }
}
