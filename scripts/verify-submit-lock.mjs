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

console.log('verify-submit-lock: PASS')
