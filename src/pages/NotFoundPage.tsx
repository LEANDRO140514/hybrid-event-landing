import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { Link } from '@tanstack/react-router'
import RouteMetadata from '../components/RouteMetadata'

export default function NotFoundPage() {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: '#050505',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        background:
          'radial-gradient(circle at 50% 0%, rgba(255, 61, 0, 0.18), transparent 34%), radial-gradient(circle at 85% 20%, rgba(255, 214, 0, 0.1), transparent 24%), #050505',
        py: { xs: 8, md: 12 },
      }}
    >
      <RouteMetadata
        title="Página no encontrada | HYBRID EXPERIENCE"
        description="La página que buscas no existe. Vuelve al inicio de HYBRID EXPERIENCE by ENFORMA."
        path="/404"
      />
      <Container maxWidth="sm">
        <Stack spacing={4} sx={{ alignItems: 'center', textAlign: 'center' }}>
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
            Error 404
          </Typography>
          <Typography
            component="h1"
            sx={{
              fontSize: { xs: '2.6rem', sm: '3.6rem' },
              fontWeight: 950,
              lineHeight: 0.95,
              letterSpacing: '-0.04em',
              background: 'linear-gradient(135deg, #ffffff 12%, #ffd600 48%, #ff3d00 92%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Página no encontrada
          </Typography>
          <Typography
            sx={{
              maxWidth: 480,
              color: 'rgba(255,255,255,0.72)',
              fontSize: { xs: '1rem', md: '1.1rem' },
              lineHeight: 1.6,
            }}
          >
            La dirección que intentaste abrir no existe o ya no está disponible. Vuelve al inicio para conocer
            HYBRID EXPERIENCE.
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="contained"
            color="secondary"
            sx={{ py: 1.4, px: 4, borderRadius: 999, fontWeight: 900 }}
          >
            Volver al inicio
          </Button>
        </Stack>
      </Container>
    </Box>
  )
}
