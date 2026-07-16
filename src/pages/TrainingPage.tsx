import { Box, Card, CardContent, Container, Typography, Stack, Divider } from '@mui/material'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import TimelineIcon from '@mui/icons-material/Timeline'

const BRAND_FONT = 'tt-norms-pro-extra-black-italic, serif'
const MONO_FONT = '"Space Grotesk", monospace'

const features = [
  { icon: <DirectionsRunIcon sx={{ fontSize: 24 }} />, title: 'GPS TRACKING', desc: 'Registra tus carreras con GPS en tiempo real.', status: 'PRÓXIMAMENTE' },
  { icon: <FitnessCenterIcon sx={{ fontSize: 24 }} />, title: 'WODS DIARIOS', desc: 'Workouts of the Day diseñados para el evento.', status: 'PRÓXIMAMENTE' },
  { icon: <CalendarMonthIcon sx={{ fontSize: 24 }} />, title: 'PLAN 12 SEMANAS', desc: 'Plan de entrenamiento progresivo hasta el evento.', status: 'PRÓXIMAMENTE' },
]

export default function TrainingPage() {
  return (
    <Container maxWidth="sm" sx={{ py: 3 }}>
      <Typography
        sx={{
          fontFamily: BRAND_FONT,
          color: '#E6F2B1',
          fontSize: { xs: '1.8rem', sm: '2.2rem' },
          lineHeight: 1,
          mb: 1.5,
          letterSpacing: '-0.02em',
        }}
      >
        TRAINING
      </Typography>

      {/* Stats banner */}
      <Card sx={{ bgcolor: '#111111', border: '1px solid rgba(230,242,177,0.15)', borderRadius: 0, mb: 2.5 }}>
        <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
          <Stack direction="row" sx={{ justifyContent: 'space-around', textAlign: 'center' }}>
            <Box>
              <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 800, fontSize: '1.5rem', color: '#E6F2B1', lineHeight: 1 }}>
                —
              </Typography>
              <Typography sx={{ fontFamily: MONO_FONT, fontSize: '0.6rem', color: '#B0B890', letterSpacing: '0.1em', mt: 0.5 }}>
                ENTRENOS
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 800, fontSize: '1.5rem', color: '#E9C7DF', lineHeight: 1 }}>
                —
              </Typography>
              <Typography sx={{ fontFamily: MONO_FONT, fontSize: '0.6rem', color: '#B0B890', letterSpacing: '0.1em', mt: 0.5 }}>
                DISTANCIA
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 800, fontSize: '1.5rem', color: '#E6F2B1', lineHeight: 1 }}>
                —
              </Typography>
              <Typography sx={{ fontFamily: MONO_FONT, fontSize: '0.6rem', color: '#B0B890', letterSpacing: '0.1em', mt: 0.5 }}>
                RACHA
              </Typography>
            </Box>
            <Box>
              <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 800, fontSize: '1.5rem', color: '#E9C7DF', lineHeight: 1 }}>
                —
              </Typography>
              <Typography sx={{ fontFamily: MONO_FONT, fontSize: '0.6rem', color: '#B0B890', letterSpacing: '0.1em', mt: 0.5 }}>
                MIN / DÍA
              </Typography>
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Feature modules */}
      <Box sx={{ display: 'grid', gap: 1.5, mb: 3 }}>
        {features.map((f) => (
          <Card key={f.title} sx={{ bgcolor: '#111111', border: '1px solid rgba(230,242,177,0.15)', borderRadius: 0 }}>
            <CardContent sx={{ p: 2.5, '&:last-child': { pb: 2.5 } }}>
              <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                <Box sx={{ color: '#E6F2B1', width: 40, display: 'grid', placeItems: 'center' }}>
                  {f.icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Stack direction="row" sx={{ alignItems: 'center', gap: 1, mb: 0.3 }}>
                    <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.05em' }}>
                      {f.title}
                    </Typography>
                    <Typography sx={{ fontFamily: MONO_FONT, fontSize: '0.55rem', color: '#B0B890', letterSpacing: '0.1em', border: '1px solid rgba(230,242,177,0.15)', px: 0.8, py: 0.1 }}>
                      {f.status}
                    </Typography>
                  </Stack>
                  <Typography sx={{ color: '#B0B890', fontFamily: MONO_FONT, fontSize: '0.75rem' }}>
                    {f.desc}
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Box>

      {/* Coming soon banner */}
      <Card sx={{ bgcolor: '#111111', border: '1px solid rgba(230,242,177,0.15)', borderRadius: 0, textAlign: 'center' }}>
        <CardContent sx={{ py: 3, '&:last-child': { pb: 3 } }}>
          <TimelineIcon sx={{ color: '#B0B890', fontSize: 32, mb: 1 }} />
          <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 700, fontSize: '0.8rem', color: '#B0B890', letterSpacing: '0.1em' }}>
            MÓDULO DE ENTRENAMIENTO COMPLETO // AGOSTO 2026
          </Typography>
        </CardContent>
      </Card>
    </Container>
  )
}