const isDev = import.meta.env.DEV

export const API_CONFIG = {
  edgeFunctionsUrl: import.meta.env.VITE_EDGE_FUNCTIONS_URL || (isDev ? 'http://localhost:54321/functions/v1' : 'https://3e9sriq7.function2.insforge.app'),
  r2rBaseUrl: import.meta.env.VITE_R2R_BASE_URL || (isDev ? 'http://localhost:8080' : 'https://api.enforma.mx'),
}
