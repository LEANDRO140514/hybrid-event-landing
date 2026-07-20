import { createRootRoute, createRoute } from '@tanstack/react-router'
import App from './App'
import LandingPage from './pages/LandingPage'
import CorporateLandingPage from './pages/CorporateLandingPage'

// ---- Root ----
const rootRoute = createRootRoute({ component: App })

// ---- Public Routes (The Hybrid Experience) ----
const landingRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: LandingPage })

// ---- Corporate ----
const corporateRoute = createRoute({ getParentRoute: () => rootRoute, path: '/corporate', component: CorporateLandingPage })

export const routeTree = rootRoute.addChildren([
  landingRoute,
  corporateRoute,
])
