import { useMemo, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Stack,
  Chip,
  IconButton,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'
import InstagramIcon from '@mui/icons-material/Instagram'
import WhatsAppIcon from '@mui/icons-material/WhatsApp'
import EmailIcon from '@mui/icons-material/Email'
import { useCountdown } from '../hooks/useCountdown'
import { CATEGORIES, getCategoryChipColor, formatPrice } from '../constants/categories'
import { eventConfig } from '../config/eventConfig'

const FAQ_DATA = [
  {
    question: '¿Qué es Hybrid Event?',
    answer:
      'Hybrid Event es una competencia de fitness funcional que combina carreras con estaciones de ejercicio. Es una experiencia competitiva y divertida diseñada para atletas de todos los niveles.',
  },
  {
    question: '¿Necesito experiencia previa?',
    answer:
      'No necesitas ser un atleta profesional. El evento está diseñado para que cualquier persona con un nivel básico de condición física pueda participar y disfrutar. Recomendamos al menos 3 meses de entrenamiento previo.',
  },
  {
    question: '¿Qué debo llevar el día del evento?',
    answer:
      'Ropa deportiva cómoda, tenis para correr, toalla, botella de agua y mucha energía. Te proporcionaremos tu número de competidor y chip de cronometraje el día del registro.',
  },
  {
    question: '¿Cómo funciona el cronometraje?',
    answer:
      'Utilizamos un sistema de cronometraje con chip electrónico. Tu tiempo se registra automáticamente al pasar por cada estación y al cruzar la meta. Los resultados se publican en tiempo real.',
  },
  {
    question: '¿Puedo cambiar de categoría después de inscribirme?',
    answer:
      'Sí, puedes solicitar un cambio de categoría hasta 15 días antes del evento, sujeto a disponibilidad. Contacta a nuestro equipo por WhatsApp o correo electrónico.',
  },
  {
    question: '¿Hay estacionamiento?',
    answer:
      'Sí, la sede cuenta con estacionamiento amplio. También recomendamos llegar temprano o usar transporte público para evitar contratiempos.',
  },
]

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <Box sx={{ textAlign: 'center', px: { xs: 1, sm: 2 } }}>
      <Typography
        variant="h2"
        sx={{
          fontWeight: 900,
          color: 'secondary.main',
          fontSize: { xs: '2rem', sm: '3rem' },
          lineHeight: 1,
        }}
      >
        {String(value).padStart(2, '0')}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          textTransform: 'uppercase',
          fontSize: { xs: '0.65rem', sm: '0.75rem' },
          letterSpacing: '0.1em',
          mt: 0.5,
        }}
      >
        {label}
      </Typography>
    </Box>
  )
}

// ── Brutalist SVG Icons ──────────────────────────────────────────
function StrengthIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
      <line x1="4" y1="24" x2="44" y2="24" strokeWidth="3" />
      <rect x="10" y="17" width="5" height="14" />
      <rect x="18" y="13" width="5" height="22" />
      <rect x="25" y="13" width="5" height="22" />
      <rect x="33" y="17" width="5" height="14" />
    </svg>
  )
}

function CardioIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
      <polygon points="28,4 10,26 22,26 18,44 38,20 26,20" />
    </svg>
  )
}

function TeamsIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
      <rect x="4" y="10" width="18" height="28" />
      <rect x="26" y="10" width="18" height="28" />
      <line x1="13" y1="4" x2="13" y2="44" />
      <line x1="35" y1="4" x2="35" y2="44" />
    </svg>
  )
}

function IndividualIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
      <circle cx="24" cy="12" r="6" />
      <line x1="24" y1="18" x2="24" y2="34" />
      <line x1="10" y1="24" x2="38" y2="24" />
      <line x1="24" y1="34" x2="14" y2="46" />
      <line x1="24" y1="34" x2="34" y2="46" />
    </svg>
  )
}

function DuplaIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
      <circle cx="12" cy="10" r="5" />
      <line x1="12" y1="15" x2="12" y2="28" />
      <line x1="4" y1="20" x2="20" y2="20" />
      <line x1="12" y1="28" x2="6" y2="38" />
      <line x1="12" y1="28" x2="18" y2="38" />
      <circle cx="36" cy="10" r="5" />
      <line x1="36" y1="15" x2="36" y2="28" />
      <line x1="28" y1="20" x2="44" y2="20" />
      <line x1="36" y1="28" x2="30" y2="38" />
      <line x1="36" y1="28" x2="42" y2="38" />
    </svg>
  )
}

function RelevoIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
      <rect x="6" y="14" width="10" height="6" />
      <rect x="20" y="14" width="10" height="6" />
      <rect x="34" y="14" width="10" height="6" />
      <line x1="16" y1="17" x2="20" y2="17" />
      <line x1="30" y1="17" x2="34" y2="17" />
      <line x1="8" y1="28" x2="40" y2="28" />
      <polyline points="34,24 40,28 34,32" />
    </svg>
  )
}

function IndividualIconF({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
      <circle cx="24" cy="12" r="6" />
      <path d="M18 8 Q24 3 30 8" />
      <line x1="24" y1="18" x2="24" y2="34" />
      <line x1="10" y1="24" x2="38" y2="24" />
      <polygon points="15,34 33,34 24,44" />
      <line x1="24" y1="44" x2="14" y2="46" />
      <line x1="24" y1="44" x2="34" y2="46" />
    </svg>
  )
}

function DuplaIconF({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
      <circle cx="12" cy="10" r="5" />
      <path d="M8 7 Q12 3 16 7" />
      <line x1="12" y1="15" x2="12" y2="28" />
      <line x1="4" y1="20" x2="20" y2="20" />
      <polygon points="6,28 18,28 12,36" />
      <line x1="12" y1="36" x2="6" y2="38" />
      <line x1="12" y1="36" x2="18" y2="38" />
      <circle cx="36" cy="10" r="5" />
      <path d="M32 7 Q36 3 40 7" />
      <line x1="36" y1="15" x2="36" y2="28" />
      <line x1="28" y1="20" x2="44" y2="20" />
      <polygon points="30,28 42,28 36,36" />
      <line x1="36" y1="36" x2="30" y2="38" />
      <line x1="36" y1="36" x2="42" y2="38" />
    </svg>
  )
}

function RelevoIconF({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
      <rect x="6" y="14" width="10" height="6" />
      <polygon points="6,20 16,20 11,26" />
      <rect x="20" y="14" width="10" height="6" />
      <polygon points="20,20 30,20 25,26" />
      <rect x="34" y="14" width="10" height="6" />
      <polygon points="34,20 44,20 39,26" />
      <line x1="16" y1="17" x2="20" y2="17" />
      <line x1="30" y1="17" x2="34" y2="17" />
      <line x1="8" y1="28" x2="40" y2="28" />
      <polyline points="34,24 40,28 34,32" />
    </svg>
  )
}

function DuplaIconMx({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
      <circle cx="12" cy="10" r="5" />
      <line x1="12" y1="15" x2="12" y2="28" />
      <line x1="4" y1="20" x2="20" y2="20" />
      <line x1="12" y1="28" x2="6" y2="38" />
      <line x1="12" y1="28" x2="18" y2="38" />
      <circle cx="36" cy="10" r="5" />
      <path d="M32 7 Q36 3 40 7" />
      <line x1="36" y1="15" x2="36" y2="28" />
      <line x1="28" y1="20" x2="44" y2="20" />
      <polygon points="30,28 42,28 36,36" />
      <line x1="36" y1="36" x2="30" y2="38" />
      <line x1="36" y1="36" x2="42" y2="38" />
    </svg>
  )
}

function RelevoIconMx({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
      <rect x="6" y="14" width="10" height="6" />
      <rect x="20" y="14" width="10" height="6" />
      <polygon points="20,20 30,20 25,26" />
      <rect x="34" y="14" width="10" height="6" />
      <line x1="16" y1="17" x2="20" y2="17" />
      <line x1="30" y1="17" x2="34" y2="17" />
      <line x1="8" y1="28" x2="40" y2="28" />
      <polyline points="34,24 40,28 34,32" />
    </svg>
  )
}

// ── Decorative Vector Accents ────────────────────────────────────
function CornerBrackets({ size = 16, color = 'rgba(230,242,177,0.15)' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="miter">
      <line x1="1" y1="1" x2="1" y2="16" />
      <line x1="1" y1="1" x2="16" y2="1" />
    </svg>
  )
}

function ArrowRight({ size = 20, color = '#E6F2B1' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
      <line x1="2" y1="10" x2="18" y2="10" />
      <polyline points="12,4 18,10 12,16" />
    </svg>
  )
}

const CATEGORY_IMAGES: Record<string, string> = {
  Individual: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80',
  Dupla: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80',
  Relevo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80',
}

const OPEN_DATA = [
  { name: 'Ski Erg', distance: '1000 m', weight: '—' },
  { name: 'Sled Push', distance: '4 × 12,5 m (50 m)', weight: '152kg / 102kg' },
  { name: 'Sled Pull', distance: '4 × 12,5 m (50 m)', weight: '103kg / 78kg' },
  { name: 'Burpee Broad Jumps', distance: '80 m', weight: '—' },
  { name: 'Remo', distance: '1000 m', weight: '—' },
  { name: 'Farmers Carry', distance: '200 m', weight: '2 × 24kg / 2 × 16kg' },
  { name: 'Sandbag Lunges', distance: '100 m', weight: '20kg / 10kg' },
  { name: 'Wall Balls', distance: '100 repeticiones', weight: '6kg / 4kg' },
]

const PRO_DATA = [
  { name: 'Ski Erg', distance: '1000 m', weight: '—' },
  { name: 'Sled Push', distance: '4 × 12,5 m (50 m)', weight: '202kg / 152kg' },
  { name: 'Sled Pull', distance: '4 × 12,5 m (50 m)', weight: '153kg / 103kg' },
  { name: 'Burpee Broad Jumps', distance: '80 m', weight: '—' },
  { name: 'Remo', distance: '1000 m', weight: '—' },
  { name: 'Farmers Carry', distance: '200 m', weight: '2 × 32kg / 2 × 24kg' },
  { name: 'Sandbag Lunges', distance: '100 m', weight: '30kg / 20kg' },
  { name: 'Wall Balls', distance: '100 repeticiones', weight: '9kg / 6kg' },
]

// ── Navbar ───────────────────────────────────────────────────────
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { label: 'INICIO', href: '#hero' },
    { label: 'COMPITE', href: '#compite' },
    { label: 'FORMATOS', href: '#formatos' },
    { label: 'PREPARACIÓN', href: '#preparacion' },
    { label: 'UBICACIÓN', href: '#ubicacion' },
    { label: 'FAQ', href: '#faq' },
  ]

  const handleClick = (href: string) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        bgcolor: '#000000',
        borderBottom: '1px solid rgba(230,242,177,0.12)',
      }}
    >
      <Container maxWidth="lg" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 1.5, px: 2 }}>
        <Typography
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          sx={{
            fontFamily: 'tt-norms-pro-extra-black-italic, sans-serif',
            fontStyle: 'italic',
            color: '#E6F2B1',
            fontSize: '1.3rem',
            lineHeight: 1,
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          HYBRID EVENT
        </Typography>

        {/* Desktop links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 2.5 }}>
          {links.map((link) => (
            <Typography
              key={link.label}
              onClick={() => handleClick(link.href)}
              sx={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.6)',
                cursor: 'pointer',
                transition: 'color 150ms',
                '&:hover': { color: '#E6F2B1' },
              }}
            >
              {link.label}
            </Typography>
          ))}
          <Button
            onClick={() => window.open('https://shop.enforma.mx', '_blank')}
            sx={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: '#000000',
              bgcolor: '#E6F2B1',
              borderRadius: 0,
              py: 0.5,
              px: 1.5,
              minHeight: 0,
              minWidth: 0,
              lineHeight: 1.2,
              '&:hover': { bgcolor: '#F0F7CD' },
            }}
          >
            SHOP
          </Button>
        </Box>

        {/* Hamburger */}
        <IconButton
          onClick={() => setMenuOpen(!menuOpen)}
          sx={{ display: { xs: 'flex', md: 'none' }, color: '#E6F2B1', borderRadius: 0 }}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Container>

      {/* Mobile menu */}
      {menuOpen && (
        <Box sx={{ borderTop: '1px solid rgba(230,242,177,0.12)', bgcolor: '#111111' }}>
          {links.map((link) => (
            <Box
              key={link.label}
              onClick={() => handleClick(link.href)}
              sx={{
                px: 3,
                py: 1.5,
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.6)',
                cursor: 'pointer',
                borderBottom: '1px solid rgba(230,242,177,0.06)',
                transition: 'color 150ms',
                '&:hover': { color: '#E6F2B1', bgcolor: 'rgba(230,242,177,0.03)' },
              }}
            >
              {link.label}
            </Box>
          ))}
          <Box
            onClick={() => { setMenuOpen(false); window.open('https://shop.enforma.mx', '_blank'); }}
            sx={{
              px: 3,
              py: 1.5,
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: '#E6F2B1',
              cursor: 'pointer',
              '&:hover': { bgcolor: 'rgba(230,242,177,0.03)' },
            }}
          >
            SHOP
          </Box>
        </Box>
      )}
    </Box>
  )
}

// ── Sponsor Marquee ──────────────────────────────────────────────
const SPONSORS: { id: string; name: string; logoUrl: string | null; type: 'image' | 'text' }[] = [
  { id: 'enforma', name: 'ENFORMA', logoUrl: null, type: 'text' },
  { id: 'algorithmus', name: 'AlgorithmUs.io', logoUrl: null, type: 'text' },
  { id: 'hybrid-labs', name: 'HYBRID LABS', logoUrl: null, type: 'text' },
  { id: 'ironclad', name: 'IRONCLAD', logoUrl: null, type: 'text' },
  { id: 'nexus-fit', name: 'NEXUS FIT', logoUrl: null, type: 'text' },
  { id: 'primal-gear', name: 'PRIMAL GEAR', logoUrl: null, type: 'text' },
  { id: 'zero-gravity', name: 'ZERO GRAVITY', logoUrl: null, type: 'text' },
  { id: 'titan-sport', name: 'TITAN SPORT', logoUrl: null, type: 'text' },
]

function SponsorMarquee() {
  const items = [...SPONSORS, ...SPONSORS] // duplicated for seamless loop

  return (
    <Box
      sx={{
        overflow: 'hidden',
        whiteSpace: 'nowrap',
        bgcolor: '#000000',
        borderTop: '1px solid rgba(230,242,177,0.15)',
        borderBottom: '1px solid rgba(230,242,177,0.15)',
        py: { xs: 1.5, sm: 2 },
        width: '100%',
        position: 'relative',
        '&::before, &::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          bottom: 0,
          width: 40,
          zIndex: 2,
          pointerEvents: 'none',
        },
        '&::before': {
          left: 0,
          background: 'linear-gradient(90deg, #000000 0%, transparent 100%)',
        },
        '&::after': {
          right: 0,
          background: 'linear-gradient(270deg, #000000 0%, transparent 100%)',
        },
      }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          gap: { xs: 6, sm: 10 },
          alignItems: 'center',
          animation: 'marquee 30s linear infinite',
          '@keyframes marquee': {
            '0%': { transform: 'translateX(0)' },
            '100%': { transform: 'translateX(-50%)' },
          },
          '&:hover': {
            animationPlayState: 'paused',
          },
        }}
      >
        {items.map((s, i) => (
          <Box
            key={`${s.id}-${i}`}
            sx={{
              ...(s.type === 'text' && {
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 800,
                fontSize: { xs: '0.9rem', sm: '1.1rem' },
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: '#ffffff',
              }),
              filter: 'grayscale(100%) opacity(0.5)',
              transition: 'filter 200ms, color 200ms',
              cursor: 'default',
              userSelect: 'none',
              '&:hover': {
                filter: 'grayscale(0%) opacity(1)',
                color: '#E6F2B1',
                textShadow: '0 0 12px rgba(230,242,177,0.4)',
              },
            }}
          >
            {s.type === 'image' && s.logoUrl ? (
              <Box
                component="img"
                src={s.logoUrl}
                alt={s.name}
                sx={{
                  height: { xs: 28, sm: 36 },
                  width: 'auto',
                  objectFit: 'contain',
                  display: 'block',
                }}
              />
            ) : (
              s.name
            )}
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default function LandingPage() {
  const navigate = useNavigate()
  const targetDate = useMemo(() => new Date('2026-10-09T17:00:00'), [])
  const timeLeft = useCountdown(targetDate)
  const [desafioTab, setDesafioTab] = useState(0)
  const currentData = desafioTab === 0 ? OPEN_DATA : PRO_DATA

  return (
    <Box>
      <Navbar />
      {/* ===== HERO SECTION ===== */}
      <Box
        id="hero"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          px: 2,
          py: 4,
          background:
            'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,1) 100%), url(https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1600&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'repeating-linear-gradient(0deg, transparent, transparent 50px, rgba(255,255,255,0.01) 50px, rgba(255,255,255,0.01) 51px)',
            pointerEvents: 'none',
          },
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1 }}>
          <Typography
            variant="h1"
            component="span"
            sx={{
              fontSize: { xs: '3.5rem', sm: '5rem', md: '7rem' },
              fontWeight: 900,
              fontFamily: 'tt-norms-pro-extra-black-italic, sans-serif',
              fontStyle: 'italic',
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: '#E6F2B1',
            }}
          >
            HYBRID
          </Typography>
          <Typography
            variant="h1"
            component="span"
            sx={{
              fontSize: { xs: 'calc(3.5rem + 3px)', sm: 'calc(5rem + 3px)', md: 'calc(7rem + 3px)' },
              fontWeight: 900,
              fontFamily: 'tt-norms-pro-extra-black-italic, sans-serif',
              fontStyle: 'italic',
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: '#E6F2B1',
            }}
          >
            EVENT
          </Typography>
        </Box>

        <Typography
          variant="h5"
          sx={{
            color: 'text.secondary',
            fontWeight: 400,
            mb: 4,
            maxWidth: 500,
            fontSize: { xs: '1rem', sm: '1.2rem' },
          }}
        >
          El evento fitness más intenso de México
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            mb: 2,
            display: 'block',
            fontSize: '0.7rem',
          }}
        >
          BY ENFORMA sports society
        </Typography>

        {/* Countdown */}
        <Stack
          direction="row"
          spacing={0}
          sx={{
            mb: 4,
            p: 2,
            bgcolor: '#111111',
            border: '1px solid rgba(230,242,177,0.15)',
          }}
        >
          <CountdownUnit value={timeLeft.days} label="Dias" />
          <Typography
            sx={{ color: 'text.secondary', alignSelf: 'flex-start', mt: 0.5, fontSize: '1.5rem' }}
          >
            :
          </Typography>
          <CountdownUnit value={timeLeft.hours} label="Horas" />
          <Typography
            sx={{ color: 'text.secondary', alignSelf: 'flex-start', mt: 0.5, fontSize: '1.5rem' }}
          >
            :
          </Typography>
          <CountdownUnit value={timeLeft.minutes} label="Min" />
          <Typography
            sx={{ color: 'text.secondary', alignSelf: 'flex-start', mt: 0.5, fontSize: '1.5rem' }}
          >
            :
          </Typography>
          <CountdownUnit value={timeLeft.seconds} label="Seg" />
        </Stack>

        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={() => {
            const el = document.getElementById('compite')
            if (el) el.scrollIntoView({ behavior: 'smooth' })
          }}
          sx={{
            px: 5,
            py: 1.5,
            fontSize: { xs: '1rem', sm: '1.1rem' },
            mb: 3,
          }}
        >
          ¡Inscríbete ahora!
        </Button>

        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', letterSpacing: '0.15em', textTransform: 'uppercase' }}
        >
          9-11 OCTUBRE 2026 • MÉRIDA YUCATÁN
        </Typography>
      </Box>

      <SponsorMarquee />

      {/* ===== ABOUT SECTION ===== */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{ textAlign: 'center', mb: 2, fontFamily: "'Space Grotesk', sans-serif" }}
          >
            {`¿Qué es ${eventConfig.name}?`}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              maxWidth: 600,
              mx: 'auto',
              mb: 6,
              fontSize: { xs: '1rem', sm: '1.1rem' },
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Hybrid Event es una competencia de fitness funcional que combina segmentos
            de carrera con estaciones de ejercicio de alta intensidad. Ya sea que compitas solo, en
            dupla o en equipo de relevos, vivirás una experiencia única llena de
            adrenalina y comunidad.
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Card
                sx={{
                  textAlign: 'center',
                  py: 4,
                  px: 2,
                  bgcolor: '#111111',
                  border: '1px solid rgba(230, 242, 177, 0.15)',
                  borderRadius: 0,
                  height: '100%',
                  position: 'relative',
                  backgroundImage:
                    'url(https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600&q=80)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.85) 100%)',
                    zIndex: 1,
                    pointerEvents: 'none',
                  },
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 2 }}>
                  <StrengthIcon />
                  <Typography variant="h5" sx={{ mb: 1, fontFamily: "'Space Grotesk', sans-serif" }}>
                    8 Estaciones
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Ejercicios funcionales que pondrán a prueba tu fuerza, resistencia y
                    determinación.
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Card
                sx={{
                  textAlign: 'center',
                  py: 4,
                  px: 2,
                  bgcolor: '#111111',
                  border: '1px solid rgba(230, 242, 177, 0.15)',
                  borderRadius: 0,
                  height: '100%',
                  position: 'relative',
                  backgroundImage:
                    'url(https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600&q=80)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.85) 100%)',
                    zIndex: 1,
                    pointerEvents: 'none',
                  },
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 2 }}>
                  <CardioIcon />
                  <Typography variant="h5" sx={{ mb: 1, fontFamily: "'Space Grotesk', sans-serif" }}>
                    Corre + Entrena
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Alterna entre segmentos de carrera y estaciones de ejercicio en un circuito
                    continuo.
                  </Typography>
                </Box>
              </Card>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <Card
                sx={{
                  textAlign: 'center',
                  py: 4,
                  px: 2,
                  bgcolor: '#111111',
                  border: '1px solid rgba(230, 242, 177, 0.15)',
                  borderRadius: 0,
                  height: '100%',
                  position: 'relative',
                  backgroundImage:
                    'url(https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=600&q=80)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background:
                      'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.85) 100%)',
                    zIndex: 1,
                    pointerEvents: 'none',
                  },
                }}
              >
                <Box sx={{ position: 'relative', zIndex: 2 }}>
                  <TeamsIcon />
                  <Typography variant="h5" sx={{ mb: 1, fontFamily: "'Space Grotesk', sans-serif" }}>
                    Individual o en Equipo
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    Compite solo, en dupla o en equipo de relevos. Hay una categoría para
                    todos.
                  </Typography>
                </Box>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ===== EL DESAFÍO ===== */}
      <Box
        id="desafio"
        sx={{
          py: { xs: 8, md: 12 },
          background:
            'linear-gradient(180deg, #000000 0%, rgba(230,242,177,0.03) 50%, #000000 100%)',
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1 }}>
            <Box sx={{ color: 'rgba(230,242,177,0.2)', fontFamily: "'JetBrains Mono', monospace", fontSize: { xs: '1rem', sm: '1.5rem' }, fontWeight: 700, lineHeight: 1, transform: 'translateY(-2px)' }}>
              {'[ '}
            </Box>
            <Typography
              variant="h2"
              sx={{
                color: '#E6F2B1',
                fontWeight: 900,
                fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem' },
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              EL DESAFÍO
            </Typography>
            <Box sx={{ color: 'rgba(230,242,177,0.2)', fontFamily: "'JetBrains Mono', monospace", fontSize: { xs: '1rem', sm: '1.5rem' }, fontWeight: 700, lineHeight: 1, transform: 'translateY(-2px)' }}>
              {' ]'}
            </Box>
          </Box>
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              mb: 3,
              maxWidth: 650,
              mx: 'auto',
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: { xs: '0.95rem', sm: '1.05rem' },
              lineHeight: 1.7,
            }}
          >
            HYBRID es una competición de fitness que combina carrera con ejercicios
            funcionales. Empiezas corriendo 1km y entras a la primera prueba, y así
            hasta acabar con el último ejercicio. Esto convierte a HYBRID en un
            desafío físico muy completo que exige tanto preparación cardiovascular
            como fuerza funcional.
          </Typography>

          {/* Tabs */}
          <Box
            sx={{
              display: 'flex',
              borderBottom: '1px solid rgba(230,242,177,0.2)',
              mb: 4,
            }}
          >
            <Box
              onClick={() => setDesafioTab(0)}
              sx={{
                px: 4,
                py: 1.5,
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.85rem',
                fontWeight: 700,
                color: desafioTab === 0 ? '#E6F2B1' : 'rgba(255,255,255,0.35)',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                borderBottom: '2px solid',
                borderBottomColor: desafioTab === 0 ? '#E6F2B1' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                userSelect: 'none',
                '&:hover': {
                  color: '#E6F2B1',
                },
              }}
            >
              OPEN
            </Box>
            <Box
              onClick={() => setDesafioTab(1)}
              sx={{
                px: 4,
                py: 1.5,
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.85rem',
                fontWeight: 700,
                color: desafioTab === 1 ? '#E6F2B1' : 'rgba(255,255,255,0.35)',
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
                borderBottom: '2px solid',
                borderBottomColor: desafioTab === 1 ? '#E6F2B1' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                userSelect: 'none',
                '&:hover': {
                  color: '#E6F2B1',
                },
              }}
            >
              PRO
            </Box>
          </Box>

          {/* Data Table */}
          <Box
            sx={{
              border: '1px solid rgba(230,242,177,0.2)',
              overflow: 'hidden',
              maxWidth: 580,
              mx: 'auto',
            }}
          >
            {/* Table header */}
            <Box
              sx={{
                display: { xs: 'none', sm: 'grid' },
                gridTemplateColumns: '1fr 120px 110px',
                borderBottom: '1px solid rgba(230,242,177,0.2)',
                bgcolor: 'rgba(230,242,177,0.05)',
              }}
            >
              {['Prueba', 'Distancia / Reps', 'Peso H / M'].map((h) => (
                <Box
                  key={h}
                  sx={{
                    px: 2.5,
                    py: 1.5,
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#E6F2B1',
                    textTransform: 'uppercase',
                    letterSpacing: '0.15em',
                    borderRight:
                      h === 'Prueba' ? '1px solid rgba(230,242,177,0.1)' : 'none',
                  }}
                >
                  {h}
                </Box>
              ))}
            </Box>

            {/* Table rows */}
            {currentData.map((row, i) => (
              <Box
                key={i}
                sx={{
                  display: { xs: 'flex', sm: 'grid' },
                  flexDirection: { xs: 'column', sm: 'row' },
                  gridTemplateColumns: { sm: '1fr 120px 110px' },
                  borderBottom:
                    i < currentData.length - 1
                      ? '1px solid rgba(230,242,177,0.08)'
                      : 'none',
                  bgcolor:
                    i % 2 === 0
                      ? 'rgba(230,242,177,0.02)'
                      : 'transparent',
                  transition: 'bgcolor 0.15s ease',
                  '&:hover': {
                    bgcolor: 'rgba(230,242,177,0.06)',
                  },
                }}
              >
                {/* Name */}
                <Box
                  sx={{
                    px: { xs: 2, sm: 2.5 },
                    py: { xs: 1.5, sm: 1.5 },
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: { xs: '0.85rem', sm: '0.9rem' },
                    fontWeight: 700,
                    color: '#E6F2B1',
                    borderRight: { sm: '1px solid rgba(230,242,177,0.1)' },
                    minHeight: 48,
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      width: 6,
                      height: 6,
                      borderRadius: 0,
                      bgcolor: '#E6F2B1',
                      flexShrink: 0,
                    }}
                  />
                  {row.name}
                </Box>

                {/* Distance */}
                <Box
                  sx={{
                    display: { xs: 'flex', sm: 'flex' },
                    alignItems: 'center',
                    px: { xs: 2, sm: 2.5 },
                    py: { xs: 0.5, sm: 1.5 },
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: { xs: '0.75rem', sm: '0.85rem' },
                    color: 'text.secondary',
                    fontWeight: 600,
                    borderRight: { sm: '1px solid rgba(230,242,177,0.1)' },
                    minHeight: 44,
                    '&::before': {
                      content: { xs: '"Distancia: "', sm: '""' },
                      fontWeight: 400,
                      color: 'rgba(255,255,255,0.35)',
                      mr: 0.5,
                      fontSize: { xs: '0.7rem', sm: '0.85rem' },
                    },
                  }}
                >
                  <Box
                    component="span"
                    sx={{
                      fontFamily: "'JetBrains Mono', 'Space Grotesk', monospace",
                      letterSpacing: '0.02em',
                    }}
                  >
                    {row.distance}
                  </Box>
                </Box>

                {/* Weight */}
                <Box
                  sx={{
                    display: { xs: 'flex', sm: 'flex' },
                    alignItems: 'center',
                    px: { xs: 2, sm: 2.5 },
                    py: { xs: 0.5, sm: 1.5 },
                    fontFamily: "'JetBrains Mono', 'Space Grotesk', monospace",
                    fontSize: { xs: '0.75rem', sm: '0.85rem' },
                    color: '#E9C7DF',
                    fontWeight: 700,
                    minHeight: 44,
                    pb: { xs: 1.5, sm: 1.5 },
                    '&::before': {
                      content: { xs: '"Peso: "', sm: '""' },
                      fontWeight: 400,
                      color: 'rgba(255,255,255,0.35)',
                      mr: 0.5,
                      fontSize: { xs: '0.7rem', sm: '0.85rem' },
                    },
                  }}
                >
                  {row.weight}
                </Box>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ===== STRATEGY NOTE ===== */}
      <Box
        sx={{
          py: { xs: 6, md: 8 },
          background:
            'linear-gradient(180deg, #000000 0%, rgba(230,242,177,0.03) 50%, #000000 100%)',
        }}
      >
        <Container maxWidth="sm">
          <Box
            sx={{
              p: 3,
              border: '1px solid rgba(230,242,177,0.12)',
              textAlign: 'center',
              position: 'relative',
            }}
          >
            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
              <CornerBrackets size={14} color="rgba(230,242,177,0.2)" />
            </Box>
            <Typography
              variant="body1"
              sx={{
                color: 'text.secondary',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: { xs: '0.9rem', sm: '1rem' },
                lineHeight: 1.8,
              }}
            >
              Hybrid Event exige estrategia. Cada atleta debe calcular cómo
              distribuir su esfuerzo entre fuerza, resistencia cardiovascular y
              capacidad funcional para maximizar su desempeño total.
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* ===== FORMATOS (CATEGORÍAS Y REGLAS) ===== */}
      <Box
        id="formatos"
        sx={{
          py: { xs: 8, md: 12 },
          background:
            'linear-gradient(180deg, rgba(230,242,177,0.04) 0%, #000000 100%)',
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1 }}>
            <Box sx={{ color: 'rgba(230,242,177,0.2)', fontFamily: "'JetBrains Mono', monospace", fontSize: { xs: '1rem', sm: '1.5rem' }, fontWeight: 700, lineHeight: 1, transform: 'translateY(-2px)' }}>
              {'[ '}
            </Box>
            <Typography
              variant="h2"
              sx={{
                color: '#E6F2B1',
                fontWeight: 900,
                fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem' },
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              FORMATOS
            </Typography>
            <Box sx={{ color: 'rgba(230,242,177,0.2)', fontFamily: "'JetBrains Mono', monospace", fontSize: { xs: '1rem', sm: '1.5rem' }, fontWeight: 700, lineHeight: 1, transform: 'translateY(-2px)' }}>
              {' ]'}
            </Box>
          </Box>
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              mb: 6,
              maxWidth: 550,
              mx: 'auto',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Categorías y reglas de la competencia.
          </Typography>

          <Grid container spacing={3}>
            {/* Open */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box
                sx={{
                  p: 3,
                  border: '1px solid rgba(230,242,177,0.15)',
                  height: '100%',
                  position: 'relative',
                }}
              >
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                  <CornerBrackets size={14} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <ArrowRight size={18} />
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 900,
                      color: '#E6F2B1',
                      letterSpacing: '0.03em',
                    }}
                  >
                    OPEN
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontFamily: "'Space Grotesk', sans-serif",
                    lineHeight: 1.8,
                    fontSize: '0.9rem',
                  }}
                >
                  Categoría individual de acceso libre. Diseñada para atletas que buscan
                  su primer reto competitivo en fitness funcional. Pesos moderados,
                  mismo formato de 8 estaciones. Ideal para quienes quieren probar la
                  experiencia HYBRID.
                </Typography>
              </Box>
            </Grid>

            {/* Pro */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box
                sx={{
                  p: 3,
                  border: '1px solid rgba(230,242,177,0.15)',
                  height: '100%',
                  position: 'relative',
                }}
              >
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                  <CornerBrackets size={14} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <ArrowRight size={18} />
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 900,
                      color: '#E6F2B1',
                      letterSpacing: '0.03em',
                    }}
                  >
                    PRO
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontFamily: "'Space Grotesk', sans-serif",
                    lineHeight: 1.8,
                    fontSize: '0.9rem',
                  }}
                >
                  Categoría individual de alto rendimiento. Pesos incrementados y
                  mayor exigencia física. Recomendada para atletas con experiencia
                  comprobable en competencias de fitness funcional.
                </Typography>
              </Box>
            </Grid>

            {/* Doubles */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box
                sx={{
                  p: 3,
                  border: '1px solid rgba(230,242,177,0.15)',
                  height: '100%',
                  position: 'relative',
                }}
              >
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                  <CornerBrackets size={14} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <ArrowRight size={18} />
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 900,
                      color: '#E6F2B1',
                      letterSpacing: '0.03em',
                    }}
                  >
                    DOUBLES
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontFamily: "'Space Grotesk', sans-serif",
                    lineHeight: 1.8,
                    fontSize: '0.9rem',
                  }}
                >
                  Modalidad en pareja. Ambos atletas completan el circuito de forma
                  colaborativa, dividiendo las estaciones y sumando esfuerzos. Existe
                  la modalidad mixta (femenino + masculino).
                </Typography>
              </Box>
            </Grid>

            {/* Relay */}
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box
                sx={{
                  p: 3,
                  border: '1px solid rgba(230,242,177,0.15)',
                  height: '100%',
                  position: 'relative',
                }}
              >
                <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
                  <CornerBrackets size={14} />
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                  <ArrowRight size={18} />
                  <Typography
                    variant="h5"
                    sx={{
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontWeight: 900,
                      color: '#E6F2B1',
                      letterSpacing: '0.03em',
                    }}
                  >
                    RELAY
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{
                    color: 'text.secondary',
                    fontFamily: "'Space Grotesk', sans-serif",
                    lineHeight: 1.8,
                    fontSize: '0.9rem',
                  }}
                >
                  Equipos de 4 atletas en formato de relevos. Cada miembro completa
                  una parte del circuito, pasando el testigo al siguiente. Estrategia,
                  velocidad y trabajo en equipo son clave.
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Warning / Rule block */}
          <Box
            sx={{
              mt: 4,
              p: 3,
              borderLeft: '4px solid #E9C7DF',
              bgcolor: 'rgba(233,199,223,0.04)',
              border: '1px solid rgba(233,199,223,0.15)',
              borderLeftWidth: '4px',
              position: 'relative',
            }}
          >
            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
              <CornerBrackets size={14} color="rgba(233,199,223,0.2)" />
            </Box>
            <Typography
              variant="body2"
              sx={{
                color: '#E9C7DF',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.85rem',
                fontWeight: 600,
                mb: 1,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
              }}
            >
              Regla de pesos cruzados
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.85rem',
                lineHeight: 1.8,
              }}
            >
              En parejas mixtas, se utiliza el peso de la categoría Open masculino
              para ambos atletas, independientemente del sexo. En la categoría relays
              (equipos de 4), los pesos utilizados son los correspondientes a la
              categoría Open (o su sexo respectivo en equipos mixtos).
            </Typography>
          </Box>
        </Container>
      </Box>

      {/* ===== COMPITE SECTION ===== */}
      <Box
        id="compite"
        sx={{
          py: { xs: 8, md: 12 },
          background:
            'linear-gradient(180deg, rgba(230,242,177,0.04) 0%, #000000 100%)',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              mb: 1,
              color: '#E6F2B1',
              fontWeight: 900,
              fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            COMPITE
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              mb: 6,
              maxWidth: 500,
              mx: 'auto',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Elige la categoría que mejor se adapte a ti y a tu equipo.
          </Typography>

          <Grid container spacing={2}>
            {CATEGORIES.map((cat) => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={cat.id}>
                <Card
                  sx={{
                    position: 'relative',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 0,
                    border: '1px solid rgba(230, 242, 177, 0.15)',
                    backgroundImage: `url(${CATEGORY_IMAGES[cat.type] || CATEGORY_IMAGES.Individual})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transition: 'transform 0.2s ease, border-color 0.2s ease',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      inset: 0,
                      background:
                        'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.92) 100%)',
                      zIndex: 1,
                      pointerEvents: 'none',
                    },
                    '&:hover': {
                      transform: 'translateY(-3px)',
                      borderColor: 'rgba(230, 242, 177, 0.5)',
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      position: 'relative',
                      zIndex: 2,
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      p: { xs: 2, sm: 3 },
                      '&:last-child': { pb: { xs: 2, sm: 3 } },
                    }}
                  >
                    <Box sx={{ mb: 0.5, color: '#E6F2B1' }}>
                      {cat.genderRule === 'female-only'
                        ? cat.type === 'Individual' ? <IndividualIconF size={40} /> :
                          cat.type === 'Dupla' ? <DuplaIconF size={40} /> :
                          <RelevoIconF size={40} />
                        : cat.genderRule === 'mixed'
                        ? cat.type === 'Dupla' ? <DuplaIconMx size={40} /> :
                          <RelevoIconMx size={40} />
                        : cat.type === 'Individual' ? <IndividualIcon size={40} /> :
                          cat.type === 'Dupla' ? <DuplaIcon size={40} /> :
                          <RelevoIcon size={40} />}
                    </Box>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 900,
                        mb: 0.25,
                        fontSize: { xs: '0.85rem', sm: '1rem' },
                        fontFamily: "'Space Grotesk', sans-serif",
                        color: '#E6F2B1',
                        letterSpacing: '0.02em',
                      }}
                    >
                      {cat.name}
                    </Typography>
                    <Chip
                      label={cat.type}
                      color={getCategoryChipColor(cat.type)}
                      size="small"
                      sx={{ mb: 0.5, fontSize: '0.65rem', height: 20, borderRadius: 0, fontWeight: 700 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'rgba(255,255,255,0.6)',
                        mb: 1,
                        fontSize: { xs: '0.7rem', sm: '0.8rem' },
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      {cat.participants}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{
                        fontWeight: 900,
                        fontSize: { xs: '1.1rem', sm: '1.3rem' },
                        fontFamily: "'Space Grotesk', sans-serif",
                        color: '#E6F2B1',
                        mb: 1.5,
                        letterSpacing: '0.02em',
                      }}
                    >
                      {formatPrice(cat.price)}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="primary"
                      size="small"
                      onClick={() => navigate({ to: '/registro' })}
                      sx={{
                        mt: 'auto',
                        fontSize: { xs: '0.65rem', sm: '0.75rem' },
                        px: { xs: 1.5, sm: 2 },
                        py: 0.5,
                        borderRadius: 0,
                        fontWeight: 700,
                        borderWidth: 2,
                        '&:hover': { borderWidth: 2 },
                      }}
                    >
                      Inscribirse
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ===== ASISTE SECTION ===== */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: '#111111' }}>
        <Container maxWidth="sm">
          <Box
            sx={{
              textAlign: 'center',
              border: '2px solid rgba(233, 199, 223, 0.25)',
              p: { xs: 4, md: 6 },
              position: 'relative',
              background:
                'linear-gradient(180deg, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.9) 100%), url(https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
              backgroundBlendMode: 'normal',
            }}
          >
            <Box>
            <ConfirmationNumberIcon
              sx={{ fontSize: 56, color: '#E9C7DF', mb: 2 }}
            />
            <Typography
              variant="h2"
              sx={{
                textAlign: 'center',
                mb: 1,
                color: '#E9C7DF',
                fontWeight: 900,
                fontSize: { xs: '3rem', sm: '4rem', md: '5rem' },
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              ASISTE
            </Typography>
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                mb: 4,
                maxWidth: 400,
                mx: 'auto',
                fontSize: { xs: '1rem', sm: '1.1rem' },
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Vive la experiencia Hybrid Event 2026 desde dentro.
            </Typography>
            <Button
              variant="contained"
              color="secondary"
              size="large"
              onClick={() => navigate({ to: '/tickets' })}
              sx={{
                px: 5,
                py: 1.5,
                fontSize: { xs: '1rem', sm: '1.1rem' },
                borderRadius: 0,
                fontWeight: 700,
              }}
            >
              COMPRAR ACCESO
            </Button>
          </Box>
        </Box>
        </Container>
      </Box>

      {/* ===== VENUE SECTION ===== */}
      <Box
        id="ubicacion"
        sx={{
          py: { xs: 8, md: 12 },
          background:
            'linear-gradient(180deg, #000000 0%, rgba(230,242,177,0.03) 50%, #000000 100%)',
        }}
      >
        <Container maxWidth="md">
          {/* Challenge header */}
          <Typography
            variant="h3"
            sx={{
              textAlign: 'center',
              fontWeight: 900,
              fontSize: { xs: '1.8rem', sm: '2.5rem', md: '3rem' },
              color: '#FFFFFF',
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              mb: 4,
            }}
          >
            ¿LISTO PARA EL RETO?
          </Typography>

          <Box
            sx={{
              position: 'relative',
              minHeight: { xs: 320, sm: 400 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-end',
              p: { xs: 3, sm: 5 },
              border: '1px solid rgba(230,242,177,0.2)',
              backgroundImage:
                'url(https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1000&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.9) 100%)',
                zIndex: 1,
                pointerEvents: 'none',
              },
            }}
          >
            <Box sx={{ position: 'relative', zIndex: 2, textAlign: 'left' }}>
              {/* HYBRID EVENT — big lime institutional */}
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 900,
                  fontFamily: 'tt-norms-pro-extra-black-italic, sans-serif',
                  fontStyle: 'italic',
                  fontSize: { xs: '3rem', sm: '5rem', md: '6.5rem' },
                  lineHeight: 1,
                  color: '#E6F2B1',
                  letterSpacing: '-0.03em',
                  mb: 0.5,
                  textTransform: 'uppercase',
                }}
              >
                HYBRID EVENT
              </Typography>

              {/* Date — pink institutional */}
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: '2.5rem', sm: '4rem', md: '5rem' },
                  lineHeight: 1,
                  color: '#E9C7DF',
                  fontFamily: "'Space Grotesk', sans-serif",
                  letterSpacing: '-0.03em',
                  mb: 2,
                }}
              >
                9-11 OCT
              </Typography>

              {/* Venue name */}
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: '2rem', sm: '3.5rem', md: '4.5rem' },
                  lineHeight: 1,
                  color: '#FFFFFF',
                  fontFamily: "'Space Grotesk', sans-serif",
                  letterSpacing: '-0.02em',
                  mb: 0.25,
                }}
              >
                CLUB CUMBRES
              </Typography>

              {/* City */}
              <Typography
                variant="h1"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: '2rem', sm: '3.5rem', md: '4.5rem' },
                  lineHeight: 1,
                  color: 'rgba(255,255,255,0.7)',
                  fontFamily: "'Space Grotesk', sans-serif",
                  letterSpacing: '-0.02em',
                  mb: 3,
                }}
              >
                MÉRIDA, YUCATÁN
              </Typography>

              {/* Button */}
              <Button
                variant="outlined"
                color="primary"
                href="https://maps.app.goo.gl/HBjqkCu1o8FMVw3P6"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  borderRadius: 0,
                  fontWeight: 700,
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  px: 4,
                  py: 1.5,
                  borderWidth: 2,
                  '&:hover': { borderWidth: 2 },
                }}
              >
                VER UBICACIÓN
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* ===== PREPARACIÓN (ACORDEONES) ===== */}
      <Box
        id="preparacion"
        sx={{
          py: { xs: 8, md: 12 },
          background:
            'linear-gradient(180deg, #000000 0%, rgba(230,242,177,0.03) 50%, #000000 100%)',
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1 }}>
            <Box sx={{ color: 'rgba(230,242,177,0.2)', fontFamily: "'JetBrains Mono', monospace", fontSize: { xs: '1rem', sm: '1.5rem' }, fontWeight: 700, lineHeight: 1, transform: 'translateY(-2px)' }}>
              {'[ '}
            </Box>
            <Typography
              variant="h2"
              sx={{
                color: '#E6F2B1',
                fontWeight: 900,
                fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem' },
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              PREPARACIÓN
            </Typography>
            <Box sx={{ color: 'rgba(230,242,177,0.2)', fontFamily: "'JetBrains Mono', monospace", fontSize: { xs: '1rem', sm: '1.5rem' }, fontWeight: 700, lineHeight: 1, transform: 'translateY(-2px)' }}>
              {' ]'}
            </Box>
          </Box>
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              mb: 6,
              maxWidth: 550,
              mx: 'auto',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Consejos, beneficios y claves para llegar en tu mejor forma.
          </Typography>

          <Box>
            {/* Accordion 1: Beneficios */}
            <Accordion
              disableGutters
              elevation={0}
              sx={{
                borderTop: '1px solid rgba(230,242,177,0.15)',
                borderBottom: '1px solid rgba(230,242,177,0.15)',
                borderRadius: 0,
                '&:before': { display: 'none' },
                bgcolor: 'transparent',
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#E6F2B1' }} />}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ color: 'rgba(230,242,177,0.3)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', fontWeight: 700, lineHeight: 1 }}>
                    {'[>]'}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      fontFamily: "'Space Grotesk', sans-serif",
                      color: '#E6F2B1',
                      fontSize: '1rem',
                      letterSpacing: '0.02em',
                    }}
                  >
                    Beneficios del Entrenamiento
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0, pb: 3 }}>
                <Box
                  component="ul"
                  sx={{
                    m: 0,
                    pl: 0,
                    listStyle: 'none',
                    '& li': {
                      fontFamily: "'Space Grotesk', sans-serif",
                      color: 'text.secondary',
                      fontSize: '0.9rem',
                      lineHeight: 1.8,
                      mb: 1,
                      '&::before': {
                        content: '"[>]"',
                        color: '#E6F2B1',
                        fontFamily: "'JetBrains Mono', 'Space Grotesk', monospace",
                        fontWeight: 700,
                        mr: 1.5,
                        fontSize: '0.8rem',
                      },
                    },
                  }}
                >
                  <li>Mejora cardiovascular: incrementa tu capacidad aeróbica y anaeróbica.</li>
                  <li>Aumento de fuerza: desarrolla potencia funcional en todo el cuerpo.</li>
                  <li>Capacidad de recuperación: entrena a tu cuerpo para rendir bajo fatiga.</li>
                  <li>Pérdida de grasa: el alto gasto calórico acelera la composición corporal.</li>
                  <li>Trabajo mental: fortalece la disciplina, la concentración y la resiliencia.</li>
                  <li>Motivación: la competencia sana impulsa a superar tus propios límites.</li>
                </Box>
              </AccordionDetails>
            </Accordion>

            {/* Accordion 2: Entrenamiento HYBRID */}
            <Accordion
              disableGutters
              elevation={0}
              sx={{
                borderBottom: '1px solid rgba(230,242,177,0.15)',
                borderRadius: 0,
                '&:before': { display: 'none' },
                bgcolor: 'transparent',
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#E6F2B1' }} />}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ color: 'rgba(230,242,177,0.3)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', fontWeight: 700, lineHeight: 1 }}>
                    {'[>]'}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      fontFamily: "'Space Grotesk', sans-serif",
                      color: '#E6F2B1',
                      fontSize: '1rem',
                      letterSpacing: '0.02em',
                    }}
                  >
                    Entrenamiento HYBRID
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0, pb: 3 }}>
                <Box
                  component="ul"
                  sx={{
                    m: 0,
                    pl: 0,
                    listStyle: 'none',
                    '& li': {
                      fontFamily: "'Space Grotesk', sans-serif",
                      color: 'text.secondary',
                      fontSize: '0.9rem',
                      lineHeight: 1.8,
                      mb: 1,
                      '&::before': {
                        content: '"[>]"',
                        color: '#E6F2B1',
                        fontFamily: "'JetBrains Mono', 'Space Grotesk', monospace",
                        fontWeight: 700,
                        mr: 1.5,
                        fontSize: '0.8rem',
                      },
                    },
                  }}
                >
                  <li>
                    <strong style={{ color: '#E6F2B1' }}>Carrera funcional:</strong> integra
                    sprints cortos con cambios de ritmo para simular el formato de la
                    competencia.
                  </li>
                  <li>
                    <strong style={{ color: '#E6F2B1' }}>Ejercicios funcionales:</strong> prioriza
                    movimientos compuestos como peso muerto, sentadilla, press y
                    ergometría.
                  </li>
                  <li>
                    <strong style={{ color: '#E6F2B1' }}>Entrenamientos por rondas:</strong> estructura
                    tus sesiones en circuitos por tiempo para acostumbrarte al
                    formato híbrido.
                  </li>
                  <li>
                    <strong style={{ color: '#E6F2B1' }}>Preparación mental:</strong> practica
                    visualización, control de la respiración y estrategias de
                    afrontamiento ante la fatiga.
                  </li>
                </Box>
              </AccordionDetails>
            </Accordion>

            {/* Accordion 3: Consejos de Competición */}
            <Accordion
              disableGutters
              elevation={0}
              sx={{
                borderBottom: '1px solid rgba(230,242,177,0.15)',
                borderRadius: 0,
                '&:before': { display: 'none' },
                bgcolor: 'transparent',
              }}
            >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: '#E6F2B1' }} />}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Box sx={{ color: 'rgba(230,242,177,0.3)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.8rem', fontWeight: 700, lineHeight: 1 }}>
                    {'[>]'}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      fontFamily: "'Space Grotesk', sans-serif",
                      color: '#E6F2B1',
                      fontSize: '1rem',
                      letterSpacing: '0.02em',
                    }}
                  >
                    Consejos de Competición
                  </Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails sx={{ pt: 0, pb: 3 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: '#E6F2B1',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    mb: 1,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  Antes del evento
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    m: 0,
                    mb: 2.5,
                    pl: 0,
                    listStyle: 'none',
                    '& li': {
                      fontFamily: "'Space Grotesk', sans-serif",
                      color: 'text.secondary',
                      fontSize: '0.9rem',
                      lineHeight: 1.8,
                      mb: 0.5,
                      '&::before': {
                        content: '"[>]"',
                        color: '#E6F2B1',
                        fontFamily: "'JetBrains Mono', 'Space Grotesk', monospace",
                        fontWeight: 700,
                        mr: 1.5,
                        fontSize: '0.8rem',
                      },
                    },
                  }}
                >
                  <li>Descansa adecuadamente los 3 días previos a la competencia.</li>
                  <li>Hidrátate bien y mantén una alimentación rica en carbohidratos complejos.</li>
                  <li>Prepara tu equipo: tenis, ropa transpirable, toalla y botella de agua.</li>
                  <li>Llega con al menos 45 minutos de anticipación para registro y calentamiento.</li>
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: '#E6F2B1',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    mb: 1,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  Durante la competición
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    m: 0,
                    mb: 2.5,
                    pl: 0,
                    listStyle: 'none',
                    '& li': {
                      fontFamily: "'Space Grotesk', sans-serif",
                      color: 'text.secondary',
                      fontSize: '0.9rem',
                      lineHeight: 1.8,
                      mb: 0.5,
                      '&::before': {
                        content: '"[>]"',
                        color: '#E6F2B1',
                        fontFamily: "'JetBrains Mono', 'Space Grotesk', monospace",
                        fontWeight: 700,
                        mr: 1.5,
                        fontSize: '0.8rem',
                      },
                    },
                  }}
                >
                  <li>Mantén un ritmo constante — no salgas demasiado rápido.</li>
                  <li>Escucha a tu cuerpo y dosifica tu energía en cada estación.</li>
                  <li>Hidrátate en los descansos entre estaciones.</li>
                  <li>Anima a los demás competidores — el ambiente es parte de la experiencia.</li>
                </Box>

                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    color: '#E6F2B1',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    mb: 1,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  Después de la competición
                </Typography>
                <Box
                  component="ul"
                  sx={{
                    m: 0,
                    pl: 0,
                    listStyle: 'none',
                    '& li': {
                      fontFamily: "'Space Grotesk', sans-serif",
                      color: 'text.secondary',
                      fontSize: '0.9rem',
                      lineHeight: 1.8,
                      mb: 0.5,
                      '&::before': {
                        content: '"[>]"',
                        color: '#E6F2B1',
                        fontFamily: "'JetBrains Mono', 'Space Grotesk', monospace",
                        fontWeight: 700,
                        mr: 1.5,
                        fontSize: '0.8rem',
                      },
                    },
                  }}
                >
                  <li>Realiza una vuelta a la calma con estiramientos suaves.</li>
                  <li>Rehidrátate y consume proteínas para favorecer la recuperación muscular.</li>
                  <li>Revisa tus resultados y celebra tu esfuerzo — ¡lo lograste!</li>
                  <li>Comparte tu experiencia en redes sociales y etiqueta a @hybridevent.</li>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Container>
      </Box>

      {/* ===== FAQ SECTION ===== */}
      <Box id="faq" sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{
              textAlign: 'center',
              mb: 2,
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Preguntas frecuentes
          </Typography>
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              mb: 6,
              maxWidth: 500,
              mx: 'auto',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Todo lo que necesitas saber antes de inscribirte.
          </Typography>

          <Box>
            {FAQ_DATA.map((faq, index) => (
              <Accordion key={index} disableGutters elevation={0}>
                <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: 'primary.main' }} />}>
                  <Typography
                    variant="body1"
                    sx={{ fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {faq.question}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {faq.answer}
                  </Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        </Container>
      </Box>

      {/* ===== DOCUMENTACIÓN SECTION ===== */}
      <Box sx={{ py: { xs: 6, md: 8 }, bgcolor: 'primary.light' }}>
        <Container maxWidth="sm">
          <Card
            sx={{
              textAlign: 'center',
              bgcolor: '#111111',
              border: '1px solid rgba(230, 242, 177, 0.15)',
              borderRadius: 0,
              p: 4,
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, mb: 1, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              📚 ¿Necesitas más información?
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: 'text.secondary', mb: 3, fontFamily: "'Space Grotesk', sans-serif" }}
            >
              Accede a nuestras guías detalladas con instrucciones paso-a-paso, FAQ y todo lo que necesitas para participar en Hybrid Event 2026.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              href="/docs/"
              sx={{
                fontWeight: 700,
                textTransform: 'none',
                fontSize: '1rem',
                borderRadius: 0,
              }}
            >
              Ver Documentación Completa
            </Button>
          </Card>
        </Container>
      </Box>

      {/* ===== FOOTER ===== */}
      <Box
        component="footer"
        sx={{
          py: 4,
          px: 2,
          textAlign: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
          bgcolor: 'background.paper',
        }}
      >
        <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', alignItems: 'baseline', mb: 2 }}>
          <Typography
            variant="h6"
            component="span"
            sx={{
              fontWeight: 900,
              fontFamily: 'tt-norms-pro-extra-black-italic, sans-serif',
              fontStyle: 'italic',
              color: '#E6F2B1',
            }}
          >
            HYBRID
          </Typography>
          <Typography
            variant="h6"
            component="span"
            sx={{
              fontWeight: 900,
              fontFamily: 'tt-norms-pro-extra-black-italic, sans-serif',
              fontStyle: 'italic',
              fontSize: 'calc(1rem + 3px)',
              color: '#E6F2B1',
              ml: 0.5,
            }}
          >
            EVENT
          </Typography>
          <Typography
            variant="h6"
            component="span"
            sx={{
              fontWeight: 900,
              fontFamily: 'tt-norms-pro-extra-black-italic, sans-serif',
              fontStyle: 'italic',
              color: '#E6F2B1',
              ml: 0.5,
            }}
          >
            2026
          </Typography>
        </Box>
        <Typography
          variant="caption"
          sx={{
            color: 'text.secondary',
            fontWeight: 600,
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            mb: 2,
            display: 'block',
            fontSize: '0.65rem',
          }}
        >
          BY ENFORMA sports society
        </Typography>

        <Stack direction="row" spacing={1} sx={{ mb: 2, justifyContent: 'center' }}>
          <IconButton
            color="primary"
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
          >
            <InstagramIcon />
          </IconButton>
          <IconButton
            color="primary"
            href="https://wa.me/5215512345678"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
          >
            <WhatsAppIcon />
          </IconButton>
          <IconButton
            color="primary"
            href="mailto:info@enforma.mx"
            aria-label="Email"
          >
            <EmailIcon />
          </IconButton>
        </Stack>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          © 2026 EnForma Sports Society. Todos los derechos reservados.
        </Typography>
      </Box>

      {/* Floating CTA - COMPITE */}
      <Box
        onClick={() => {
          const el = document.getElementById('compite')
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          zIndex: 1200,
          bgcolor: '#E6F2B1',
          color: '#000000',
          fontFamily: 'tt-norms-pro-extra-black-italic, sans-serif',
          fontSize: '0.9rem',
          letterSpacing: '-0.01em',
          px: 2.5,
          py: 1.5,
          cursor: 'pointer',
          border: '2px solid #E6F2B1',
          boxShadow: '0 0 24px rgba(230,242,177,0.3)',
          transition: 'box-shadow 200ms, transform 200ms',
          animation: 'pulseGlow 2s ease-in-out infinite',
          '@keyframes pulseGlow': {
            '0%, 100%': { boxShadow: '0 0 24px rgba(230,242,177,0.3)', transform: 'scale(1)' },
            '50%': { boxShadow: '0 0 40px rgba(230,242,177,0.6)', transform: 'scale(1.05)' },
          },
          '&:hover': {
            boxShadow: '0 0 48px rgba(230,242,177,0.8)',
            transform: 'scale(1.05)',
          },
          display: { xs: 'flex', sm: 'flex' },
          alignItems: 'center',
          gap: 1,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}
      >
        <Box sx={{ fontSize: '1.2rem', lineHeight: 1 }}>🏆</Box>
        ¡Quiero Competir!
      </Box>
    </Box>
  )
}