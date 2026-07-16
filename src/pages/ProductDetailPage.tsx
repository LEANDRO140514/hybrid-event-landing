import { useNavigate, useParams } from '@tanstack/react-router'
import { Box, Button, Container, Typography, Stack, Divider } from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useState } from 'react'
import { useCartStore } from '../store/cartStore'

const BRAND_FONT = 'tt-norms-pro-extra-black-italic, serif'
const MONO_FONT = '"Space Grotesk", monospace'

const PRODUCTS: Record<string, any> = {
  '1': { id: '1', name: 'Playera Hybrid Event 2026', price: 450, sizes: ['S', 'M', 'L', 'XL'], description: 'Playera oficial del evento. Tejido técnico transpirable con logo HYBRID EVENT en el pecho y lista de categorías en la espalda.' },
  '2': { id: '2', name: 'Hoodie Hybrid Event', price: 890, sizes: ['S', 'M', 'L', 'XL'], description: 'Sudadera con capucha. Interior afelpado para máxima comodidad. Logo bordado.' },
  '3': { id: '3', name: 'Gorra Hybrid Event', price: 350, sizes: ['Única'], description: 'Gorra snapback con logo HYBRID EVENT bordado en frontal. Ajustable.' },
  '4': { id: '4', name: 'Botella Térmica', price: 280, sizes: ['Única'], description: 'Botella de acero inoxidable 750ml. Mantiene tu bebida fría 12h o caliente 6h.' },
  '5': { id: '5', name: 'Morral Hybrid Event', price: 420, sizes: ['Única'], description: 'Morral deportivo con múltiples compartimentos. Ideal para el gym.' },
  '6': { id: '6', name: 'Calcetines Técnicos', price: 180, sizes: ['S/M', 'L/XL'], description: 'Par de calcetines de compresión. Tejido técnico anti-ampollas.' },
}

export default function ProductDetailPage() {
  const params = useParams({ strict: false }) as { productId: string }
  const productId = params.productId
  const navigate = useNavigate()
  const addItem = useCartStore((s) => s.addItem)
  const [selectedSize, setSelectedSize] = useState<string>('')
  const product = PRODUCTS[productId]

  if (!product) {
    return (
      <Container maxWidth="sm" sx={{ py: 4, textAlign: 'center' }}>
        <Typography sx={{ fontFamily: MONO_FONT, color: '#B0B890' }}>Producto no encontrado</Typography>
      </Container>
    )
  }

  const handleAdd = () => {
    if (!selectedSize) return
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
    })
    navigate({ to: '/app/shop/cart' })
  }

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      {/* Back button */}
      <Button
        onClick={() => navigate({ to: '/app/shop' })}
        startIcon={<ArrowBackIcon />}
        sx={{ fontFamily: MONO_FONT, color: '#B0B890', fontSize: '0.75rem', mb: 2, '&:hover': { color: '#E6F2B1' }, textTransform: 'none', borderRadius: 0 }}
      >
        Volver a tienda
      </Button>

      {/* Product image placeholder */}
      <Box
        sx={{
          height: 220, mb: 2.5,
          bgcolor: '#000000',
          border: '1px solid rgba(230,242,177,0.15)',
          display: 'grid', placeItems: 'center', fontSize: '4rem',
        }}
      >
        🏷️
      </Box>

      <Typography sx={{ fontFamily: BRAND_FONT, color: '#E6F2B1', fontSize: '1.5rem', lineHeight: 1, mb: 0.5, letterSpacing: '-0.01em' }}>
        {product.name}
      </Typography>
      <Typography sx={{ fontFamily: MONO_FONT, color: '#E6F2B1', fontWeight: 800, fontSize: '1.3rem', mb: 2 }}>
        ${product.price} MXN
      </Typography>
      <Typography sx={{ fontFamily: MONO_FONT, color: '#B0B890', fontSize: '0.85rem', mb: 3, lineHeight: 1.6 }}>
        {product.description}
      </Typography>

      <Divider sx={{ borderColor: 'rgba(230,242,177,0.1)', mb: 2.5 }} />

      {/* Size selector */}
      <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 700, fontSize: '0.75rem', color: '#B0B890', letterSpacing: '0.1em', mb: 1.5 }}>
        // TALLA
      </Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 3, flexWrap: 'wrap', gap: 1 }}>
        {product.sizes.map((size: string) => (
          <Box
            key={size}
            onClick={() => setSelectedSize(size)}
            role="button"
            tabIndex={0}
            aria-label={`Seleccionar talla ${size}`}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setSelectedSize(size); }}
            sx={{
              px: 2.5, py: 1.25,
              minWidth: 48, minHeight: 44,
              display: 'grid', placeItems: 'center',
              border: selectedSize === size ? '2px solid #E6F2B1' : '1px solid rgba(230,242,177,0.2)',
              bgcolor: selectedSize === size ? '#E6F2B1' : 'transparent',
              color: selectedSize === size ? '#000000' : '#E6F2B1',
              fontWeight: 700,
              fontSize: '0.85rem',
              fontFamily: MONO_FONT,
              cursor: 'pointer',
              transition: 'all 100ms',
              '&:hover': { borderColor: '#E6F2B1' },
            }}
          >
            {size}
          </Box>
        ))}
      </Stack>

      <Typography sx={{ fontFamily: MONO_FONT, fontSize: '0.7rem', color: '#B0B890', mb: 2, letterSpacing: '0.03em' }}>
        🚚 Pickup en el evento — Recoge tu pedido el día del evento mostrando tu QR
      </Typography>

      <Button
        variant="contained"
        size="large"
        fullWidth
        disabled={!selectedSize}
        startIcon={<ShoppingCartIcon />}
        onClick={handleAdd}
        sx={{
          py: 1.5, borderRadius: 0,
          bgcolor: selectedSize ? '#E6F2B1' : 'rgba(230,242,177,0.1)',
          color: selectedSize ? '#000000' : '#B0B890',
          fontWeight: 700,
          fontFamily: MONO_FONT,
          letterSpacing: '0.08em',
          border: '2px solid',
          borderColor: selectedSize ? '#E6F2B1' : 'rgba(230,242,177,0.1)',
          '&:hover': selectedSize ? { bgcolor: '#F0F7CD', borderColor: '#F0F7CD' } : {},
          '&.Mui-disabled': { bgcolor: 'rgba(230,242,177,0.05)', color: '#555' },
        }}
      >
        {selectedSize ? `AGREGAR — TALLA ${selectedSize}` : 'SELECCIONA TALLA'}
      </Button>
    </Container>
  )
}