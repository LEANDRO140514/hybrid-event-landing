import { useEffect } from 'react'

interface RouteMetadataProps {
  title: string
  description: string
  /** Path relative to the canonical origin, e.g. '/404'. */
  path: string
}

const CANONICAL_ORIGIN = 'https://hybrid-experience.enforma.mx'

/**
 * Swaps document title/description/canonical/og:url (and their Twitter
 * equivalents) for the lifetime of the mounted route, restoring whatever
 * index.html already had on unmount. Only touches tags that already exist
 * in index.html — never creates new ones.
 */
export default function RouteMetadata({ title, description, path }: RouteMetadataProps) {
  useEffect(() => {
    const canonicalUrl = `${CANONICAL_ORIGIN}${path}`
    const originalTitle = document.title

    const descriptionEl = document.querySelector('meta[name="description"]')
    const canonicalEl = document.querySelector('link[rel="canonical"]')
    const ogUrlEl = document.querySelector('meta[property="og:url"]')
    const ogTitleEl = document.querySelector('meta[property="og:title"]')
    const ogDescriptionEl = document.querySelector('meta[property="og:description"]')
    const twitterTitleEl = document.querySelector('meta[name="twitter:title"]')
    const twitterDescriptionEl = document.querySelector('meta[name="twitter:description"]')

    const original = {
      description: descriptionEl?.getAttribute('content') ?? null,
      canonical: canonicalEl?.getAttribute('href') ?? null,
      ogUrl: ogUrlEl?.getAttribute('content') ?? null,
      ogTitle: ogTitleEl?.getAttribute('content') ?? null,
      ogDescription: ogDescriptionEl?.getAttribute('content') ?? null,
      twitterTitle: twitterTitleEl?.getAttribute('content') ?? null,
      twitterDescription: twitterDescriptionEl?.getAttribute('content') ?? null,
    }

    document.title = title
    descriptionEl?.setAttribute('content', description)
    canonicalEl?.setAttribute('href', canonicalUrl)
    ogUrlEl?.setAttribute('content', canonicalUrl)
    ogTitleEl?.setAttribute('content', title)
    ogDescriptionEl?.setAttribute('content', description)
    twitterTitleEl?.setAttribute('content', title)
    twitterDescriptionEl?.setAttribute('content', description)

    return () => {
      document.title = originalTitle
      if (original.description !== null) descriptionEl?.setAttribute('content', original.description)
      if (original.canonical !== null) canonicalEl?.setAttribute('href', original.canonical)
      if (original.ogUrl !== null) ogUrlEl?.setAttribute('content', original.ogUrl)
      if (original.ogTitle !== null) ogTitleEl?.setAttribute('content', original.ogTitle)
      if (original.ogDescription !== null) ogDescriptionEl?.setAttribute('content', original.ogDescription)
      if (original.twitterTitle !== null) twitterTitleEl?.setAttribute('content', original.twitterTitle)
      if (original.twitterDescription !== null) twitterDescriptionEl?.setAttribute('content', original.twitterDescription)
    }
  }, [title, description, path])

  return null
}
