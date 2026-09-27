import React from 'react'
import ReactDOM from 'react-dom/client'
import { ThemeProvider, CssBaseline } from '@mui/material'
import { SnackbarProvider } from 'notistack'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { captureAffiliateFromUrl } from './lib/affiliate'
import { captureAttributionFromUrl } from './lib/attribution'
import { getOrCreateSessionId, getOrCreateVisitorId } from './lib/visitor'
import { initAnalytics, trackPageView, trackViewContent } from './lib/analytics'
import { theme } from './theme'
import { routeTree } from './routeTree.gen'
import NotFoundPage from './pages/NotFoundPage'

captureAffiliateFromUrl()
captureAttributionFromUrl()
getOrCreateVisitorId()
getOrCreateSessionId()

// Fired once per real (fresh) page load — this SPA has only two routes and
// the funnel itself is anchor/scroll based within `/`, so a module-level
// boot call (not a per-route effect) is what actually matches "once per
// navigation" here, and sidesteps any React.StrictMode double-invoke risk.
initAnalytics()
trackPageView()
if (window.location.pathname === '/') trackViewContent()

const router = createRouter({ routeTree, defaultNotFoundComponent: NotFoundPage })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <RouterProvider router={router} />
      </SnackbarProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
