const isDev = import.meta.env.DEV

export const API_CONFIG = {
  edgeFunctionsUrl: import.meta.env.VITE_EDGE_FUNCTIONS_URL || (isDev ? 'http://localhost:54321/functions/v1' : 'https://3e9sriq7.function2.insforge.app'),
  r2rBaseUrl: import.meta.env.VITE_R2R_BASE_URL || (isDev ? 'http://localhost:8080' : 'https://api.enforma.mx'),
}

export const DOMAINS = {
  event: import.meta.env.VITE_EVENT_DOMAIN || 'hybrid.enforma.mx',
  app: import.meta.env.VITE_APP_DOMAIN || 'app.enforma.mx',
  shop: import.meta.env.VITE_SHOP_DOMAIN || 'shop.enforma.mx',
  admin: import.meta.env.VITE_ADMIN_DOMAIN || 'admin.enforma.mx',
  r2r: import.meta.env.VITE_R2R_DOMAIN || 'ready2race.enforma.mx',
}
