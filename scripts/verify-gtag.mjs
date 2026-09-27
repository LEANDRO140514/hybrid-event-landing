/**
 * Zero-dependency check that gtag pushes an Arguments object (what gtag.js
 * executes) into dataLayer, never a plain Array. Run: node scripts/verify-gtag.mjs
 * (Node >= 22.18 strips the TypeScript types of the imported module natively).
 */
import assert from 'node:assert/strict'
import { installGtag } from '../src/lib/gtagShim.ts'

const host = {}
const gtag = installGtag(host)
gtag('js', new Date())
gtag('config', 'G-TEST123')

assert.equal(host.dataLayer.length, 2, 'each gtag() call pushes one entry')
for (const entry of host.dataLayer) {
  assert.equal(Object.prototype.toString.call(entry), '[object Arguments]', 'entry must be an Arguments object')
  assert.equal(Array.isArray(entry), false, 'entry must not be a plain Array')
}
assert.equal(host.dataLayer[1][0], 'config')
assert.equal(host.dataLayer[1][1], 'G-TEST123')

// Never replaces an existing gtag/dataLayer (e.g. injected by another tag).
const existing = () => {}
const layer = ['pre-existing']
const other = { gtag: existing, dataLayer: layer }
assert.equal(installGtag(other), existing)
assert.equal(other.dataLayer, layer)

console.log('verify-gtag: OK — dataLayer receives Arguments objects')
