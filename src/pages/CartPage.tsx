import { useNavigate } from '@tanstack/react-router'
import { Box, Button, Container, Typography, Stack, IconButton, Divider } from '@mui/material'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'
import DeleteIcon from '@mui/icons-material/Delete'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useCartStore } from '../store/cartStore'

const BRAND_FONT = 'tt-norms-pro-extra-black-italic, serif'
const MONO_FONT = '"Space Grotesk", monospace'

export default function CartPage() {
  const navigate = useNavigate()
  const { items, total, itemCount, updateQty, removeItem } = useCartStore()

  if (items.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
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
          CARRITO
        </Typography>
        <Typography sx={{ fontFamily: MONO_FONT, color: '#B0B890', mb: 3, fontSize: '0.9rem' }}>
          Agrega productos desde la tienda oficial.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate({ to: '/app/shop' })}
          sx={{
            borderRadius: 0,
            bgcolor: '#E6F2B1',
            color: '#000000',
            fontWeight: 700,
            fontFamily: MONO_FONT,
            letterSpacing: '0.08em',
            border: '2px solid #E6F2B1',
            px: 4, py: 1.5,
            '&:hover': { bgcolor: '#F0F7CD', borderColor: '#F0F7CD' },
          }}
        >
          IR A LA TIENDA
        </Button>
      </Container>
    )
  }

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      {/* Header */}
      <Stack direction="row" sx={{ alignItems: 'center', mb: 2.5 }}>
        <IconButton onClick={() => navigate({ to: '/app/shop' })} sx={{ color: '#B0B890', borderRadius: 0 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography
          sx={{
            fontFamily: BRAND_FONT,
            color: '#E6F2B1',
            fontSize: '1.5rem',
            lineHeight: 1,
            flex: 1,
            letterSpacing: '-0.01em',
          }}
        >
          CARRITO
        </Typography>
        <Typography sx={{ fontFamily: MONO_FONT, fontSize: '0.75rem', color: '#B0B890', letterSpacing: '0.05em' }}>
          {itemCount} {itemCount === 1 ? 'ITEM' : 'ITEMS'}
        </Typography>
      </Stack>

      {/* Cart items - system receipt style */}
      <Box sx={{ border: '1px solid rgba(230,242,177,0.15)', bgcolor: '#111111', mb: 2.5 }}>
        {items.map((item, idx) => (
          <Box key={`${item.productId}-${item.size}`} sx={{ borderBottom: idx < items.length - 1 ? '1px solid rgba(230,242,177,0.08)' : 'none' }}>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', p: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 700, fontSize: '0.85rem' }}>
                  {item.name}
                </Typography>
                <Typography sx={{ fontFamily: MONO_FONT, fontSize: '0.7rem', color: '#B0B890' }}>
                  TALLA {item.size} · ${item.price} MXN
                </Typography>
              </Box>
              <Stack direction="row" sx={{ alignItems: 'center', gap: 0 }}>
                <IconButton
                  onClick={() => updateQty(item.productId, item.size, item.quantity - 1)}
                  aria-label={`Reducir cantidad de ${item.name}`}
                  sx={{ color: '#E6F2B1', borderRadius: 0, border: '1px solid rgba(230,242,177,0.2)', width: 44, height: 44, '&:hover': { borderColor: '#E6F2B1', bgcolor: 'rgba(230,242,177,0.08)' } }}
                >
                  <RemoveIcon sx={{ fontSize: 16 }} />
                </IconButton>
                <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 700, minWidth: 28, textAlign: 'center', fontSize: '0.85rem' }}>
                  {item.quantity}
                </Typography>
                <IconButton
                  onClick={() => updateQty(item.productId, item.size, item.quantity + 1)}
                  aria-label={`Aumentar cantidad de ${item.name}`}
                  sx={{ color: '#E6F2B1', borderRadius: 0, border: '1px solid rgba(230,242,177,0.2)', width: 44, height: 44, '&:hover': { borderColor: '#E6F2B1', bgcolor: 'rgba(230,242,177,0.08)' } }}
                >
                  <AddIcon sx={{ fontSize: 16 }} />
                </IconButton>
              </Stack>
              <IconButton
                onClick={() => removeItem(item.productId, item.size)}
                aria-label={`Eliminar ${item.name} del carrito`}
                sx={{ color: '#B0B890', borderRadius: 0, width: 44, height: 44, '&:hover': { color: '#FF5252', bgcolor: 'rgba(255,82,82,0.08)' } }}
              >
                <DeleteIcon sx={{ fontSize: 18 }} />
              </IconButton>
            </Stack>
            <Stack direction="row" sx={{ justifyContent: 'flex-end', px: 2, pb: 1 }}>
              <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 700, fontSize: '0.8rem', color: '#E6F2B1' }}>
                ${item.price * item.quantity} MXN
              </Typography>
            </Stack>
          </Box>
        ))}
      </Box>

      {/* Total - receipt style */}
      <Box sx={{ border: '1px solid rgba(230,242,177,0.15)', bgcolor: '#111111', p: 2, mb: 2 }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.05em' }}>
            TOTAL
          </Typography>
          <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 800, fontSize: '1.1rem', color: '#E6F2B1' }}>
            ${total} MXN
          </Typography>
        </Stack>
      </Box>

      <Typography sx={{ fontFamily: MONO_FONT, fontSize: '0.7rem', color: '#B0B890', mb: 2, textAlign: 'center', letterSpacing: '0.03em' }}>
        🚚 Pickup en el evento — Recibe tu QR de recogida tras el pago
      </Typography>

      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={() => navigate({ to: '/app/shop/checkout' })}
        sx={{
          py: 1.5, borderRadius: 0,
          bgcolor: '#E6F2B1',
          color: '#000000',
          fontWeight: 700,
          fontFamily: MONO_FONT,
          letterSpacing: '0.08em',
          border: '2px solid #E6F2B1',
          '&:hover': { bgcolor: '#F0F7CD', borderColor: '#F0F7CD' },
        }}
      >
        IR A PAGAR — ${total} MXN
      </Button>
    </Container>
  )
}