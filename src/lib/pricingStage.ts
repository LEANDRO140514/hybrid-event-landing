import { SALES_CONFIG } from '../config/salesConfig'

export type EtapaComercial = 'lanzamiento' | 'preventa' | 'regular'

interface EtapaWindow {
  etapa: EtapaComercial
  start: Date
  end: Date
}

/**
 * America/Merida (Yucatán) is fixed at UTC-6 with no DST — Mexico eliminated
 * seasonal time changes nationwide under the 2022 reform — so a hardcoded
 * offset is safe for the 2026 sales window below.
 */
const MERIDA_UTC_OFFSET = '-06:00'

function meridaDate(isoLocalDateTime: string): Date {
  return new Date(`${isoLocalDateTime}${MERIDA_UTC_OFFSET}`)
}

// Calendario comercial confirmado (11 ago 2026):
//   lanzamiento: 11 ago – 31 ago 2026
//   preventa:     1 sep – 30 sep 2026
//   regular:      1 oct –  7 nov 2026 (cierre de ventas: 7 nov)
const ETAPA_WINDOWS: EtapaWindow[] = [
  {
    etapa: 'lanzamiento',
    start: meridaDate('2026-08-11T00:00:00'),
    end: meridaDate('2026-08-31T23:59:59.999'),
  },
  {
    etapa: 'preventa',
    start: meridaDate('2026-09-01T00:00:00'),
    end: meridaDate('2026-09-30T23:59:59.999'),
  },
  {
    etapa: 'regular',
    start: meridaDate('2026-10-01T00:00:00'),
    end: meridaDate('2026-11-07T23:59:59.999'),
  },
]

// Cierre de ventas confirmado (decisión operativa: logística, kits, seguros,
// chips). Después de esta fecha resolveEtapaComercial() devuelve null; el
// cierre visible al público se opera cambiando SALES_CONFIG.status a
// 'closed' ese día.
export const FECHA_CIERRE_VENTAS = '2026-11-07'

/**
 * Resolves the current commercial stage by date (America/Merida), gated by
 * the manual `ventasArrancadas` switch in salesConfig. Returns null when
 * sales haven't been manually started, or when `now` falls outside every
 * defined window (before lanzamiento or after the 7 nov 23:59 regular close).
 *
 * This does NOT open sales by itself — salesConfig.status is the separate,
 * unchanged authority the landing UI currently reads for that.
 */
export function resolveEtapaComercial(now: Date = new Date()): EtapaComercial | null {
  if (!SALES_CONFIG.ventasArrancadas) return null
  const t = now.getTime()
  for (const window of ETAPA_WINDOWS) {
    if (t >= window.start.getTime() && t <= window.end.getTime()) return window.etapa
  }
  return null
}
