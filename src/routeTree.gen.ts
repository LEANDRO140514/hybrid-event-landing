import { createRootRoute, createRoute } from '@tanstack/react-router'
import App from './App'
import LandingPage from './pages/LandingPage'
import CheckoutConfirmPage from './pages/CheckoutConfirmPage'
import OpenpayReturnPage from './pages/OpenpayReturnPage'
import TermsPage from './pages/TermsPage'
import PrivacyPage from './pages/PrivacyPage'
import { PRIVACY_PATH, TERMS_PATH } from './config/legalConfig'

// ---- Root ----
const rootRoute = createRootRoute({ component: App })

// ---- Public Routes (The Hybrid Experience) ----
const landingRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: LandingPage })
const checkoutConfirmRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout/confirmando',
  validateSearch: (search: Record<string, unknown>) => ({
    // Mercado Pago may append collection_* etc.; only `ref` is optionally used as fallback.
    ref: typeof search.ref === 'string' ? search.ref : undefined,
  }),
  component: CheckoutConfirmPage,
})

const openpayReturnRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout/openpay',
  component: OpenpayReturnPage,
})

const termsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: TERMS_PATH,
  component: TermsPage,
})

const privacyRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: PRIVACY_PATH,
  component: PrivacyPage,
})

export const routeTree = rootRoute.addChildren([
  landingRoute,
  checkoutConfirmRoute,
  openpayReturnRoute,
  termsRoute,
  privacyRoute,
])
