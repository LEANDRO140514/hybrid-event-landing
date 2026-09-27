// Central tracking layer for HYBRID EXPERIENCE. One typed track*() function
// per funnel step, fanned out to Meta Pixel and GA4 adapters — nothing
// outside this file calls fbq()/gtag() directly.
//
// Design constraints (see docs/tracking report for the full rationale):
//  - Never sends PII (name/email/phone/roster) — only product, navigation
//    and campaign data.
//  - No-ops safely when an ID isn't configured: no thrown errors, no events
//    sent, a single dev-only console.debug per skipped call.
//  - Scripts load async and are only injected once, even under
//    React.StrictMode's double-invoke in development.
//  - GA4's automatic `page_view` (fired by `gtag('config', ID)`) is relied
//    upon instead of manually re-sending `page_view` — see initAnalytics().

import { captureFirstParty } from './firstPartyCapture'
import { installGtag } from './gtagShim'

const isDev = import.meta.env.DEV

const metaPixelId = (import.meta.env.VITE_META_PIXEL_ID as string | undefined)?.trim() || null
const ga4MeasurementId = (import.meta.env.VITE_GA4_MEASUREMENT_ID as string | undefined)?.trim() || null

function devLog(...args: unknown[]): void {
  if (isDev) console.debug('[analytics]', ...args)
}

// ── Meta Pixel ───────────────────────────────────────────────────
interface FbqFunction {
  (...args: unknown[]): void
  callMethod?: (...args: unknown[]) => void
  queue: unknown[]
  push: FbqFunction
  loaded: boolean
  version: string
}

declare global {
  interface Window {
    fbq?: FbqFunction
    _fbq?: FbqFunction
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
  }
}

let metaLoaded = false

/**
 * Facebook's official Pixel base code, verbatim (just wrapped in a function
 * and guarded so it only runs once). `n.callMethod`/`n.queue` is exactly
 * what fbevents.js looks for once it finishes loading, to drain calls made
 * before the real script was ready — reproducing anything less than this
 * exact shape silently breaks that handoff.
 */
function ensureMetaPixel(): boolean {
  if (!metaPixelId) return false
  if (metaLoaded) return true
  if (typeof window === 'undefined') return false

  if (!window.fbq) {
    const n = function (...args: unknown[]) {
      if (n.callMethod) n.callMethod(...args)
      else n.queue.push(args)
    } as FbqFunction
    n.queue = []
    n.loaded = true
    n.version = '2.0'
    n.push = n
    window.fbq = n
    window._fbq ??= n

    const script = document.createElement('script')
    script.async = true
    script.src = 'https://connect.facebook.net/en_US/fbevents.js'
    document.head.appendChild(script)
  }

  window.fbq!('init', metaPixelId)
  metaLoaded = true
  return true
}

// ── GA4 ──────────────────────────────────────────────────────────
let ga4Loaded = false

/** Official gtag.js snippet. `gtag('config', ID)` sends GA4's automatic page_view — do not also send a manual one. */
function ensureGa4(): boolean {
  if (!ga4MeasurementId) return false
  if (ga4Loaded) return true
  if (typeof window === 'undefined') return false

  const gtag = installGtag(window)

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4MeasurementId)}`
  document.head.appendChild(script)

  gtag('js', new Date())
  gtag('config', ga4MeasurementId)
  ga4Loaded = true
  return true
}

/**
 * Boots whichever adapters have an ID configured. Safe to call once at app
 * start even if neither VITE_META_PIXEL_ID nor VITE_GA4_MEASUREMENT_ID is
 * set — it simply does nothing. Never throws.
 */
export function initAnalytics(): void {
  try {
    const metaOn = ensureMetaPixel()
    const ga4On = ensureGa4()
    if (!metaOn && !metaPixelId) devLog('Meta Pixel not configured (VITE_META_PIXEL_ID unset) — no-op')
    if (!ga4On && !ga4MeasurementId) devLog('GA4 not configured (VITE_GA4_MEASUREMENT_ID unset) — no-op')
  } catch (err) {
    devLog('initAnalytics failed (non-fatal):', err)
  }
}

// ── Funnel event taxonomy ───────────────────────────────────────
export type SelectExperienceValue = 'compite' | 'half_hybrid' | 'asiste'
export type CheckoutType = 'embedded' | 'external'

type CategoryPayloadBase = {
  category_code: string
  category_name: string
  /** Product's `tipo` from catalogo.ts (e.g. "Individual", "½ Hybrid Dobles") — GA4's item_category. */
  format: string
}

export type SelectCategoryPayload = CategoryPayloadBase & {
  integrantes: number
  day: string
  session: string
  /** Current catalogo.ts vigente price — the unit/listing price, not yet a checkout value. */
  price: number
  cta_location: string
}

export type BeginCheckoutPayload = CategoryPayloadBase & {
  /**
   * TOTAL real de la transacción (precio del producto × quantity), no precio
   * por persona — un equipo de Dobles vale 2750, no 1375. quantity son
   * unidades compradas (1 para inscripción individual/de equipo; puede ser
   * >1 solo en accesos de público con cantidad editable).
   */
  value: number
  quantity: number
  checkout_type: CheckoutType
  cta_location: string
  /**
   * public_order_reference of the order just created — sent as Meta eventID
   * and GA4 transaction_id. The CAPI CSV must use the same value (orders.tracking_ref)
   * as event_id so Meta deduplicates browser and server events.
   */
  event_id?: string
}

export type PurchasePayload = CategoryPayloadBase & {
  transaction_id: string
  value: number
  quantity: number
}

/** Meta's flat content params (content_ids/content_name/content_type/value/currency/num_items) — used for select_category/begin_checkout/purchase. */
function metaContentParams(p: CategoryPayloadBase & { value: number; quantity?: number }) {
  return {
    content_ids: [p.category_code],
    content_name: p.category_name,
    content_type: 'product' as const,
    value: p.value,
    currency: 'MXN' as const,
    ...(p.quantity != null ? { num_items: p.quantity } : {}),
  }
}

/** GA4 ecommerce item (items: [...]) — one line item per event, quantity = units purchased, never integrantes. */
function ga4Item(p: CategoryPayloadBase & { price: number; quantity: number }) {
  return {
    item_id: p.category_code,
    item_name: p.category_name,
    item_category: p.format,
    price: p.price,
    quantity: p.quantity,
  }
}

/** Meta PageView — fire once per real page load. GA4's page_view is automatic via ensureGa4()'s `config` call, so it is intentionally not duplicated here. */
export function trackPageView(): void {
  devLog('page_view (meta PageView; ga4 auto page_view via config)')
  if (ensureMetaPixel()) window.fbq!('track', 'PageView')
  captureFirstParty({ eventType: 'LANDING_VIEW' })
}

/** Meta-only — GA4 has no equivalent step in this funnel's event map. Fire once, only on the landing route. */
export function trackViewContent(): void {
  const payload = { content_name: 'HYBRID EXPERIENCE 2026', content_type: 'event', currency: 'MXN' as const }
  devLog('view_content (meta only)', payload)
  if (ensureMetaPixel()) window.fbq!('track', 'ViewContent', payload)
}

export function trackSelectExperience(payload: { experience: SelectExperienceValue; cta_location: string }): void {
  devLog('select_experience', payload)
  if (ensureMetaPixel()) window.fbq!('trackCustom', 'SelectExperience', payload)
  if (ensureGa4()) window.gtag!('event', 'select_experience', payload)
  captureFirstParty({
    eventType: 'EXPERIENCE_SELECTED',
    metadata: { experience: payload.experience, cta_location: payload.cta_location },
  })
}

export function trackSelectCategory(payload: SelectCategoryPayload): void {
  devLog('select_category', payload)
  if (ensureMetaPixel()) {
    window.fbq!('trackCustom', 'SelectCategory', {
      ...metaContentParams({ ...payload, value: payload.price }),
      cta_location: payload.cta_location,
    })
  }
  if (ensureGa4()) {
    window.gtag!('event', 'select_category', {
      currency: 'MXN',
      value: payload.price,
      cta_location: payload.cta_location,
      items: [ga4Item({ ...payload, price: payload.price, quantity: 1 })],
    })
  }
  captureFirstParty({
    eventType: 'CATEGORY_SELECTED',
    categoryCode: payload.category_code,
    metadata: { cta_location: payload.cta_location, format: payload.format },
  })
}

export function trackBeginCheckout(payload: BeginCheckoutPayload): void {
  devLog('begin_checkout', payload)
  if (ensureMetaPixel()) {
    window.fbq!(
      'track',
      'InitiateCheckout',
      {
        ...metaContentParams(payload),
        checkout_type: payload.checkout_type,
        cta_location: payload.cta_location,
      },
      ...(payload.event_id ? [{ eventID: payload.event_id }] : []),
    )
  }
  if (ensureGa4()) {
    window.gtag!('event', 'begin_checkout', {
      ...(payload.event_id ? { transaction_id: payload.event_id } : {}),
      currency: 'MXN',
      value: payload.value,
      checkout_type: payload.checkout_type,
      cta_location: payload.cta_location,
      items: [ga4Item({ ...payload, price: payload.value, quantity: payload.quantity })],
    })
  }
  captureFirstParty({
    eventType: 'CHECKOUT_STARTED',
    categoryCode: payload.category_code,
    metadata: { cta_location: payload.cta_location, quantity: payload.quantity, format: payload.format },
  })
}

/** SOLO llamar con confirmación de pago real (status === 'APPROVED' desde get-order-status) — ver CheckoutConfirmPage.tsx. */
export function trackPurchase(payload: PurchasePayload): void {
  devLog('purchase', payload)
  if (ensureMetaPixel()) {
    // eventID = public_order_reference, same as the CAPI CSV event_id (orders.tracking_ref).
    window.fbq!('track', 'Purchase', metaContentParams(payload), { eventID: payload.transaction_id })
  }
  if (ensureGa4()) {
    window.gtag!('event', 'purchase', {
      transaction_id: payload.transaction_id,
      currency: 'MXN',
      value: payload.value,
      items: [ga4Item({ ...payload, price: payload.value, quantity: payload.quantity })],
    })
  }
}
