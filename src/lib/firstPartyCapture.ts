import { getCheckoutConfig } from '../config/checkoutConfig'
import { buildMarketingContext } from './marketingContext'

const EVENT_CODE = 'HEX-2026'

function endpoint(): string | null {
  try {
    const base = getCheckoutConfig().functionsBase
    return base ? `${base}/functions/marketing-capture` : null
  } catch {
    return null
  }
}

/** Fire-and-forget. A failure here does not affect Pixel, GA4, or the page. */
export function captureFirstParty(input: {
  eventType: 'LANDING_VIEW' | 'EXPERIENCE_SELECTED' | 'CATEGORY_SELECTED' | 'CHECKOUT_STARTED'
  categoryCode?: string
  metadata?: Record<string, string | number>
}): void {
  try {
    const url = endpoint()
    if (!url) return
    const context = buildMarketingContext()
    const body = JSON.stringify({
      marketing_event_id: crypto.randomUUID(),
      event_code: EVENT_CODE,
      visitor_id: context.visitor_id,
      session_id: context.session_id,
      event_type: input.eventType,
      occurred_at: new Date().toISOString(),
      category_code: input.categoryCode ?? null,
      first_touch: context.first_touch,
      last_touch: context.last_touch,
      metadata: input.metadata ?? {},
    })
    void fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
      keepalive: true,
    }).catch(() => undefined)
  } catch {
    /* attribution capture is optional */
  }
}
