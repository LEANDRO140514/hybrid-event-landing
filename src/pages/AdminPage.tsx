import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  Box,
  Button,
  Container,
  Typography,
  Stack,
  TextField,
  IconButton,
  Switch,
  FormControlLabel,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import AddIcon from '@mui/icons-material/Add'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useProductStore, type AdminProduct } from '../store/productStore'

const BRAND_FONT = 'tt-norms-pro-extra-black-italic, serif'
const MONO_FONT = '"Space Grotesk", monospace'

function generateId(): string {
  return `prod-${Date.now()}`
}

export default function AdminPage() {
  const navigate = useNavigate()
  const { products, addProduct, updateProduct, deleteProduct, toggleAvailability, toggleDelivery } = useProductStore()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({
    name: '',
    price: '',
    sizes: '',
    description: '',
    image_url: '',
    available: true,
    delivery: true,
  })

  const resetForm = () => {
    setForm({ name: '', price: '', sizes: '', description: '', image_url: '', available: true, delivery: true })
    setEditingId(null)
    setShowForm(false)
  }

  const handleEdit = (p: AdminProduct) => {
    setForm({
      name: p.name,
      price: String(p.price),
      sizes: p.sizes.join(', '),
      description: p.description,
      image_url: p.image_url,
      available: p.available,
      delivery: p.delivery,
    })
    setEditingId(p.id)
    setShowForm(true)
  }

  const handleSave = () => {
    if (!form.name || !form.price) return
    const sizes = form.sizes.split(',').map((s) => s.trim()).filter(Boolean)
    const product: AdminProduct = {
      id: editingId || generateId(),
      name: form.name,
      price: Number(form.price),
      sizes,
      description: form.description,
      image_url: form.image_url,
      available: form.available,
      delivery: form.delivery,
    }
    if (editingId) {
      updateProduct(editingId, product)
    } else {
      addProduct(product)
    }
    resetForm()
  }

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#000000', pb: 6 }}>
      {/* Header */}
      <Box sx={{ borderBottom: '1px solid rgba(230,242,177,0.12)', bgcolor: '#111111' }}>
        <Container maxWidth="md" sx={{ py: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <IconButton onClick={() => navigate({ to: '/' })} sx={{ color: '#B0B890', borderRadius: 0 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography
            sx={{
              fontFamily: BRAND_FONT,
              color: '#E6F2B1',
              fontSize: '1.5rem',
              lineHeight: 1,
              letterSpacing: '-0.01em',
              flex: 1,
            }}
          >
            ADMIN
          </Typography>
          <Typography sx={{ fontFamily: MONO_FONT, fontSize: '0.65rem', color: '#B0B890', letterSpacing: '0.1em' }}>
            {products.length} PRODUCTOS
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="md" sx={{ pt: 3 }}>
        {/* Add button */}
        {!showForm && (
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            onClick={() => setShowForm(true)}
            sx={{
              borderRadius: 0,
              borderColor: 'rgba(230,242,177,0.3)',
              color: '#E6F2B1',
              fontFamily: MONO_FONT,
              fontWeight: 700,
              letterSpacing: '0.08em',
              fontSize: '0.75rem',
              mb: 3,
              '&:hover': { borderColor: '#E6F2B1', bgcolor: 'rgba(230,242,177,0.05)' },
            }}
          >
            AGREGAR PRODUCTO
          </Button>
        )}

        {/* Form */}
        {showForm && (
          <Box
            sx={{
              border: '1px solid rgba(230,242,177,0.15)',
              bgcolor: '#111111',
              p: 2.5,
              mb: 3,
            }}
          >
            <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 700, fontSize: '0.75rem', color: '#B0B890', letterSpacing: '0.1em', mb: 2 }}>
              {editingId ? '// EDITAR PRODUCTO' : '// NUEVO PRODUCTO'}
            </Typography>
            <Stack spacing={2}>
              <TextField
                label="Nombre"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                fullWidth
                variant="outlined"
                slotProps={{ inputLabel: { sx: { fontFamily: MONO_FONT, fontSize: '0.85rem' } }, htmlInput: { sx: { fontFamily: MONO_FONT, fontSize: '0.9rem' } } }}
              />
              <TextField
                label="Precio (MXN)"
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                fullWidth
                variant="outlined"
                slotProps={{ inputLabel: { sx: { fontFamily: MONO_FONT, fontSize: '0.85rem' } }, htmlInput: { sx: { fontFamily: MONO_FONT, fontSize: '0.9rem' } } }}
              />
              <TextField
                label="Tallas (separadas por coma)"
                value={form.sizes}
                onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                fullWidth
                variant="outlined"
                placeholder="S, M, L, XL"
                slotProps={{ inputLabel: { sx: { fontFamily: MONO_FONT, fontSize: '0.85rem' } }, htmlInput: { sx: { fontFamily: MONO_FONT, fontSize: '0.9rem' } } }}
              />
              <TextField
                label="Descripción"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                fullWidth
                multiline
                rows={2}
                variant="outlined"
                slotProps={{ inputLabel: { sx: { fontFamily: MONO_FONT, fontSize: '0.85rem' } }, htmlInput: { sx: { fontFamily: MONO_FONT, fontSize: '0.9rem' } } }}
              />
              <TextField
                label="URL de imagen"
                value={form.image_url}
                onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                fullWidth
                variant="outlined"
                slotProps={{ inputLabel: { sx: { fontFamily: MONO_FONT, fontSize: '0.85rem' } }, htmlInput: { sx: { fontFamily: MONO_FONT, fontSize: '0.9rem' } } }}
              />
              <Stack direction="row" spacing={4}>
                <FormControlLabel
                  control={<Switch checked={form.available} onChange={(e) => setForm({ ...form, available: e.target.checked })} sx={{ '& .MuiSwitch-thumb': { bgcolor: '#E6F2B1' } }} />}
                  label={<Typography sx={{ fontFamily: MONO_FONT, fontSize: '0.75rem', color: '#B0B890' }}>Disponible</Typography>}
                />
                <FormControlLabel
                  control={<Switch checked={form.delivery} onChange={(e) => setForm({ ...form, delivery: e.target.checked })} sx={{ '& .MuiSwitch-thumb': { bgcolor: '#E6F2B1' } }} />}
                  label={<Typography sx={{ fontFamily: MONO_FONT, fontSize: '0.75rem', color: '#B0B890' }}>Envío</Typography>}
                />
              </Stack>
              <Stack direction="row" spacing={1.5}>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  sx={{
                    borderRadius: 0,
                    bgcolor: '#E6F2B1',
                    color: '#000000',
                    fontWeight: 700,
                    fontFamily: MONO_FONT,
                    letterSpacing: '0.08em',
                    '&:hover': { bgcolor: '#F0F7CD' },
                    flex: 1,
                  }}
                >
                  {editingId ? 'GUARDAR CAMBIOS' : 'CREAR PRODUCTO'}
                </Button>
                <Button
                  variant="outlined"
                  onClick={resetForm}
                  sx={{
                    borderRadius: 0,
                    borderColor: 'rgba(230,242,177,0.3)',
                    color: '#B0B890',
                    fontFamily: MONO_FONT,
                    fontWeight: 700,
                    '&:hover': { borderColor: '#E6F2B1', color: '#E6F2B1' },
                  }}
                >
                  CANCELAR
                </Button>
              </Stack>
            </Stack>
          </Box>
        )}

        {/* Product list */}
        <Box sx={{ border: '1px solid rgba(230,242,177,0.15)' }}>
          {/* Header row */}
          <Box
            sx={{
              display: { xs: 'none', sm: 'grid' },
              gridTemplateColumns: '1fr 100px 80px 80px 80px 60px',
              borderBottom: '1px solid rgba(230,242,177,0.15)',
              bgcolor: 'rgba(230,242,177,0.05)',
            }}
          >
            {['Producto', 'Precio', 'Tallas', 'Envío', 'Disponible', ''].map((h) => (
              <Box
                key={h}
                sx={{
                  px: 1.5,
                  py: 1.5,
                  fontFamily: MONO_FONT,
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: '#E6F2B1',
                  textTransform: 'uppercase',
                  letterSpacing: '0.1em',
                }}
              >
                {h}
              </Box>
            ))}
          </Box>

          {products.map((p, idx) => (
            <Box
              key={p.id}
              sx={{
                borderBottom: idx < products.length - 1 ? '1px solid rgba(230,242,177,0.08)' : 'none',
                bgcolor: idx % 2 === 0 ? 'rgba(230,242,177,0.02)' : 'transparent',
              }}
            >
              {/* Desktop row */}
              <Box
                sx={{
                  display: { xs: 'none', sm: 'grid' },
                  gridTemplateColumns: '1fr 100px 80px 80px 80px 60px',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ px: 1.5, py: 1.5 }}>
                  <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 700, fontSize: '0.8rem', mb: 0.25 }}>
                    {p.name}
                  </Typography>
                  <Typography sx={{ fontFamily: MONO_FONT, fontSize: '0.65rem', color: '#B0B890' }}>
                    {p.description.length > 60 ? p.description.slice(0, 60) + '...' : p.description}
                  </Typography>
                </Box>
                <Box sx={{ px: 1.5, fontFamily: MONO_FONT, fontWeight: 700, fontSize: '0.8rem', color: '#E6F2B1' }}>
                  ${p.price}
                </Box>
                <Box sx={{ px: 1.5, fontFamily: MONO_FONT, fontSize: '0.7rem', color: '#B0B890' }}>
                  {p.sizes.join(', ')}
                </Box>
                <Box sx={{ px: 1.5 }}>
                  <Switch
                    checked={p.delivery}
                    onChange={() => toggleDelivery(p.id)}
                    size="small"
                    sx={{ '& .MuiSwitch-thumb': { bgcolor: p.delivery ? '#E6F2B1' : '#555' } }}
                  />
                </Box>
                <Box sx={{ px: 1.5 }}>
                  <Switch
                    checked={p.available}
                    onChange={() => toggleAvailability(p.id)}
                    size="small"
                    sx={{ '& .MuiSwitch-thumb': { bgcolor: p.available ? '#E6F2B1' : '#555' } }}
                  />
                </Box>
                <Box sx={{ px: 1.5, display: 'flex', gap: 0.5 }}>
                  <IconButton onClick={() => handleEdit(p)} size="small" sx={{ color: '#B0B890', '&:hover': { color: '#E6F2B1' } }}>
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => deleteProduct(p.id)} size="small" sx={{ color: '#B0B890', '&:hover': { color: '#FF5252' } }}>
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              {/* Mobile row */}
              <Box sx={{ display: { xs: 'block', sm: 'none' }, p: 2 }}>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                  <Box>
                    <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 700, fontSize: '0.8rem' }}>
                      {p.name}
                    </Typography>
                    <Typography sx={{ fontFamily: MONO_FONT, fontSize: '0.65rem', color: '#B0B890' }}>
                      {p.sizes.join(', ')}
                    </Typography>
                  </Box>
                  <Typography sx={{ fontFamily: MONO_FONT, fontWeight: 700, fontSize: '0.85rem', color: '#E6F2B1' }}>
                    ${p.price}
                  </Typography>
                </Stack>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                    <Typography sx={{ fontFamily: MONO_FONT, fontSize: '0.6rem', color: p.available ? '#E6F2B1' : '#555' }}>
                      {p.available ? 'DISPONIBLE' : 'AGOTADO'}
                    </Typography>
                    <Typography sx={{ fontFamily: MONO_FONT, fontSize: '0.6rem', color: p.delivery ? '#E6F2B1' : '#555' }}>
                      {p.delivery ? 'ENVÍO' : 'PICKUP'}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={0.5}>
                    <IconButton onClick={() => handleEdit(p)} size="small" sx={{ color: '#B0B890', '&:hover': { color: '#E6F2B1' } }}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => deleteProduct(p.id)} size="small" sx={{ color: '#B0B890', '&:hover': { color: '#FF5252' } }}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>
              </Box>
            </Box>
          ))}
        </Box>

        {products.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography sx={{ fontFamily: MONO_FONT, color: '#B0B890', fontSize: '0.9rem' }}>
              No hay productos. Agrega el primero.
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  )
}