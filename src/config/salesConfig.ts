export type RegistrationStatus = 'coming_soon' | 'open' | 'closed'

export const SALES_CONFIG = {
  status: 'coming_soon' as RegistrationStatus,
  openingLabel: 'Próximamente',
  /**
   * Manual kill-switch for staged pricing (see src/lib/pricingStage.ts).
   * Defaults to false: no commercial stage resolves as active until this is
   * flipped by hand. Independent of `status` above — flipping this alone
   * does NOT open sales; `status` remains the UI's separate gate.
   */
  ventasArrancadas: false,
}
