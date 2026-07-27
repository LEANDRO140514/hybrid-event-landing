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

type PageCheckoutGlobals = {
  __r2hSandboxCheckoutPageLock?: SubmitLock
  __r2hActiveCheckoutProductCode?: string | null
  __r2hCheckoutUiListeners?: Set<() => void>
}

function pageGlobals(): PageCheckoutGlobals {
  return globalThis as unknown as PageCheckoutGlobals
}

function getUiListeners(): Set<() => void> {
  const g = pageGlobals()
  if (!g.__r2hCheckoutUiListeners) g.__r2hCheckoutUiListeners = new Set()
  return g.__r2hCheckoutUiListeners
}

function emitUi(): void {
  for (const listener of getUiListeners()) listener()
}

/** Shared page lock — stored on globalThis so Vite HMR cannot fork instances. */
export function getSandboxCheckoutPageLock(): SubmitLock {
  const g = pageGlobals()
  if (!g.__r2hSandboxCheckoutPageLock) {
    g.__r2hSandboxCheckoutPageLock = createSubmitLock()
  }
  return g.__r2hSandboxCheckoutPageLock
}

export function getActiveCheckoutProductCode(): string | null {
  return pageGlobals().__r2hActiveCheckoutProductCode ?? null
}

export function setActiveCheckoutProductCode(code: string | null): void {
  pageGlobals().__r2hActiveCheckoutProductCode = code
  emitUi()
}

export function subscribeActiveCheckoutProductCode(listener: () => void): () => void {
  const listeners = getUiListeners()
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/** Test-only: reset shared page lock and active product between scripted cases. */
export function resetSandboxCheckoutPageLockForTests(): void {
  const lock = getSandboxCheckoutPageLock()
  if (lock.isLocked()) lock.release()
  pageGlobals().__r2hActiveCheckoutProductCode = null
  emitUi()
}
