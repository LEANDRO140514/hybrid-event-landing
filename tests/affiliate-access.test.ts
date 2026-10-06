import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { nextBenefitCode } from '../src/lib/affiliate.ts'
import { priceForVisit, resolveEtapaComercial } from '../src/lib/pricingStage.ts'

const presale = new Date('2026-10-06T18:00:00.000Z')

describe('partner access context', () => {
  it('keeps a QR or link visit through reload and in-page navigation', () => {
    assert.equal(
      nextBenefitCode({ urlCode: 'ENFORMA1', navigation: 'navigate', currentBenefitCode: null }),
      'ENFORMA1',
    )
    assert.equal(
      nextBenefitCode({ urlCode: null, navigation: 'reload', currentBenefitCode: 'ENFORMA1' }),
      'ENFORMA1',
    )
    assert.equal(
      nextBenefitCode({ urlCode: null, navigation: 'back_forward', currentBenefitCode: 'ENFORMA1' }),
      'ENFORMA1',
    )
    assert.equal(
      nextBenefitCode({ urlCode: null, navigation: null, currentBenefitCode: 'ENFORMA1' }),
      'ENFORMA1',
    )
  })

  it('drops the benefit on a new direct entry', () => {
    assert.equal(
      nextBenefitCode({ urlCode: null, navigation: 'navigate', currentBenefitCode: 'ENFORMA1' }),
      null,
    )
  })

  it('shows the public presale price without a link visit, and launch price with one', () => {
    assert.equal(resolveEtapaComercial(presale), 'preventa')
    assert.equal(
      priceForVisit({ calendarPrice: 1650, launchPrice: 1500, benefitActive: false, competitor: true }),
      1650,
    )
    assert.equal(
      priceForVisit({ calendarPrice: 1650, launchPrice: 1500, benefitActive: true, competitor: true }),
      1500,
    )
  })

  it('does not give a non-competitor the launch benefit', () => {
    assert.equal(
      priceForVisit({ calendarPrice: 350, launchPrice: 350, benefitActive: true, competitor: false }),
      350,
    )
  })
})
