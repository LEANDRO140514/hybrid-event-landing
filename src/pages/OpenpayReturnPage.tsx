import { useCallback, useEffect, useRef, useState } from 'react'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { Link } from '@tanstack/react-router'
import RouteMetadata from '../components/RouteMetadata'
import {
  clampPollSeconds,
  getOrderStatus,
  type PublicOrderStatus,
} from '../api/orderStatus'
import { resolvePublicOrderReference } from '../lib/checkoutSession'
import { isCheckoutActive } from '../config/checkoutConfig'

/** Browser return after Openpay 3DS. The provider may append a charge id; this page never reads it. */
export const OPENPAY_RETURN_PATH = '/checkout/openpay'
export const OPENPAY_RETURN_URL = 'https://hybrid-experience.enforma.mx/checkout/openpay'

type Outcome = 'approved' | 'pending' | 'incomplete'

export function outcomeForOrderStatus(status: PublicOrderStatus): Outcome {
  if (status === 'APPROVED') return 'approved'
  if (status === 'CREATING' || status === 'AWAITING_PAYMENT' || status === 'REQUIRES_ACTION') {
    return 'pending'
  }
  return 'incomplete'
}

const OUTCOME_TITLE: Record<Outcome, string> = {
  approved: 'Pago aprobado',
  pending: 'Pago pendiente',
  incomplete: 'Pago no completado',
}

const OUTCOME_DETAIL: Record<Outcome, string> = {
  approved: 'Tu lugar quedó confirmado.',
  pending: 'Seguimos confirmando el resultado con el banco.',
  incomplete: 'Puedes volver al inicio y completar el pago con Mercado Pago.',
}

type ViewState =
  | { kind: 'missing_ref' }
  | { kind: 'offline' }
  | { kind: 'loading' }
  | { kind: 'status'; outcome: Outcome; terminal: boolean }
  | { kind: 'error' }

export default function OpenpayReturnPage() {
  const reference = resolvePublicOrderReference(null)
  const [view, setView] = useState<ViewState>(() =>
    reference ? { kind: 'loading' } : { kind: 'missing_ref' },
  )
  const timerRef = useRef<number | null>(null)
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
    if (!isCheckoutActive()) {
      setView({ kind: 'error' })
      return
    }
    try {
      const result = await getOrderStatus(reference)
      setView({
        kind: 'status',
        outcome: outcomeForOrderStatus(result.status),
        terminal: result.terminal,
      })
      if (result.terminal) {
        clearTimer()
        return
      }
      const waitMs = clampPollSeconds(result.next_poll_after_seconds) * 1000
      clearTimer()
      timerRef.current = window.setTimeout(() => {
        if (activeRef.current) void poll()
      }, waitMs)
    } catch {
      setView({ kind: 'error' })
      clearTimer()
    }
  }, [reference])

  useEffect(() => {
    activeRef.current = true
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

  const title = view.kind === 'status' ? OUTCOME_TITLE[view.outcome] : 'Verificando pago'
  const liveText =
    view.kind === 'status'
      ? OUTCOME_DETAIL[view.outcome]
      : view.kind === 'loading'
        ? 'Estamos verificando tu pago'
        : view.kind === 'offline'
          ? 'Se necesita conexión para confirmar el pago.'
          : view.kind === 'missing_ref'
            ? 'No encontramos el pago de esta sesión.'
            : 'No pudimos consultar el estado del pago.'

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
        title="Regreso de pago | HYBRID EXPERIENCE"
        description="Resultado del pago con tarjeta de HYBRID EXPERIENCE."
        path={OPENPAY_RETURN_PATH}
      />
      <Container maxWidth="sm">
        <Stack spacing={3} sx={{ alignItems: 'center', textAlign: 'center' }}>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: '1.8rem', sm: '2.2rem' },
              fontWeight: 950,
              letterSpacing: '-0.03em',
            }}
          >
            {title}
          </Typography>
          <Typography
            aria-live="polite"
            sx={{ color: 'rgba(255,255,255,0.78)', fontSize: '1.05rem', lineHeight: 1.6 }}
          >
            {liveText}
          </Typography>
          {(view.kind === 'error' || view.kind === 'offline') && (
            <Button
              variant="outlined"
              onClick={() => {
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
