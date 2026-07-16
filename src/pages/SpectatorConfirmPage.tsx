import { useEffect, useState } from 'react'
import { Container, Typography, Card, CardContent, Box, Button, Stack } from '@mui/material'
import QrCodeIcon from '@mui/icons-material/QrCode'
import { useNavigate } from '@tanstack/react-router'

export default function SpectatorConfirmPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'approved' | 'pending'>('loading')

  useEffect(() => {
    const url = new URL(window.location.href)
    const paymentStatus = url.searchParams.get('status')
    if (paymentStatus === 'approved') setStatus('approved')
    else if (paymentStatus === 'pending') setStatus('pending')
  }, [])

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(ellipse at 50% 0%, rgba(233,199,223,0.06) 0%, #000000 60%)',
      }}
    >
      <Container maxWidth="sm" sx={{ py: 6, textAlign: 'center' }}>
        {status === 'approved' && (
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                color: '#E9C7DF',
                fontFamily: 'tt-norms-pro-extra-black-italic, sans-serif',
                fontStyle: 'italic',
                mb: 2,
              }}
            >
              ASISTE
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, mb: 1, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              ¡Entrada Confirmada!
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: 'text.secondary', mb: 4, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Tu entrada de aficionado está confirmada. Recibirás tu QR de acceso por email.
            </Typography>

            {/* All-Access Ticket Card */}
            <Card
              sx={{
                bgcolor: '#111111',
                mb: 3,
                borderRadius: 0,
                border: '1px solid rgba(233, 199, 223, 0.25)',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 4,
                  background: 'linear-gradient(90deg, #E9C7DF, #E6F2B1)',
                },
              }}
            >
              <CardContent sx={{ py: 4 }}>
                <QrCodeIcon
                  sx={{ fontSize: 80, color: '#E9C7DF', mb: 2 }}
                />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, mb: 0.5, fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  ALL-ACCESS
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', mb: 2, fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Hybrid Event 2026 • 17 Octubre
                </Typography>

                <Box
                  sx={{
                    borderTop: '1px dashed rgba(233, 199, 223, 0.3)',
                    borderBottom: '1px dashed rgba(233, 199, 223, 0.3)',
                    py: 1.5,
                    mb: 2,
                  }}
                >
                  <Stack spacing={0.5}>
                    <Typography
                      variant="caption"
                      sx={{ color: '#E9C7DF', letterSpacing: '0.15em', fontFamily: 'monospace', fontSize: '0.65rem' }}
                    >
                      STATUS
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 700, color: '#E6F2B1', fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      ✓ CONFIRMADO
                    </Typography>
                  </Stack>
                </Box>

                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  Preséntalo en la entrada el día del evento.
                </Typography>
              </CardContent>
            </Card>

            <Button
              variant="contained"
              size="large"
              onClick={() => navigate({ to: '/' })}
              sx={{
                borderRadius: 0,
                fontWeight: 700,
                bgcolor: '#E9C7DF',
                color: '#000000',
                border: '2px solid #E9C7DF',
                fontFamily: "'Space Grotesk', sans-serif",
                letterSpacing: '0.05em',
                px: 4,
                '&:hover': {
                  bgcolor: '#000000',
                  color: '#E9C7DF',
                },
              }}
            >
              IR AL INICIO
            </Button>
          </Box>
        )}

        {status === 'pending' && (
          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 900,
                color: '#E9C7DF',
                fontFamily: 'tt-norms-pro-extra-black-italic, sans-serif',
                fontStyle: 'italic',
                mb: 2,
              }}
            >
              ASISTE
            </Typography>
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, mb: 1, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Pago en proceso
            </Typography>
            <Typography
              variant="body1"
              sx={{ color: 'text.secondary', mb: 3, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Te notificaremos por email cuando se confirme tu entrada.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate({ to: '/' })}
              sx={{
                borderRadius: 0,
                fontWeight: 700,
                bgcolor: '#E9C7DF',
                color: '#000000',
                border: '2px solid #E9C7DF',
                fontFamily: "'Space Grotesk', sans-serif",
                letterSpacing: '0.05em',
                px: 4,
                '&:hover': {
                  bgcolor: '#000000',
                  color: '#E9C7DF',
                },
              }}
            >
              IR AL INICIO
            </Button>
          </Box>
        )}
      </Container>
    </Box>
  )
}