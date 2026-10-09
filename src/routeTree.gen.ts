import { createRootRoute, createRoute } from '@tanstack/react-router'
import App from './App'
import LandingPage from './pages/LandingPage'
import CheckoutConfirmPage from './pages/CheckoutConfirmPage'
import OpenpayReturnPage from './pages/OpenpayReturnPage'

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

export const routeTree = rootRoute.addChildren([
  landingRoute,
  checkoutConfirmRoute,
  openpayReturnRoute,
])
