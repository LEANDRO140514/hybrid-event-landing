export type CheckoutMode = 'off' | 'sandbox'

const PRODUCTION_HOST = 'hybrid-experience.enforma.mx'

function readBool(raw: string | undefined): boolean {
  return (raw ?? '').trim().toLowerCase() === 'true'
}

function normalizeFunctionsBase(raw: string | undefined): string | null {
  const value = (raw ?? '').trim().replace(/\/+$/, '')
  if (!value) return null
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:') return null
    return url.origin + url.pathname.replace(/\/+$/, '')
  } catch {
    return null
  }
}

function currentHostname(): string {
  if (typeof window === 'undefined') return ''
  return window.location.hostname.toLowerCase()
}

const modeRaw = (import.meta.env.VITE_CHECKOUT_MODE ?? 'off').trim().toLowerCase()
const checkoutMode: CheckoutMode = modeRaw === 'sandbox' ? 'sandbox' : 'off'
const checkoutEnabledFlag = readBool(import.meta.env.VITE_CHECKOUT_ENABLED)
const functionsBase = normalizeFunctionsBase(import.meta.env.VITE_INSFORGE_FUNCTIONS_BASE)

/** Sandbox checkout never initializes on the canonical production host. */
export function isSandboxCheckoutActive(): boolean {
  if (checkoutMode !== 'sandbox') return false
  if (!checkoutEnabledFlag) return false
  if (!functionsBase) return false
  if (currentHostname() === PRODUCTION_HOST) return false
  return true
}

export function getCheckoutConfig() {
  return {
    checkoutMode,
    checkoutEnabledFlag,
    functionsBase,
    productionHost: PRODUCTION_HOST,
    active: isSandboxCheckoutActive(),
  }
}

export function checkoutEndpoint(path: 'mp-create-checkout' | 'get-order-status'): string {
  const base = getCheckoutConfig().functionsBase
  if (!base) {
    throw new Error('Checkout is not configured')
  }
  return `${base}/functions/${path}`
}
