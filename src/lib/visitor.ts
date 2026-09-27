const VISITOR_KEY = 'enforma_visitor_id'
const SESSION_KEY = 'enforma_session_id'

function randomId(): string {
  return crypto.randomUUID()
}

function read(storage: Storage, key: string): string | null {
  try {
    const value = storage.getItem(key)
    if (!value || value.includes('@')) return null
    return value
  } catch {
    return null
  }
}

/** Opaque visitor id. Persists in localStorage. Never written into the URL. */
export function getOrCreateVisitorId(storage: Storage = localStorage): string {
  const existing = read(storage, VISITOR_KEY)
  if (existing) return existing
  const next = randomId()
  storage.setItem(VISITOR_KEY, next)
  return next
}

/** New id per browser session storage. */
export function getOrCreateSessionId(storage: Storage = sessionStorage): string {
  const existing = read(storage, SESSION_KEY)
  if (existing) return existing
  const next = randomId()
  storage.setItem(SESSION_KEY, next)
  return next
}
