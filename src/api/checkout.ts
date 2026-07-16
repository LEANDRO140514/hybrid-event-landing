import { API_CONFIG } from '../config'

interface CreateCheckoutParams {
  category_id: number
  category_name: string
  category_type: 'Individual' | 'Dupla' | 'Relevo'
  team_name: string | null
  participants: Array<{
    name: string
    email: string
    phone: string
    birth_date: string
    gender: 'M' | 'F'
  }>
  contact_email: string
  contact_phone: string
  amount: number
  provider: 'mercadopago' | 'stripe'
}

interface CheckoutResponse {
  registration_id: string
  checkout_url: string
}

export async function createCheckout(params: CreateCheckoutParams): Promise<CheckoutResponse> {
  const res = await fetch(`${API_CONFIG.edgeFunctionsUrl}/create-checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  })

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `HTTP ${res.status}`)
  }

  return res.json()
}

export interface RegistrationStatus {
  id: string
  category_name: string
  category_type: string
  team_name: string | null
  status: 'pending' | 'paid' | 'failed' | 'registered'
  contact_email: string
  amount: number
}

export async function getRegistrationStatus(registrationId: string): Promise<RegistrationStatus> {
  const res = await fetch(
    `${API_CONFIG.edgeFunctionsUrl}/registration-status?registration_id=${registrationId}`,
    { headers: { 'Content-Type': 'application/json' } }
  )

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(error.error || `HTTP ${res.status}`)
  }

  return res.json()
}
