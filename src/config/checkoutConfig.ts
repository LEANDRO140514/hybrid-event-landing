export type CheckoutMode = 'off' | 'sandbox' | 'production'

export type SandboxCheckoutFamily = 'spectator' | 'press' | 'competitor' | 'team'
export type SandboxQuantityMode = 'editable' | 'fixed'

export type SandboxCheckoutProductConfig = {
  productCode: string
  family: SandboxCheckoutFamily
  quantityMode: SandboxQuantityMode
  minimumQuantity: number
}

const PRODUCTION_HOST = 'hybrid-experience.enforma.mx'

/** Explicit checkout product allowlist — no monetary fields. */
const SANDBOX_CHECKOUT_PRODUCTS: Record<string, SandboxCheckoutProductConfig> = {
  'PUB-VIE': {
    productCode: 'PUB-VIE',
    family: 'spectator',
    quantityMode: 'editable',
    minimumQuantity: 1,
  },
  'PUB-SAB': {
    productCode: 'PUB-SAB',
    family: 'spectator',
    quantityMode: 'editable',
    minimumQuantity: 1,
  },
  'PUB-DOM': {
    productCode: 'PUB-DOM',
    family: 'spectator',
    quantityMode: 'editable',
    minimumQuantity: 1,
  },
  'PUB-3D': {
    productCode: 'PUB-3D',
    family: 'spectator',
    quantityMode: 'editable',
    minimumQuantity: 1,
  },
  'FOT-VIE': {
    productCode: 'FOT-VIE',
    family: 'press',
    quantityMode: 'fixed',
    minimumQuantity: 1,
  },
  'FOT-SAB': {
    productCode: 'FOT-SAB',
    family: 'press',
    quantityMode: 'fixed',
    minimumQuantity: 1,
  },
  'FOT-DOM': {
    productCode: 'FOT-DOM',
    family: 'press',
    quantityMode: 'fixed',
    minimumQuantity: 1,
  },
  'FOT-3D': {
    productCode: 'FOT-3D',
    family: 'press',
    quantityMode: 'fixed',
    minimumQuantity: 1,
  },
  // Individual competitors — one athlete slot per purchase, no roster.
  // Sports-participation waiver is captured physically at kit pickup,
  // outside this system.
  'IND-H': {
    productCode: 'IND-H',
    family: 'competitor',
    quantityMode: 'fixed',
    minimumQuantity: 1,
  },
  'IND-M': {
    productCode: 'IND-M',
    family: 'competitor',
    quantityMode: 'fixed',
    minimumQuantity: 1,
  },
  'HALF-IND-H': {
    productCode: 'HALF-IND-H',
    family: 'competitor',
    quantityMode: 'fixed',
    minimumQuantity: 1,
  },
  'HALF-IND-M': {
    productCode: 'HALF-IND-M',
    family: 'competitor',
    quantityMode: 'fixed',
    minimumQuantity: 1,
  },
  'WOD-H': {
    productCode: 'WOD-H',
    family: 'competitor',
    quantityMode: 'fixed',
    minimumQuantity: 1,
  },
  'WOD-M': {
    productCode: 'WOD-M',
    family: 'competitor',
    quantityMode: 'fixed',
    minimumQuantity: 1,
  },
  // Team categories — one team slot per purchase (quantity is teams, not
  // people). Roster of full names is collected in the card via
  // TeammateNameFields (integrantes - 1 fields); captain = buyer.
  'DOB-VIE-MM': {
    productCode: 'DOB-VIE-MM',
    family: 'team',
    quantityMode: 'fixed',
    minimumQuantity: 1,
  },
  'DOB-SAB-HH': {
    productCode: 'DOB-SAB-HH',
    family: 'team',
    quantityMode: 'fixed',
    minimumQuantity: 1,
  },
  'DOB-SAB-MH': {
    productCode: 'DOB-SAB-MH',
    family: 'team',
    quantityMode: 'fixed',
    minimumQuantity: 1,
  },
  'REL-4H': {
    productCode: 'REL-4H',
    family: 'team',
    quantityMode: 'fixed',
    minimumQuantity: 1,
  },
  'REL-4M': {
    productCode: 'REL-4M',
    family: 'team',
    quantityMode: 'fixed',
    minimumQuantity: 1,
  },
  'REL-2H2M': {
    productCode: 'REL-2H2M',
    family: 'team',
    quantityMode: 'fixed',
    minimumQuantity: 1,
  },
  'HALF-DOB-MM': {
    productCode: 'HALF-DOB-MM',
    family: 'team',
    quantityMode: 'fixed',
    minimumQuantity: 1,
  },
  'HALF-DOB-HH': {
    productCode: 'HALF-DOB-HH',
    family: 'team',
    quantityMode: 'fixed',
    minimumQuantity: 1,
  },
  'HALF-DOB-MH': {
    productCode: 'HALF-DOB-MH',
    family: 'team',
    quantityMode: 'fixed',
    minimumQuantity: 1,
  },
}

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

function parseCheckoutMode(raw: string | undefined): CheckoutMode {
  const value = (raw ?? 'off').trim().toLowerCase()
  if (value === 'sandbox' || value === 'production') return value
  return 'off'
}

const checkoutMode: CheckoutMode = parseCheckoutMode(import.meta.env.VITE_CHECKOUT_MODE)
const checkoutEnabledFlag = readBool(import.meta.env.VITE_CHECKOUT_ENABLED)
const functionsBase = normalizeFunctionsBase(import.meta.env.VITE_INSFORGE_FUNCTIONS_BASE)

function hasCheckoutRuntime(): boolean {
  return checkoutEnabledFlag && functionsBase != null
}

function isCanonicalProductionHost(): boolean {
  return currentHostname() === PRODUCTION_HOST
}

/** Sandbox: never on the canonical production host. */
export function isSandboxCheckoutActive(): boolean {
  if (checkoutMode !== 'sandbox') return false
  if (!hasCheckoutRuntime()) return false
  if (isCanonicalProductionHost()) return false
  return true
}

/** Production: only on the canonical production host. */
export function isProductionCheckoutActive(): boolean {
  if (checkoutMode !== 'production') return false
  if (!hasCheckoutRuntime()) return false
  if (!isCanonicalProductionHost()) return false
  return true
}

/** UI + confirm page: either allowed mode for this host. */
export function isCheckoutActive(): boolean {
  return isSandboxCheckoutActive() || isProductionCheckoutActive()
}

export function getSandboxCheckoutProductConfig(
  productCode: string,
): SandboxCheckoutProductConfig | null {
  return SANDBOX_CHECKOUT_PRODUCTS[productCode] ?? null
}

export function isSandboxCheckoutProduct(productCode: string): boolean {
  return getSandboxCheckoutProductConfig(productCode) != null
}

export function listSandboxCheckoutProductCodes(): string[] {
  return Object.keys(SANDBOX_CHECKOUT_PRODUCTS)
}

export function getCheckoutConfig() {
  return {
    checkoutMode,
    checkoutEnabledFlag,
    functionsBase,
    productionHost: PRODUCTION_HOST,
    active: isCheckoutActive(),
    sandboxActive: isSandboxCheckoutActive(),
    productionActive: isProductionCheckoutActive(),
  }
}

export function checkoutEndpoint(path: 'mp-create-checkout' | 'get-order-status'): string {
  const base = getCheckoutConfig().functionsBase
  if (!base) {
    throw new Error('Checkout is not configured')
  }
  return `${base}/functions/${path}`
}
