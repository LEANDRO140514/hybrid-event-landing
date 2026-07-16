export interface Category {
  id: number
  name: string
  type: 'Individual' | 'Dupla' | 'Relevo'
  participants: string
  participantCount: number
  icon: string
  price: number
  genderRule: 'male-only' | 'female-only' | 'mixed' | 'any'
}

export const CATEGORIES: Category[] = [
  { id: 1, name: 'Pros Hombres', type: 'Individual', participants: '1 participante', participantCount: 1, icon: '🏃‍♂️', price: 1500, genderRule: 'male-only' },
  { id: 2, name: 'Pros Mujeres', type: 'Individual', participants: '1 participante', participantCount: 1, icon: '🏃‍♀️', price: 1500, genderRule: 'female-only' },
  { id: 3, name: 'Dupla HH', type: 'Dupla', participants: '2 hombres', participantCount: 2, icon: '👬', price: 2500, genderRule: 'male-only' },
  { id: 4, name: 'Dupla MM', type: 'Dupla', participants: '2 mujeres', participantCount: 2, icon: '👭', price: 2500, genderRule: 'female-only' },
  { id: 5, name: 'Dupla Mixta', type: 'Dupla', participants: '1H + 1M', participantCount: 2, icon: '👫', price: 2500, genderRule: 'mixed' },
  { id: 6, name: 'Relevo 4H', type: 'Relevo', participants: '4 hombres', participantCount: 4, icon: '🏋️‍♂️', price: 4000, genderRule: 'male-only' },
  { id: 7, name: 'Relevo 4M', type: 'Relevo', participants: '4 mujeres', participantCount: 4, icon: '🏋️‍♀️', price: 4000, genderRule: 'female-only' },
  { id: 8, name: 'Relevo Mixto', type: 'Relevo', participants: '2H + 2M', participantCount: 4, icon: '💪', price: 4000, genderRule: 'mixed' },
]

export function getCategoryColor(type: string): string {
  switch (type) {
    case 'Individual':
      return 'linear-gradient(135deg, rgba(255,61,0,0.15) 0%, rgba(255,61,0,0.05) 100%)'
    case 'Dupla':
      return 'linear-gradient(135deg, rgba(255,214,0,0.15) 0%, rgba(255,214,0,0.05) 100%)'
    case 'Relevo':
      return 'linear-gradient(135deg, rgba(0,176,255,0.15) 0%, rgba(0,176,255,0.05) 100%)'
    default:
      return 'transparent'
  }
}

export function getCategoryChipColor(type: string): 'error' | 'warning' | 'info' {
  switch (type) {
    case 'Individual':
      return 'error'
    case 'Dupla':
      return 'warning'
    case 'Relevo':
      return 'info'
    default:
      return 'error'
  }
}

export function formatPrice(price: number): string {
  return `$${price.toLocaleString('es-MX')} MXN`
}
