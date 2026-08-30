import { useEffect, useMemo, useState, useSyncExternalStore, type ReactNode, type FormEvent } from 'react'
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
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
} from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import MenuIcon from '@mui/icons-material/Menu'
import CloseIcon from '@mui/icons-material/Close'
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import BoltIcon from '@mui/icons-material/Bolt'
import InstagramIcon from '@mui/icons-material/Instagram'
import Inventory2Icon from '@mui/icons-material/Inventory2'
import TimerIcon from '@mui/icons-material/Timer'
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety'
import MedicalServicesIcon from '@mui/icons-material/MedicalServices'
import SpaIcon from '@mui/icons-material/Spa'
import StadiumIcon from '@mui/icons-material/Stadium'
import { useCountdown } from '../hooks/useCountdown'
import {
  CATALOGO,
  porBloque,
  getInscribirUrl,
  formatPrecio,
  getPrecioVigente,
} from '../data/catalogo'
import type { Producto } from '../data/catalogo'
import { eventConfig } from '../config/eventConfig'
import { SALES_CONFIG } from '../config/salesConfig'
import { SIMULACRO_PRO_ACTIVE } from '../config/simulacroProConfig'
import { resolveEtapaComercial } from '../lib/pricingStage'
import type { EtapaComercial } from '../lib/pricingStage'
import {
  getSandboxCheckoutProductConfig,
  isCheckoutActive,
  isSandboxCheckoutActive,
  isSandboxCheckoutProduct,
} from '../config/checkoutConfig'
import { createCheckout, messageForCheckoutError, CheckoutApiError } from '../api/checkout'
import {
  getCheckoutAttempt,
  getOrCreateCheckoutAttempt,
  savePublicOrderReference,
} from '../lib/checkoutSession'
import {
  getActiveCheckoutProductCode,
  getSandboxCheckoutPageLock,
  setActiveCheckoutProductCode,
  subscribeActiveCheckoutProductCode,
} from '../lib/submitLock'

const EVENT_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Event',
  name: eventConfig.name,
  description:
    'Vive HYBRID EXPERIENCE del 13 al 15 de noviembre de 2026 en Mérida. Compite en Individual, Dobles o Relay, empieza con ½ Hybrid y Workout Experience, o compra tu acceso como público.',
  url: 'https://hybrid-experience.enforma.mx/',
  startDate: '2026-11-13T17:00:00-06:00',
  endDate: '2026-11-15',
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  location: {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Mérida',
      addressRegion: 'Yucatán',
      addressCountry: 'MX',
    },
  },
  organizer: {
    '@type': 'Organization',
    name: 'ENFORMA Sports Society',
  },
} as const

const DIA_COMPITO_ROWS = [
  { formato: 'Dobles', cuando: 'Viernes Vespertino (Mujeres) · Sábado Día completo (Hombres y Mixto)' },
  { formato: 'Individual (Open)', cuando: 'Viernes Vespertino' },
  { formato: '½ Hybrid', cuando: 'Sábado Día completo' },
  { formato: 'Workout Experience', cuando: 'Sábado Día completo' },
  { formato: 'Relay', cuando: 'Domingo Matutino' },
]

function DiaCompitoTable() {
  return (
    <Box component="dl" sx={{ m: 0 }}>
      {DIA_COMPITO_ROWS.map((row) => (
        <Box
          key={row.formato}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 2,
            py: 0.75,
            borderBottom: '1px solid rgba(230,242,177,0.08)',
          }}
        >
          <Box component="dt" sx={{ color: '#E6F2B1', fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
            {row.formato}
          </Box>
          <Box component="dd" sx={{ m: 0, color: 'text.secondary', fontFamily: "'Space Grotesk', sans-serif", textAlign: 'right' }}>
            {row.cuando}
          </Box>
        </Box>
      ))}
    </Box>
  )
}

interface FaqItem {
  question: string
  answer: ReactNode
}

const FAQ_DATA: FaqItem[] = [
  {
    question: '¿Nunca he competido, puedo participar?',
    answer:
      'Sí. Empieza con el Workout Experience (para probar) o el ½ Hybrid (para competir con volumen accesible). Ninguno de los dos requiere experiencia previa.',
  },
  {
    question: '¿Qué diferencia hay entre ½ Hybrid y el formato completo?',
    answer:
      'El ½ Hybrid usa las mismas estaciones y el mismo espíritu del formato oficial, con la mitad del volumen y cargas accesibles: es competencia real, con chip y clasificación. El formato completo (Individual, Dobles, Relay) es el reto sin reducir.',
  },
  {
    question: '¿Qué incluye el precio?',
    answer:
      'Chip de cronometraje y seguro del atleta, incluidos en todas las categorías de competencia y en el ½ Hybrid. Sin cargos adicionales ni desgloses ocultos.',
  },
  {
    question: '¿Qué día compito?',
    answer: <DiaCompitoTable />,
  },
  {
    question: '¿Puedo ir solo a ver?',
    answer: `Sí. Pases de público por día (${formatPrecio(250)}) o pase de 3 días (${formatPrecio(600)}). Compra el día en que compite tu atleta.`,
  },
  {
    question: '¿Qué necesito llevar?',
    answer:
      'Ropa deportiva cómoda, tenis para correr, toalla y botella de agua. Tu número de competidor y chip se entregan el día del registro.',
  },
  {
    question: '¿Cómo funciona el cronometraje?',
    answer:
      'Sistema de chip electrónico. Tu tiempo se registra al pasar por cada estación y al cruzar la meta. Resultados en tiempo real.',
  },
  {
    question: '¿Hay estacionamiento?',
    answer:
      'Sí, la sede cuenta con estacionamiento amplio. Recomendamos llegar con anticipación.',
  },
]

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <Box sx={{ textAlign: 'center', px: { xs: 1, sm: 2 } }}>
      <Typography
        variant="h2"
        component="span"
        sx={{
          display: 'block',
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
function CardioIcon({ size = 48 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="miter">
      <polygon points="28,4 10,26 22,26 18,44 38,20 26,20" />
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

function ArrowUp({ size = 20, color = '#E6F2B1' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" stroke={color} strokeWidth="2" strokeLinecap="square" strokeLinejoin="miter">
      <line x1="10" y1="18" x2="10" y2="2" />
      <polyline points="4,8 10,2 16,8" />
    </svg>
  )
}

// Hero background — responsive by breakpoint (largest available original is w1248).
const IMG_HERO_400 =
  'https://3e9sriq7.us-east.insforge.app/api/storage/buckets/images/objects/hero%2Fhero-corredores-multitud-w400.webp?v=88169c62c615ba9bb61116af9eed197e'
const IMG_HERO_800 =
  'https://3e9sriq7.us-east.insforge.app/api/storage/buckets/images/objects/hero%2Fhero-corredores-multitud-w800.webp?v=c83fbdbae44ef58109a443c458ebfeda'
const IMG_HERO_1248 =
  'https://3e9sriq7.us-east.insforge.app/api/storage/buckets/images/objects/hero%2Fhero-corredores-multitud-w1248.webp?v=816d22dd74b6710c6f5a59c662c0b133'

// Ubicación (Club Cumbres) background — responsive by breakpoint.
const IMG_VENUE_400 =
  'https://3e9sriq7.us-east.insforge.app/api/storage/buckets/images/objects/location%2Fubicacion-club-cumbres-aerea-w400.webp?v=5fa7e655dc6123e7a1fa26cdd30e037e'
const IMG_VENUE_800 =
  'https://3e9sriq7.us-east.insforge.app/api/storage/buckets/images/objects/location%2Fubicacion-club-cumbres-aerea-w800.webp?v=164ba70d20e415ed87779f7323757914'
const IMG_VENUE_907 =
  'https://3e9sriq7.us-east.insforge.app/api/storage/buckets/images/objects/location%2Fubicacion-club-cumbres-aerea-w907.webp?v=e549b18940cb3c16aa502310a0eeb23b'

// ENFORMA storage (InsForge), w800 variant — sharp enough for card backgrounds, light enough to load 28 of them.
const IMG_INDIVIDUAL_HOMBRE =
  'https://3e9sriq7.us-east.insforge.app/api/storage/buckets/images/objects/individual%2Findividual-hombre-corriendo-pista-w800.webp?v=49426bd84482dea102db9a1bc76dc388'
const IMG_INDIVIDUAL_MUJER =
  'https://3e9sriq7.us-east.insforge.app/api/storage/buckets/images/objects/individual%2Findividual-mujer-corriendo-pista-w800.webp?v=d3808e7eef83c55a5d0e7866bf61cf1a'
const IMG_DOBLES_HOMBRES =
  'https://3e9sriq7.us-east.insforge.app/api/storage/buckets/images/objects/doubles%2Fdobles-hombres-remo-asistido-w800.webp?v=bc444540f47e703aa6f8c744cdaa108b'
const IMG_DOBLES_MUJERES =
  'https://3e9sriq7.us-east.insforge.app/api/storage/buckets/images/objects/doubles%2Fdobles-mujeres-remo-equipo-w800.webp?v=77333debedfe851b21a3becbf9c90283'
const IMG_DOBLES_MIXTO =
  'https://3e9sriq7.us-east.insforge.app/api/storage/buckets/images/objects/doubles%2Fdobles-mixto-remo-equipo-w800.webp?v=d86b55ae3cfd8a58c58144f12deabdf2'
const IMG_RELAY_HOMBRES =
  'https://3e9sriq7.us-east.insforge.app/api/storage/buckets/images/objects/relay%2Frelay-equipo-hombres-legends-w800.webp?v=2cf0d209b5f3f19bdb70afd0bb9a85a4'
const IMG_RELAY_MUJERES =
  'https://3e9sriq7.us-east.insforge.app/api/storage/buckets/images/objects/relay%2Frelay-equipo-mujeres-team712-w800.webp?v=ca66d376b2405f2e49837b093eeb9945'
const IMG_RELAY_MIXTO =
  'https://3e9sriq7.us-east.insforge.app/api/storage/buckets/images/objects/relay%2Frelay-equipo-mixto-cambio-w800.webp?v=883cfbcdcb9a070de88d05ca113c6ea3'
const IMG_PUBLICO =
  'https://3e9sriq7.us-east.insforge.app/api/storage/buckets/images/objects/atmosphere%2Fpublico-animando-graderio-w800.webp?v=0fc58b5ef5b3277b6ab33ce399babea0'
const IMG_FOTOGRAFO =
  'https://3e9sriq7.us-east.insforge.app/api/storage/buckets/images/objects/media%2Ffotografos-cubriendo-carrera-w800.webp?v=df02c6283432f9fb887436449c5a12c1'
const IMG_WORKOUT =
  'https://3e9sriq7.us-east.insforge.app/api/storage/buckets/images/objects/stations%2Festacion-skierg-concept2-w800.webp?v=f5ff3662c86ba60a6b2f7f8f52cdb14e'
const IMG_WORKOUT_HOMBRE =
  'https://3e9sriq7.us-east.insforge.app/api/storage/buckets/images/objects/workout%2Fworkout-atleta-hombre-w600.webp?v=080575586a60e80938d84ab10c861264'
const IMG_WORKOUT_MUJER =
  'https://3e9sriq7.us-east.insforge.app/api/storage/buckets/images/objects/workout%2Fworkout-atleta-mujer-w800.webp?v=a748115eb4fff6a76ecf16d762879831'

// Keyed by product code (not just tipo) since COMPITE/EXPERIENCE have gender-specific photography.
const PRODUCT_IMAGES: Record<string, string> = {
  // COMPITE — Dobles
  'DOB-VIE-MM': IMG_DOBLES_MUJERES,
  'DOB-SAB-HH': IMG_DOBLES_HOMBRES,
  'DOB-SAB-MH': IMG_DOBLES_MIXTO,
  // COMPITE — Relay
  'REL-4H': IMG_RELAY_HOMBRES,
  'REL-4M': IMG_RELAY_MUJERES,
  'REL-2H2M': IMG_RELAY_MIXTO,
  // COMPITE — Individual
  'IND-H': IMG_INDIVIDUAL_HOMBRE,
  'IND-M': IMG_INDIVIDUAL_MUJER,
  // EXPERIENCE — ½ Hybrid (reuses the full-format photography for the same discipline)
  'HALF-IND-M': IMG_INDIVIDUAL_MUJER,
  'HALF-IND-H': IMG_INDIVIDUAL_HOMBRE,
  'HALF-DOB-MM': IMG_DOBLES_MUJERES,
  'HALF-DOB-HH': IMG_DOBLES_HOMBRES,
  'HALF-DOB-MH': IMG_DOBLES_MIXTO,
  // EXPERIENCE — Workout (fotografía por género, igual que la landing B)
  'WOD-M': IMG_WORKOUT_MUJER,
  'WOD-H': IMG_WORKOUT_HOMBRE,
  // ASISTE — Público
  'PUB-VIE': IMG_PUBLICO,
  'PUB-SAB': IMG_PUBLICO,
  'PUB-DOM': IMG_PUBLICO,
  'PUB-3D': IMG_PUBLICO,
  // ASISTE — Fotógrafo
  'FOT-VIE': IMG_FOTOGRAFO,
  'FOT-SAB': IMG_FOTOGRAFO,
  'FOT-DOM': IMG_FOTOGRAFO,
  'FOT-3D': IMG_FOTOGRAFO,
}

function getProductIcon(tipo: string, size = 40) {
  switch (tipo) {
    case 'Dobles':
    case '½ Hybrid Dobles':
      return <DuplaIcon size={size} />
    case 'Relay':
      return <RelevoIcon size={size} />
    case 'Individual':
    case '½ Hybrid Individual':
      return <IndividualIcon size={size} />
    case 'Workout Experience':
      return <CardioIcon size={size} />
    case 'Fotógrafo':
      return <PhotoCameraIcon sx={{ fontSize: size }} />
    case 'Público':
    default:
      return <ConfirmationNumberIcon sx={{ fontSize: size }} />
  }
}

const DIA_FECHA: Record<string, string> = {
  Viernes: 'VIERNES 13',
  Sábado: 'SÁBADO 14',
  Domingo: 'DOMINGO 15',
  'Vie-Dom': 'VIE 13 – DOM 15',
}

const DIA_SLUG: Record<string, string> = {
  Viernes: 'vie',
  Sábado: 'sab',
  Domingo: 'dom',
  'Vie-Dom': 'vie-dom',
}

const SESION_LABEL: Record<string, string> = {
  AM: 'Matutino',
  PM: 'Vespertino',
  DIA: 'Día completo',
}

const FORMATO_DESCRIPCIONES: Record<string, string> = {
  'Workout Experience':
    'Una hora, un coach de ENFORMA, las instalaciones y el equipo real del evento. Aprendes la técnica de cada estación y haces un entrenamiento completo en formato híbrido. Sin cronómetro, sin ranking, sin experiencia previa. Sales sabiendo si esto es para ti.',
  '½ Hybrid Individual':
    'Formato by ENFORMA. La estructura del formato oficial con la mitad del volumen: mismas estaciones, mismo espíritu, distancia y cargas accesibles. Es competencia de verdad, con chip y clasificación. Para quien ya entrena y quiere su primera competencia.',
  '½ Hybrid Dobles':
    'Formato by ENFORMA. La estructura del formato oficial con la mitad del volumen: mismas estaciones, mismo espíritu, distancia y cargas accesibles. Es competencia de verdad, con chip y clasificación. Para quien ya entrena y quiere su primera competencia.',
  Dobles:
    'Dos atletas, un solo tiempo. Se dividen el trabajo de las estaciones y se relevan según su estrategia. Formato completo.',
  Relay:
    'Cuatro atletas por equipo. Cada quien toma su tramo. El formato más social y el mejor para llegar en grupo.',
  Individual:
    'El formato completo, tú solo, de principio a fin. Categoría Open — la apertura del evento el viernes por la tarde.',
}

interface TresDiasItem {
  fecha: string
  sesion: string
  titulo: string
  texto: string
  links: { label: string; href: string }[]
}

const TRES_DIAS: TresDiasItem[] = [
  {
    fecha: 'VIERNES 13',
    sesion: 'Vespertino',
    titulo: 'Arranca la competencia',
    texto: 'Dobles Mujeres e Individual (Open) abren la competencia. La energía del primer día.',
    links: [
      { label: 'Ver Dobles', href: '#compite-vie-pm-dobles' },
      { label: 'Ver Individual', href: '#compite-vie-pm-individual' },
    ],
  },
  {
    fecha: 'SÁBADO 14',
    sesion: 'Día completo',
    titulo: 'El día más abierto',
    texto:
      'Dobles Hombres y Mixto, debuta el ½ Hybrid, y quien nunca ha competido puede tomar el Workout. Día completo, abierto a todos los niveles.',
    links: [
      { label: 'Ver Dobles', href: '#compite-sab-dia-dobles' },
      { label: 'Ver ½ Hybrid y Workout', href: '#experience' },
    ],
  },
  {
    fecha: 'DOMINGO 15',
    sesion: 'Matutino',
    titulo: 'Relay',
    texto: 'Cuatro atletas, un solo tiempo. El cierre del evento con el formato más social y de mayor ambiente.',
    links: [{ label: 'Ver Relay', href: '#compite-dom-am-relay' }],
  },
]

const CU_SUFFIX_RE = /\s*\(\$[\d,]+(?:\.\d+)? c\/u\)\s*$/

/** Compact currency, no "MXN" suffix — used for c/u breakdowns and the pricing table. */
function formatMonto(n: number): string {
  return `$${Math.round(n).toLocaleString('es-MX')}`
}

/** Recomputes the "($X c/u)" suffix from the current vigent price so it never drifts from precioPorEtapa. */
function unidadConPrecioVigente(producto: Producto, precioVigente: number): string {
  const base = producto.precioUnidad.replace(CU_SUFFIX_RE, '')
  if (producto.integrantes > 1) {
    const unitario = precioVigente / producto.integrantes
    return `${base} (${formatMonto(unitario)} c/u)`
  }
  return base
}

interface ProductCardProps {
  producto: Producto
  accentColor?: string
}

/** Shared with SimulacroProSection — buyer/email validation for checkout. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

const checkoutFieldSx = (accentColor: string) => ({
  '& .MuiInputBase-root': {
    color: '#fff',
    borderRadius: 0,
    bgcolor: 'rgba(0,0,0,0.35)',
  },
  '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.7)' },
  '& .MuiOutlinedInput-notchedOutline': { borderColor: `${accentColor}66` },
})

type CheckoutBuyerFieldsProps = {
  accentColor: string
  disabled: boolean
  name: string
  email: string
  phone: string
  contactConsent: boolean
  onNameChange: (value: string) => void
  onEmailChange: (value: string) => void
  onPhoneChange: (value: string) => void
  onConsentChange: (value: boolean) => void
}

function CheckoutBuyerFields({
  accentColor,
  disabled,
  name,
  email,
  phone,
  contactConsent,
  onNameChange,
  onEmailChange,
  onPhoneChange,
  onConsentChange,
}: CheckoutBuyerFieldsProps) {
  return (
    <Stack spacing={1} sx={{ width: '100%' }}>
      <TextField
        label="Nombre completo"
        value={name}
        onChange={(e) => onNameChange(e.target.value)}
        disabled={disabled}
        required
        size="small"
        fullWidth
        autoComplete="name"
        sx={checkoutFieldSx(accentColor)}
      />
      <TextField
        label="Correo electrónico"
        type="email"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        disabled={disabled}
        required
        size="small"
        fullWidth
        autoComplete="email"
        sx={checkoutFieldSx(accentColor)}
      />
      <TextField
        label="Teléfono / WhatsApp (opcional)"
        value={phone}
        onChange={(e) => onPhoneChange(e.target.value)}
        disabled={disabled}
        size="small"
        fullWidth
        autoComplete="tel"
        sx={checkoutFieldSx(accentColor)}
      />
      <FormControlLabel
        sx={{
          alignItems: 'flex-start',
          mx: 0,
          gap: 0.5,
          '& .MuiFormControlLabel-label': {
            color: 'rgba(255,255,255,0.75)',
            fontSize: '0.72rem',
            lineHeight: 1.35,
            fontFamily: "'Space Grotesk', sans-serif",
            pt: 0.35,
          },
        }}
        control={
          <Checkbox
            checked={contactConsent}
            onChange={(e) => onConsentChange(e.target.checked)}
            disabled={disabled}
            size="small"
            sx={{
              color: `${accentColor}99`,
              p: 0.5,
              '&.Mui-checked': { color: accentColor },
            }}
          />
        }
        label="Quiero recibir noticias, novedades, ajustes y avisos de próximos eventos"
      />
    </Stack>
  )
}

function ProductCard({ producto, accentColor = '#E6F2B1' }: ProductCardProps) {
  const imageUrl = PRODUCT_IMAGES[producto.code] || IMG_WORKOUT
  const isOpen = SALES_CONFIG.status === 'open'
  const isClosed = SALES_CONFIG.status === 'closed'
  const buttonLabel = isOpen ? 'Inscribirse' : isClosed ? 'Inscripciones cerradas' : SALES_CONFIG.openingLabel
  const etapaVigente = resolveEtapaComercial() ?? 'lanzamiento'
  const precioVigente = getPrecioVigente(producto, etapaVigente)
  const isWorkout = producto.tipo === 'Workout Experience'
  const productConfig = getSandboxCheckoutProductConfig(producto.code)
  const checkoutActive =
    isCheckoutActive() && isSandboxCheckoutProduct(producto.code) && productConfig != null
  const showSandboxBadge = checkoutActive && isSandboxCheckoutActive()
  const quantityEditable = productConfig?.quantityMode === 'editable'
  const [buyerName, setBuyerName] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')
  const [buyerPhone, setBuyerPhone] = useState('')
  const [contactConsent, setContactConsent] = useState(false)
  const [quantityInput, setQuantityInput] = useState('1')
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const activeCheckoutProductCode = useSyncExternalStore(
    subscribeActiveCheckoutProductCode,
    getActiveCheckoutProductCode,
    () => null,
  )
  const submitting = activeCheckoutProductCode === producto.code
  const checkoutBusy = activeCheckoutProductCode != null

  const isContactValid =
    buyerName.trim().length > 1 &&
    EMAIL_PATTERN.test(buyerEmail.trim()) &&
    (buyerPhone.trim() === '' || buyerPhone.trim().length >= 10)

  const parseQuantity = (raw: string): number | null => {
    if (!/^\d+$/.test(raw.trim())) return null
    const n = Number(raw)
    if (!Number.isInteger(n) || n < 1) return null
    return n
  }

  const resolvedQuantity =
    productConfig == null
      ? null
      : productConfig.quantityMode === 'fixed'
        ? 1
        : parseQuantity(quantityInput)

  const quantityOk =
    productConfig != null &&
    resolvedQuantity != null &&
    resolvedQuantity >= productConfig.minimumQuantity &&
    (productConfig.quantityMode !== 'fixed' || resolvedQuantity === 1)

  const canPay = checkoutActive && isContactValid && quantityOk && !checkoutBusy

  const startCheckout = async () => {
    if (!productConfig || !canPay || resolvedQuantity == null) return
    // Page-wide synchronous lock: must run before any await / setState.
    const pageLock = getSandboxCheckoutPageLock()
    if (!pageLock.tryAcquire()) return
    setActiveCheckoutProductCode(producto.code)
    setErrorMessage(null)

    if (!navigator.onLine) {
      setErrorMessage('Se necesita conexión para iniciar el pago.')
      setActiveCheckoutProductCode(null)
      pageLock.release()
      return
    }

    const quantity = resolvedQuantity

    try {
      const attempt = getOrCreateCheckoutAttempt({
        productCode: producto.code,
        quantity,
      })
      const phoneTrimmed = buyerPhone.trim()
      const result = await createCheckout({
        productCode: attempt.productCode,
        quantity: attempt.quantity,
        idempotencyKey: attempt.idempotencyKey,
        selectedProvider: 'MERCADO_PAGO',
        buyer: {
          email: buyerEmail.trim(),
          name: buyerName.trim(),
          ...(phoneTrimmed ? { phone: phoneTrimmed } : {}),
          contactConsent,
        },
      })
      savePublicOrderReference(producto.code, result.public_order_reference)
      const stored = getCheckoutAttempt(producto.code)
      if (stored?.publicOrderReference !== result.public_order_reference) {
        throw new Error('Checkout attempt was not persisted')
      }
      // Keep lock held through navigation; do not release on success path.
      window.location.assign(result.checkout_url)
    } catch (err) {
      if (err instanceof CheckoutApiError) {
        setErrorMessage(messageForCheckoutError(err.code))
      } else {
        setErrorMessage('No pudimos iniciar el proceso de pago.')
      }
      setActiveCheckoutProductCode(null)
      pageLock.release()
    }
  }

  return (
    <Card
      sx={{
        position: 'relative',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: 0,
        border: `1px solid ${accentColor}26`,
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        transition: 'transform 0.2s ease, border-color 0.2s ease',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.92) 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        },
        '&:hover': {
          transform: 'translateY(-3px)',
          borderColor: `${accentColor}80`,
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
        <Box sx={{ mb: 0.5, color: accentColor }}>{getProductIcon(producto.tipo)}</Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 900,
            mb: 0.25,
            fontSize: { xs: '0.85rem', sm: '1rem' },
            fontFamily: "'Space Grotesk', sans-serif",
            color: accentColor,
            letterSpacing: '0.02em',
          }}
        >
          {producto.nombre}
        </Typography>
        <Chip
          label={producto.tipo}
          size="small"
          sx={{
            mb: 0.5,
            fontSize: '0.65rem',
            height: 20,
            borderRadius: 0,
            fontWeight: 700,
            bgcolor: `${accentColor}26`,
            color: accentColor,
          }}
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
          {producto.integrantes} {producto.integrantes === 1 ? 'integrante' : 'integrantes'}
        </Typography>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 900,
            fontSize: { xs: '1.1rem', sm: '1.3rem' },
            fontFamily: "'Space Grotesk', sans-serif",
            color: accentColor,
            letterSpacing: '0.02em',
          }}
        >
          {formatPrecio(precioVigente)}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: 'rgba(255,255,255,0.65)',
            fontSize: '0.75rem',
            mb: producto.incluyeChip ? 0.5 : 1.5,
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          {unidadConPrecioVigente(producto, precioVigente)}
        </Typography>
        {producto.incluyeChip && (
          <Typography
            variant="caption"
            sx={{
              color: 'rgba(255,255,255,0.65)',
              fontSize: '0.7rem',
              lineHeight: 1.4,
              mb: 1.5,
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Incluye chip de cronometraje y seguro del atleta
          </Typography>
        )}
        <Box
          sx={{
            width: '100%',
            pt: 1,
            mb: 1.25,
            borderTop: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          {isWorkout ? (
            <>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  color: accentColor,
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  fontSize: '0.65rem',
                  mb: 0.25,
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                PRECIO ÚNICO
              </Typography>
              <Typography
                variant="caption"
                sx={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.68rem', lineHeight: 1.4, fontFamily: "'Space Grotesk', sans-serif" }}
              >
                $350 durante todas las etapas. Sin meses sin intereses.
              </Typography>
            </>
          ) : producto.msi ? (
            <>
              <Typography
                variant="caption"
                sx={{
                  display: 'block',
                  color: accentColor,
                  fontWeight: 800,
                  letterSpacing: '0.1em',
                  fontSize: '0.65rem',
                  mb: 0.25,
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                3 MESES SIN INTERESES
              </Typography>
              <Typography
                variant="caption"
                sx={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.68rem', lineHeight: 1.4, fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Disponible con tarjetas participantes a través de Mercado Pago.
              </Typography>
            </>
          ) : (
            <>
              <Typography
                variant="caption"
                sx={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.68rem', lineHeight: 1.4, fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Pago seguro mediante Mercado Pago.
              </Typography>
              <Typography
                variant="caption"
                sx={{ display: 'block', color: 'rgba(255,255,255,0.6)', fontSize: '0.68rem', lineHeight: 1.4, fontFamily: "'Space Grotesk', sans-serif" }}
              >
                Este producto no participa en 3 meses sin intereses.
              </Typography>
            </>
          )}
        </Box>
        {checkoutActive && (
          <Stack spacing={1} sx={{ width: '100%', mt: 'auto', mb: 1.25 }}>
            {showSandboxBadge && (
              <Typography
                variant="caption"
                sx={{
                  color: accentColor,
                  fontWeight: 800,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  fontSize: '0.65rem',
                }}
              >
                Entorno de prueba
              </Typography>
            )}
            <CheckoutBuyerFields
              accentColor={accentColor}
              disabled={checkoutBusy}
              name={buyerName}
              email={buyerEmail}
              phone={buyerPhone}
              contactConsent={contactConsent}
              onNameChange={(value) => {
                setBuyerName(value)
                setErrorMessage(null)
              }}
              onEmailChange={(value) => {
                setBuyerEmail(value)
                setErrorMessage(null)
              }}
              onPhoneChange={(value) => {
                setBuyerPhone(value)
                setErrorMessage(null)
              }}
              onConsentChange={(value) => {
                setContactConsent(value)
                setErrorMessage(null)
              }}
            />
            {quantityEditable && (
              <TextField
                label="Cantidad"
                value={quantityInput}
                onChange={(e) => {
                  setQuantityInput(e.target.value)
                  setErrorMessage(null)
                }}
                disabled={checkoutBusy}
                slotProps={{
                  htmlInput: {
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                    min: 1,
                    'aria-label': 'Cantidad de accesos',
                  },
                }}
                size="small"
                fullWidth
                sx={checkoutFieldSx(accentColor)}
              />
            )}
            {errorMessage && (
              <Typography
                role="alert"
                variant="caption"
                sx={{ color: '#E9C7DF', fontSize: '0.72rem', textAlign: 'left' }}
              >
                {errorMessage}
              </Typography>
            )}
          </Stack>
        )}
        <Button
          component={checkoutActive ? 'button' : isOpen ? 'a' : 'button'}
          href={!checkoutActive && isOpen ? getInscribirUrl(producto.code) : undefined}
          target={!checkoutActive && isOpen ? '_blank' : undefined}
          rel={!checkoutActive && isOpen ? 'noopener noreferrer' : undefined}
          disabled={checkoutActive ? !canPay : !isOpen}
          onClick={checkoutActive ? () => void startCheckout() : undefined}
          variant="outlined"
          size="small"
          sx={{
            mt: checkoutActive ? 0 : 'auto',
            minHeight: 44,
            fontSize: { xs: '0.68rem', sm: '0.78rem' },
            px: { xs: 1.5, sm: 2 },
            py: { xs: 1, sm: 1.15 },
            borderRadius: 0,
            fontWeight: 700,
            borderWidth: 2,
            borderColor: accentColor,
            color: accentColor,
            '&:hover': { borderWidth: 2, borderColor: accentColor, bgcolor: `${accentColor}1A` },
            '&:focus-visible': { outline: `3px solid ${accentColor}`, outlineOffset: 2 },
            '&.Mui-disabled': {
              borderWidth: 2,
              borderColor: `${accentColor}55`,
              color: `${accentColor}99`,
            },
          }}
        >
          {checkoutActive
            ? submitting
              ? 'Iniciando…'
              : showSandboxBadge
                ? 'Probar checkout'
                : 'Pagar'
            : buttonLabel}
        </Button>
      </CardContent>
    </Card>
  )
}

interface ProductoGroup {
  key: string
  id: string
  dia: string
  sesion: string
  tipo: string
  precioUnidad: string
  productos: Producto[]
}

function groupProductos(productos: Producto[]): ProductoGroup[] {
  const groups: ProductoGroup[] = []
  for (const p of productos) {
    const key = `${p.dia}|${p.sesion}|${p.tipo}`
    let group = groups.find((g) => g.key === key)
    if (!group) {
      const tipoSlug = p.tipo.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
      const id = `compite-${DIA_SLUG[p.dia]}-${p.sesion.toLowerCase()}-${tipoSlug}`
      group = { key, id, dia: p.dia, sesion: p.sesion, tipo: p.tipo, precioUnidad: p.precioUnidad, productos: [] }
      groups.push(group)
    }
    group.productos.push(p)
  }
  return groups
}

const COMPITE_GROUPS = groupProductos(porBloque('COMPITE'))
const HALF_HYBRID_PRODUCTS = CATALOGO.filter((p) => p.tipo === '½ Hybrid Individual' || p.tipo === '½ Hybrid Dobles')
const WORKOUT_PRODUCTS = CATALOGO.filter((p) => p.tipo === 'Workout Experience')
const PUBLICO_PRODUCTS = CATALOGO.filter((p) => p.tipo === 'Público')
const FOTOGRAFO_PRODUCTS = CATALOGO.filter((p) => p.tipo === 'Fotógrafo')

function SectionHeading({ label, color = '#E6F2B1' }: { label: string; color?: string }) {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, mb: 1 }}>
      <Box sx={{ color: `${color}33`, fontFamily: "'JetBrains Mono', monospace", fontSize: { xs: '1rem', sm: '1.5rem' }, fontWeight: 700, lineHeight: 1, transform: 'translateY(-2px)' }}>
        {'[ '}
      </Box>
      <Typography
        variant="h2"
        sx={{
          color,
          fontWeight: 900,
          fontSize: { xs: '2rem', sm: '3rem', md: '3.5rem' },
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        {label}
      </Typography>
      <Box sx={{ color: `${color}33`, fontFamily: "'JetBrains Mono', monospace", fontSize: { xs: '1rem', sm: '1.5rem' }, fontWeight: 700, lineHeight: 1, transform: 'translateY(-2px)' }}>
        {' ]'}
      </Box>
    </Box>
  )
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

// ── Simulacro PRO (portado APAGADO desde la landing B) ───────────
// SIN backend en esta landing: el submit está deshabilitado con un TODO
// claro. No encender SIMULACRO_PRO_ACTIVE hasta conectarlo.
type IndividualProModalidad = 'hombre' | 'mujer'
type DoblesProModalidad = 'hombres' | 'mujeres' | 'mixto'

const EMAIL_PATTERN_SIMULACRO = EMAIL_PATTERN

type SimulacroProViewState = 'form' | 'submitting' | 'done' | 'error'

function SimulacroProSection() {
  const [view, setView] = useState<SimulacroProViewState>('form')
  const [nombre, setNombre] = useState('')
  const [correo, setCorreo] = useState('')
  const [telefono, setTelefono] = useState('')
  const [individualPro, setIndividualPro] = useState<IndividualProModalidad | ''>('')
  const [doblesPro, setDoblesPro] = useState<DoblesProModalidad | ''>('')

  const isValid =
    nombre.trim().length > 1 &&
    EMAIL_PATTERN_SIMULACRO.test(correo.trim()) &&
    telefono.trim().length >= 10 &&
    (individualPro !== '' || doblesPro !== '')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!isValid) return
    // TODO(Ready2Hybrid): conectar este envío al backend de captación de
    // interés Pro (equivalente a api/simulacroPro.ts en hybrid-registro)
    // ANTES de encender SIMULACRO_PRO_ACTIVE. Mientras no exista backend,
    // el envío reporta error para no simular un registro exitoso.
    setView('error')
  }

  return (
    <Box id="simulacro-pro" sx={{ py: { xs: 8, md: 12 }, bgcolor: '#111111' }}>
      <Container maxWidth="sm">
        <SectionHeading label="SIMULACRO PRO" />
        <Typography
          variant="h5"
          sx={{
            textAlign: 'center',
            color: '#fff',
            fontWeight: 900,
            mb: 2,
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          ¿Interesado en competir en modalidad Pro?
        </Typography>
        <Typography
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            mb: 4,
            maxWidth: 480,
            mx: 'auto',
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          Estamos evaluando la apertura de un simulacro Pro dentro de HYBRID EXPERIENCE. Déjanos tus
          datos e indícanos la modalidad que te interesa. La organización se comunicará contigo.
        </Typography>

        {view === 'done' ? (
          <Typography sx={{ textAlign: 'center', color: '#E6F2B1', fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
            ¡Listo! Dejamos registrado tu interés — la organización se comunicará contigo.
          </Typography>
        ) : (
          <Stack component="form" spacing={2.5} onSubmit={handleSubmit}>
            <TextField label="Nombre completo" value={nombre} onChange={(e) => setNombre(e.target.value)} fullWidth required />
            <TextField label="Correo electrónico" type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} fullWidth required />
            <TextField label="WhatsApp" value={telefono} onChange={(e) => setTelefono(e.target.value)} fullWidth required />

            <FormControl>
              <FormLabel sx={{ color: '#E6F2B1', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em', '&.Mui-focused': { color: '#E6F2B1' } }}>
                Individual Pro (elige una, opcional)
              </FormLabel>
              <RadioGroup value={individualPro} onChange={(e) => setIndividualPro(e.target.value as IndividualProModalidad)}>
                <FormControlLabel value="hombre" control={<Radio />} label="Individual Pro — Hombre" />
                <FormControlLabel value="mujer" control={<Radio />} label="Individual Pro — Mujer" />
              </RadioGroup>
            </FormControl>

            <FormControl>
              <FormLabel sx={{ color: '#E6F2B1', fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.05em', '&.Mui-focused': { color: '#E6F2B1' } }}>
                Dobles Pro (elige una, opcional)
              </FormLabel>
              <RadioGroup value={doblesPro} onChange={(e) => setDoblesPro(e.target.value as DoblesProModalidad)}>
                <FormControlLabel value="hombres" control={<Radio />} label="Dobles Pro — Hombres" />
                <FormControlLabel value="mujeres" control={<Radio />} label="Dobles Pro — Mujeres" />
                <FormControlLabel value="mixto" control={<Radio />} label="Dobles Pro — Mixto" />
              </RadioGroup>
            </FormControl>

            <Typography sx={{ fontSize: '0.78rem', color: 'text.secondary', lineHeight: 1.5 }}>
              La apertura de esta modalidad dependerá del volumen de inscripción y de la valoración de
              la Dirección Deportiva del evento HYBRID EXPERIENCE. Dejar tus datos es una expresión de
              interés, no una inscripción confirmada.
            </Typography>

            <Button
              type="submit"
              variant="outlined"
              size="large"
              disabled={!isValid || view === 'submitting'}
              sx={{
                borderRadius: 0,
                borderWidth: 2,
                borderColor: '#E6F2B1',
                color: '#E6F2B1',
                fontWeight: 700,
                py: 1.25,
                fontFamily: "'Space Grotesk', sans-serif",
                '&:hover': { borderWidth: 2, borderColor: '#E6F2B1', bgcolor: 'rgba(230,242,177,0.1)' },
              }}
            >
              {view === 'submitting' ? 'Enviando…' : 'Dejar mis datos'}
            </Button>
            {view === 'error' && (
              <Typography sx={{ color: '#ff8a8a', fontSize: '0.85rem', textAlign: 'center' }}>
                No pudimos guardar tu interés. Inténtalo de nuevo en unos minutos.
              </Typography>
            )}
          </Stack>
        )}
      </Container>
    </Box>
  )
}

// ── Navbar ───────────────────────────────────────────────────────
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  const links = [
    { label: 'INICIO', href: '#hero' },
    { label: 'EXPERIENCE', href: '#experience' },
    { label: 'FORMATOS', href: '#formatos' },
    { label: 'PRECIOS', href: '#precios' },
    { label: 'COMPITE', href: '#compite' },
    { label: 'PREMIOS', href: '#premios' },
    ...(SIMULACRO_PRO_ACTIVE ? [{ label: 'PRO', href: '#simulacro-pro' }] : []),
    { label: 'ASISTE', href: '#asiste' },
    { label: 'UBICACIÓN', href: '#ubicacion' },
    { label: 'PREPARACIÓN', href: '#preparacion' },
    { label: 'COMUNIDAD', href: '#comunidad' },
    { label: 'FAQ', href: '#faq' },
  ]

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
            fontSize: { xs: '0.95rem', sm: '1.3rem' },
            lineHeight: 1,
            cursor: 'pointer',
            userSelect: 'none',
            whiteSpace: 'nowrap',
          }}
        >
          HYBRID EXPERIENCE
        </Typography>

        {/* Desktop links */}
        <Box sx={{ display: { xs: 'none', lg: 'flex' }, alignItems: 'center', gap: 2.5 }}>
          {links.map((link) => (
            <Typography
              key={link.label}
              component="a"
              href={link.href}
              sx={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'color 150ms',
                '&:hover': { color: '#E6F2B1' },
                '&:focus-visible': { outline: '2px solid #E6F2B1', outlineOffset: 2 },
              }}
            >
              {link.label}
            </Typography>
          ))}
          {/* Tienda aún no disponible: se muestra a propósito, deshabilitada, para
              que la audiencia sepa que viene — no navega a DOMAINS.shop todavía. */}
          <Button
            disabled
            aria-label="Tienda — próximamente"
            sx={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.68rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              borderRadius: 0,
              py: 0.5,
              px: 1.5,
              minHeight: 0,
              minWidth: 0,
              flexShrink: 0,
              lineHeight: 1.2,
              border: '1px solid rgba(230,242,177,0.35)',
              '&.Mui-disabled': {
                color: 'rgba(230,242,177,0.6)',
                bgcolor: 'transparent',
              },
            }}
          >
            SHOP · PRONTO
          </Button>
        </Box>

        {/* Hamburger */}
        <IconButton
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          sx={{ display: { xs: 'flex', lg: 'none' }, color: '#E6F2B1', borderRadius: 0, flexShrink: 0 }}
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
              component="a"
              href={link.href}
              onClick={() => setMenuOpen(false)}
              sx={{
                display: 'block',
                px: 3,
                py: 1.5,
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: '0.8rem',
                fontWeight: 700,
                letterSpacing: '0.1em',
                color: 'rgba(255,255,255,0.6)',
                textDecoration: 'none',
                cursor: 'pointer',
                borderBottom: '1px solid rgba(230,242,177,0.06)',
                transition: 'color 150ms',
                '&:hover': { color: '#E6F2B1', bgcolor: 'rgba(230,242,177,0.03)' },
                '&:focus-visible': { outline: '2px solid #E6F2B1', outlineOffset: -2 },
              }}
            >
              {link.label}
            </Box>
          ))}
          {/* Tienda aún no disponible — misma decisión que en el navbar de escritorio. */}
          <Box
            aria-disabled="true"
            sx={{
              px: 3,
              py: 1.5,
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: '0.8rem',
              fontWeight: 700,
              letterSpacing: '0.1em',
              color: 'rgba(230,242,177,0.6)',
              cursor: 'default',
            }}
          >
            SHOP · PRONTO
          </Box>
        </Box>
      )}
    </Box>
  )
}

// ── Organizer Strip (static — replaces the prior sponsor marquee) ──
function OrganizerStrip() {
  return (
    <Box
      sx={{
        textAlign: 'center',
        bgcolor: '#000000',
        borderTop: '1px solid rgba(230,242,177,0.15)',
        borderBottom: '1px solid rgba(230,242,177,0.15)',
        py: { xs: 2, sm: 2.5 },
        px: 2,
      }}
    >
      <Typography
        sx={{
          fontFamily: 'tt-norms-pro-extra-black-italic, sans-serif',
          fontStyle: 'italic',
          color: '#E6F2B1',
          fontSize: { xs: '0.9rem', sm: '1.1rem' },
          mb: 0.5,
        }}
      >
        HYBRID EXPERIENCE
      </Typography>
      <Typography
        sx={{
          fontFamily: "'Space Grotesk', sans-serif",
          color: 'text.secondary',
          fontWeight: 600,
          fontSize: { xs: '0.7rem', sm: '0.8rem' },
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}
      >
        Organizado por ENFORMA Sports Society · Mérida, Yucatán · 13, 14 y 15 de noviembre de 2026
      </Typography>
    </Box>
  )
}

// ── Elige tu experiencia (three conceptual entry points) ─────────
interface AccesoConceptual {
  titulo: string
  subtitulo: string
  href: string
  color: string
}

const ACCESOS: AccesoConceptual[] = [
  { titulo: 'QUIERO COMPETIR', subtitulo: 'Individual · Dobles · Relay', href: '#compite', color: '#E6F2B1' },
  { titulo: 'QUIERO EMPEZAR', subtitulo: 'Workout Experience · ½ Hybrid', href: '#experience', color: '#E6F2B1' },
  { titulo: 'QUIERO ASISTIR', subtitulo: 'Público · Fotógrafo', href: '#asiste', color: '#E9C7DF' },
]

function EligeTuExperiencia() {
  return (
    <Box
      id="elige-tu-experiencia"
      component="section"
      sx={{ py: { xs: 8, md: 10 }, bgcolor: 'background.default', scrollMarginTop: '80px' }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          component="h2"
          sx={{
            textAlign: 'center',
            mb: { xs: 5, md: 6 },
            fontWeight: 900,
            fontSize: { xs: '1.6rem', sm: '2.1rem', md: '2.4rem' },
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            fontFamily: "'Space Grotesk', sans-serif",
            color: '#E6F2B1',
          }}
        >
          Elige cómo vivir la experiencia
        </Typography>
        <Grid container spacing={3}>
          {ACCESOS.map((acceso) => (
            <Grid size={{ xs: 12, sm: 4 }} key={acceso.href}>
              <Box
                component="a"
                href={acceso.href}
                sx={{
                  display: 'block',
                  textAlign: 'center',
                  height: '100%',
                  p: { xs: 3.5, sm: 4 },
                  border: '2px solid',
                  borderColor: `${acceso.color}4D`,
                  textDecoration: 'none',
                  transition: 'border-color 0.15s ease, transform 0.15s ease',
                  '&:hover': { borderColor: acceso.color, transform: 'translateY(-3px)' },
                  '&:focus-visible': { outline: `3px solid ${acceso.color}`, outlineOffset: 3 },
                }}
              >
                <Typography
                  component="h3"
                  sx={{
                    fontWeight: 900,
                    color: acceso.color,
                    fontFamily: "'Space Grotesk', sans-serif",
                    letterSpacing: '0.03em',
                    fontSize: { xs: '1.15rem', sm: '1.3rem' },
                    textTransform: 'uppercase',
                    mb: 1,
                  }}
                >
                  {acceso.titulo}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: 'text.secondary', fontFamily: "'Space Grotesk', sans-serif" }}
                >
                  {acceso.subtitulo}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  )
}

// ── Etapas de precio → tabla por experiencia (transparent, no invented numbers) ──
const ETAPA_ORDEN: EtapaComercial[] = ['lanzamiento', 'preventa', 'regular']
const ETAPA_LABEL: Record<EtapaComercial, string> = {
  lanzamiento: 'Lanzamiento',
  preventa: 'Preventa',
  regular: 'Regular',
}

function productoPorTipo(tipo: string): Producto {
  const p = CATALOGO.find((x) => x.tipo === tipo)
  if (!p) throw new Error(`Producto no encontrado para tipo: ${tipo}`)
  return p
}
function productoPorCode(code: string): Producto {
  const p = CATALOGO.find((x) => x.code === code)
  if (!p) throw new Error(`Producto no encontrado para code: ${code}`)
  return p
}

interface FilaTablaPrecio {
  categoria: string
  producto: Producto | null
  /** Merged single cell across the 3 stage columns — Workout (fixed) and Público/Fotógrafo (no stages). */
  singleCelda?: string
}
interface GrupoTablaPrecio {
  bloque: string
  color: string
  filas: FilaTablaPrecio[]
}

const TABLA_PRECIOS_GRUPOS: GrupoTablaPrecio[] = [
  {
    bloque: 'COMPITE',
    color: '#E6F2B1',
    filas: [
      { categoria: 'Individual', producto: productoPorTipo('Individual') },
      { categoria: 'Dobles', producto: productoPorTipo('Dobles') },
      { categoria: 'Relay', producto: productoPorTipo('Relay') },
    ],
  },
  {
    bloque: 'EXPERIENCE',
    color: '#E6F2B1',
    filas: [
      { categoria: '½ Hybrid Individual', producto: productoPorTipo('½ Hybrid Individual') },
      { categoria: '½ Hybrid Dobles', producto: productoPorTipo('½ Hybrid Dobles') },
      { categoria: 'Workout', producto: productoPorTipo('Workout Experience') },
    ],
  },
  {
    bloque: 'ASISTE',
    color: '#E9C7DF',
    filas: [
      {
        categoria: 'Público',
        producto: null,
        singleCelda: `${formatMonto(productoPorCode('PUB-VIE').precio)} por día · ${formatMonto(productoPorCode('PUB-3D').precio)} pase 3 días`,
      },
      {
        categoria: 'Fotógrafo',
        producto: null,
        singleCelda: `${formatMonto(productoPorCode('FOT-VIE').precio)} por día · ${formatMonto(productoPorCode('FOT-3D').precio)} pase 3 días`,
      },
    ],
  },
]

function PrecioCelda({ total, cu }: { total: number; cu?: number }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <Box
        component="span"
        sx={{
          fontFamily: "'JetBrains Mono', 'Space Grotesk', monospace",
          fontWeight: 800,
          fontSize: { xs: '0.85rem', sm: '0.92rem' },
          color: '#ffffff',
          letterSpacing: '0.01em',
        }}
      >
        {formatMonto(total)}
      </Box>
      {cu != null && (
        <Box
          component="span"
          sx={{
            fontFamily: "'JetBrains Mono', 'Space Grotesk', monospace",
            fontSize: { xs: '0.68rem', sm: '0.7rem' },
            color: 'rgba(255,255,255,0.6)',
          }}
        >
          {formatMonto(cu)} c/u
        </Box>
      )}
    </Box>
  )
}

function FilaPrecioTabla({ fila }: { fila: FilaTablaPrecio }) {
  const p = fila.producto
  const isWorkout = p?.tipo === 'Workout Experience'
  const isMerged = fila.singleCelda != null || isWorkout
  const mergedText = fila.singleCelda ?? (p ? formatMonto(p.precioPorEtapa!.lanzamiento) : '')
  const msi = p?.msi === true

  return (
    <Box
      sx={{
        display: { xs: 'block', sm: 'grid' },
        gridTemplateColumns: { sm: '1.5fr 1fr 1fr 1fr 0.9fr' },
        borderBottom: '1px solid rgba(230,242,177,0.08)',
        py: { xs: 1.75, sm: 0 },
        px: { xs: 2, sm: 0 },
        '&:hover': { bgcolor: 'rgba(230,242,177,0.04)' },
      }}
    >
      <Box
        sx={{
          px: { sm: 2.5 },
          py: { sm: 1.6 },
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          fontFamily: "'Space Grotesk', sans-serif",
          fontWeight: 800,
          fontSize: { xs: '0.9rem', sm: '0.85rem' },
          color: '#ffffff',
          mb: { xs: 1, sm: 0 },
          borderRight: { sm: '1px solid rgba(230,242,177,0.1)' },
        }}
      >
        <Box component="span" sx={{ width: 6, height: 6, bgcolor: '#E6F2B1', flexShrink: 0 }} />
        {fila.categoria}
      </Box>

      {isMerged ? (
        <Box
          sx={{
            gridColumn: { sm: 'span 3' },
            px: { sm: 2.5 },
            py: { xs: 0.5, sm: 1.6 },
            display: 'flex',
            alignItems: 'center',
            fontFamily: "'JetBrains Mono', 'Space Grotesk', monospace",
            fontSize: { xs: '0.8rem', sm: '0.85rem' },
            fontWeight: 700,
            color: '#ffffff',
          }}
        >
          {mergedText}
        </Box>
      ) : (
        ETAPA_ORDEN.map((etapa) => (
          <Box
            key={etapa}
            sx={{
              px: { sm: 2.5 },
              py: { xs: 0.4, sm: 1.4 },
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              borderRight: { sm: '1px solid rgba(230,242,177,0.06)' },
              '&::before': {
                content: { xs: `"${ETAPA_LABEL[etapa]}: "`, sm: '""' },
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 400,
                color: 'rgba(255,255,255,0.4)',
                fontSize: '0.72rem',
              },
            }}
          >
            <PrecioCelda
              total={p!.precioPorEtapa![etapa]}
              cu={p!.integrantes > 1 ? p!.precioPorEtapa![etapa] / p!.integrantes : undefined}
            />
          </Box>
        ))
      )}

      <Box
        sx={{
          px: { sm: 2.5 },
          py: { xs: 0.4, sm: 1.6 },
          display: 'flex',
          alignItems: 'center',
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: '0.72rem',
          fontWeight: 800,
          letterSpacing: '0.04em',
          color: msi ? '#E6F2B1' : 'rgba(255,255,255,0.3)',
          '&::before': {
            content: { xs: '"MSI: "', sm: '""' },
            fontWeight: 400,
            color: 'rgba(255,255,255,0.4)',
            fontSize: '0.72rem',
          },
        }}
      >
        {msi ? '✓ 3 MSI' : '—'}
      </Box>
    </Box>
  )
}

function EtapasDePrecio() {
  return (
    <Box
      component="section"
      id="precios"
      sx={{
        py: { xs: 7, md: 9 },
        bgcolor: '#111111',
        borderTop: '1px solid rgba(230,242,177,0.12)',
        borderBottom: '1px solid rgba(230,242,177,0.12)',
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h2"
          component="h2"
          sx={{
            textAlign: 'center',
            mb: 2,
            fontWeight: 900,
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.3rem' },
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            fontFamily: "'Space Grotesk', sans-serif",
            color: '#E6F2B1',
          }}
        >
          Asegura tu lugar al mejor precio
        </Typography>
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            maxWidth: 620,
            mx: 'auto',
            mb: { xs: 5, md: 6 },
            fontSize: { xs: '0.95rem', sm: '1.05rem' },
            lineHeight: 1.7,
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          Cada etapa tiene un precio distinto. Al avanzar las etapas, el costo aumenta. Si ya
          decidiste asistir, comprar antes significa pagar menos.
        </Typography>

        <Box
          sx={{
            border: '1px solid rgba(230,242,177,0.2)',
            overflow: 'hidden',
            mb: 3,
          }}
        >
          {/* Header (desktop only — mobile uses inline labels per cell) */}
          <Box
            sx={{
              display: { xs: 'none', sm: 'grid' },
              gridTemplateColumns: '1.5fr 1fr 1fr 1fr 0.9fr',
              borderBottom: '1px solid rgba(230,242,177,0.2)',
              bgcolor: 'rgba(230,242,177,0.05)',
            }}
          >
            {['Categoría', 'Lanzamiento', 'Preventa', 'Regular', 'MSI'].map((h) => (
              <Box
                key={h}
                sx={{
                  px: 2.5,
                  py: 1.5,
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: '#E6F2B1',
                  textTransform: 'uppercase',
                  letterSpacing: '0.12em',
                }}
              >
                {h}
              </Box>
            ))}
          </Box>

          {TABLA_PRECIOS_GRUPOS.map((grupo) => (
            <Box key={grupo.bloque}>
              <Box
                sx={{
                  px: { xs: 2, sm: 2.5 },
                  py: 0.85,
                  bgcolor: 'rgba(255,255,255,0.03)',
                  borderBottom: '1px solid rgba(230,242,177,0.08)',
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontWeight: 900,
                    fontSize: '0.68rem',
                    letterSpacing: '0.15em',
                    color: grupo.color,
                    textTransform: 'uppercase',
                  }}
                >
                  {grupo.bloque}
                </Typography>
              </Box>
              {grupo.filas.map((fila) => (
                <FilaPrecioTabla key={fila.categoria} fila={fila} />
              ))}
            </Box>
          ))}
        </Box>

        <Typography
          variant="body2"
          sx={{
            textAlign: 'center',
            color: '#E6F2B1',
            fontWeight: 700,
            mb: 1,
            fontSize: { xs: '0.8rem', sm: '0.85rem' },
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          ✓ 3 meses sin intereses disponibles en categorías seleccionadas.
        </Typography>
        <Typography
          variant="caption"
          sx={{
            display: 'block',
            textAlign: 'center',
            color: 'rgba(255,255,255,0.5)',
            mb: 4,
            fontSize: '0.72rem',
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          Los precios se actualizan conforme cambia cada etapa de venta.
        </Typography>

        <Box sx={{ textAlign: 'center' }}>
          <Button
            component="a"
            href="#experience"
            variant="outlined"
            sx={{
              borderRadius: 0,
              borderWidth: 2,
              borderColor: '#E6F2B1',
              color: '#E6F2B1',
              fontWeight: 700,
              minHeight: 44,
              '&:hover': { borderWidth: 2, borderColor: '#E6F2B1', bgcolor: '#E6F2B11A' },
              '&:focus-visible': { outline: '3px solid #E6F2B1', outlineOffset: 2 },
            }}
          >
            Ver categorías
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

// ── Premios por día (misma estructura que la landing B) ──
interface PrizeRow {
  lugar: string
  premio: number
}

const INDIVIDUAL_PRIZES: PrizeRow[] = [
  { lugar: '1°', premio: 5000 },
  { lugar: '2°', premio: 3000 },
  { lugar: '3°', premio: 2000 },
]

const DOBLES_PRIZES: PrizeRow[] = [
  { lugar: '1°', premio: 7000 },
  { lugar: '2°', premio: 5000 },
  { lugar: '3°', premio: 3000 },
]

function PrizeTable({ title, rows, accentColor = '#E6F2B1' }: { title: string; rows: PrizeRow[]; accentColor?: string }) {
  return (
    <Box sx={{ flex: 1, minWidth: 220 }}>
      <Typography
        variant="overline"
        sx={{
          display: 'block',
          textAlign: 'center',
          color: accentColor,
          fontWeight: 700,
          letterSpacing: '0.15em',
          fontSize: '0.75rem',
          mb: 1.5,
          fontFamily: "'Space Grotesk', sans-serif",
        }}
      >
        {title}
      </Typography>
      <Box
        component="table"
        sx={{
          width: '100%',
          borderCollapse: 'collapse',
          fontFamily: "'Space Grotesk', sans-serif",
          '& td': {
            textAlign: 'center',
            py: 1,
            px: 1,
            borderBottom: '1px solid rgba(230,242,177,0.12)',
            fontSize: '0.9rem',
            color: 'rgba(255,255,255,0.85)',
          },
          '& td:first-of-type': { textAlign: 'left', fontWeight: 700, color: accentColor },
          '& td:last-of-type': { textAlign: 'right', fontWeight: 700, color: '#fff' },
        }}
      >
        <tbody>
          {rows.map((row) => (
            <tr key={row.lugar}>
              <td>{row.lugar}</td>
              <td>{formatPrecio(row.premio)}</td>
            </tr>
          ))}
        </tbody>
      </Box>
    </Box>
  )
}

function ReconocimientoLine({ align = 'center' }: { align?: 'left' | 'center' }) {
  return (
    <Typography
      sx={{
        textAlign: align,
        color: 'rgba(255,255,255,0.55)',
        fontSize: '0.78rem',
        fontStyle: 'italic',
        mt: align === 'left' ? 1 : 0,
        mb: 2.5,
        fontFamily: "'Space Grotesk', sans-serif",
      }}
    >
      Reconocimiento y premios a los mejores tiempos por categoría.
    </Typography>
  )
}

// ── ¿Por qué perteneces aquí? ─────────────────────────────────────
interface Beneficio {
  icon: ReactNode
  texto: string
}

const BENEFICIOS: Beneficio[] = [
  { icon: <Inventory2Icon />, texto: 'Kit oficial del evento.' },
  { icon: <TimerIcon />, texto: 'Chip de cronometraje.' },
  { icon: <HealthAndSafetyIcon />, texto: 'Seguro para competidores.' },
  { icon: <MedicalServicesIcon />, texto: 'Asistencia médica durante el evento.' },
  { icon: <SpaIcon />, texto: 'Zona de recovery y experiencias wellness.' },
  {
    icon: <StadiumIcon />,
    texto:
      'Las instalaciones de Club Cumbres, el escenario donde la comunidad HYBRID EXPERIENCE se reúne para desafiar sus propios límites.',
  },
]

const MANIFIESTO_INTRO = [
  'El deporte híbrido está transformando la forma de entrenar, competir y conectar.',
  'HYBRID EXPERIENCE reúne a quienes ya viven este deporte, a quienes sueñan con competir por primera vez y a quienes entienden que el verdadero reto siempre es convertirse en una mejor versión de sí mismos.',
  'Aquí no importa si buscas tu mejor marca, tu primera meta o simplemente vivir una experiencia diferente.',
]
const MANIFIESTO_NO_IMPORTA = ['No importa tu edad.', 'No importa tu experiencia.']
const MANIFIESTO_DESTACADO = 'No importa de dónde vienes. Lo importante es que hoy perteneces.'
const MANIFIESTO_CIERRE = [
  'Cada entrenamiento suma.',
  'Cada meta inspira.',
  'Cada historia fortalece esta comunidad.',
  'Porque HYBRID EXPERIENCE no es solo un evento.',
  'Es un movimiento que crece con cada persona que decide aceptar el reto.',
]
const MANIFIESTO_CTA_LINE = 'Únete a la comunidad HYBRID EXPERIENCE.'

function PorQuePerteneces() {
  return (
    <Box
      component="section"
      id="comunidad"
      sx={{
        py: { xs: 8, md: 12 },
        background: 'linear-gradient(180deg, #000000 0%, rgba(230,242,177,0.04) 50%, #000000 100%)',
      }}
    >
      <Container maxWidth="md">
        <Typography
          variant="h2"
          component="h2"
          sx={{
            textAlign: 'center',
            fontWeight: 900,
            fontSize: { xs: '1.8rem', sm: '2.4rem', md: '2.8rem' },
            textTransform: 'uppercase',
            letterSpacing: '0.02em',
            fontFamily: "'Space Grotesk', sans-serif",
            color: '#E6F2B1',
            mb: 1,
          }}
        >
          ¿Por qué perteneces aquí?
        </Typography>
        <Typography
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            fontSize: { xs: '0.8rem', sm: '0.9rem' },
            mb: { xs: 6, md: 8 },
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          Más que una inscripción. Una experiencia.
        </Typography>

        {/* Sub-bloque A — todo lo que incluye tu experiencia */}
        <Typography
          variant="body1"
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            maxWidth: 640,
            mx: 'auto',
            mb: 4,
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: { xs: '0.95rem', sm: '1.05rem' },
            lineHeight: 1.7,
          }}
        >
          Tu inscripción incluye todo lo necesario para que vivas HYBRID EXPERIENCE al máximo:
        </Typography>
        <Grid container spacing={2.5} sx={{ mb: { xs: 6, md: 8 } }}>
          {BENEFICIOS.map((b) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={b.texto}>
              <Box
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 1.75,
                  p: { xs: 2.5, sm: 3 },
                  border: '1px solid rgba(230,242,177,0.18)',
                  transition: 'border-color 0.15s ease, transform 0.15s ease',
                  '&:hover': { borderColor: '#E6F2B1', transform: 'translateY(-2px)' },
                }}
              >
                <Box sx={{ color: '#E6F2B1', display: 'flex', flexShrink: 0, mt: 0.25 }}>
                  {b.icon}
                </Box>
                <Typography
                  sx={{
                    color: 'rgba(255,255,255,0.85)',
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: { xs: '0.88rem', sm: '0.92rem' },
                    lineHeight: 1.5,
                  }}
                >
                  {b.texto}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>

        {/* Puente */}
        <Stack spacing={0.5} sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Typography
            sx={{
              color: '#E6F2B1',
              fontWeight: 800,
              fontSize: { xs: '1.05rem', sm: '1.25rem' },
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Pero lo más importante no viene dentro del kit.
          </Typography>
          <Typography
            sx={{
              color: '#E6F2B1',
              fontWeight: 800,
              fontSize: { xs: '1.05rem', sm: '1.25rem' },
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Viene con las personas que estarán a tu lado.
          </Typography>
        </Stack>

        {/* Sub-bloque B — más que una competencia, una comunidad */}
        <Typography
          sx={{
            textAlign: 'center',
            fontWeight: 900,
            color: '#ffffff',
            textTransform: 'uppercase',
            letterSpacing: '0.03em',
            fontSize: { xs: '1.1rem', sm: '1.4rem' },
            mb: 3,
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          Más que una competencia. Una comunidad.
        </Typography>

        <Stack spacing={1.75} sx={{ maxWidth: 680, mx: 'auto', mb: 4 }}>
          {MANIFIESTO_INTRO.map((line) => (
            <Typography
              key={line}
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: { xs: '0.9rem', sm: '1rem' },
                lineHeight: 1.7,
              }}
            >
              {line}
            </Typography>
          ))}
        </Stack>

        <Stack spacing={0.5} sx={{ textAlign: 'center', mb: 4 }}>
          {MANIFIESTO_NO_IMPORTA.map((line) => (
            <Typography
              key={line}
              sx={{
                color: 'rgba(255,255,255,0.75)',
                fontWeight: 700,
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: { xs: '0.95rem', sm: '1.05rem' },
              }}
            >
              {line}
            </Typography>
          ))}
        </Stack>

        <Box
          sx={{
            maxWidth: 680,
            mx: 'auto',
            mb: 4,
            py: { xs: 2.5, sm: 3 },
            px: { xs: 2.5, sm: 4 },
            borderLeft: { xs: '4px solid #E6F2B1', sm: 'none' },
            borderTop: { sm: '2px solid #E6F2B1' },
            borderBottom: { sm: '2px solid #E6F2B1' },
            textAlign: 'center',
          }}
        >
          <Typography
            sx={{
              color: '#E6F2B1',
              fontWeight: 900,
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: { xs: '1.15rem', sm: '1.5rem', md: '1.7rem' },
              lineHeight: 1.4,
              letterSpacing: '0.01em',
            }}
          >
            {MANIFIESTO_DESTACADO}
          </Typography>
        </Box>

        <Stack spacing={1.75} sx={{ maxWidth: 680, mx: 'auto', mb: 3 }}>
          {MANIFIESTO_CIERRE.map((line) => (
            <Typography
              key={line}
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: { xs: '0.9rem', sm: '1rem' },
                lineHeight: 1.7,
              }}
            >
              {line}
            </Typography>
          ))}
        </Stack>

        <Typography
          sx={{
            textAlign: 'center',
            color: '#ffffff',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            fontSize: { xs: '1rem', sm: '1.2rem' },
            mb: { xs: 5, md: 6 },
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          {MANIFIESTO_CTA_LINE}
        </Typography>

        <Box sx={{ textAlign: 'center' }}>
          <Button
            component="a"
            href="#experience"
            variant="outlined"
            sx={{
              borderRadius: 0,
              borderWidth: 2,
              borderColor: '#E6F2B1',
              color: '#E6F2B1',
              fontWeight: 700,
              minHeight: 44,
              '&:hover': { borderWidth: 2, borderColor: '#E6F2B1', bgcolor: '#E6F2B11A' },
              '&:focus-visible': { outline: '3px solid #E6F2B1', outlineOffset: 2 },
            }}
          >
            Ver categorías
          </Button>
        </Box>
      </Container>
    </Box>
  )
}

// ── Sales status banner (visible while registration isn't open) ──
function SalesStatusBanner() {
  if (SALES_CONFIG.status === 'open') return null
  const text = SALES_CONFIG.status === 'coming_soon' ? SALES_CONFIG.openingLabel : 'Inscripciones cerradas'
  return (
    <Box
      sx={{
        bgcolor: '#E6F2B1',
        color: '#000000',
        textAlign: 'center',
        py: 1,
        px: 2,
        fontFamily: "'Space Grotesk', sans-serif",
        fontWeight: 800,
        fontSize: { xs: '0.7rem', sm: '0.8rem' },
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
      }}
    >
      {text}
    </Box>
  )
}

export default function LandingPage() {
  const targetDate = useMemo(() => new Date('2026-11-13T17:00:00'), [])
  const timeLeft = useCountdown(targetDate)
  const [showBackToTop, setShowBackToTop] = useState(false)

  useEffect(() => {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.text = JSON.stringify(EVENT_JSON_LD)
    document.head.appendChild(script)
    return () => {
      document.head.removeChild(script)
    }
  }, [])

  useEffect(() => {
    const onScroll = () => setShowBackToTop(window.scrollY > 800)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <Box>
      <Navbar />
      <SalesStatusBanner />
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
          backgroundImage: {
            xs: `linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,1) 100%), url(${IMG_HERO_400})`,
            sm: `linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,1) 100%), url(${IMG_HERO_800})`,
            md: `linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, rgba(0,0,0,1) 100%), url(${IMG_HERO_1248})`,
          },
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
        <Box component="h1" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1, m: 0 }}>
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
          <Box component="span" sx={{ fontSize: 0, lineHeight: 0 }}> </Box>
          <Typography
            variant="h1"
            component="span"
            sx={{
              fontSize: { xs: 'calc(2.2rem + 3px)', sm: 'calc(3.6rem + 3px)', md: 'calc(5.2rem + 3px)' },
              fontWeight: 900,
              fontFamily: 'tt-norms-pro-extra-black-italic, sans-serif',
              fontStyle: 'italic',
              letterSpacing: '-0.03em',
              lineHeight: 1,
              color: '#E6F2B1',
            }}
          >
            EXPERIENCE
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
          component="a"
          href="#elige-tu-experiencia"
          variant="contained"
          color="primary"
          size="large"
          sx={{
            px: 5,
            py: 1.5,
            fontSize: { xs: '1rem', sm: '1.1rem' },
            mb: 3,
            '&:focus-visible': { outline: '3px solid #E6F2B1', outlineOffset: 3 },
          }}
        >
          Elige tu experiencia
        </Button>

        <Typography
          variant="body2"
          sx={{ color: 'text.secondary', letterSpacing: '0.15em', textTransform: 'uppercase' }}
        >
          13-15 NOVIEMBRE 2026 • MÉRIDA YUCATÁN
        </Typography>
      </Box>

      <EligeTuExperiencia />
      <OrganizerStrip />

      {/* ===== QUÉ ES EL DEPORTE HÍBRIDO ===== */}
      <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'background.default' }}>
        <Container maxWidth="md">
          <Typography
            variant="h2"
            sx={{ textAlign: 'center', mb: 3, fontFamily: "'Space Grotesk', sans-serif" }}
          >
            ¿Qué es el deporte híbrido?
          </Typography>
          <Stack spacing={2} sx={{ maxWidth: 640, mx: 'auto', mb: 5 }}>
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                fontSize: { xs: '1rem', sm: '1.1rem' },
                lineHeight: 1.7,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Una competencia continua: corres, entras a una estación de trabajo funcional,
              y vuelves a correr. Sin pausas entre segmentos.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                fontSize: { xs: '1rem', sm: '1.1rem' },
                lineHeight: 1.7,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Se mide en tiempo total. El que termina primero — corriendo y trabajando —
              gana.
            </Typography>
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                color: '#E6F2B1',
                fontWeight: 700,
                fontSize: { xs: '1rem', sm: '1.1rem' },
                lineHeight: 1.7,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Esto es deporte híbrido: resistencia y fuerza puestas a prueba en el mismo reloj. El reto completo.
            </Typography>
          </Stack>

          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              mb: 2.5,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              fontSize: '0.75rem',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Elige tu nivel de entrada
          </Typography>
          <Grid container spacing={2}>
            {[
              { label: 'Workout', desc: 'Probar el deporte, sin cronómetro.', href: '#experience' },
              { label: '½ Hybrid', desc: 'Competir de verdad, volumen accesible.', href: '#experience' },
              { label: 'Hybrid completo', desc: 'El reto real. Individual, Dobles o Relay.', href: '#compite' },
            ].map((nivel) => (
              <Grid size={{ xs: 12, sm: 4 }} key={nivel.label}>
                <Box
                  component="a"
                  href={nivel.href}
                  sx={{
                    display: 'block',
                    textAlign: 'center',
                    p: 3,
                    height: '100%',
                    border: '1px solid rgba(230, 242, 177, 0.2)',
                    textDecoration: 'none',
                    transition: 'border-color 0.15s ease, transform 0.15s ease',
                    '&:hover': { borderColor: '#E6F2B1', transform: 'translateY(-2px)' },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 900,
                      color: '#E6F2B1',
                      fontFamily: "'Space Grotesk', sans-serif",
                      letterSpacing: '0.02em',
                      mb: 0.5,
                      textTransform: 'uppercase',
                    }}
                  >
                    {nivel.label}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', fontFamily: "'Space Grotesk', sans-serif" }}
                  >
                    {nivel.desc}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      <EtapasDePrecio />
      <PorQuePerteneces />

      {/* ===== EXPERIENCE SECTION ===== */}
      <Box
        id="experience"
        sx={{
          py: { xs: 8, md: 12 },
          background: 'linear-gradient(180deg, #000000 0%, rgba(230,242,177,0.05) 50%, #000000 100%)',
        }}
      >
        <Container maxWidth="lg">
          <SectionHeading label="EXPERIENCE" />
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              mb: { xs: 5, md: 7 },
              maxWidth: 620,
              mx: 'auto',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            La puerta de entrada al deporte híbrido. Para quien nunca ha competido — y para
            quien quiere hacerlo de verdad, en volumen accesible.
          </Typography>

          {/* B) Workout Experience — conversion product, most prominent treatment */}
          <Box
            sx={{
              mb: { xs: 6, md: 8 },
              p: { xs: 3, sm: 4, md: 5 },
              border: '2px solid #E6F2B1',
              position: 'relative',
              background:
                'linear-gradient(135deg, rgba(230,242,177,0.1) 0%, rgba(0,0,0,0.5) 100%)',
              boxShadow: '0 0 40px rgba(230,242,177,0.08)',
            }}
          >
            <Box sx={{ position: 'absolute', top: 8, right: 8 }}>
              <CornerBrackets size={16} />
            </Box>
            <Chip
              icon={<BoltIcon sx={{ fontSize: '1rem !important', color: '#000000 !important' }} />}
              label="EMPIEZA AQUÍ"
              sx={{
                mb: 2,
                bgcolor: '#E6F2B1',
                color: '#000000',
                fontWeight: 900,
                fontSize: '0.7rem',
                letterSpacing: '0.1em',
                borderRadius: 0,
              }}
            />
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                gap: { xs: 4, md: 6 },
                alignItems: { md: 'center' },
              }}
            >
              <Box sx={{ flex: 1.2 }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 900,
                    color: '#E6F2B1',
                    fontFamily: "'Space Grotesk', sans-serif",
                    letterSpacing: '0.01em',
                    fontSize: { xs: '1.5rem', sm: '2rem', md: '2.3rem' },
                    mb: 1,
                    textTransform: 'uppercase',
                  }}
                >
                  Conoce el deporte híbrido: haz el workout
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: '#E6F2B1',
                    fontWeight: 700,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    fontSize: '0.8rem',
                    mb: 2,
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  Sábado 14 · Día completo · {formatPrecio(350)}
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'text.secondary',
                    fontFamily: "'Space Grotesk', sans-serif",
                    lineHeight: 1.8,
                    fontSize: { xs: '0.9rem', sm: '1rem' },
                  }}
                >
                  {FORMATO_DESCRIPCIONES['Workout Experience']}
                </Typography>
                <ReconocimientoLine align="left" />
              </Box>
              <Grid container spacing={2} sx={{ flex: 1, justifyContent: 'center' }}>
                {WORKOUT_PRODUCTS.map((producto) => (
                  <Grid size={{ xs: 6 }} key={producto.code}>
                    <ProductCard producto={producto} />
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Box>

          {/* A) ½ Hybrid */}
          <Box>
            <Typography
              variant="h4"
              sx={{
                textAlign: 'center',
                fontWeight: 900,
                color: '#E6F2B1',
                fontFamily: "'Space Grotesk', sans-serif",
                letterSpacing: '0.02em',
                fontSize: { xs: '1.3rem', sm: '1.8rem', md: '2.1rem' },
                mb: 0.5,
                textTransform: 'uppercase',
              }}
            >
              Vive la Experience ½ Hybrid
            </Typography>
            <Typography
              variant="body2"
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                fontSize: '0.75rem',
                mb: 1,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Formato by ENFORMA · Sábado 14 Día completo
            </Typography>
            <Typography
              variant="body1"
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                mb: 4,
                maxWidth: 560,
                mx: 'auto',
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: { xs: '0.9rem', sm: '1rem' },
              }}
            >
              {FORMATO_DESCRIPCIONES['½ Hybrid Individual']}
            </Typography>
            <ReconocimientoLine />
            <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
              {HALF_HYBRID_PRODUCTS.map((producto) => (
                <Grid size={{ xs: 6, sm: 4 }} key={producto.code}>
                  <ProductCard producto={producto} />
                </Grid>
              ))}
            </Grid>
          </Box>
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
            {OPEN_DATA.map((row, i) => (
              <Box
                key={i}
                sx={{
                  display: { xs: 'flex', sm: 'grid' },
                  flexDirection: { xs: 'column', sm: 'row' },
                  gridTemplateColumns: { sm: '1fr 120px 110px' },
                  borderBottom:
                    i < OPEN_DATA.length - 1
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
              Hybrid Experience exige estrategia. Cada atleta debe calcular cómo
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
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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

            {/* Doubles */}
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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

      {/* ===== TRES DÍAS (TIMELINE) ===== */}
      <Box
        sx={{
          py: { xs: 8, md: 12 },
          background: 'linear-gradient(180deg, #000000 0%, rgba(230,242,177,0.03) 50%, #000000 100%)',
        }}
      >
        <Container maxWidth="md">
          <SectionHeading label="TRES DÍAS" />
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
            Qué pasa cada día.
          </Typography>

          <Stack spacing={0}>
            {TRES_DIAS.map((dia, i) => (
              <Box
                key={dia.titulo}
                sx={{
                  display: 'flex',
                  gap: { xs: 2, sm: 3 },
                  py: { xs: 3, sm: 3.5 },
                  borderTop: i === 0 ? '1px solid rgba(230,242,177,0.15)' : 'none',
                  borderBottom: '1px solid rgba(230,242,177,0.15)',
                }}
              >
                <Box sx={{ flexShrink: 0, width: { xs: 76, sm: 120 } }}>
                  <Typography
                    sx={{
                      color: '#E6F2B1',
                      fontWeight: 900,
                      fontSize: { xs: '0.75rem', sm: '0.9rem' },
                      letterSpacing: '0.05em',
                      lineHeight: 1.3,
                      fontFamily: "'Space Grotesk', sans-serif",
                    }}
                  >
                    {dia.fecha}
                  </Typography>
                  <Typography
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 700,
                      fontSize: { xs: '0.7rem', sm: '0.8rem' },
                      letterSpacing: '0.1em',
                      fontFamily: "'JetBrains Mono', monospace",
                    }}
                  >
                    {dia.sesion}
                  </Typography>
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 900,
                      color: '#FFFFFF',
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: { xs: '1rem', sm: '1.15rem' },
                      mb: 0.5,
                      textTransform: 'uppercase',
                    }}
                  >
                    {dia.titulo}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      fontFamily: "'Space Grotesk', sans-serif",
                      fontSize: { xs: '0.85rem', sm: '0.9rem' },
                      lineHeight: 1.7,
                      mb: 1.5,
                    }}
                  >
                    {dia.texto}
                  </Typography>
                  <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
                    {dia.links.map((link) => (
                      <Box
                        key={link.label}
                        component="a"
                        href={link.href}
                        sx={{
                          color: '#E6F2B1',
                          fontFamily: "'Space Grotesk', sans-serif",
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          letterSpacing: '0.02em',
                          textDecoration: 'none',
                          borderBottom: '1px solid rgba(230,242,177,0.4)',
                          '&:hover': { borderBottomColor: '#E6F2B1' },
                        }}
                      >
                        {link.label} →
                      </Box>
                    ))}
                  </Stack>
                </Box>
              </Box>
            ))}
          </Stack>
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
          <SectionHeading label="COMPITE" />
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

          {COMPITE_GROUPS.map((group) => {
            const etapaVigente = resolveEtapaComercial() ?? 'lanzamiento'
            const precioVigente = getPrecioVigente(group.productos[0], etapaVigente)
            return (
            <Box key={group.key} id={group.id} sx={{ mb: { xs: 5, md: 6 }, scrollMarginTop: '80px' }}>
              <Typography
                variant="overline"
                sx={{
                  display: 'block',
                  textAlign: 'center',
                  color: '#E6F2B1',
                  fontWeight: 700,
                  letterSpacing: '0.15em',
                  fontSize: '0.75rem',
                  mb: 1,
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {`${DIA_FECHA[group.dia]} · ${SESION_LABEL[group.sesion] ?? group.sesion} · ${group.tipo.toUpperCase()} · ${formatPrecio(precioVigente)} ${unidadConPrecioVigente(group.productos[0], precioVigente)}`}
              </Typography>
              {FORMATO_DESCRIPCIONES[group.tipo] && (
                <Typography
                  variant="body2"
                  sx={{
                    textAlign: 'center',
                    color: 'text.secondary',
                    maxWidth: 560,
                    mx: 'auto',
                    mb: 2.5,
                    fontSize: '0.85rem',
                    lineHeight: 1.6,
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {FORMATO_DESCRIPCIONES[group.tipo]}
                </Typography>
              )}
              {group.tipo === 'Relay' && <ReconocimientoLine />}
              <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
                {group.productos.map((producto) => (
                  <Grid size={{ xs: 6, sm: 4, md: 3 }} key={producto.code}>
                    <ProductCard producto={producto} />
                  </Grid>
                ))}
              </Grid>
            </Box>
            )
          })}

          <Typography
            sx={{
              textAlign: 'center',
              color: 'rgba(255,255,255,0.85)',
              fontWeight: 600,
              fontSize: { xs: '0.95rem', sm: '1.05rem' },
              lineHeight: 1.6,
              maxWidth: 560,
              mx: 'auto',
              mt: 4,
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Los heats y horarios de cada categoría se definen según el volumen de inscripciones.
            Los cupos son limitados por categoría: inscribirte a tiempo asegura tu lugar.
          </Typography>
        </Container>
      </Box>

      {/* ===== PREMIOS SECTION ===== */}
      <Box
        id="premios"
        sx={{
          py: { xs: 8, md: 12 },
          background: 'linear-gradient(180deg, #000000 0%, rgba(230,242,177,0.04) 100%)',
        }}
      >
        <Container maxWidth="md">
          <SectionHeading label="PREMIOS" />
          <Typography
            variant="body1"
            sx={{
              textAlign: 'center',
              color: '#fff',
              fontWeight: 700,
              mb: 6,
              maxWidth: 560,
              mx: 'auto',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Más de {formatPrecio(60000)} en premios en efectivo
          </Typography>

          {/* VIERNES */}
          <Typography
            variant="overline"
            sx={{
              display: 'block',
              textAlign: 'center',
              color: 'text.secondary',
              fontWeight: 700,
              letterSpacing: '0.15em',
              fontSize: '0.7rem',
              mb: 3,
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Viernes 13 — Vespertino
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} sx={{ mb: 6 }}>
            <PrizeTable title="INDIVIDUAL MUJERES OPEN" rows={INDIVIDUAL_PRIZES} />
            <PrizeTable title="INDIVIDUAL HOMBRES OPEN" rows={INDIVIDUAL_PRIZES} />
          </Stack>

          {/* SÁBADO */}
          <Typography
            variant="overline"
            sx={{
              display: 'block',
              textAlign: 'center',
              color: 'text.secondary',
              fontWeight: 700,
              letterSpacing: '0.15em',
              fontSize: '0.7rem',
              mb: 3,
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Sábado 14 — Día completo
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} sx={{ mb: 3 }}>
            <PrizeTable title="DOBLES MUJERES OPEN" rows={DOBLES_PRIZES} />
            <PrizeTable title="DOBLES HOMBRES OPEN" rows={DOBLES_PRIZES} />
            <PrizeTable title="DOBLES MIXTOS OPEN" rows={DOBLES_PRIZES} />
          </Stack>
          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              fontSize: '0.85rem',
              maxWidth: 480,
              mx: 'auto',
              mb: 6,
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            ½ Hybrid y Workout: reconocimiento y kit para todos los participantes.
          </Typography>

          {/* DOMINGO */}
          <Typography
            variant="overline"
            sx={{
              display: 'block',
              textAlign: 'center',
              color: 'text.secondary',
              fontWeight: 700,
              letterSpacing: '0.15em',
              fontSize: '0.7rem',
              mb: 1.5,
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Domingo 15 — Matutino
          </Typography>
          <Typography
            variant="body2"
            sx={{
              textAlign: 'center',
              color: 'text.secondary',
              fontSize: '0.85rem',
              maxWidth: 480,
              mx: 'auto',
              fontFamily: "'Space Grotesk', sans-serif",
            }}
          >
            Relay: reconocimiento y premios a los mejores tiempos por categoría.
          </Typography>
        </Container>
      </Box>

      {SIMULACRO_PRO_ACTIVE && <SimulacroProSection />}

      {/* ===== ASISTE SECTION ===== */}
      <Box id="asiste" sx={{ py: { xs: 8, md: 12 }, bgcolor: '#111111' }}>
        <Container maxWidth="lg">
          <SectionHeading label="ASISTE" color="#E9C7DF" />
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
            Vive la Hybrid Experience 2026 desde dentro, sin competir.
          </Typography>

          {/* Público */}
          <Box sx={{ mb: { xs: 6, md: 7 } }}>
            <Typography
              variant="overline"
              sx={{
                display: 'block',
                textAlign: 'center',
                color: '#E9C7DF',
                fontWeight: 700,
                letterSpacing: '0.15em',
                fontSize: '0.75rem',
                mb: 0.5,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {`PÚBLICO · ${formatPrecio(250)} POR DÍA`}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                textAlign: 'center',
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.8rem',
                mb: 2.5,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Compra el día en que compite tu atleta.
            </Typography>
            <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
              {PUBLICO_PRODUCTS.map((producto) => (
                <Grid size={{ xs: 6, sm: 3 }} key={producto.code}>
                  <ProductCard producto={producto} accentColor="#E9C7DF" />
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Fotógrafo */}
          <Box>
            <Typography
              variant="overline"
              sx={{
                display: 'block',
                textAlign: 'center',
                color: '#E9C7DF',
                fontWeight: 700,
                letterSpacing: '0.15em',
                fontSize: '0.75rem',
                mb: 0.5,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              {`FOTÓGRAFO · ${formatPrecio(350)} POR DÍA`}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                textAlign: 'center',
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.8rem',
                mb: 2.5,
                fontFamily: "'Space Grotesk', sans-serif",
              }}
            >
              Acreditación para fotógrafos externos.
            </Typography>
            <Grid container spacing={2} sx={{ justifyContent: 'center' }}>
              {FOTOGRAFO_PRODUCTS.map((producto) => (
                <Grid size={{ xs: 6, sm: 3 }} key={producto.code}>
                  <ProductCard producto={producto} accentColor="#E9C7DF" />
                </Grid>
              ))}
            </Grid>
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
          {/* Section kicker — semantic H2 for SEO hierarchy */}
          <Typography
            variant="h2"
            component="h2"
            sx={{
              textAlign: 'center',
              fontWeight: 700,
              fontSize: { xs: '0.75rem', sm: '0.85rem' },
              color: 'text.secondary',
              fontFamily: "'Space Grotesk', sans-serif",
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              mb: 1.5,
            }}
          >
            Sede y fechas
          </Typography>
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
              backgroundImage: {
                xs: `url(${IMG_VENUE_400})`,
                sm: `url(${IMG_VENUE_800})`,
                md: `url(${IMG_VENUE_907})`,
              },
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
              {/* HYBRID EXPERIENCE — big lime institutional (decorative repeat, not a heading: the page H1 lives in the hero) */}
              <Typography
                variant="h1"
                component="p"
                sx={{
                  fontWeight: 900,
                  fontFamily: 'tt-norms-pro-extra-black-italic, sans-serif',
                  fontStyle: 'italic',
                  fontSize: { xs: '2.1rem', sm: '3.6rem', md: '4.8rem' },
                  lineHeight: 1,
                  color: '#E6F2B1',
                  letterSpacing: '-0.03em',
                  mb: 0.5,
                  textTransform: 'uppercase',
                }}
              >
                HYBRID EXPERIENCE
              </Typography>

              {/* Date — pink institutional (stylistic, not a heading) */}
              <Typography
                variant="h2"
                component="p"
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
                13-15 NOV
              </Typography>

              {/* Venue name */}
              <Typography
                variant="h1"
                component="h3"
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
                component="p"
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
                  <li>Comparte tu experiencia en redes sociales y etiqueta a @enforma.sports_.</li>
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
                    component="div"
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
            EXPERIENCE
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
            href="https://www.instagram.com/enforma.sports_/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram de ENFORMA Sports Society"
          >
            <InstagramIcon />
          </IconButton>
        </Stack>

        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          © 2026 EnForma Sports Society. Todos los derechos reservados.
        </Typography>
      </Box>

      {/* Back to top — appears once the user has scrolled past the hero, so a long page never leaves them stranded */}
      {showBackToTop && (
        <Box
          component="a"
          href="#hero"
          aria-label="Volver arriba"
          sx={{
            position: 'fixed',
            bottom: 24,
            left: 24,
            zIndex: 1200,
            width: 48,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: '#000000',
            border: '2px solid #E6F2B1',
            boxShadow: '0 0 16px rgba(0,0,0,0.6)',
            transition: 'transform 150ms, background-color 150ms',
            '&:hover': { bgcolor: '#111111', transform: 'translateY(-2px)' },
            '&:focus-visible': { outline: '3px solid #E6F2B1', outlineOffset: 3 },
          }}
        >
          <ArrowUp size={20} />
        </Box>
      )}

      {/* Floating CTA - Elige tu experiencia */}
      <Box
        component="a"
        href="#elige-tu-experiencia"
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
          textDecoration: 'none',
          border: '2px solid #E6F2B1',
          boxShadow: '0 0 24px rgba(230,242,177,0.3)',
          transition: 'box-shadow 200ms, transform 200ms',
          animation: 'pulseGlow 2s ease-in-out infinite',
          '@keyframes pulseGlow': {
            '0%, 100%': { boxShadow: '0 0 24px rgba(230,242,177,0.3)', transform: 'scale(1)' },
            '50%': { boxShadow: '0 0 40px rgba(230,242,177,0.6)', transform: 'scale(1.05)' },
          },
          '@media (prefers-reduced-motion: reduce)': {
            animation: 'none',
          },
          '&:hover': {
            boxShadow: '0 0 48px rgba(230,242,177,0.8)',
            transform: 'scale(1.05)',
          },
          '&:focus-visible': {
            outline: '3px solid #FFFFFF',
            outlineOffset: 3,
          },
          display: { xs: 'flex', sm: 'flex' },
          alignItems: 'center',
          gap: 1,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}
      >
        <Box sx={{ fontSize: '1.2rem', lineHeight: 1 }}>🏆</Box>
        Elige tu experiencia
      </Box>
    </Box>
  )
}