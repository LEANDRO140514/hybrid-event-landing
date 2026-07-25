import { DOMAINS } from '../config'

export type ProductoBloque = 'COMPITE' | 'EXPERIENCE' | 'ASISTE'
export type ProductoDia = 'Viernes' | 'Sábado' | 'Domingo' | 'Vie-Dom'
export type ProductoSesion = 'AM' | 'PM'

export interface Producto {
  code: string
  nombre: string
  bloque: ProductoBloque
  tipo: string
  integrantes: number
  dia: ProductoDia
  sesion: ProductoSesion
  precio: number
  precioUnidad: string
  incluyeChip: boolean
}

export const CATALOGO: Producto[] = [
  // ── COMPITE — Viernes 9 · PM · Dobles · $2,500 por pareja ──
  { code: 'DOB-VIE-MM', nombre: 'Dobles Mujeres', bloque: 'COMPITE', tipo: 'Dobles', integrantes: 2, dia: 'Viernes', sesion: 'PM', precio: 2500, precioUnidad: 'por pareja ($1,250 c/u)', incluyeChip: true },
  { code: 'DOB-VIE-HH', nombre: 'Dobles Hombres', bloque: 'COMPITE', tipo: 'Dobles', integrantes: 2, dia: 'Viernes', sesion: 'PM', precio: 2500, precioUnidad: 'por pareja ($1,250 c/u)', incluyeChip: true },
  { code: 'DOB-VIE-MH', nombre: 'Dobles Mixto', bloque: 'COMPITE', tipo: 'Dobles', integrantes: 2, dia: 'Viernes', sesion: 'PM', precio: 2500, precioUnidad: 'por pareja ($1,250 c/u)', incluyeChip: true },

  // ── COMPITE — Sábado 10 · AM · Dobles · $2,500 por pareja ──
  { code: 'DOB-SAB-MM', nombre: 'Dobles Mujeres', bloque: 'COMPITE', tipo: 'Dobles', integrantes: 2, dia: 'Sábado', sesion: 'AM', precio: 2500, precioUnidad: 'por pareja ($1,250 c/u)', incluyeChip: true },
  { code: 'DOB-SAB-HH', nombre: 'Dobles Hombres', bloque: 'COMPITE', tipo: 'Dobles', integrantes: 2, dia: 'Sábado', sesion: 'AM', precio: 2500, precioUnidad: 'por pareja ($1,250 c/u)', incluyeChip: true },
  { code: 'DOB-SAB-MH', nombre: 'Dobles Mixto', bloque: 'COMPITE', tipo: 'Dobles', integrantes: 2, dia: 'Sábado', sesion: 'AM', precio: 2500, precioUnidad: 'por pareja ($1,250 c/u)', incluyeChip: true },

  // ── COMPITE — Sábado 10 · PM · Relay (4 personas) · $3,400 por equipo ──
  { code: 'REL-4H', nombre: 'Relay 4 Hombres', bloque: 'COMPITE', tipo: 'Relay', integrantes: 4, dia: 'Sábado', sesion: 'PM', precio: 3400, precioUnidad: 'por equipo ($850 c/u)', incluyeChip: true },
  { code: 'REL-4M', nombre: 'Relay 4 Mujeres', bloque: 'COMPITE', tipo: 'Relay', integrantes: 4, dia: 'Sábado', sesion: 'PM', precio: 3400, precioUnidad: 'por equipo ($850 c/u)', incluyeChip: true },
  { code: 'REL-2H2M', nombre: 'Relay Mixto 2H+2M', bloque: 'COMPITE', tipo: 'Relay', integrantes: 4, dia: 'Sábado', sesion: 'PM', precio: 3400, precioUnidad: 'por equipo ($850 c/u)', incluyeChip: true },

  // ── COMPITE — Domingo 11 · AM · Individual · $1,500 por persona ──
  { code: 'IND-H', nombre: 'Individual Hombre (Open)', bloque: 'COMPITE', tipo: 'Individual', integrantes: 1, dia: 'Domingo', sesion: 'AM', precio: 1500, precioUnidad: 'por persona', incluyeChip: true },
  { code: 'IND-M', nombre: 'Individual Mujer (Open)', bloque: 'COMPITE', tipo: 'Individual', integrantes: 1, dia: 'Domingo', sesion: 'AM', precio: 1500, precioUnidad: 'por persona', incluyeChip: true },
  { code: 'IND-PRO-H', nombre: 'Individual Pro Hombre', bloque: 'COMPITE', tipo: 'Individual', integrantes: 1, dia: 'Domingo', sesion: 'AM', precio: 1500, precioUnidad: 'por persona', incluyeChip: true },
  { code: 'IND-PRO-M', nombre: 'Individual Pro Mujer', bloque: 'COMPITE', tipo: 'Individual', integrantes: 1, dia: 'Domingo', sesion: 'AM', precio: 1500, precioUnidad: 'por persona', incluyeChip: true },

  // ── EXPERIENCE — ½ Hybrid — Sábado 10 · AM ──
  { code: 'HALF-IND-M', nombre: '½ Hybrid Individual Mujer', bloque: 'EXPERIENCE', tipo: '½ Hybrid Individual', integrantes: 1, dia: 'Sábado', sesion: 'AM', precio: 850, precioUnidad: 'por persona', incluyeChip: true },
  { code: 'HALF-IND-H', nombre: '½ Hybrid Individual Hombre', bloque: 'EXPERIENCE', tipo: '½ Hybrid Individual', integrantes: 1, dia: 'Sábado', sesion: 'AM', precio: 850, precioUnidad: 'por persona', incluyeChip: true },
  { code: 'HALF-DOB-MM', nombre: '½ Hybrid Dobles Mujeres', bloque: 'EXPERIENCE', tipo: '½ Hybrid Dobles', integrantes: 2, dia: 'Sábado', sesion: 'AM', precio: 1700, precioUnidad: 'por pareja ($850 c/u)', incluyeChip: true },
  { code: 'HALF-DOB-HH', nombre: '½ Hybrid Dobles Hombres', bloque: 'EXPERIENCE', tipo: '½ Hybrid Dobles', integrantes: 2, dia: 'Sábado', sesion: 'AM', precio: 1700, precioUnidad: 'por pareja ($850 c/u)', incluyeChip: true },
  { code: 'HALF-DOB-MH', nombre: '½ Hybrid Dobles Mixto', bloque: 'EXPERIENCE', tipo: '½ Hybrid Dobles', integrantes: 2, dia: 'Sábado', sesion: 'AM', precio: 1700, precioUnidad: 'por pareja ($850 c/u)', incluyeChip: true },

  // ── EXPERIENCE — Workout Experience — Sábado 10 · AM · $350 ──
  { code: 'WOD-M', nombre: 'Workout Experience Mujer', bloque: 'EXPERIENCE', tipo: 'Workout Experience', integrantes: 1, dia: 'Sábado', sesion: 'AM', precio: 350, precioUnidad: 'por persona', incluyeChip: false },
  { code: 'WOD-H', nombre: 'Workout Experience Hombre', bloque: 'EXPERIENCE', tipo: 'Workout Experience', integrantes: 1, dia: 'Sábado', sesion: 'AM', precio: 350, precioUnidad: 'por persona', incluyeChip: false },

  // ── ASISTE — Público · $250 por día ──
  { code: 'PUB-VIE', nombre: 'Público — Viernes', bloque: 'ASISTE', tipo: 'Público', integrantes: 1, dia: 'Viernes', sesion: 'AM', precio: 250, precioUnidad: 'por día', incluyeChip: false },
  { code: 'PUB-SAB', nombre: 'Público — Sábado', bloque: 'ASISTE', tipo: 'Público', integrantes: 1, dia: 'Sábado', sesion: 'AM', precio: 250, precioUnidad: 'por día', incluyeChip: false },
  { code: 'PUB-DOM', nombre: 'Público — Domingo', bloque: 'ASISTE', tipo: 'Público', integrantes: 1, dia: 'Domingo', sesion: 'AM', precio: 250, precioUnidad: 'por día', incluyeChip: false },
  { code: 'PUB-3D', nombre: 'Público — Pase 3 Días', bloque: 'ASISTE', tipo: 'Público', integrantes: 1, dia: 'Vie-Dom', sesion: 'AM', precio: 600, precioUnidad: 'pase 3 días', incluyeChip: false },

  // ── ASISTE — Fotógrafo · $350 por día (acreditación para fotógrafos externos) ──
  { code: 'FOT-VIE', nombre: 'Fotógrafo — Viernes', bloque: 'ASISTE', tipo: 'Fotógrafo', integrantes: 1, dia: 'Viernes', sesion: 'AM', precio: 350, precioUnidad: 'por día', incluyeChip: false },
  { code: 'FOT-SAB', nombre: 'Fotógrafo — Sábado', bloque: 'ASISTE', tipo: 'Fotógrafo', integrantes: 1, dia: 'Sábado', sesion: 'AM', precio: 350, precioUnidad: 'por día', incluyeChip: false },
  { code: 'FOT-DOM', nombre: 'Fotógrafo — Domingo', bloque: 'ASISTE', tipo: 'Fotógrafo', integrantes: 1, dia: 'Domingo', sesion: 'AM', precio: 350, precioUnidad: 'por día', incluyeChip: false },
  { code: 'FOT-3D', nombre: 'Fotógrafo — Pase 3 Días', bloque: 'ASISTE', tipo: 'Fotógrafo', integrantes: 1, dia: 'Vie-Dom', sesion: 'AM', precio: 800, precioUnidad: 'pase 3 días', incluyeChip: false },
]

export function getInscribirUrl(code: string): string {
  return `https://${DOMAINS.registration}/inscribir?cat=${code}`
}

export function formatPrecio(precio: number): string {
  return `$${precio.toLocaleString('es-MX')} MXN`
}

export function porBloque(bloque: ProductoBloque): Producto[] {
  return CATALOGO.filter((p) => p.bloque === bloque)
}
