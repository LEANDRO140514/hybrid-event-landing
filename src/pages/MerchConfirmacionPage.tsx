import { useEffect, useState } from 'react'
import { Container, Typography, Box, Stack, Button } from '@mui/material'
import { useNavigate } from '@tanstack/react-router'

const BRAND_FONT = 'tt-norms-pro-extra-black-italic, serif'
const MONO_FONT = '"Space Grotesk", monospace'

export default function MerchConfirmacionPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'approved' | 'pending'>('loading')

  useEffect(() => {
    const url = new URL(window.location.href)
    const paymentStatus = url.searchParams.get('status')
    if (paymentStatus === 'approved') {
      setStatus('approved')
      // Guardar sesión mínima
      const orderId = url.searchParams.get('order_id')
      if (orderId) {
        localStorage.setItem('the-hype-last-order', orderId)
      }
    } else if (paymentStatus === 'pending') {
      setStatus('pending')
    }
  }, [])

  return (
    <Container maxWidth="sm" sx={{ py: 6, textAlign: 'center' }}>
      {status === 'loading' && (
        <Typography sx={{ fontFamily: MONO_FONT, color: '#B0B890' }}>Verificando pago...</Typography>
      )}

      {status === 'approved' && (
        <Box>
          <Typography
            sx={{
              fontFamily: BRAND_FONT,
              color: '#E6F2B1',
              fontSize: { xs: '2rem', sm: '2.5rem' },
              lineHeight: 1,
              mb: 1,
              letterSpacing: '-0.02em',
            }}
          >
            ¡PEDIDO CONFIRMADO!
          </Typography>
          <Typography sx={{ fontFamily: MONO_FONT, color: '#B0B890', fontSize: '0.85rem', mb: 3 }}>
            Tu pedido de merch oficial está confirmado. Recibirás un QR de recogida por email.
          </Typography>

          {/* QR receipt placeholder */}
          <Box
            sx={{
              border: '2px solid rgba(230,242,177,0.2)',
              bgcolor: '#111111',
              p: 3,
              mb: 3,
              textAlign: 'center',
            }}
          >
            <Box
              sx={{
                width: 100, height: 100,
                border: '1px solid rgba(230,242,177,0.2)',
                display: 'grid', placeItems: 'center',
                mx: 'auto', mb: 1.5,
                bgcolor: '#000000',
              }}
            >
              <Typography sx={{ fontFamily: MONO_FONT, fontSize: '0.6rem', color: '#B0B890', letterSpacing: '0.1em' }}>
                QR
              </Typography>
            </Box>
            <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 700, fontSize: '0.85rem', mb: 0.5, letterSpacing: '0.05em' }}>
              Tu QR de Recogida
            </Typography>
            <Typography sx={{ fontFamily: MONO_FONT, fontSize: '0.7rem', color: '#B0B890' }}>
              Llegará a tu email. Preséntalo en la zona de Merch el día del evento.
            </Typography>
          </Box>

          <Stack spacing={1.5}>
            <Button
              variant="contained"
              onClick={() => navigate({ to: '/app/shop' })}
              sx={{
                borderRadius: 0,
                bgcolor: '#E6F2B1',
                color: '#000000',
                fontWeight: 700,
                fontFamily: MONO_FONT,
                letterSpacing: '0.08em',
                border: '2px solid #E6F2B1',
                py: 1.5,
                '&:hover': { bgcolor: '#F0F7CD', borderColor: '#F0F7CD' },
              }}
            >
              SEGUIR COMPRANDO
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate({ to: '/app' })}
              sx={{
                borderRadius: 0,
                borderColor: 'rgba(230,242,177,0.3)',
                color: '#E6F2B1',
                fontFamily: MONO_FONT,
                fontWeight: 700,
                letterSpacing: '0.08em',
                py: 1.5,
                '&:hover': { borderColor: '#E6F2B1', bgcolor: 'rgba(230,242,177,0.05)' },
              }}
            >
              IR AL INICIO
            </Button>
          </Stack>
        </Box>
      )}

      {status === 'pending' && (
        <Box>
          <Typography
            sx={{
              fontFamily: BRAND_FONT,
              color: '#E6F2B1',
              fontSize: { xs: '2rem', sm: '2.5rem' },
              lineHeight: 1,
              mb: 1,
              letterSpacing: '-0.02em',
            }}
          >
            PAGO EN PROCESO
          </Typography>
          <Typography sx={{ fontFamily: MONO_FONT, color: '#B0B890', fontSize: '0.85rem', mb: 3 }}>
            Tu pago está siendo procesado. Te notificaremos por email cuando se confirme.
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate({ to: '/app' })}
            sx={{
              borderRadius: 0,
              bgcolor: '#E6F2B1',
              color: '#000000',
              fontWeight: 700,
              fontFamily: MONO_FONT,
              letterSpacing: '0.08em',
              border: '2px solid #E6F2B1',
              px: 5, py: 1.5,
              '&:hover': { bgcolor: '#F0F7CD', borderColor: '#F0F7CD' },
            }}
          >
            IR AL INICIO
          </Button>
        </Box>
      )}
    </Container>
  )
}