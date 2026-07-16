import { useState, useEffect } from 'react'
import { Box, Card, CardContent, Container, Typography, Stack, Divider } from '@mui/material'
import PersonIcon from '@mui/icons-material/Person'
import SettingsIcon from '@mui/icons-material/Settings'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'

const BRAND_FONT = 'tt-norms-pro-extra-black-italic, serif'
const MONO_FONT = '"Space Grotesk", monospace'

interface AthleteSession {
  email: string
  registrationId: string
  categoryName: string
  teamName?: string
  loggedAt: string
}

const badges = [
  { icon: '🏅', name: 'INSCRITO', desc: 'Registrado en Hybrid Event 2026', earned: true },
  { icon: '🔥', name: 'RACHA 7 DÍAS', desc: '7 días seguidos de entrenamiento', earned: false },
  { icon: '🏃', name: 'PRIMER 5K', desc: 'Completar 5km en un entrenamiento', earned: false },
  { icon: '🏆', name: 'FINISHER', desc: 'Completar Hybrid Event 2026', earned: false },
]

function StatMetric({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography
        sx={{
          fontFamily: MONO_FONT,
          fontWeight: 800,
          fontSize: '1.8rem',
          lineHeight: 1,
          color,
          letterSpacing: '-0.02em',
        }}
      >
        {value}
      </Typography>
      <Typography sx={{ color: '#B0B890', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', mt: 0.5, fontFamily: MONO_FONT }}>
        {label}
      </Typography>
    </Box>
  )
}

export default function ProfilePage() {
  const [session, setSession] = useState<AthleteSession | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem('the-hype-session')
    if (raw) {
      try { setSession(JSON.parse(raw)) } catch { /* ignore */ }
    }
  }, [])

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
        PERFIL
      </Typography>

      {/* ---- Athlete identity card ---- */}
      <Card sx={{ bgcolor: '#111111', border: '1px solid rgba(230,242,177,0.15)', borderRadius: 0, mb: 2 }}>
        <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
          <Stack direction="row" spacing={2.5} sx={{ alignItems: 'center' }}>
            <Box
              sx={{
                width: 64, height: 64,
                border: '2px solid rgba(230,242,177,0.3)',
                display: 'grid', placeItems: 'center',
                bgcolor: '#000000',
              }}
            >
              <PersonIcon sx={{ fontSize: 32, color: '#E6F2B1' }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 700, fontSize: '1.1rem', color: '#E6F2B1' }}>
                {session?.teamName || 'ATLETA'}
              </Typography>
              <Typography sx={{ color: '#B0B890', fontSize: '0.75rem', fontFamily: MONO_FONT, letterSpacing: '0.05em' }}>
                {session?.categoryName || 'HYBRID EVENT 2026'} // {session?.registrationId?.slice(0, 8) || '—'}
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* ---- Stats (console metrics) ---- */}
      <Card sx={{ bgcolor: '#111111', border: '1px solid rgba(230,242,177,0.15)', borderRadius: 0, mb: 2 }}>
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 700, fontSize: '0.75rem', color: '#B0B890', letterSpacing: '0.1em', mb: 2 }}>
            // ESTADÍSTICAS
          </Typography>
          <Stack direction="row" sx={{ justifyContent: 'space-around' }}>
            <StatMetric value="0" label="ENTRENOS" color="#E6F2B1" />
            <StatMetric value="0 KM" label="DISTANCIA" color="#E9C7DF" />
            <StatMetric value="0" label="RACHA" color="#E6F2B1" />
          </Stack>
        </CardContent>
      </Card>

      {/* ---- Badges ---- */}
      <Card sx={{ bgcolor: '#111111', border: '1px solid rgba(230,242,177,0.15)', borderRadius: 0, mb: 2 }}>
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 700, fontSize: '0.75rem', color: '#B0B890', letterSpacing: '0.1em', mb: 2 }}>
            // INSIGNIAS
          </Typography>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
            {badges.map((b) => (
              <Box
                key={b.name}
                sx={{
                  p: 1.5, textAlign: 'center',
                  bgcolor: b.earned ? 'rgba(230,242,177,0.08)' : 'rgba(255,255,255,0.02)',
                  border: '1px solid',
                  borderColor: b.earned ? 'rgba(230,242,177,0.3)' : 'rgba(255,255,255,0.06)',
                  opacity: b.earned ? 1 : 0.35,
                }}
              >
                <Typography sx={{ fontSize: '1.5rem', mb: 0.5, fontFamily: MONO_FONT }}>{b.icon}</Typography>
                <Typography sx={{ fontWeight: 700, fontSize: '0.65rem', fontFamily: MONO_FONT, letterSpacing: '0.05em' }}>{b.name}</Typography>
              </Box>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* ---- Settings ---- */}
      <Card sx={{ bgcolor: '#111111', border: '1px solid rgba(230,242,177,0.15)', borderRadius: 0 }}>
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
            <SettingsIcon sx={{ color: '#B0B890', fontSize: 20 }} />
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 600, fontSize: '0.85rem' }}>Configuración</Typography>
              <Typography sx={{ color: '#B0B890', fontFamily: MONO_FONT, fontSize: '0.7rem' }}>Notificaciones, privacidad, cuenta</Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Container>
  )
}