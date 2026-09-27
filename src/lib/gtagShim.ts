export type GtagFunction = (...args: unknown[]) => void

type GtagHost = {
  dataLayer?: unknown[]
  gtag?: GtagFunction
}

/**
 * Official gtag snippet (`function gtag(){dataLayer.push(arguments);}`).
 * gtag.js only executes Arguments objects pushed to dataLayer — a plain
 * array (e.g. from rest params) is silently ignored and no hit is sent.
 * Kept free of Vite-only APIs so scripts/verify-gtag.mjs can import it.
 */
export function installGtag(host: GtagHost): GtagFunction {
  host.dataLayer ??= []
  host.gtag ??= function gtag(..._args: unknown[]) {
    // eslint-disable-next-line prefer-rest-params
    host.dataLayer!.push(arguments)
  }
  return host.gtag
}
