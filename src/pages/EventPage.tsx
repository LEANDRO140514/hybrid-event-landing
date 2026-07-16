import { useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  Box, Button, Card, CardContent, Container, Typography, Stack, Divider,
} from '@mui/material'
import QrCodeIcon from '@mui/icons-material/QrCode'
import DownloadIcon from '@mui/icons-material/Download'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag'

const BRAND_FONT = 'tt-norms-pro-extra-black-italic, serif'
const MONO_FONT = '"Space Grotesk", monospace'

interface AthleteSession {
  email: string
  registrationId: string
  categoryName: string
  teamName?: string
  loggedAt: string
}

export default function EventPage() {
  const navigate = useNavigate()
  const [session, setSession] = useState<AthleteSession | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem('the-hype-session')
    if (raw) {
      try { setSession(JSON.parse(raw)) } catch { /* ignore */ }
    }
  }, [])

  if (!session) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Typography
          sx={{
            fontFamily: BRAND_FONT,
            color: '#E6F2B1',
            fontSize: { xs: '2rem', sm: '2.5rem' },
            lineHeight: 1,
            mb: 1.5,
            letterSpacing: '-0.02em',
          }}
        >
          EVENTO
        </Typography>
        <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 500, color: '#B0B890', mb: 3, fontSize: '0.9rem' }}>
          Aún no tienes una inscripción. Regístrate para ver tu credencial digital y QR.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate({ to: '/registro' })}
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
          INSCRIBIRSE AHORA
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      {/* ---- Section Header ---- */}
      <Typography
        sx={{
          fontFamily: BRAND_FONT,
          color: '#E6F2B1',
          fontSize: { xs: '1.8rem', sm: '2.2rem' },
          lineHeight: 1,
          mb: 2.5,
          letterSpacing: '-0.02em',
        }}
      >
        EVENTO
      </Typography>

      {/* ---- Digital Credential (QR + athlete info) ---- */}
      <Card sx={{ bgcolor: '#111111', border: '2px solid rgba(230,242,177,0.2)', borderRadius: 0, mb: 2.5 }}>
        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
          {/* Credential header */}
          <Box sx={{ borderBottom: '2px solid rgba(230,242,177,0.15)', pb: 1.5, mb: 2 }}>
            <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 700, fontSize: '0.65rem', color: '#E6F2B1', letterSpacing: '0.15em', mb: 0.5 }}>
              HYBRID EVENT 2026 // CREDENCIAL DIGITAL
            </Typography>
            <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 700, fontSize: '0.55rem', color: '#B0B890', letterSpacing: '0.1em' }}>
              ID: {session.registrationId}
            </Typography>
          </Box>

          {/* QR Area - cyber/industrial */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              py: 2.5,
              border: '1px solid rgba(230,242,177,0.1)',
              bgcolor: '#0A0A0A',
              mb: 2,
            }}
          >
            <Box
              sx={{
                width: 130, height: 130,
                border: '2px solid #E6F2B1',
                display: 'grid', placeItems: 'center',
                bgcolor: '#000000',
                mb: 1.5,
              }}
            >
              <QrCodeIcon sx={{ fontSize: 72, color: '#E6F2B1' }} />
            </Box>
            <Typography sx={{ fontFamily: MONO_FONT, fontSize: '0.6rem', color: '#B0B890', letterSpacing: '0.1em' }}>
              // CÓDIGO DE ACCESO
            </Typography>
          </Box>

          {/* Athlete Info */}
          <Stack spacing={1.5} sx={{ mb: 2 }}>
            <Box sx={{ borderBottom: '1px solid rgba(230,242,177,0.08)', pb: 1 }}>
              <Typography sx={{ fontFamily: MONO_FONT, fontSize: '0.6rem', color: '#B0B890', letterSpacing: '0.1em', mb: 0.3 }}>ATLETA</Typography>
              <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 700, fontSize: '1.1rem', color: '#E6F2B1' }}>
                {session.teamName || 'Atleta'}
              </Typography>
            </Box>
            <Stack direction="row" sx={{ gap: 3 }}>
              <Box>
                <Typography sx={{ fontFamily: MONO_FONT, fontSize: '0.6rem', color: '#B0B890', letterSpacing: '0.1em', mb: 0.3 }}>CATEGORÍA</Typography>
                <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 700, fontSize: '0.85rem', color: '#E9C7DF' }}>
                  {session.categoryName}
                </Typography>
              </Box>
              <Box>
                <Typography sx={{ fontFamily: MONO_FONT, fontSize: '0.6rem', color: '#B0B890', letterSpacing: '0.1em', mb: 0.3 }}>STATUS</Typography>
                <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 700, fontSize: '0.85rem', color: '#E6F2B1' }}>
                  CONFIRMADO
                </Typography>
              </Box>
            </Stack>
          </Stack>

          <Button
            variant="outlined"
            fullWidth
            startIcon={<DownloadIcon />}
            sx={{
              borderRadius: 0,
              borderColor: 'rgba(230,242,177,0.3)',
              color: '#E6F2B1',
              fontFamily: MONO_FONT,
              fontWeight: 700,
              letterSpacing: '0.08em',
              py: 1.2,
              '&:hover': { borderColor: '#E6F2B1', bgcolor: 'rgba(230,242,177,0.05)' },
            }}
          >
            DESCARGAR QR PDF
          </Button>
        </CardContent>
      </Card>

      {/* ---- CTA Cards: Spectator + Merch ---- */}
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5, mb: 2.5 }}>
        <Card
          role="button"
          tabIndex={0}
          aria-label="Comprar entrada de aficionado"
          sx={{ bgcolor: '#111111', cursor: 'pointer', borderRadius: 0, border: '1px solid rgba(230,242,177,0.15)', '&:hover': { borderColor: '#E6F2B1' }, transition: 'border-color 150ms' }}
          onClick={() => navigate({ to: '/app/evento/aficionado' })}
          onKeyDown={(e) => { if (e.key === 'Enter') navigate({ to: '/app/evento/aficionado' }); }}
        >
          <CardContent sx={{ textAlign: 'center', py: 2.5, px: 1.5, '&:last-child': { pb: 2.5 } }}>
            <ConfirmationNumberIcon sx={{ fontSize: 28, color: '#E6F2B1', mb: 1 }} />
            <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 700, fontSize: '0.75rem', mb: 0.3, letterSpacing: '0.05em' }}>Entrada Aficionado</Typography>
            <Typography sx={{ color: '#B0B890', fontFamily: MONO_FONT, fontSize: '0.65rem' }}>Desde $200 MXN</Typography>
          </CardContent>
        </Card>
        <Card
          role="button"
          tabIndex={0}
          aria-label="Ir a la tienda de merch oficial"
          sx={{ bgcolor: '#111111', cursor: 'pointer', borderRadius: 0, border: '1px solid rgba(230,242,177,0.15)', '&:hover': { borderColor: '#E9C7DF' }, transition: 'border-color 150ms' }}
          onClick={() => navigate({ to: '/app/shop' })}
          onKeyDown={(e) => { if (e.key === 'Enter') navigate({ to: '/app/shop' }); }}
        >
          <CardContent sx={{ textAlign: 'center', py: 2.5, px: 1.5, '&:last-child': { pb: 2.5 } }}>
            <ShoppingBagIcon sx={{ fontSize: 28, color: '#E9C7DF', mb: 1 }} />
            <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 700, fontSize: '0.75rem', mb: 0.3, letterSpacing: '0.05em' }}>Merch Oficial</Typography>
            <Typography sx={{ color: '#B0B890', fontFamily: MONO_FONT, fontSize: '0.65rem' }}>Playeras, hoodies y más</Typography>
          </CardContent>
        </Card>
      </Box>

      {/* ---- Event Info ---- */}
      <Card sx={{ bgcolor: '#111111', border: '1px solid rgba(230,242,177,0.15)', borderRadius: 0 }}>
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 700, fontSize: '0.75rem', color: '#B0B890', letterSpacing: '0.1em', mb: 2 }}>
            // INFO DEL EVENTO
          </Typography>
          <Stack spacing={1.5}>
            <Stack direction="row" sx={{ justifyContent: 'space-between', borderBottom: '1px solid rgba(230,242,177,0.06)', pb: 1 }}>
              <Typography sx={{ fontFamily: MONO_FONT, fontSize: '0.7rem', color: '#B0B890', letterSpacing: '0.05em' }}>UBICACIÓN</Typography>
              <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 600, fontSize: '0.75rem' }}>CDMX</Typography>
            </Stack>
            <Stack direction="row" sx={{ justifyContent: 'space-between', borderBottom: '1px solid rgba(230,242,177,0.06)', pb: 1 }}>
              <Typography sx={{ fontFamily: MONO_FONT, fontSize: '0.7rem', color: '#B0B890', letterSpacing: '0.05em' }}>FECHA</Typography>
              <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 600, fontSize: '0.75rem' }}>17 OCT 2026</Typography>
            </Stack>
            <Stack direction="row" sx={{ justifyContent: 'space-between', borderBottom: '1px solid rgba(230,242,177,0.06)', pb: 1 }}>
              <Typography sx={{ fontFamily: MONO_FONT, fontSize: '0.7rem', color: '#B0B890', letterSpacing: '0.05em' }}>HORA</Typography>
              <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 600, fontSize: '0.75rem' }}>8:00 AM</Typography>
            </Stack>
            <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
              <Typography sx={{ fontFamily: MONO_FONT, fontSize: '0.7rem', color: '#B0B890', letterSpacing: '0.05em' }}>LLEVAR</Typography>
              <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 600, fontSize: '0.7rem', textAlign: 'right', maxWidth: '60%' }}>
                Ropa deportiva, tenis, toalla, botella de agua
              </Typography>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  )
}