import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { normalizePhoneMx } from '../src/lib/phone.ts'

describe('checkout phone (MX + international E.164)', () => {
  it('sends +52 plus 10 digits for a plain 10-digit number', () => {
    assert.equal(normalizePhoneMx('9811204320'), '+529811204320')
  })

  it('ignores spaces, hyphens and parentheses', () => {
    assert.equal(normalizePhoneMx('981 120 4320'), '+529811204320')
    assert.equal(normalizePhoneMx('981-120-4320'), '+529811204320')
    assert.equal(normalizePhoneMx(' (981) 120 - 4320 '), '+529811204320')
  })

  it('accepts 52 and +52 prefixes', () => {
    assert.equal(normalizePhoneMx('+52 981 120 4320'), '+529811204320')
    assert.equal(normalizePhoneMx('+529811204320'), '+529811204320')
    assert.equal(normalizePhoneMx('52 981 120 4320'), '+529811204320')
  })

  it('accepts the old mobile format with the extra 1 and drops it', () => {
    assert.equal(normalizePhoneMx('+52 1 981 120 4320'), '+529811204320')
    assert.equal(normalizePhoneMx('+521 981 120 4320'), '+529811204320')
    assert.equal(normalizePhoneMx('5219811204320'), '+529811204320')
    assert.equal(normalizePhoneMx('52 1 981-120-4320'), '+529811204320')
    assert.equal(normalizePhoneMx('+52 1 (981) 120 4320'), '+529811204320')
  })

  it('keeps international numbers as E.164', () => {
    assert.equal(normalizePhoneMx('+1 305 555 0123'), '+13055550123')
    assert.equal(normalizePhoneMx('+34 612 345 678'), '+34612345678')
    assert.equal(normalizePhoneMx('+12345678'), '+12345678')
    assert.equal(normalizePhoneMx('+123456789012345'), '+123456789012345')
  })

  it('treats an empty field as valid because it is optional', () => {
    assert.equal(normalizePhoneMx(''), '')
    assert.equal(normalizePhoneMx('   '), '')
  })

  it('rejects Mexican numbers that start with 0 or 1, with or without 52/+52', () => {
    for (const bad of [
      '+52 1 981 120 432',
      '1234567890',
      '0123456789',
      '52 1234567890',
      '+52 1234567890',
      '+52 0123456789',
      '+52 1 123 456 7890',
      '521 123 456 7890',
    ]) {
      assert.equal(normalizePhoneMx(bad), null, bad)
    }
  })

  it('still accepts the old mobile format with a valid number after the 1', () => {
    assert.equal(normalizePhoneMx('+52 1 981 120 4320'), '+529811204320')
    assert.equal(normalizePhoneMx('5219811204320'), '+529811204320')
    assert.equal(normalizePhoneMx('+52 1 222 123 4567'), '+522221234567')
  })

  it('rejects anything else', () => {
    for (const bad of [
      '12345',
      '981123456',
      '98112345678',
      '+5298112345',
      '+52',
      '+1234567',
      '+1234567890123456',
      '+0 305 555 0123',
      '1 305 555 0123',
      'abc',
      '981123456a',
    ]) {
      assert.equal(normalizePhoneMx(bad), null, bad)
    }
  })
})
