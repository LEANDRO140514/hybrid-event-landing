import { checkoutEndpoint } from '../config/checkoutConfig'

export type CheckoutPublicErrorCode =
  | 'INVALID_REQUEST'
  | 'PRODUCT_NOT_FOUND'
  | 'PRODUCT_NOT_AVAILABLE'
  | 'SALES_NOT_OPEN'
  | 'WAIVER_REQUIRED'
  | 'CONTACT_REQUIRED'
  | 'SOLD_OUT'
  | 'ORIGIN_NOT_ALLOWED'
  | 'CONFIGURATION_ERROR'
  | 'UNSUPPORTED_PROVIDER'
  | 'UNKNOWN'

export type CreateCheckoutSuccess = {
  checkout_url: string
  public_order_reference: string
  expires_at: string
}

export class CheckoutApiError extends Error {
  readonly code: CheckoutPublicErrorCode
  readonly httpStatus: number

  constructor(code: CheckoutPublicErrorCode, httpStatus: number) {
    super(code)
    this.name = 'CheckoutApiError'
    this.code = code
    this.httpStatus = httpStatus
  }
}

const TRACKING_REF_RE = /^trk_[0-9a-f]{32}$/

function mapErrorCode(raw: unknown): CheckoutPublicErrorCode {
  const code = typeof raw === 'string' ? raw : ''
  switch (code) {
    case 'INVALID_REQUEST':
    case 'PRODUCT_NOT_FOUND':
    case 'PRODUCT_NOT_AVAILABLE':
    case 'SALES_NOT_OPEN':
    case 'WAIVER_REQUIRED':
    case 'CONTACT_REQUIRED':
    case 'SOLD_OUT':
    case 'ORIGIN_NOT_ALLOWED':
    case 'CONFIGURATION_ERROR':
    case 'UNSUPPORTED_PROVIDER':
      return code
    default:
      return 'UNKNOWN'
  }
}

export function messageForCheckoutError(code: CheckoutPublicErrorCode): string {
  switch (code) {
    case 'INVALID_REQUEST':
      return 'Revisa la cantidad e inténtalo de nuevo.'
    case 'PRODUCT_NOT_FOUND':
      return 'Este acceso no está disponible.'
    case 'PRODUCT_NOT_AVAILABLE':
      return 'Este producto todavía no está disponible.'
    case 'SALES_NOT_OPEN':
      return 'Las ventas todavía no están disponibles.'
    case 'SOLD_OUT':
      return 'Este acceso está agotado.'
    case 'ORIGIN_NOT_ALLOWED':
      return 'No pudimos iniciar el proceso de pago.'
    case 'CONFIGURATION_ERROR':
    case 'UNSUPPORTED_PROVIDER':
      return 'No pudimos iniciar el pago. Inténtalo más tarde.'
    case 'WAIVER_REQUIRED':
      return 'No pudimos iniciar el proceso de pago.'
    case 'CONTACT_REQUIRED':
      return 'Completa tu nombre y correo para continuar.'
    // TODO(ready2hybrid): when the backend confirms the exact error-code
    // string for a roster-fingerprint conflict (reused idempotencyKey with a
    // changed roster), map it here to an actionable message + auto-clear the
    // stored checkout attempt. The frontend already regenerates the key on
    // roster change (computeRosterFingerprint in checkoutSession.ts), so this
    // is a belt-and-suspenders safety net, not the primary guard.
    default:
      return 'No pudimos iniciar el proceso de pago.'
  }
}

function assertSuccessShape(body: unknown): CreateCheckoutSuccess {
  if (!body || typeof body !== 'object') {
    throw new CheckoutApiError('UNKNOWN', 500)
  }
  const data = body as Record<string, unknown>
  const checkoutUrl = data.checkout_url
  const reference = data.public_order_reference
  const expiresAt = data.expires_at
  if (typeof checkoutUrl !== 'string' || !checkoutUrl.startsWith('https://')) {
    throw new CheckoutApiError('UNKNOWN', 500)
  }
  if (typeof reference !== 'string' || !TRACKING_REF_RE.test(reference)) {
    throw new CheckoutApiError('UNKNOWN', 500)
  }
  if (typeof expiresAt !== 'string' || !expiresAt) {
    throw new CheckoutApiError('UNKNOWN', 500)
  }
  return {
    checkout_url: checkoutUrl,
    public_order_reference: reference,
    expires_at: expiresAt,
  }
}

export type CreateCheckoutBuyerInput = {
  email: string
  name: string
  phone?: string
  contactConsent?: boolean
}

export type CreateCheckoutInput = {
  productCode: string
  quantity: number
  idempotencyKey: string
  buyer: CreateCheckoutBuyerInput
  /**
   * Team captain's full name. Always sent — equals `buyer.name` (no separate
   * override in the UI). The backend (checkout_start_tx, migration 0025)
   * expects it alongside `teammate_names`.
   */
  captainName: string
  /**
   * Full names of the remaining team members (roster size - 1). Always sent;
   * an empty array for individual products.
   */
  teammateNames: string[]
  /** Fixed to Mercado Pago for go-live; no UI provider selector. */
  selectedProvider: 'MERCADO_PAGO'
}

export async function createCheckout(input: CreateCheckoutInput): Promise<CreateCheckoutSuccess> {
  if (!navigator.onLine) {
    throw new CheckoutApiError('UNKNOWN', 0)
  }

  const buyerBody: {
    email: string
    name: string
    phone?: string
    contact_consent?: boolean
  } = {
    email: input.buyer.email,
    name: input.buyer.name,
  }
  if (input.buyer.phone != null && input.buyer.phone.trim() !== '') {
    buyerBody.phone = input.buyer.phone.trim()
  }
  if (input.buyer.contactConsent !== undefined) {
    buyerBody.contact_consent = input.buyer.contactConsent
  }

  const response = await fetch(checkoutEndpoint('mp-create-checkout'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      product_code: input.productCode,
      quantity: input.quantity,
      idempotency_key: input.idempotencyKey,
      selected_provider: input.selectedProvider,
      buyer: buyerBody,
      captain_name: input.captainName,
      teammate_names: input.teammateNames,
    }),
  })

  let json: unknown = null
  try {
    json = await response.json()
  } catch {
    json = null
  }

  if (!response.ok) {
    const code = mapErrorCode(
      json && typeof json === 'object'
        ? (json as { error?: { code?: unknown } }).error?.code
        : undefined,
    )
    throw new CheckoutApiError(code, response.status)
  }

  return assertSuccessShape(json)
}
