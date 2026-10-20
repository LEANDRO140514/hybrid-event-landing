export type EtapaComercial = 'lanzamiento' | 'preventa' | 'regular'

/**
 * Copy of the checkout calendar in ready2hybrid
 * `insforge/functions/_shared/checkout/staged-pricing.ts`.
 * Authority is that file. This calendar is a copy so the landing displays
 * the same stage the server charges.
 *
 * America/Mérida is fixed at UTC−6 (no DST). Windows are half-open [start, end).
 *   LAUNCH   2026-08-11 → 2026-09-25  (through 24 sep inclusive)
 *   PRESALE  2026-09-25 → 2026-10-27  (25 sep – 26 oct inclusive; extended from 19 oct)
 *   REGULAR  2026-10-27 → 2026-11-13 11:00  (27 oct – 13 nov 11:00)
 *
 * Online sales for competitors close at 13 nov 11:00 (backend SALES_CLOSED_AT_MS).
 * From 13 nov 00:00 every product is card-only (backend CARDS_ONLY_FROM).
 */

const MERIDA_OFFSET_MS = -6 * 60 * 60 * 1000

function meridaWallToUtcMs(y: number, m: number, d: number, hh = 0, mm = 0, ss = 0): number {
  return Date.UTC(y, m - 1, d, hh, mm, ss) - MERIDA_OFFSET_MS
}

const STAGE_WINDOWS = {
  lanzamiento: {
    startMs: meridaWallToUtcMs(2026, 8, 11, 0, 0, 0),
    endMs: meridaWallToUtcMs(2026, 9, 25, 0, 0, 0),
  },
  preventa: {
    startMs: meridaWallToUtcMs(2026, 9, 25, 0, 0, 0),
    endMs: meridaWallToUtcMs(2026, 10, 27, 0, 0, 0),
  },
  regular: {
    startMs: meridaWallToUtcMs(2026, 10, 27, 0, 0, 0),
    endMs: meridaWallToUtcMs(2026, 11, 13, 11, 0, 0),
  },
} as const

/** Exclusive end of REGULAR: 13 nov 2026 11:00 America/Mérida. */
export const FECHA_CIERRE_VENTAS = '2026-11-13'

/** Mirrors backend CARDS_ONLY_FROM: 13 nov 2026 00:00 America/Mérida. */
const SOLO_TARJETA_DESDE_MS = meridaWallToUtcMs(2026, 11, 13, 0, 0, 0)

/** From 13 nov 00:00 every product is paid by card only (no cash). */
export function esSoloTarjeta(now: Date = new Date()): boolean {
  return now.getTime() >= SOLO_TARJETA_DESDE_MS
}

/** Display range per stage, inclusive, in America/Mérida — mirrors STAGE_WINDOWS. */
export const ETAPA_RANGO_LABEL: Record<EtapaComercial, string> = {
  lanzamiento: 'Hasta 24 sep',
  preventa: 'hasta el 26 de octubre',
  regular: '27 oct – 13 nov, 11:00',
}

/**
 * Copy of ready2hybrid EVENT_DAY_SALES_CLOSE_MS: spectator passes stay on
 * sale during the event, each until the end of its first valid day.
 * PUB-3D and PUB-DOM were cancelled by the Oct 2026 calendar change (Sunday 15
 * is "por anunciar", public is sold per day only), so they are no longer here;
 * keep this map in sync with the server.
 */
const VENTA_EN_EVENTO_HASTA_MS: Record<string, number> = {
  'PUB-VIE': meridaWallToUtcMs(2026, 11, 14, 0, 0, 0),
  'PUB-SAB': meridaWallToUtcMs(2026, 11, 15, 0, 0, 0),
}

/** Whether the calendar still allows buying this product (same rule the server charges by). */
export function isVentaAbierta(code: string, now: Date = new Date()): boolean {
  if (resolveEtapaComercial(now) != null) return true
  const t = now.getTime()
  const hasta = VENTA_EN_EVENTO_HASTA_MS[code]
  return hasta != null && t >= STAGE_WINDOWS.regular.endMs && t < hasta
}

/**
 * Launch price only while a QR or partner-link visit is active and the
 * product is a competitor with a staged launch amount. Otherwise the
 * calendar price.
 */
export function priceForVisit(input: {
  calendarPrice: number
  launchPrice: number | undefined
  benefitActive: boolean
  competitor: boolean
}): number {
  if (input.benefitActive && input.competitor && input.launchPrice != null) {
    return input.launchPrice
  }
  return input.calendarPrice
}

export function resolveEtapaComercial(now: Date = new Date()): EtapaComercial | null {
  const t = now.getTime()
  if (t < STAGE_WINDOWS.lanzamiento.startMs || t >= STAGE_WINDOWS.regular.endMs) return null
  if (t < STAGE_WINDOWS.lanzamiento.endMs) return 'lanzamiento'
  if (t < STAGE_WINDOWS.preventa.endMs) return 'preventa'
  return 'regular'
}
