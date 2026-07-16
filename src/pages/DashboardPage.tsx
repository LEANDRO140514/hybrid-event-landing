import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  Box, Button, Card, CardContent, Container, Grid, Typography, Stack, Chip,
} from '@mui/material'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import TimerIcon from '@mui/icons-material/Timer'
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment'
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents'
import { useCountdown } from '../hooks/useCountdown'

const BRAND_FONT = 'tt-norms-pro-extra-black-italic, serif'
const MONO_FONT = '"Space Grotesk", monospace'

// ---- Types ----
interface AthleteSession {
  email: string
  registrationId: string
  categoryName: string
  teamName?: string
  loggedAt: string
}

// ---- Countdown Unit ----
function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <Box sx={{ textAlign: 'center', px: { xs: 1, sm: 2 } }}>
      <Typography
        sx={{
          fontFamily: BRAND_FONT,
          color: '#E6F2B1',
          fontSize: { xs: '2rem', sm: '3rem' },
          lineHeight: 1,
        }}
      >
        {String(value).padStart(2, '0')}
      </Typography>
      <Typography variant="body2" sx={{ color: '#B0B890', textTransform: 'uppercase', fontSize: '0.6rem', letterSpacing: '0.12em', mt: 0.5 }}>
        {label}
      </Typography>
    </Box>
  )
}

// ---- Stat Card (console/metric style) ----
function StatCard({ icon, value, label, color }: { icon: React.ReactNode; value: string; label: string; color: string }) {
  return (
    <Card sx={{ bgcolor: '#111111', border: '1px solid rgba(230,242,177,0.15)', borderRadius: 0, height: '100%' }}>
      <CardContent sx={{ textAlign: 'center', py: 2.5, px: 2, '&:last-child': { pb: 2.5 } }}>
        <Box sx={{ color, mb: 0.5 }}>{icon}</Box>
        <Typography
          sx={{
            fontFamily: MONO_FONT,
            fontWeight: 800,
            fontSize: '1.5rem',
            lineHeight: 1.1,
            color: '#E6F2B1',
            letterSpacing: '-0.02em',
          }}
        >
          {value}
        </Typography>
        <Typography variant="body2" sx={{ color: '#B0B890', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', mt: 0.5, fontFamily: MONO_FONT }}>
          {label}
        </Typography>
      </CardContent>
    </Card>
  )
}

// ---- WOD Placeholder ----
const WOD_PLACEHOLDER = {
  title: '5 ROUNDS FOR TIME',
  exercises: [
    { name: 'Run', detail: '400m' },
    { name: 'Burpees', detail: '15 reps' },
    { name: 'Kettlebell Swings', detail: '20 reps @ 24/16kg' },
    { name: 'Box Jumps', detail: '10 reps' },
  ],
  intensity: 'ALTA',
}

export default function DashboardPage() {
  const navigate = useNavigate()
  const targetDate = useMemo(() => new Date('2026-10-17T08:00:00'), [])
  const timeLeft = useCountdown(targetDate)
  const [session, setSession] = useState<AthleteSession | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem('the-hype-session')
    if (raw) {
      try { setSession(JSON.parse(raw)) } catch { /* ignore */ }
    }
  }, [])

  return (
    <Box>
      {/* ---- Hero / Countdown ---- */}
      <Box
        sx={{
          px: 2, pt: 4, pb: 3,
          background: 'radial-gradient(ellipse at 50% 0%, rgba(230,242,177,0.08) 0%, rgba(10,10,10,1) 70%)',
        }}
      >
        <Typography
          sx={{
            fontFamily: BRAND_FONT,
            color: '#E6F2B1',
            fontSize: { xs: '2rem', sm: '2.8rem' },
            lineHeight: 1,
            mb: 0.5,
            letterSpacing: '-0.02em',
          }}
        >
          {session ? `¡HOLA, ${session.teamName || 'ATLETA'}!` : 'HYBRID EVENT 2026'}
        </Typography>
        <Typography variant="body2" sx={{ color: '#B0B890', fontFamily: MONO_FONT, mb: 3, letterSpacing: '0.05em' }}>
          {session
            ? `${session.categoryName} // OCT 2026 // CDMX`
            : 'EL EVENTO FITNESS MÁS INTENSO DE MÉXICO'}
        </Typography>

        {/* Countdown - brutalist container */}
        <Stack
          direction="row"
          spacing={1}
          sx={{
            p: 2,
            border: '1px solid rgba(230,242,177,0.15)',
            bgcolor: '#111111',
            justifyContent: 'center',
            borderRadius: 0,
          }}
        >
          <CountdownUnit value={timeLeft.days} label="Días" />
          <Typography sx={{ color: '#B0B890', alignSelf: 'flex-start', mt: 0.5, fontSize: '1.5rem', fontWeight: 300, fontFamily: MONO_FONT }}>:</Typography>
          <CountdownUnit value={timeLeft.hours} label="Horas" />
          <Typography sx={{ color: '#B0B890', alignSelf: 'flex-start', mt: 0.5, fontSize: '1.5rem', fontWeight: 300, fontFamily: MONO_FONT }}>:</Typography>
          <CountdownUnit value={timeLeft.minutes} label="Min" />
          <Typography sx={{ color: '#B0B890', alignSelf: 'flex-start', mt: 0.5, fontSize: '1.5rem', fontWeight: 300, fontFamily: MONO_FONT }}>:</Typography>
          <CountdownUnit value={timeLeft.seconds} label="Seg" />
        </Stack>
      </Box>

      {/* ---- Stats Row ---- */}
      {session && (
        <Container maxWidth="lg" sx={{ mb: 3 }}>
          <Grid container spacing={1.5}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <StatCard icon={<EmojiEventsIcon sx={{ fontSize: 22 }} />} value="INSCRITO" label={session.categoryName} color="#E6F2B1" />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <StatCard icon={<LocalFireDepartmentIcon sx={{ fontSize: 22 }} />} value="—" label="Racha (próx.)" color="#E6F2B1" />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <StatCard icon={<TimerIcon sx={{ fontSize: 22 }} />} value="—" label="Entrenos / Sem" color="#E6F2B1" />
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <StatCard icon={<FitnessCenterIcon sx={{ fontSize: 22 }} />} value="107" label="Días para evento" color="#E6F2B1" />
            </Grid>
          </Grid>
        </Container>
      )}

      {/* ---- WOD of the Day ---- */}
      <Container maxWidth="lg" sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontFamily: BRAND_FONT,
            color: '#E6F2B1',
            fontSize: '1.3rem',
            lineHeight: 1,
            mb: 1.5,
            letterSpacing: '-0.01em',
          }}
        >
          WOD DEL DÍA
        </Typography>
        <Card sx={{ bgcolor: '#111111', border: '1px solid rgba(230,242,177,0.15)', borderRadius: 0 }}>
          <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
            <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2 }}>
              <Typography
                sx={{
                  fontFamily: MONO_FONT,
                  fontWeight: 800,
                  fontSize: '1rem',
                  flex: 1,
                  letterSpacing: '0.05em',
                }}
              >
                {WOD_PLACEHOLDER.title}
              </Typography>
              <Chip label={WOD_PLACEHOLDER.intensity} size="small" sx={{ bgcolor: 'rgba(230,242,177,0.1)', color: '#E6F2B1', fontWeight: 700, borderRadius: 0, border: '1px solid rgba(230,242,177,0.3)', fontFamily: MONO_FONT }} />
            </Stack>
            {WOD_PLACEHOLDER.exercises.map((ex, i) => (
              <Stack key={i} direction="row" spacing={2} sx={{ py: 0.8, borderBottom: i < WOD_PLACEHOLDER.exercises.length - 1 ? '1px solid rgba(230,242,177,0.08)' : 'none', alignItems: 'center' }}>
                <Typography sx={{ color: '#B0B890', fontFamily: MONO_FONT, fontWeight: 700, minWidth: 24, fontSize: '0.85rem' }}>{String(i + 1).padStart(2, '0')}</Typography>
                <Typography sx={{ flex: 1, fontFamily: MONO_FONT, fontWeight: 500 }}>{ex.name}</Typography>
                <Typography sx={{ color: '#B0B890', fontFamily: MONO_FONT, fontSize: '0.85rem' }}>{ex.detail}</Typography>
              </Stack>
            ))}
            <Button
              variant="contained"
              fullWidth
              sx={{
                mt: 2,
                py: 1.2,
                borderRadius: 0,
                bgcolor: '#E6F2B1',
                color: '#000000',
                fontWeight: 700,
                fontFamily: MONO_FONT,
                letterSpacing: '0.08em',
                border: '2px solid #E6F2B1',
                '&:hover': { bgcolor: '#F0F7CD', borderColor: '#F0F7CD' },
              }}
            >
              REGISTRAR ENTRENAMIENTO
            </Button>
          </CardContent>
        </Card>
      </Container>

      {/* ---- CTA para no inscritos ---- */}
      {!session && (
        <Container maxWidth="sm" sx={{ mb: 4 }}>
          <Card sx={{ bgcolor: '#111111', border: '1px solid rgba(230,242,177,0.15)', borderRadius: 0, textAlign: 'center', p: 3 }}>
            <Typography
              sx={{
                fontFamily: BRAND_FONT,
                color: '#E6F2B1',
                fontSize: '1.3rem',
                lineHeight: 1,
                mb: 1,
                letterSpacing: '-0.01em',
              }}
            >
              ¿AÚN NO TE INSCRIBES?
            </Typography>
            <Typography variant="body2" sx={{ color: '#B0B890', fontFamily: MONO_FONT, mb: 2 }}>
              8 CATEGORÍAS. INDIVIDUAL, DUPLA O RELEVO. ¡ELIGE LA TUYA!
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate({ to: '/registro' })}
              sx={{
                px: 5,
                py: 1.5,
                borderRadius: 0,
                bgcolor: '#E6F2B1',
                color: '#000000',
                fontWeight: 700,
                fontFamily: MONO_FONT,
                letterSpacing: '0.08em',
                border: '2px solid #E6F2B1',
                '&:hover': { bgcolor: '#F0F7CD', borderColor: '#F0F7CD' },
              }}
            >
              ¡INSCRÍBETE AHORA!
            </Button>
          </Card>
        </Container>
      )}
    </Box>
  )
}