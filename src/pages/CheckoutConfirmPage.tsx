import { useCallback, useEffect, useRef, useState } from 'react'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { Link, useSearch } from '@tanstack/react-router'
import RouteMetadata from '../components/RouteMetadata'
import {
  clampPollSeconds,
  getOrderStatus,
  labelForOrderStatus,
  type PublicOrderStatus,
} from '../api/orderStatus'
import { clearCheckoutAttempt, resolvePublicOrderReference } from '../lib/checkoutSession'
import { isSandboxCheckoutActive } from '../config/checkoutConfig'

const MAX_AUTO_POLL_MS = 2 * 60 * 1000

type ViewState =
  | { kind: 'missing_ref' }
  | { kind: 'offline' }
  | { kind: 'loading' }
  | { kind: 'status'; status: PublicOrderStatus; terminal: boolean }
  | { kind: 'error'; message: string }

export default function CheckoutConfirmPage() {
  const search = useSearch({ from: '/checkout/confirmando' })
  const reference = resolvePublicOrderReference(
    typeof search.ref === 'string' ? search.ref : null,
  )
  const [view, setView] = useState<ViewState>(() =>
    reference ? { kind: 'loading' } : { kind: 'missing_ref' },
  )
  const [autoStopped, setAutoStopped] = useState(false)
  const timerRef = useRef<number | null>(null)
  const startedAtRef = useRef<number>(Date.now())
  const activeRef = useRef(true)

  const clearTimer = () => {
    if (timerRef.current != null) {
      window.clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  const poll = useCallback(async () => {
    if (!reference) {
      setView({ kind: 'missing_ref' })
      return
    }
    if (!navigator.onLine) {
      setView({ kind: 'offline' })
      return
    }
    if (!isSandboxCheckoutActive()) {
      setView({
        kind: 'error',
        message: 'La confirmación de pago no está disponible en este entorno.',
      })
      return
    }

    try {
      const result = await getOrderStatus(reference)
      setView({ kind: 'status', status: result.status, terminal: result.terminal })
      if (result.terminal) {
        clearCheckoutAttempt(reference)
        clearTimer()
        return
      }
      if (Date.now() - startedAtRef.current > MAX_AUTO_POLL_MS) {
        setAutoStopped(true)
        clearTimer()
        return
      }
      const waitMs = clampPollSeconds(result.next_poll_after_seconds) * 1000
      clearTimer()
      timerRef.current = window.setTimeout(() => {
        if (activeRef.current) void poll()
      }, waitMs)
    } catch {
      setView({
        kind: 'error',
        message: 'No pudimos consultar el estado del pago. Inténtalo de nuevo.',
      })
      clearTimer()
    }
  }, [reference])

  useEffect(() => {
    activeRef.current = true
    startedAtRef.current = Date.now()
    setAutoStopped(false)
    if (reference) {
      setView({ kind: 'loading' })
      void poll()
    } else {
      setView({ kind: 'missing_ref' })
    }
    return () => {
      activeRef.current = false
      clearTimer()
    }
  }, [poll, reference])

  const liveText =
    view.kind === 'status'
      ? labelForOrderStatus(view.status)
      : view.kind === 'loading'
        ? 'Consultando el estado del pago…'
        : view.kind === 'offline'
          ? 'Se necesita conexión para confirmar el pago.'
          : view.kind === 'missing_ref'
            ? 'No encontramos una referencia de orden válida.'
            : view.kind === 'error'
              ? view.message
              : ''

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#050505',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        py: { xs: 8, md: 12 },
      }}
    >
      <RouteMetadata
        title="Confirmando pago | HYBRID EXPERIENCE"
        description="Confirmación autoritativa del estado de pago de HYBRID EXPERIENCE."
        path="/checkout/confirmando"
      />
      <Container maxWidth="sm">
        <Stack spacing={3} sx={{ alignItems: 'center', textAlign: 'center' }}>
          <Typography
            component="p"
            sx={{
              color: 'secondary.main',
              fontSize: '0.75rem',
              fontWeight: 900,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
            }}
          >
            Entorno de prueba
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: '1.8rem', sm: '2.2rem' },
              fontWeight: 950,
              letterSpacing: '-0.03em',
            }}
          >
            Confirmando pago
          </Typography>
          <Typography
            aria-live="polite"
            sx={{ color: 'rgba(255,255,255,0.78)', fontSize: '1.05rem', lineHeight: 1.6 }}
          >
            {liveText}
          </Typography>
          {(view.kind === 'error' || view.kind === 'offline' || autoStopped) && (
            <Button
              variant="outlined"
              onClick={() => {
                startedAtRef.current = Date.now()
                setAutoStopped(false)
                setView({ kind: 'loading' })
                void poll()
              }}
              sx={{
                borderRadius: 0,
                borderWidth: 2,
                borderColor: '#E6F2B1',
                color: '#E6F2B1',
                fontWeight: 700,
                minHeight: 44,
                '&:hover': { borderWidth: 2, borderColor: '#E6F2B1', bgcolor: '#E6F2B11A' },
              }}
            >
              Volver a consultar
            </Button>
          )}
          <Button
            component={Link}
            to="/"
            sx={{
              borderRadius: 0,
              color: 'rgba(255,255,255,0.7)',
              textTransform: 'none',
              minHeight: 44,
            }}
          >
            Volver al inicio
          </Button>
        </Stack>
      </Container>
    </Box>
  )
}
