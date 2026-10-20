import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  ETAPA_RANGO_LABEL,
  esSoloTarjeta,
  isVentaAbierta,
  resolveEtapaComercial,
} from '../src/lib/pricingStage.ts'

// America/Mérida is UTC−6 all year: 00:00 local = 06:00Z.
describe('presale calendar (extended to 26 Oct)', () => {
  it('still charges presale on 19 and 20 Oct, which used to be regular', () => {
    assert.equal(resolveEtapaComercial(new Date('2026-10-20T05:59:59.000Z')), 'preventa')
    assert.equal(resolveEtapaComercial(new Date('2026-10-20T06:00:00.000Z')), 'preventa')
    assert.equal(resolveEtapaComercial(new Date('2026-10-26T20:00:00.000Z')), 'preventa')
  })

  it('switches to regular at 27 Oct 00:00 Mérida, half-open', () => {
    assert.equal(resolveEtapaComercial(new Date('2026-10-27T05:59:59.999Z')), 'preventa')
    assert.equal(resolveEtapaComercial(new Date('2026-10-27T06:00:00.000Z')), 'regular')
  })

  it('keeps the launch window as it was', () => {
    assert.equal(resolveEtapaComercial(new Date('2026-09-25T05:59:59.000Z')), 'lanzamiento')
    assert.equal(resolveEtapaComercial(new Date('2026-09-25T06:00:00.000Z')), 'preventa')
  })

  it('shows the visible stage labels', () => {
    assert.equal(`Preventa ${ETAPA_RANGO_LABEL.preventa}`, 'Preventa hasta el 26 de octubre')
    assert.equal(ETAPA_RANGO_LABEL.regular, '27 oct – 13 nov, 11:00')
  })
})

// Same cut-offs as the checkout backend (SALES_CLOSED_AT_MS / CARDS_ONLY_FROM).
describe('online sales close on 13 Nov 11:00 Mérida', () => {
  const at = (local: string) => new Date(`${local}-06:00`)

  it('26 Oct 23:59 is presale and 27 Oct 00:00 is regular', () => {
    assert.equal(resolveEtapaComercial(at('2026-10-26T23:59:00')), 'preventa')
    assert.equal(resolveEtapaComercial(at('2026-10-27T00:00:00')), 'regular')
  })

  it('13 Nov 00:00 and 10:59 are still regular for competitors', () => {
    assert.equal(resolveEtapaComercial(at('2026-11-13T00:00:00')), 'regular')
    assert.equal(resolveEtapaComercial(at('2026-11-13T10:59:00')), 'regular')
    assert.equal(isVentaAbierta('IND-H', at('2026-11-13T00:00:00')), true)
    assert.equal(isVentaAbierta('IND-H', at('2026-11-13T10:59:00')), true)
  })

  it('13 Nov 11:00 closes online sales for competitors', () => {
    assert.equal(resolveEtapaComercial(at('2026-11-13T11:00:00')), null)
    assert.equal(isVentaAbierta('IND-H', at('2026-11-13T11:00:00')), false)
    assert.equal(isVentaAbierta('REL-4H', at('2026-11-14T09:00:00')), false)
  })

  it('public passes stay on sale after 11:00, each until the end of its day', () => {
    assert.equal(isVentaAbierta('PUB-VIE', at('2026-11-13T11:00:00')), true)
    assert.equal(isVentaAbierta('PUB-VIE', at('2026-11-14T00:00:00')), false)
    assert.equal(isVentaAbierta('PUB-SAB', at('2026-11-14T12:00:00')), true)
  })

  it('card-only starts at 13 Nov 00:00 and not before', () => {
    assert.equal(esSoloTarjeta(at('2026-11-12T23:59:00')), false)
    assert.equal(esSoloTarjeta(at('2026-11-13T00:00:00')), true)
    assert.equal(esSoloTarjeta(at('2026-11-13T10:59:00')), true)
    assert.equal(esSoloTarjeta(at('2026-11-13T11:00:00')), true)
  })
})
