import type { ReactNode } from 'react'
import { Box, Button, Container, Stack, Typography } from '@mui/material'
import { Link } from '@tanstack/react-router'
import RouteMetadata from '../components/RouteMetadata'
import { LEGAL_LAST_UPDATED } from '../config/legalConfig'

export type LegalSection = { title: string; body: ReactNode }

type LegalLayoutProps = {
  title: string
  description: string
  path: string
  intro?: ReactNode
  sections: LegalSection[]
}

export default function LegalLayout({ title, description, path, intro, sections }: LegalLayoutProps) {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#050505', color: '#fff', py: { xs: 6, md: 10 } }}>
      <RouteMetadata title={`${title} | HYBRID EXPERIENCE`} description={description} path={path} />
      <Container maxWidth="md">
        <Stack spacing={3}>
          <Button
            component={Link}
            to="/"
            sx={{ alignSelf: 'flex-start', color: 'rgba(255,255,255,0.7)', textTransform: 'none', px: 0 }}
          >
            ← Volver al inicio
          </Button>
          <Typography
            component="h1"
            sx={{ fontSize: { xs: '1.9rem', sm: '2.6rem' }, fontWeight: 950, letterSpacing: '-0.03em' }}
          >
            {title}
          </Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
            Última actualización: {LEGAL_LAST_UPDATED}
          </Typography>
          {intro && (
            <Typography sx={{ color: 'rgba(255,255,255,0.82)', lineHeight: 1.7 }}>{intro}</Typography>
          )}
          {sections.map((section, index) => (
            <Box key={section.title} component="section">
              <Typography
                component="h2"
                sx={{ fontSize: '1.15rem', fontWeight: 800, color: '#E6F2B1', mb: 1 }}
              >
                {index + 1}. {section.title}
              </Typography>
              <Typography
                component="div"
                sx={{ color: 'rgba(255,255,255,0.78)', lineHeight: 1.7, fontSize: '0.95rem' }}
              >
                {section.body}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Container>
    </Box>
  )
}
