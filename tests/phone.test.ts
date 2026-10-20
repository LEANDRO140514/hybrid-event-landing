import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { normalizePhoneMx } from '../src/lib/phone.ts'

describe('checkout phone (Mexico)', () => {
  it('sends +52 plus 10 digits for a plain 10-digit number', () => {
    assert.equal(normalizePhoneMx('9811234567'), '+529811234567')
  })

  it('ignores spaces and hyphens', () => {
    assert.equal(normalizePhoneMx('981 123 4567'), '+529811234567')
    assert.equal(normalizePhoneMx('981-123-4567'), '+529811234567')
    assert.equal(normalizePhoneMx(' 981 - 123 - 4567 '), '+529811234567')
  })

  it('keeps an explicit +52 prefix', () => {
    assert.equal(normalizePhoneMx('+52 981 123 4567'), '+529811234567')
    assert.equal(normalizePhoneMx('+529811234567'), '+529811234567')
  })

  it('treats an empty field as valid because it is optional', () => {
    assert.equal(normalizePhoneMx(''), '')
    assert.equal(normalizePhoneMx('   '), '')
  })

  it('rejects anything else', () => {
    for (const bad of ['981123456', '98112345678', '+5298112345', '+51 9811234567', '52 9811234567', 'abc', '981123456a', '+52']) {
      assert.equal(normalizePhoneMx(bad), null, bad)
    }
  })
})
