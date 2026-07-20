import { Box, Button, Card, CardContent, Container, Stack, Typography } from '@mui/material'
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter'
import SportsScoreIcon from '@mui/icons-material/SportsScore'
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import { DOMAINS } from '../config'
import { eventConfig } from '../config/eventConfig'

const products = [
  {
    title: eventConfig.name,
    description: 'Competencia de fitness funcional. Inscripciones abiertas para atletas, duplas y relevos.',
    href: `https://${DOMAINS.event}`,
    icon: <FitnessCenterIcon sx={{ fontSize: 38 }} />,
    cta: 'Ir al evento',
  },
  {
    title: 'Ready2Hybrid',
    description: 'Plataforma de gestión de eventos deportivos con inscripciones, QR, cronometraje y resultados.',
    href: `https://${DOMAINS.app}`,
    icon: <SportsScoreIcon sx={{ fontSize: 38 }} />,
    cta: 'Abrir plataforma',
  },
  {
    title: 'Admin',
    description: 'Panel operativo para el equipo de EnForma Sports Society y administradores de eventos.',
    href: `https://${DOMAINS.admin}`,
    icon: <AdminPanelSettingsIcon sx={{ fontSize: 38 }} />,
    cta: 'Ir al admin',
  },
]

export default function CorporateLandingPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#050505',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        background:
          'radial-gradient(circle at 50% 0%, rgba(255, 61, 0, 0.22), transparent 34%), radial-gradient(circle at 85% 20%, rgba(255, 214, 0, 0.12), transparent 24%), #050505',
        py: { xs: 8, md: 12 },
      }}
    >
      <Container maxWidth="lg">
        <Stack spacing={5} sx={{ alignItems: 'center', textAlign: 'center' }}>
          <Stack spacing={2} sx={{ alignItems: 'center' }}>
            <Typography
              component="p"
              sx={{
                color: 'secondary.main',
                fontSize: '0.85rem',
                fontWeight: 900,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
              }}
            >
              EnForma Sports Society
            </Typography>
            <Typography
              component="h1"
              sx={{
                fontSize: { xs: '3.2rem', sm: '5.5rem', md: '7rem' },
                fontWeight: 950,
                lineHeight: 0.88,
                letterSpacing: '-0.08em',
                background: 'linear-gradient(135deg, #ffffff 12%, #ffd600 48%, #ff3d00 92%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              ENFORMA
            </Typography>
            <Typography
              sx={{
                maxWidth: 720,
                color: 'rgba(255,255,255,0.72)',
                fontSize: { xs: '1.05rem', md: '1.3rem' },
                lineHeight: 1.6,
              }}
            >
              Donde nace la competencia. Diseñamos, operamos y escalamos experiencias deportivas con tecnología,
              comunidad y ejecución profesional.
            </Typography>
          </Stack>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
              gap: 2.5,
              width: '100%',
            }}
          >
            {products.map((product) => (
              <Card
                key={product.title}
                sx={{
                  bgcolor: 'rgba(255,255,255,0.045)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 5,
                  backdropFilter: 'blur(20px)',
                  transition: 'transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    borderColor: 'rgba(255,214,0,0.55)',
                    boxShadow: '0 24px 70px rgba(255,61,0,0.18)',
                  },
                }}
              >
                <CardContent sx={{ p: { xs: 3, md: 4 }, height: '100%' }}>
                  <Stack spacing={2.4} sx={{ alignItems: 'flex-start', textAlign: 'left', height: '100%' }}>
                    <Box
                      sx={{
                        width: 66,
                        height: 66,
                        borderRadius: 3,
                        display: 'grid',
                        placeItems: 'center',
                        color: '#050505',
                        background: 'linear-gradient(135deg, #FFD600, #FF3D00)',
                      }}
                    >
                      {product.icon}
                    </Box>
                    <Stack spacing={1} sx={{ flex: 1 }}>
                      <Typography component="h2" variant="h4" sx={{ fontWeight: 950, color: '#fff' }}>
                        {product.title}
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.64)', lineHeight: 1.65 }}>
                        {product.description}
                      </Typography>
                    </Stack>
                    <Button
                      href={product.href}
                      variant={product.title === eventConfig.name ? 'contained' : 'outlined'}
                      color="secondary"
                      fullWidth
                      sx={{ py: 1.2, borderRadius: 999, fontWeight: 900 }}
                    >
                      {product.cta}
                    </Button>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </Box>

          <Typography sx={{ color: 'rgba(255,255,255,0.42)', fontSize: '0.9rem' }}>
            {`© 2026 EnForma Sports Society · Ready2Hybrid · ${eventConfig.name}`}
          </Typography>
        </Stack>
      </Container>
    </Box>
  )
}