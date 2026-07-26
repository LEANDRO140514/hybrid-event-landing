import { checkoutEndpoint } from '../config/checkoutConfig'
import { isValidPublicOrderReference } from '../lib/checkoutSession'

export type PublicOrderStatus =
  | 'CREATING'
  | 'AWAITING_PAYMENT'
  | 'APPROVED'
  | 'REJECTED'
  | 'CANCELLED'
  | 'EXPIRED'
  | 'REQUIRES_ACTION'
  | 'REFUNDED'
  | 'CHARGED_BACK'

export type OrderStatusSuccess = {
  status: PublicOrderStatus
  terminal: boolean
  next_poll_after_seconds: number | null
}

export class OrderStatusApiError extends Error {
  readonly code: string
  readonly httpStatus: number

  constructor(code: string, httpStatus: number) {
    super(code)
    this.name = 'OrderStatusApiError'
    this.code = code
    this.httpStatus = httpStatus
  }
}

const PUBLIC_STATUSES = new Set<PublicOrderStatus>([
  'CREATING',
  'AWAITING_PAYMENT',
  'APPROVED',
  'REJECTED',
  'CANCELLED',
  'EXPIRED',
  'REQUIRES_ACTION',
  'REFUNDED',
  'CHARGED_BACK',
])

export function labelForOrderStatus(status: PublicOrderStatus): string {
  switch (status) {
    case 'CREATING':
      return 'Preparando tu orden'
    case 'AWAITING_PAYMENT':
      return 'Esperando confirmación del pago'
    case 'APPROVED':
      return 'Pago confirmado'
    case 'REJECTED':
      return 'El pago no fue aprobado'
    case 'CANCELLED':
      return 'El proceso de pago fue cancelado'
    case 'EXPIRED':
      return 'La orden expiró'
    case 'REQUIRES_ACTION':
      return 'El pago requiere una acción adicional'
    case 'REFUNDED':
      return 'El pago fue reembolsado'
    case 'CHARGED_BACK':
      return 'El pago fue contracargado'
  }
}

function assertStatusShape(body: unknown): OrderStatusSuccess {
  if (!body || typeof body !== 'object') {
    throw new OrderStatusApiError('UNKNOWN', 500)
  }
  const data = body as Record<string, unknown>
  const status = data.status
  const terminal = data.terminal
  const next = data.next_poll_after_seconds
  if (typeof status !== 'string' || !PUBLIC_STATUSES.has(status as PublicOrderStatus)) {
    throw new OrderStatusApiError('UNKNOWN', 500)
  }
  if (typeof terminal !== 'boolean') {
    throw new OrderStatusApiError('UNKNOWN', 500)
  }
  if (!(next === null || (typeof next === 'number' && Number.isFinite(next)))) {
    throw new OrderStatusApiError('UNKNOWN', 500)
  }
  return {
    status: status as PublicOrderStatus,
    terminal,
    next_poll_after_seconds: next,
  }
}

export async function getOrderStatus(reference: string): Promise<OrderStatusSuccess> {
  if (!isValidPublicOrderReference(reference)) {
    throw new OrderStatusApiError('INVALID_REFERENCE', 400)
  }
  if (!navigator.onLine) {
    throw new OrderStatusApiError('OFFLINE', 0)
  }

  const url = `${checkoutEndpoint('get-order-status')}?reference=${encodeURIComponent(reference)}`
  const response = await fetch(url, { method: 'GET', headers: { Accept: 'application/json' } })

  let json: unknown = null
  try {
    json = await response.json()
  } catch {
    json = null
  }

  if (!response.ok) {
    const code =
      json && typeof json === 'object'
        ? String((json as { error?: { code?: unknown } }).error?.code ?? 'UNKNOWN')
        : 'UNKNOWN'
    throw new OrderStatusApiError(code, response.status)
  }

  return assertStatusShape(json)
}

export function clampPollSeconds(raw: number | null | undefined): number {
  const n = typeof raw === 'number' && Number.isFinite(raw) ? raw : 3
  return Math.min(10, Math.max(2, Math.round(n)))
}
