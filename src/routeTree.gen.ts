import { createRootRoute, createRoute } from '@tanstack/react-router'
import App from './App'
import LandingPage from './pages/LandingPage'
import RegistroPage from './pages/RegistroPage'
import PagoPage from './pages/PagoPage'
import ConfirmacionPage from './pages/ConfirmacionPage'
import SpectatorTicketPage from './pages/SpectatorTicketPage'
import SpectatorConfirmPage from './pages/SpectatorConfirmPage'
import CorporateLandingPage from './pages/CorporateLandingPage'

// ---- Root ----
const rootRoute = createRootRoute({ component: App })

// ---- Public Routes (The Hybrid Event) ----
const landingRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: LandingPage })
const registroRoute = createRoute({ getParentRoute: () => rootRoute, path: '/registro', component: RegistroPage })
const pagoRoute = createRoute({ getParentRoute: () => rootRoute, path: '/pago', component: PagoPage })
const confirmacionRoute = createRoute({ getParentRoute: () => rootRoute, path: '/confirmacion', component: ConfirmacionPage })

// ---- Spectator Tickets (public, no longer under /app) ----
const ticketsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/tickets', component: SpectatorTicketPage })
const ticketsConfirmRoute = createRoute({ getParentRoute: () => rootRoute, path: '/tickets/confirmacion', component: SpectatorConfirmPage })

// ---- Corporate ----
const corporateRoute = createRoute({ getParentRoute: () => rootRoute, path: '/corporate', component: CorporateLandingPage })

export const routeTree = rootRoute.addChildren([
  landingRoute,
  registroRoute,
  pagoRoute,
  confirmacionRoute,
  ticketsRoute,
  ticketsConfirmRoute,
  corporateRoute,
])
