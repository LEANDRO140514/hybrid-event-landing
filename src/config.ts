export const DOMAINS = {
  // Web institucional de ENFORMA.
  corporate: import.meta.env.VITE_CORPORATE_DOMAIN || 'enforma.mx',
  // Landing pública de HYBRID EXPERIENCE — dominio canónico confirmado.
  event: import.meta.env.VITE_EVENT_DOMAIN || 'hybrid-experience.enforma.mx',
  // Futuro registro y compra pública en Ready2Hybrid. No usar app.enforma.mx para esto.
  registration: import.meta.env.VITE_REGISTRATION_DOMAIN || 'registro.enforma.mx',
  // Futuro panel operativo de Ready2Hybrid.
  admin: import.meta.env.VITE_ADMIN_DOMAIN || 'admin.enforma.mx',
  // Reservado para la futura ENFORMA App — no es el dominio de inscripción.
  app: import.meta.env.VITE_APP_DOMAIN || 'app.enforma.mx',
  shop: import.meta.env.VITE_SHOP_DOMAIN || 'shop.enforma.mx',
}
