import { createRootRoute, createRoute } from '@tanstack/react-router'
import App from './App'
import AppLayout from './components/AppLayout'
import LandingPage from './pages/LandingPage'
import RegistroPage from './pages/RegistroPage'
import PagoPage from './pages/PagoPage'
import ConfirmacionPage from './pages/ConfirmacionPage'
import DashboardPage from './pages/DashboardPage'
import TrainingPage from './pages/TrainingPage'
import CommunityPage from './pages/CommunityPage'
import EventPage from './pages/EventPage'
import ShopPage from './pages/ShopPage'
import ProductDetailPage from './pages/ProductDetailPage'
import CartPage from './pages/CartPage'
import MerchCheckoutPage from './pages/MerchCheckoutPage'
import MerchConfirmacionPage from './pages/MerchConfirmacionPage'
import SpectatorTicketPage from './pages/SpectatorTicketPage'
import SpectatorConfirmPage from './pages/SpectatorConfirmPage'
import ProfilePage from './pages/ProfilePage'
import AdminPage from './pages/AdminPage'

// ---- Root ----
const rootRoute = createRootRoute({ component: App })

// ---- Public routes ----
const landingRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: LandingPage })
const registroRoute = createRoute({ getParentRoute: () => rootRoute, path: '/registro', component: RegistroPage })
const pagoRoute = createRoute({ getParentRoute: () => rootRoute, path: '/pago', component: PagoPage })
const confirmacionRoute = createRoute({ getParentRoute: () => rootRoute, path: '/confirmacion', component: ConfirmacionPage })
const adminRoute = createRoute({ getParentRoute: () => rootRoute, path: '/admin', component: AdminPage })

// ---- App layout (with bottom tab bar) ----
const appLayoutRoute = createRoute({ getParentRoute: () => rootRoute, id: 'app-layout', component: AppLayout })

const dashboardRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/app', component: DashboardPage })
const trainingRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/app/entrenamiento', component: TrainingPage })
const communityRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/app/comunidad', component: CommunityPage })
const eventTabRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/app/evento', component: EventPage })
const shopRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/app/shop', component: ShopPage })
const profileRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/app/perfil', component: ProfilePage })

// Shop sub-routes
const productDetailRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/app/shop/$productId', component: ProductDetailPage })
const cartRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/app/shop/cart', component: CartPage })
const merchCheckoutRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/app/shop/checkout', component: MerchCheckoutPage })
const merchConfirmRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/app/shop/confirmacion', component: MerchConfirmacionPage })

// Spectator sub-routes
const spectatorRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/app/evento/aficionado', component: SpectatorTicketPage })
const spectatorConfirmRoute = createRoute({ getParentRoute: () => appLayoutRoute, path: '/app/evento/aficionado/confirmacion', component: SpectatorConfirmPage })

export const routeTree = rootRoute.addChildren([
  landingRoute,
  registroRoute,
  pagoRoute,
  confirmacionRoute,
  adminRoute,
  appLayoutRoute.addChildren([
    dashboardRoute,
    trainingRoute,
    communityRoute,
    eventTabRoute,
    spectatorRoute,
    spectatorConfirmRoute,
    shopRoute,
    productDetailRoute,
    cartRoute,
    merchCheckoutRoute,
    merchConfirmRoute,
    profileRoute,
  ]),
])
