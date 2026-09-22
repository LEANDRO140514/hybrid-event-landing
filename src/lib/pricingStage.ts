export type EtapaComercial = 'lanzamiento' | 'preventa' | 'regular'

/**
 * Copy of the checkout calendar in ready2hybrid
 * `insforge/functions/_shared/checkout/staged-pricing.ts`.
 * Authority is that file. This calendar is a copy so the landing displays
 * the same stage the server charges.
 *
 * America/Mérida is fixed at UTC−6 (no DST). Windows are half-open [start, end).
 *   LAUNCH   2026-08-11 → 2026-09-11
 *   PRESALE  2026-09-11 → 2026-10-01
 *   REGULAR  2026-10-01 → 2026-11-08
 */

const MERIDA_OFFSET_MS = -6 * 60 * 60 * 1000

function meridaWallToUtcMs(y: number, m: number, d: number, hh = 0, mm = 0, ss = 0): number {
  return Date.UTC(y, m - 1, d, hh, mm, ss) - MERIDA_OFFSET_MS
}

const STAGE_WINDOWS = {
  lanzamiento: {
    startMs: meridaWallToUtcMs(2026, 8, 11, 0, 0, 0),
    endMs: meridaWallToUtcMs(2026, 9, 11, 0, 0, 0),
  },
  preventa: {
    startMs: meridaWallToUtcMs(2026, 9, 11, 0, 0, 0),
    endMs: meridaWallToUtcMs(2026, 10, 1, 0, 0, 0),
  },
  regular: {
    startMs: meridaWallToUtcMs(2026, 10, 1, 0, 0, 0),
    endMs: meridaWallToUtcMs(2026, 11, 8, 0, 0, 0),
  },
} as const

/** Exclusive end of REGULAR: 8 nov 2026 00:00 America/Mérida. */
export const FECHA_CIERRE_VENTAS = '2026-11-08'

export function resolveEtapaComercial(now: Date = new Date()): EtapaComercial | null {
  const t = now.getTime()
  if (t < STAGE_WINDOWS.lanzamiento.startMs || t >= STAGE_WINDOWS.regular.endMs) return null
  if (t < STAGE_WINDOWS.lanzamiento.endMs) return 'lanzamiento'
  if (t < STAGE_WINDOWS.preventa.endMs) return 'preventa'
  return 'regular'
}
