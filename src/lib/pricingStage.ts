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

const ETAPA_WINDOWS: EtapaWindow[] = [
  {
    etapa: 'lanzamiento',
    start: meridaDate('2026-08-10T00:00:00'),
    end: meridaDate('2026-08-23T23:59:59.999'),
  },
  {
    etapa: 'preventa',
    start: meridaDate('2026-08-24T00:00:00'),
    end: meridaDate('2026-09-13T23:59:59.999'),
  },
  {
    etapa: 'regular',
    start: meridaDate('2026-09-14T00:00:00'),
    end: meridaDate('2026-10-02T23:59:59.999'),
  },
]

/**
 * Resolves the current commercial stage by date (America/Merida), gated by
 * the manual `ventasArrancadas` switch in salesConfig. Returns null when
 * sales haven't been manually started, or when `now` falls outside every
 * defined window (before lanzamiento or after the 2 oct 23:59 regular close).
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
