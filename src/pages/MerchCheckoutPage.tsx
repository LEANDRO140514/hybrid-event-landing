import { useState } from 'react'
import { Button, Box, Container, TextField, Typography, Stack, Divider } from '@mui/material'
import { useCartStore } from '../store/cartStore'
import { API_CONFIG } from '../config'

const BRAND_FONT = 'tt-norms-pro-extra-black-italic, serif'
const MONO_FONT = '"Space Grotesk", monospace'

export default function MerchCheckoutPage() {
  const { items, total, clearCart } = useCartStore()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCheckout = async () => {
    if (!name || !email || !phone) return
    setLoading(true)
    try {
      const res = await fetch(`${API_CONFIG.edgeFunctionsUrl}/merch-checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact_name: name,
          contact_email: email,
          contact_phone: phone,
          items: items.map((i) => ({
            product_id: i.productId,
            name: i.name,
            size: i.size,
            quantity: i.quantity,
            price: i.price,
          })),
          total,
          provider: 'mercadopago',
        }),
      })
      const data = await res.json()
      if (data.checkout_url) {
        clearCart()
        window.location.href = data.checkout_url
      } else {
        alert('Error al crear el checkout. Intenta de nuevo.')
      }
    } catch {
      alert('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container maxWidth="sm" sx={{ py: 2 }}>
      <Typography
        sx={{
          fontFamily: BRAND_FONT,
          color: '#E6F2B1',
          fontSize: { xs: '1.8rem', sm: '2.2rem' },
          lineHeight: 1,
          mb: 2.5,
          letterSpacing: '-0.02em',
        }}
      >
        CHECKOUT
      </Typography>

      {/* Contact form */}
      <Box sx={{ border: '1px solid rgba(230,242,177,0.15)', bgcolor: '#111111', p: 2.5, mb: 2.5 }}>
        <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 700, fontSize: '0.75rem', color: '#B0B890', letterSpacing: '0.1em', mb: 2 }}>
          // TUS DATOS
        </Typography>
        <Stack spacing={2}>
          <TextField
            label="Nombre completo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
            required
            variant="outlined"
            InputLabelProps={{ sx: { fontFamily: MONO_FONT, fontSize: '0.85rem' } }}
            inputProps={{ sx: { fontFamily: MONO_FONT, fontSize: '0.9rem' } }}
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
            variant="outlined"
            InputLabelProps={{ sx: { fontFamily: MONO_FONT, fontSize: '0.85rem' } }}
            inputProps={{ sx: { fontFamily: MONO_FONT, fontSize: '0.9rem' } }}
          />
          <TextField
            label="Teléfono"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            fullWidth
            required
            variant="outlined"
            InputLabelProps={{ sx: { fontFamily: MONO_FONT, fontSize: '0.85rem' } }}
            inputProps={{ sx: { fontFamily: MONO_FONT, fontSize: '0.9rem' } }}
          />
        </Stack>
      </Box>

      {/* Order summary - receipt style */}
      <Box sx={{ border: '1px solid rgba(230,242,177,0.15)', bgcolor: '#111111', p: 2.5, mb: 2.5 }}>
        <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 700, fontSize: '0.75rem', color: '#B0B890', letterSpacing: '0.1em', mb: 2 }}>
          // RESUMEN DEL PEDIDO
        </Typography>
        {items.map((i) => (
          <Stack key={`${i.productId}-${i.size}`} direction="row" sx={{ justifyContent: 'space-between', py: 0.5 }}>
            <Typography sx={{ fontFamily: MONO_FONT, fontSize: '0.8rem' }}>
              {i.name} (T. {i.size}) x{i.quantity}
            </Typography>
            <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 700, fontSize: '0.8rem' }}>
              ${i.price * i.quantity}
            </Typography>
          </Stack>
        ))}
        <Divider sx={{ borderColor: 'rgba(230,242,177,0.1)', my: 1.5 }} />
        <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
          <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 700, fontSize: '0.85rem', letterSpacing: '0.05em' }}>
            TOTAL
          </Typography>
          <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 800, fontSize: '1rem', color: '#E6F2B1' }}>
            ${total} MXN
          </Typography>
        </Stack>
      </Box>

      <Button
        variant="contained"
        size="large"
        fullWidth
        disabled={!name || !email || !phone || loading}
        onClick={handleCheckout}
        sx={{
          py: 1.5, borderRadius: 0,
          bgcolor: !name || !email || !phone || loading ? 'rgba(230,242,177,0.1)' : '#E6F2B1',
          color: !name || !email || !phone || loading ? '#B0B890' : '#000000',
          fontWeight: 700,
          fontFamily: MONO_FONT,
          letterSpacing: '0.08em',
          border: '2px solid',
          borderColor: !name || !email || !phone || loading ? 'rgba(230,242,177,0.1)' : '#E6F2B1',
          '&:hover': !loading ? { bgcolor: '#F0F7CD', borderColor: '#F0F7CD' } : {},
          '&.Mui-disabled': { bgcolor: 'rgba(230,242,177,0.05)', color: '#555' },
        }}
      >
        {loading ? 'CREANDO PAGO...' : `PAGAR CON MERCADOPAGO — $${total} MXN`}
      </Button>
    </Container>
  )
}