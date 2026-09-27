import { DOMAINS } from '../config'
import { getAffiliateCode } from '../lib/affiliate'
import { appendAttributionParams } from '../lib/attribution'
import { resolveEtapaComercial, type EtapaComercial } from '../lib/pricingStage'

export type ProductoBloque = 'COMPITE' | 'EXPERIENCE' | 'ASISTE'
export type ProductoDia = 'Viernes' | 'Sábado' | 'Domingo' | 'Vie-Dom'
export type ProductoSesion = 'AM' | 'PM' | 'DIA'
export type ProductoKind = 'competitor' | 'workout' | 'spectator' | 'press'

export interface PrecioPorEtapa {
  lanzamiento: number
  preventa: number
  regular: number
}

export interface Producto {
  code: string
  /** Mirrors products.kind. Competitor codes lock to launch price when an affiliate is stored. */
  kind: ProductoKind
  nombre: string
  bloque: ProductoBloque
  tipo: string
  integrantes: number
  dia: ProductoDia
  sesion: ProductoSesion
  /**
   * Legacy flat display price — still what the current UI renders (Fase 2
   * migrates the UI to precioPorEtapa). For staged products this mirrors
   * the `lanzamiento` tier value.
   */
  precio: number
  /** Per-stage price for display. null = product has no staged pricing (Público/Fotógrafo). */
  precioPorEtapa: PrecioPorEtapa | null
  /** MSI (meses sin intereses) eligibility. */
  msi: boolean
  precioUnidad: string
  incluyeChip: boolean
}

export const CATALOGO: Producto[] = [
  // ── COMPITE — Viernes 13 · PM · Dobles Mujeres + Individual (apertura del evento) ──
  { code: 'DOB-VIE-MM', kind: 'competitor', nombre: 'Dobles Mujeres', bloque: 'COMPITE', tipo: 'Dobles', integrantes: 2, dia: 'Viernes', sesion: 'PM', precio: 2500, precioPorEtapa: { lanzamiento: 2500, preventa: 2750, regular: 3000 }, msi: true, precioUnidad: 'por pareja ($1,250 c/u)', incluyeChip: true },
  { code: 'IND-H', kind: 'competitor', nombre: 'Individual Hombre (Open)', bloque: 'COMPITE', tipo: 'Individual', integrantes: 1, dia: 'Viernes', sesion: 'PM', precio: 1500, precioPorEtapa: { lanzamiento: 1500, preventa: 1650, regular: 1800 }, msi: true, precioUnidad: 'por persona', incluyeChip: true },
  { code: 'IND-M', kind: 'competitor', nombre: 'Individual Mujer (Open)', bloque: 'COMPITE', tipo: 'Individual', integrantes: 1, dia: 'Viernes', sesion: 'PM', precio: 1500, precioPorEtapa: { lanzamiento: 1500, preventa: 1650, regular: 1800 }, msi: true, precioUnidad: 'por persona', incluyeChip: true },

  // ── COMPITE — Sábado 14 · Día completo · Dobles Hombres + Mixto ──
  { code: 'DOB-SAB-HH', kind: 'competitor', nombre: 'Dobles Hombres', bloque: 'COMPITE', tipo: 'Dobles', integrantes: 2, dia: 'Sábado', sesion: 'DIA', precio: 2500, precioPorEtapa: { lanzamiento: 2500, preventa: 2750, regular: 3000 }, msi: true, precioUnidad: 'por pareja ($1,250 c/u)', incluyeChip: true },
  { code: 'DOB-SAB-MH', kind: 'competitor', nombre: 'Dobles Mixto', bloque: 'COMPITE', tipo: 'Dobles', integrantes: 2, dia: 'Sábado', sesion: 'DIA', precio: 2500, precioPorEtapa: { lanzamiento: 2500, preventa: 2750, regular: 3000 }, msi: true, precioUnidad: 'por pareja ($1,250 c/u)', incluyeChip: true },

  // ── COMPITE — Domingo 15 · AM · Relay (4 personas), cierre del evento ──
  { code: 'REL-4H', kind: 'competitor', nombre: 'Relay 4 Hombres', bloque: 'COMPITE', tipo: 'Relay', integrantes: 4, dia: 'Domingo', sesion: 'AM', precio: 3200, precioPorEtapa: { lanzamiento: 3200, preventa: 3500, regular: 3800 }, msi: true, precioUnidad: 'por equipo ($850 c/u)', incluyeChip: true },
  { code: 'REL-4M', kind: 'competitor', nombre: 'Relay 4 Mujeres', bloque: 'COMPITE', tipo: 'Relay', integrantes: 4, dia: 'Domingo', sesion: 'AM', precio: 3200, precioPorEtapa: { lanzamiento: 3200, preventa: 3500, regular: 3800 }, msi: true, precioUnidad: 'por equipo ($850 c/u)', incluyeChip: true },
  { code: 'REL-2H2M', kind: 'competitor', nombre: 'Relay Mixto 2H+2M', bloque: 'COMPITE', tipo: 'Relay', integrantes: 4, dia: 'Domingo', sesion: 'AM', precio: 3200, precioPorEtapa: { lanzamiento: 3200, preventa: 3500, regular: 3800 }, msi: true, precioUnidad: 'por equipo ($850 c/u)', incluyeChip: true },

  // ── EXPERIENCE — ½ Hybrid — Sábado 14 · Día completo ──
  { code: 'HALF-IND-M', kind: 'competitor', nombre: '½ Hybrid Individual Mujer', bloque: 'EXPERIENCE', tipo: '½ Hybrid Individual', integrantes: 1, dia: 'Sábado', sesion: 'DIA', precio: 800, precioPorEtapa: { lanzamiento: 800, preventa: 900, regular: 1000 }, msi: true, precioUnidad: 'por persona', incluyeChip: true },
  { code: 'HALF-IND-H', kind: 'competitor', nombre: '½ Hybrid Individual Hombre', bloque: 'EXPERIENCE', tipo: '½ Hybrid Individual', integrantes: 1, dia: 'Sábado', sesion: 'DIA', precio: 800, precioPorEtapa: { lanzamiento: 800, preventa: 900, regular: 1000 }, msi: true, precioUnidad: 'por persona', incluyeChip: true },
  { code: 'HALF-DOB-MM', kind: 'competitor', nombre: '½ Hybrid Dobles Mujeres', bloque: 'EXPERIENCE', tipo: '½ Hybrid Dobles', integrantes: 2, dia: 'Sábado', sesion: 'DIA', precio: 1600, precioPorEtapa: { lanzamiento: 1600, preventa: 1800, regular: 2000 }, msi: true, precioUnidad: 'por pareja ($850 c/u)', incluyeChip: true },
  { code: 'HALF-DOB-HH', kind: 'competitor', nombre: '½ Hybrid Dobles Hombres', bloque: 'EXPERIENCE', tipo: '½ Hybrid Dobles', integrantes: 2, dia: 'Sábado', sesion: 'DIA', precio: 1600, precioPorEtapa: { lanzamiento: 1600, preventa: 1800, regular: 2000 }, msi: true, precioUnidad: 'por pareja ($850 c/u)', incluyeChip: true },
  { code: 'HALF-DOB-MH', kind: 'competitor', nombre: '½ Hybrid Dobles Mixto', bloque: 'EXPERIENCE', tipo: '½ Hybrid Dobles', integrantes: 2, dia: 'Sábado', sesion: 'DIA', precio: 1600, precioPorEtapa: { lanzamiento: 1600, preventa: 1800, regular: 2000 }, msi: true, precioUnidad: 'por pareja ($850 c/u)', incluyeChip: true },

  // ── EXPERIENCE — Workout Experience — Sábado 14 · Día completo · $350 (todas las etapas, sin MSI) ──
  { code: 'WOD-M', kind: 'workout', nombre: 'Workout Experience Mujer', bloque: 'EXPERIENCE', tipo: 'Workout Experience', integrantes: 1, dia: 'Sábado', sesion: 'DIA', precio: 350, precioPorEtapa: { lanzamiento: 350, preventa: 350, regular: 350 }, msi: false, precioUnidad: 'por persona', incluyeChip: false },
  { code: 'WOD-H', kind: 'workout', nombre: 'Workout Experience Hombre', bloque: 'EXPERIENCE', tipo: 'Workout Experience', integrantes: 1, dia: 'Sábado', sesion: 'DIA', precio: 350, precioPorEtapa: { lanzamiento: 350, preventa: 350, regular: 350 }, msi: false, precioUnidad: 'por persona', incluyeChip: false },

  // ── ASISTE — Público · $250 por día (sin etapas, sin MSI) ──
  { code: 'PUB-VIE', kind: 'spectator', nombre: 'Público — Viernes', bloque: 'ASISTE', tipo: 'Público', integrantes: 1, dia: 'Viernes', sesion: 'AM', precio: 250, precioPorEtapa: null, msi: false, precioUnidad: 'por día', incluyeChip: false },
  { code: 'PUB-SAB', kind: 'spectator', nombre: 'Público — Sábado', bloque: 'ASISTE', tipo: 'Público', integrantes: 1, dia: 'Sábado', sesion: 'AM', precio: 250, precioPorEtapa: null, msi: false, precioUnidad: 'por día', incluyeChip: false },
  { code: 'PUB-DOM', kind: 'spectator', nombre: 'Público — Domingo', bloque: 'ASISTE', tipo: 'Público', integrantes: 1, dia: 'Domingo', sesion: 'AM', precio: 250, precioPorEtapa: null, msi: false, precioUnidad: 'por día', incluyeChip: false },
  { code: 'PUB-3D', kind: 'spectator', nombre: 'Público — Pase 3 Días', bloque: 'ASISTE', tipo: 'Público', integrantes: 1, dia: 'Vie-Dom', sesion: 'AM', precio: 600, precioPorEtapa: null, msi: false, precioUnidad: 'pase 3 días', incluyeChip: false },

  // ── ASISTE — Fotógrafo · $350 por día (acreditación para fotógrafos externos, sin etapas, sin MSI) ──
  { code: 'FOT-VIE', kind: 'press', nombre: 'Fotógrafo — Viernes', bloque: 'ASISTE', tipo: 'Fotógrafo', integrantes: 1, dia: 'Viernes', sesion: 'AM', precio: 350, precioPorEtapa: null, msi: false, precioUnidad: 'por día', incluyeChip: false },
  { code: 'FOT-SAB', kind: 'press', nombre: 'Fotógrafo — Sábado', bloque: 'ASISTE', tipo: 'Fotógrafo', integrantes: 1, dia: 'Sábado', sesion: 'AM', precio: 350, precioPorEtapa: null, msi: false, precioUnidad: 'por día', incluyeChip: false },
  { code: 'FOT-DOM', kind: 'press', nombre: 'Fotógrafo — Domingo', bloque: 'ASISTE', tipo: 'Fotógrafo', integrantes: 1, dia: 'Domingo', sesion: 'AM', precio: 350, precioPorEtapa: null, msi: false, precioUnidad: 'por día', incluyeChip: false },
  { code: 'FOT-3D', kind: 'press', nombre: 'Fotógrafo — Pase 3 Días', bloque: 'ASISTE', tipo: 'Fotógrafo', integrantes: 1, dia: 'Vie-Dom', sesion: 'AM', precio: 800, precioPorEtapa: null, msi: false, precioUnidad: 'pase 3 días', incluyeChip: false },
]

/**
 * Registration URL for a product, carrying the `cat` code plus last-touch
 * UTM params (when present) so campaign attribution survives the hop to
 * registro.enforma.mx. Built with URL/URLSearchParams — never string
 * concatenation — so existing/appended params are never duplicated or
 * malformed. fbclid/gclid are intentionally not appended here; see
 * lib/attribution.ts.
 */
export function getInscribirUrl(code: string): string {
  const base = `https://${DOMAINS.registration}/inscribir?cat=${encodeURIComponent(code)}`
  return appendAttributionParams(base)
}

export function formatPrecio(precio: number): string {
  return `$${precio.toLocaleString('es-MX')} MXN`
}

export function porBloque(bloque: ProductoBloque): Producto[] {
  return CATALOGO.filter((p) => p.bloque === bloque)
}

/**
 * Calendar price for a product. Falls back to the legacy `precio` scalar when
 * the product has no staged pricing (Público/Fotógrafo) or when `now` is
 * outside every window.
 */
export function getPrecioVigente(producto: Producto, etapa: EtapaComercial | null): number {
  if (producto.precioPorEtapa && etapa) {
    return producto.precioPorEtapa[etapa]
  }
  return producto.precio
}

/**
 * Price shown on the card and sent as expected_unit_price_cents.
 * An active affiliate code locks competitor products to launch; everything
 * else uses the calendar stage.
 */
export function getPrecioMostrado(producto: Producto, now: Date = new Date()): number {
  if (getAffiliateCode() && producto.kind === 'competitor' && producto.precioPorEtapa) {
    return producto.precioPorEtapa.lanzamiento
  }
  return getPrecioVigente(producto, resolveEtapaComercial(now))
}
