import { useState, useEffect, useCallback } from 'react'
import { useSearch, useNavigate } from '@tanstack/react-router'
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Stack,
} from '@mui/material'
import CheckCircleOutlined from '@mui/icons-material/CheckCircleOutlined'
import HourglassTop from '@mui/icons-material/HourglassTop'
import ErrorOutlined from '@mui/icons-material/ErrorOutlined'
import { getRegistrationStatus, type RegistrationStatus } from '../api/checkout'
import { formatPrice } from '../constants/categories'
import { eventConfig } from '../config/eventConfig'

export default function ConfirmacionPage() {
  const navigate = useNavigate()
  const search = useSearch({ strict: false }) as Record<string, string>
  const [registration, setRegistration] = useState<RegistrationStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const registrationId = search.registration_id || sessionStorage.getItem('registrationId')
  const urlStatus = search.status

  const pollStatus = useCallback(async () => {
    if (!registrationId) return
    try {
      const data = await getRegistrationStatus(registrationId)
      setRegistration(data)
      setLoading(false)
      return data.status
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al consultar estado')
      setLoading(false)
      return 'error'
    }
  }, [registrationId])

  useEffect(() => {
    if (!registrationId) {
      setLoading(false)
      setError('No se encontro ID de registro')
      return
    }

    let intervalId: number

    const startPolling = async () => {
      const status = await pollStatus()
      if (status === 'registered' || status === 'failed' || status === 'error') return

      intervalId = window.setInterval(async () => {
        const s = await pollStatus()
        if (s === 'registered' || s === 'failed' || s === 'error') {
          clearInterval(intervalId)
        }
      }, 3000)
    }

    startPolling()
    return () => clearInterval(intervalId)
  }, [registrationId, pollStatus])

  if (!registrationId) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(230,242,177,0.06) 0%, #000000 60%)',
        }}
      >
        <Container maxWidth="sm" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ borderRadius: 0 }}>
            No se encontro informacion de registro.
          </Alert>
          <Button onClick={() => navigate({ to: '/registro' })} sx={{ mt: 2, borderRadius: 0 }}>
            Ir al registro
          </Button>
        </Container>
      </Box>
    )
  }

  const getStatusDisplay = () => {
    const status = registration?.status || (urlStatus === 'approved' ? 'paid' : urlStatus)

    switch (status) {
      case 'registered':
        return {
          icon: <CheckCircleOutlined sx={{ fontSize: 80, color: '#E6F2B1' }} />,
          title: 'Inscripción confirmada',
          subtitle: `Tu pago fue procesado y ya estás inscrito en ${eventConfig.name} 2026.`,
          color: '#E6F2B1',
        }
      case 'paid':
        return {
          icon: <HourglassTop sx={{ fontSize: 80, color: '#E9C7DF' }} />,
          title: 'Pago recibido',
          subtitle: 'Estamos procesando tu inscripción. Esto puede tomar unos segundos...',
          color: '#E9C7DF',
        }
      case 'pending':
        return {
          icon: <HourglassTop sx={{ fontSize: 80, color: '#A0A880' }} />,
          title: 'Pago pendiente',
          subtitle: 'Tu pago está siendo procesado. Te notificaremos por email cuando se confirme.',
          color: '#A0A880',
        }
      case 'failed':
        return {
          icon: <ErrorOutlined sx={{ fontSize: 80, color: '#FF5252' }} />,
          title: 'Pago no completado',
          subtitle: 'Hubo un problema con tu pago. Puedes intentar de nuevo.',
          color: '#FF5252',
        }
      default:
        return {
          icon: <HourglassTop sx={{ fontSize: 80, color: '#A0A880' }} />,
          title: 'Verificando pago...',
          subtitle: 'Estamos verificando el estado de tu pago.',
          color: '#A0A880',
        }
    }
  }

  const statusDisplay = getStatusDisplay()

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(ellipse at 50% 0%, rgba(230,242,177,0.06) 0%, #000000 60%)',
      }}
    >
      <Container maxWidth="sm" sx={{ py: 4, minHeight: '100vh' }}>
        <Box sx={{ textAlign: 'center', py: 4 }}>
          {loading ? (
            <>
              <CircularProgress size={60} sx={{ mb: 3, color: '#E6F2B1' }} />
              <Typography
                variant="h5"
                sx={{ fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Verificando tu pago...
              </Typography>
            </>
          ) : error ? (
            <>
              <ErrorOutlined sx={{ fontSize: 80, color: '#FF5252' }} />
              <Typography
                variant="h4"
                sx={{ fontWeight: 900, mt: 2, mb: 1, color: '#FF5252', fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Error
              </Typography>
              <Alert severity="error" sx={{ mb: 2, textAlign: 'left', borderRadius: 0 }}>
                {error}
              </Alert>
            </>
          ) : (
            <>
              {statusDisplay.icon}
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 900,
                  mt: 2,
                  mb: 1,
                  color: statusDisplay.color,
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {statusDisplay.title}
              </Typography>
              <Typography
                color="text.secondary"
                sx={{ mb: 4, fontSize: '1.1rem', fontFamily: "'Space Grotesk', sans-serif" }}
              >
                {statusDisplay.subtitle}
              </Typography>
            </>
          )}
        </Box>

        {registration && (registration.status === 'registered' || registration.status === 'paid') && (
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
                sx={{ fontWeight: 700, mb: 2, fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Detalles de tu inscripción
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
                    {registration.category_name}
                  </Typography>
                </Box>
                {registration.team_name && (
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
                      {registration.team_name}
                    </Typography>
                  </Box>
                )}
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography
                    color="text.secondary"
                    sx={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Email
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {registration.contact_email}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography
                    color="text.secondary"
                    sx={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Total pagado
                  </Typography>
                  <Typography
                    sx={{ fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {formatPrice(registration.amount)}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        )}

        {registration?.status === 'registered' && (
          <Stack spacing={2}>
            <Alert
              severity="info"
              sx={{
                borderRadius: 0,
                '& .MuiAlert-icon': { color: '#E6F2B1' },
              }}
            >
              Revisa tu email ({registration.contact_email}) para recibir tu ticket QR.
              Si no lo recibes en 10 minutos, revisa tu carpeta de spam.
            </Alert>
            <Button
              variant="contained"
              size="large"
              fullWidth
              sx={{
                py: 1.5,
                borderRadius: 0,
                fontWeight: 700,
                bgcolor: '#E6F2B1',
                color: '#000000',
                border: '2px solid #E6F2B1',
                fontFamily: "'Space Grotesk', sans-serif",
                '&:hover': {
                  bgcolor: '#000000',
                  color: '#E6F2B1',
                },
              }}
              disabled
            >
              Descargar QR PDF (disponible por email)
            </Button>
          </Stack>
        )}

        {registration?.status === 'failed' && (
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={() => navigate({ to: '/registro' })}
            sx={{
              py: 1.5,
              borderRadius: 0,
              fontWeight: 700,
              bgcolor: '#E6F2B1',
              color: '#000000',
              border: '2px solid #E6F2B1',
              fontFamily: "'Space Grotesk', sans-serif",
              '&:hover': {
                bgcolor: '#000000',
                color: '#E6F2B1',
              },
            }}
          >
            Intentar de nuevo
          </Button>
        )}

        {(registration?.status === 'paid' || registration?.status === 'pending') && (
          <Box sx={{ textAlign: 'center' }}>
            <CircularProgress size={24} sx={{ mr: 1, color: '#E6F2B1' }} />
            <Typography
              variant="body2"
              color="text.secondary"
              component="span"
              sx={{ fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Actualizando estado...
            </Typography>
          </Box>
        )}

        <Button
          onClick={() => navigate({ to: '/' })}
          sx={{
            mt: 4,
            display: 'block',
            mx: 'auto',
            color: 'text.secondary',
            fontFamily: "'Space Grotesk', sans-serif",
            '&:hover': { color: '#E6F2B1' },
          }}
        >
          Volver al inicio
        </Button>
      </Container>
    </Box>
  )
}