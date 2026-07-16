import { useState } from 'react'
import { useSearch, useNavigate } from '@tanstack/react-router'
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  Stack,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material'
import { CATEGORIES, formatPrice } from '../constants/categories'
import { createCheckout } from '../api/checkout'

export default function PagoPage() {
  const navigate = useNavigate()
  const search = useSearch({ strict: false }) as Record<string, string>
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const categoryId = Number(search.categoryId)
  const category = CATEGORIES.find(c => c.id === categoryId)

  // Get registration data from sessionStorage (stored by RegistroPage on submit)
  const registrationData = sessionStorage.getItem('pendingRegistration')
  const parsedData = registrationData ? JSON.parse(registrationData) : null

  if (!category || !parsedData) {
    return (
      <Container maxWidth="sm" sx={{ py: 4, minHeight: '100vh' }}>
        <Alert severity="error" sx={{ borderRadius: 0 }}>
          No se encontraron datos de registro. Por favor regresa al formulario.
        </Alert>
        <Button onClick={() => navigate({ to: '/registro' })} sx={{ mt: 2, borderRadius: 0 }}>
          Volver al registro
        </Button>
      </Container>
    )
  }

  const handlePay = async (provider: 'mercadopago' | 'stripe') => {
    setLoading(true)
    setError(null)

    try {
      const result = await createCheckout({
        category_id: category.id,
        category_name: category.name,
        category_type: category.type,
        team_name: parsedData.teamName || null,
        participants: parsedData.participants,
        contact_email: parsedData.contactEmail,
        contact_phone: parsedData.contactPhone,
        amount: category.price,
        provider,
      })

      // Store registration ID for confirmation page
      sessionStorage.setItem('registrationId', result.registration_id)

      // Redirect to payment provider
      window.location.href = result.checkout_url
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar el pago')
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(ellipse at 50% 0%, rgba(230,242,177,0.06) 0%, #000000 60%)',
      }}
    >
      <Container maxWidth="sm" sx={{ py: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            color: '#E6F2B1',
            fontFamily: 'tt-norms-pro-extra-black-italic, sans-serif',
            fontStyle: 'italic',
            mb: 1,
          }}
        >
          Pago
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ mb: 4, fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Selecciona tu método de pago para completar la inscripción.
        </Typography>

        {/* Order Summary — ticket style */}
        <Card
          sx={{
            mb: 4,
            bgcolor: '#111111',
            borderRadius: 0,
            border: '1px solid rgba(230, 242, 177, 0.15)',
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Resumen de tu orden
            </Typography>
            <Stack spacing={1.5}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography
                  color="text.secondary"
                  sx={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Categoría
                </Typography>
                <Typography
                  sx={{ fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {category.name}
                </Typography>
              </Box>
              {parsedData.teamName && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography
                    color="text.secondary"
                    sx={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Equipo
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {parsedData.teamName}
                  </Typography>
                </Box>
              )}
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography
                  color="text.secondary"
                  sx={{ fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Participantes
                </Typography>
                <Typography
                  sx={{ fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {parsedData.participants.length}
                </Typography>
              </Box>
              <Divider sx={{ borderColor: 'rgba(230, 242, 177, 0.12)' }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Total
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 900,
                    color: '#E6F2B1',
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {formatPrice(category.price)}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 0 }}>
            {error}
          </Alert>
        )}

        {/* Payment Methods */}
        <Stack spacing={2}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            disabled={loading}
            onClick={() => handlePay('mercadopago')}
            sx={{
              py: 1.5,
              fontSize: '1rem',
              fontWeight: 700,
              borderRadius: 0,
              bgcolor: '#E6F2B1',
              color: '#000000',
              border: '2px solid #E6F2B1',
              letterSpacing: '0.05em',
              '&:hover': {
                bgcolor: '#000000',
                color: '#E6F2B1',
              },
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#E6F2B1' }} /> : 'Pagar con MercadoPago'}
          </Button>

          <Button
            variant="outlined"
            size="large"
            fullWidth
            disabled={loading}
            onClick={() => handlePay('stripe')}
            sx={{
              py: 1.5,
              fontSize: '0.9rem',
              fontWeight: 700,
              borderRadius: 0,
              borderColor: 'rgba(230, 242, 177, 0.4)',
              color: '#E6F2B1',
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: '0.05em',
              '&:hover': {
                borderColor: '#E6F2B1',
                bgcolor: 'rgba(230, 242, 177, 0.08)',
              },
            }}
          >
            Pagar con tarjeta internacional (Stripe)
          </Button>
        </Stack>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 3, textAlign: 'center', fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Tu pago es seguro y está protegido por encriptación SSL.
        </Typography>

        <Button
          onClick={() => navigate({ to: '/registro' })}
          sx={{
            mt: 2,
            display: 'block',
            mx: 'auto',
            color: 'text.secondary',
            fontFamily: "'Space Grotesk', sans-serif",
            '&:hover': { color: '#E6F2B1' },
          }}
        >
          Volver al registro
        </Button>
      </Container>
    </Box>
  )
}