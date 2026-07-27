import { checkoutEndpoint } from '../config/checkoutConfig'

export type CheckoutPublicErrorCode =
  | 'INVALID_REQUEST'
  | 'PRODUCT_NOT_FOUND'
  | 'PRODUCT_NOT_AVAILABLE'
  | 'SALES_NOT_OPEN'
  | 'WAIVER_REQUIRED'
  | 'SOLD_OUT'
  | 'ORIGIN_NOT_ALLOWED'
  | 'CONFIGURATION_ERROR'
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
    case 'SOLD_OUT':
    case 'ORIGIN_NOT_ALLOWED':
    case 'CONFIGURATION_ERROR':
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
      return 'No pudimos iniciar el pago. Inténtalo más tarde.'
    case 'WAIVER_REQUIRED':
      return 'No pudimos iniciar el proceso de pago.'
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

export async function createCheckout(input: {
  productCode: string
  quantity: number
  idempotencyKey: string
}): Promise<CreateCheckoutSuccess> {
  if (!navigator.onLine) {
    throw new CheckoutApiError('UNKNOWN', 0)
  }

  const response = await fetch(checkoutEndpoint('mp-create-checkout'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      product_code: input.productCode,
      quantity: input.quantity,
      idempotency_key: input.idempotencyKey,
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
