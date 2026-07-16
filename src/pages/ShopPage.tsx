import { useNavigate } from '@tanstack/react-router'
import { Box, Card, CardContent, Container, Typography, Badge, Fab, IconButton } from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { useCartStore } from '../store/cartStore'

const BRAND_FONT = 'tt-norms-pro-extra-black-italic, serif'
const MONO_FONT = '"Space Grotesk", monospace'

const PRODUCT_IMAGES: Record<string, string> = {
  '1': 'https://images.unsplash.com/photo-1581515302716-69279fa6fdc0?w=600&q=80',
  '2': 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80',
  '3': 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80',
  '4': 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80',
  '5': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80',
  '6': 'https://images.unsplash.com/photo-1511556821820-912aed7961b9?w=600&q=80',
}

// Placeholder products — serán reemplazados por data de la API
const PRODUCTS = [
  { id: '1', name: 'Playera Hybrid Event 2026', price: 450, image_url: '', sizes: ['S', 'M', 'L', 'XL'], description: 'Playera oficial del evento. Tejido técnico transpirable.' },
  { id: '2', name: 'Hoodie Hybrid Event', price: 890, image_url: '', sizes: ['S', 'M', 'L', 'XL'], description: 'Sudadera con capucha. Interior afelpado.' },
  { id: '3', name: 'Gorra Hybrid Event', price: 350, image_url: '', sizes: ['Única'], description: 'Gorra snapback con logo bordado.' },
  { id: '4', name: 'Botella Térmica', price: 280, image_url: '', sizes: ['Única'], description: 'Botella de acero inoxidable 750ml.' },
  { id: '5', name: 'Morral Hybrid Event', price: 420, image_url: '', sizes: ['Única'], description: 'Morral deportivo con compartimentos.' },
  { id: '6', name: 'Calcetines Técnicos', price: 180, image_url: '', sizes: ['S/M', 'L/XL'], description: 'Par de calcetines de compresión.' },
]

export default function ShopPage() {
  const navigate = useNavigate()
  const itemCount = useCartStore((s) => s.itemCount)

  return (
    <Box sx={{ pb: 8 }}>
      <Container maxWidth="lg" sx={{ py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <IconButton onClick={() => navigate({ to: '/' })} sx={{ color: '#B0B890', borderRadius: 0, p: 0.5 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography
            sx={{
              fontFamily: BRAND_FONT,
              color: '#E6F2B1',
              fontSize: { xs: '1.8rem', sm: '2.2rem' },
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            SHOP
          </Typography>
        </Box>
        <Typography sx={{ fontFamily: MONO_FONT, color: '#B0B890', fontSize: '0.8rem', mb: 3, letterSpacing: '0.05em' }}>
          Productos oficiales de Hybrid Event 2026. Recoge tu pedido en el evento.
        </Typography>

        <Box sx={{ display: 'grid', gridTemplateColumns: { xs: 'repeat(2, 1fr)', sm: 'repeat(3, 1fr)', md: 'repeat(4, 1fr)' }, gap: 1.5 }}>
          {PRODUCTS.map((p) => (
            <Card
              key={p.id}
              sx={{
                bgcolor: '#111111',
                cursor: 'pointer',
                borderRadius: 0,
                border: '1px solid rgba(230,242,177,0.15)',
                transition: 'border-color 150ms',
                '&:hover': { borderColor: 'rgba(230,242,177,0.4)' },
                height: '100%',
              }}
              onClick={() => navigate({ to: `/app/shop/${p.id}`, params: { productId: p.id } })}
            >
              <Box
                sx={{
                  height: 140,
                  bgcolor: '#000000',
                  borderBottom: '1px solid rgba(230,242,177,0.1)',
                  display: 'grid',
                  placeItems: 'center',
                  fontSize: '2.5rem',
                  backgroundImage: `url(${PRODUCT_IMAGES[p.id] || ''})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)',
                    zIndex: 1,
                    pointerEvents: 'none',
                  },
                }}
              >
                🏷️
              </Box>
              <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 700, fontSize: '0.8rem', mb: 0.5, letterSpacing: '0.02em' }}>
                  {p.name}
                </Typography>
                <Typography sx={{ fontFamily: MONO_FONT, color: '#E6F2B1', fontWeight: 800, fontSize: '0.85rem' }}>
                  ${p.price} MXN
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* Cart FAB - brutalist */}
      {itemCount > 0 && (
        <Fab
          sx={{
            position: 'fixed', bottom: 80, right: 20, zIndex: 1001,
            bgcolor: '#E6F2B1', color: '#000000', borderRadius: 0,
            border: '2px solid #E6F2B1',
            '&:hover': { bgcolor: '#F0F7CD' },
          }}
          onClick={() => navigate({ to: '/app/shop/cart' })}
        >
          <Badge badgeContent={itemCount} sx={{ '& .MuiBadge-badge': { bgcolor: '#E9C7DF', color: '#000000', borderRadius: 0, fontWeight: 700, fontFamily: MONO_FONT } }}>
            <ShoppingCartIcon />
          </Badge>
        </Fab>
      )}
    </Box>
  )
}