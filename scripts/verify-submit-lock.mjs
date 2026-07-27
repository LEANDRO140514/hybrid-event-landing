/**
 * Zero-dependency verification of the atomic submit lock contract.
 * Mirrors src/lib/submitLock.ts without adding test frameworks.
 */
function createSubmitLock() {
  let locked = false
  return {
    tryAcquire() {
      if (locked) return false
      locked = true
      return true
    },
    release() {
      locked = false
    },
    isLocked() {
      return locked
    },
  }
}

function assert(cond, msg) {
  if (!cond) throw new Error(msg)
}

// --- Per-instance lock (legacy contract) ---
const lock = createSubmitLock()
let posts = 0
async function handler() {
  if (!lock.tryAcquire()) return
  posts += 1
  await Promise.resolve()
}

await Promise.all([handler(), handler(), handler()])
assert(posts === 1, `3 rapid calls must produce 1 post, got ${posts}`)

lock.release()
const key = 'idem-shared'
let keys = []
async function retryable() {
  if (!lock.tryAcquire()) return
  keys.push(key)
  lock.release()
}
await retryable()
await retryable()
assert(keys.length === 2 && keys[0] === keys[1], 'retry reuses same idempotency key')

// --- Shared page lock across products (IMPL-13E-X) ---
const pageLock = createSubmitLock()
let pagePosts = []
async function startCheckout(productCode) {
  if (!pageLock.tryAcquire()) return
  pagePosts.push(productCode)
  await Promise.resolve()
}

await Promise.all([startCheckout('PUB-SAB'), startCheckout('PUB-SAB'), startCheckout('PUB-SAB')])
assert(pagePosts.length === 1 && pagePosts[0] === 'PUB-SAB', '3 clicks PUB-SAB → 1 POST')

pageLock.release()
pagePosts = []
await Promise.all([startCheckout('PUB-SAB'), startCheckout('FOT-VIE')])
assert(pagePosts.length === 1, `PUB-SAB + FOT-VIE immediate → 1 POST total, got ${pagePosts.length}`)

pageLock.release()
pagePosts = []
await startCheckout('PUB-SAB')
// Simulate SALES_NOT_OPEN / error path: release and allow another product.
pageLock.release()
await startCheckout('FOT-VIE')
assert(
  pagePosts.length === 2 && pagePosts[0] === 'PUB-SAB' && pagePosts[1] === 'FOT-VIE',
  'after error, other product may attempt',
)

// Idempotency namespace simulation (mirrors checkoutSession rules)
function attemptKey(productCode, quantity, existing) {
  if (
    existing &&
    existing.productCode === productCode &&
    existing.quantity === quantity &&
    !existing.publicOrderReference
  ) {
    return existing.idempotencyKey
  }
  return `${productCode}:${quantity}:${Math.random().toString(16).slice(2)}`
}

const first = { productCode: 'PUB-SAB', quantity: 2, idempotencyKey: 'key-a', publicOrderReference: undefined }
const retrySame = attemptKey('PUB-SAB', 2, first)
assert(retrySame === 'key-a', 'retry same product/quantity reuses key')
const qtyChange = attemptKey('PUB-SAB', 1, first)
assert(qtyChange !== 'key-a', 'quantity change creates new key')
const otherProduct = attemptKey('FOT-VIE', 1, first)
assert(otherProduct !== 'key-a', 'different product creates new key')

console.log('verify-submit-lock: PASS')
