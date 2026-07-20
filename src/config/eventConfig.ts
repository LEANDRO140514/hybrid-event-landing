/**
 * Canonical event identity configuration.
 *
 * This is the single authority for stable event identity data
 * consumed by components, metadata, and PWA manifest.
 *
 * Editorial copy, dates, venues, and campaign text do NOT belong here —
 * those remain in their respective page/component files until a
 * confirmed authority exists.
 */

export const eventConfig = {
  /** Full commercial name shown in headers, page titles, and formal contexts. */
  name: 'The Hybrid Experience',
  /** Short name for space-constrained UI (buttons, labels, PWA short_name). */
  shortName: 'Hybrid',
  /** URL / filesystem-safe slug. */
  slug: 'the-hybrid-experience',
  /** Organizer brand shown in "BY {organizer}" labels and credits. */
  organizer: 'ENFORMA',
} as const

export type EventConfig = typeof eventConfig
