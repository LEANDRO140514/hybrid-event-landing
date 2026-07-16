import { useState } from 'react'
import { Box, Button, Card, CardContent, Container, TextField, Typography, Stack } from '@mui/material'
import { API_CONFIG } from '../config'

const SPECTATOR_PRICE = 200

export default function SpectatorTicketPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(false)

  const total = SPECTATOR_PRICE * quantity

  const handleCheckout = async () => {
    if (!name || !email || !phone) return
    setLoading(true)
    try {
      const res = await fetch(`${API_CONFIG.edgeFunctionsUrl}/spectator-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact_name: name,
          contact_email: email,
          contact_phone: phone,
          quantity,
          amount: total,
          provider: 'mercadopago',
        }),
      })
      const data = await res.json()
      if (data.checkout_url) {
        window.location.href = data.checkout_url
      } else {
        alert('Error al crear el checkout. Intenta de nuevo.')
      }
    } catch {
      alert('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 0,
      '& fieldset': {
        borderColor: 'rgba(233, 199, 223, 0.2)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(233, 199, 223, 0.4)',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#E9C7DF',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#B0B890',
      fontFamily: "'Space Grotesk', sans-serif",
      '&.Mui-focused': {
        color: '#E9C7DF',
      },
    },
    '& .MuiInputBase-input': {
      fontFamily: "'Space Grotesk', sans-serif",
    },
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(ellipse at 50% 0%, rgba(233,199,223,0.06) 0%, #000000 60%)',
      }}
    >
      <Container maxWidth="sm" sx={{ py: 3 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 900,
            color: '#E9C7DF',
            fontFamily: 'tt-norms-pro-extra-black-italic, sans-serif',
            fontStyle: 'italic',
            mb: 1,
          }}
        >
          ASISTE
        </Typography>
        <Typography
          variant="body1"
          sx={{ color: 'text.secondary', mb: 3, fontFamily: "'Space Grotesk', sans-serif" }}
        >
          Vive la experiencia Hybrid Event 2026 desde dentro.
        </Typography>

        <Card
          sx={{
            bgcolor: '#111111',
            mb: 3,
            borderRadius: 0,
            border: '1px solid rgba(233, 199, 223, 0.15)',
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 2, fontFamily: "'Space Grotesk', sans-serif", color: '#E9C7DF' }}
            >
              Tus datos
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                fullWidth
                required
                sx={textFieldSx}
                FormHelperTextProps={{ sx: { fontFamily: "'Space Grotesk', sans-serif" } }}
              />
              <TextField
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                fullWidth
                required
                sx={textFieldSx}
                FormHelperTextProps={{ sx: { fontFamily: "'Space Grotesk', sans-serif" } }}
              />
              <TextField
                label="Teléfono"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                fullWidth
                required
                sx={textFieldSx}
                FormHelperTextProps={{ sx: { fontFamily: "'Space Grotesk', sans-serif" } }}
              />
            </Stack>
          </CardContent>
        </Card>

        <Card
          sx={{
            bgcolor: '#111111',
            mb: 3,
            borderRadius: 0,
            border: '1px solid rgba(233, 199, 223, 0.15)',
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, mb: 2, fontFamily: "'Space Grotesk', sans-serif", color: '#E9C7DF' }}
            >
              Cantidad
            </Typography>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2 }}>
              <Button
                variant="outlined"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                aria-label="Reducir cantidad"
                sx={{
                  minWidth: 44, minHeight: 44,
                  borderRadius: 0,
                  borderColor: 'rgba(233, 199, 223, 0.4)',
                  color: '#E9C7DF',
                  '&:hover': {
                    borderColor: '#E9C7DF',
                    bgcolor: 'rgba(233, 199, 223, 0.08)',
                  },
                }}
              >
                −
              </Button>
              <Typography
                sx={{
                  fontWeight: 700,
                  minWidth: 32,
                  textAlign: 'center',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {quantity}
              </Typography>
              <Button
                variant="outlined"
                onClick={() => setQuantity(Math.min(10, quantity + 1))}
                aria-label="Aumentar cantidad"
                sx={{
                  minWidth: 44, minHeight: 44,
                  borderRadius: 0,
                  borderColor: 'rgba(233, 199, 223, 0.4)',
                  color: '#E9C7DF',
                  '&:hover': {
                    borderColor: '#E9C7DF',
                    bgcolor: 'rgba(233, 199, 223, 0.08)',
                  },
                }}
              >
                +
              </Button>
            </Stack>
            <Stack
              direction="row"
              sx={{ justifyContent: 'space-between', alignItems: 'center' }}
            >
              <Typography
                variant="body1"
                sx={{ fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {quantity}x Entrada General
              </Typography>
              <Typography
                variant="body1"
                sx={{ fontWeight: 700, color: '#E9C7DF', fontFamily: "'Space Grotesk', sans-serif" }}
              >
                ${total} MXN
              </Typography>
            </Stack>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', mt: 1, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Recibirás tu QR de acceso por email
            </Typography>
          </CardContent>
        </Card>

        <Button
          variant="contained"
          size="large"
          fullWidth
          disabled={!name || !email || !phone || loading}
          onClick={handleCheckout}
          sx={{
            py: 1.5,
            borderRadius: 0,
            fontWeight: 700,
            fontSize: '1rem',
            letterSpacing: '0.05em',
            bgcolor: '#E9C7DF',
            color: '#000000',
            border: '2px solid #E9C7DF',
            '&:hover': {
              bgcolor: '#000000',
              color: '#E9C7DF',
            },
            '&.Mui-disabled': {
              bgcolor: 'rgba(233, 199, 223, 0.12)',
              color: '#B0B890',
            },
          }}
        >
          {loading ? 'Creando pago...' : `PAGAR BOLETO — $${total} MXN`}
        </Button>
      </Container>
    </Box>
  )
}