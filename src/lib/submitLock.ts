/**
 * Synchronous in-instance submit lock.
 * React state alone is insufficient: multiple events can fire before re-render.
 */
export type SubmitLock = {
  tryAcquire: () => boolean
  release: () => void
  isLocked: () => boolean
}

export function createSubmitLock(): SubmitLock {
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
