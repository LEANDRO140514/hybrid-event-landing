import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { ETAPA_RANGO_LABEL, resolveEtapaComercial } from '../src/lib/pricingStage.ts'

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

  it('keeps the regular close and the launch window as they were', () => {
    assert.equal(resolveEtapaComercial(new Date('2026-11-12T20:00:00.000Z')), 'regular')
    assert.equal(resolveEtapaComercial(new Date('2026-11-13T06:00:00.000Z')), null)
    assert.equal(resolveEtapaComercial(new Date('2026-09-25T05:59:59.000Z')), 'lanzamiento')
    assert.equal(resolveEtapaComercial(new Date('2026-09-25T06:00:00.000Z')), 'preventa')
  })

  it('shows the visible presale label', () => {
    assert.equal(`Preventa ${ETAPA_RANGO_LABEL.preventa}`, 'Preventa hasta el 26 de octubre')
    assert.equal(ETAPA_RANGO_LABEL.regular, '27 oct – 12 nov')
  })
})
