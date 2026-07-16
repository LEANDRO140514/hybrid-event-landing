import { useState, useCallback } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useForm, useFieldArray, FormProvider, useFormContext, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  Chip,
  Container,
  Divider,
  Fade,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import {
  CATEGORIES,
  getCategoryColor,
  getCategoryChipColor,
  formatPrice,
} from '../constants/categories'
import type { Category } from '../constants/categories'

/* ------------------------------------------------------------------ */
/*  Zod schemas                                                       */
/* ------------------------------------------------------------------ */

const participantSchema = z.object({
  name: z.string().min(3, 'Nombre requerido (mín 3 caracteres)'),
  email: z.string().email('Email inválido'),
  phone: z.string().regex(/^\d{10}$/, 'Teléfono debe ser de 10 dígitos'),
  birthDate: z.string().min(1, 'Fecha de nacimiento requerida'),
  gender: z.enum(['M', 'F'], { error: 'Selecciona género' }),
})

const registrationSchema = z.object({
  categoryId: z.number(),
  teamName: z.string().optional(),
  participants: z.array(participantSchema),
  termsAccepted: z.boolean().refine((val) => val === true, 'Debes aceptar los términos'),
})

type RegistrationForm = z.infer<typeof registrationSchema>

const STEP_LABELS = ['Categoría', 'Participantes', 'Resumen']

const emptyParticipant = () => ({
  name: '',
  email: '',
  phone: '',
  birthDate: '',
  gender: '' as 'M' | 'F',
})

/* ------------------------------------------------------------------ */
/*  Step 1 – Category Selection                                       */
/* ------------------------------------------------------------------ */

interface StepCategoryProps {
  selectedId: number | null
  onSelect: (cat: Category) => void
}

function StepCategory({ selectedId, onSelect }: StepCategoryProps) {
  return (
    <Fade in timeout={400}>
      <Box>
        <Typography variant="h4" sx={{ mb: 1, fontFamily: "'Space Grotesk', sans-serif" }}>
          Elige tu categoría
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, fontFamily: "'Space Grotesk', sans-serif" }}>
          Selecciona la categoría en la que quieres competir.
        </Typography>

        <Grid container spacing={2}>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedId === cat.id
            return (
              <Grid size={{ xs: 6, sm: 6, md: 3 }} key={cat.id}>
                <Card
                  onClick={() => onSelect(cat)}
                  sx={{
                    cursor: 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: getCategoryColor(cat.type),
                    bgcolor: '#111111',
                    borderRadius: 0,
                    border: isSelected ? '2px solid' : '1px solid',
                    borderColor: isSelected ? '#E6F2B1' : 'rgba(230, 242, 177, 0.15)',
                    boxShadow: isSelected
                      ? '0 0 20px rgba(230, 242, 177, 0.25)'
                      : 'none',
                    transition: 'all 0.15s ease',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      borderColor: isSelected ? '#E6F2B1' : 'rgba(230, 242, 177, 0.4)',
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      textAlign: 'center',
                      p: { xs: 2, sm: 3 },
                      '&:last-child': { pb: { xs: 2, sm: 3 } },
                    }}
                  >
                    <Typography sx={{ fontSize: { xs: '2rem', sm: '2.5rem' }, mb: 1 }}>
                      {cat.icon}
                    </Typography>
                    <Typography
                      variant="h6"
                      sx={{ fontWeight: 700, mb: 0.5, fontSize: { xs: '0.85rem', sm: '1rem' }, fontFamily: "'Space Grotesk', sans-serif" }}
                    >
                      {cat.name}
                    </Typography>
                    <Chip
                      label={cat.type}
                      color={getCategoryChipColor(cat.type)}
                      size="small"
                      sx={{ mb: 1, fontSize: '0.7rem', height: 22, borderRadius: 0 }}
                    />
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.secondary',
                        mb: 1,
                        fontSize: { xs: '0.75rem', sm: '0.85rem' },
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      {cat.participants}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: '#E9C7DF',
                        fontWeight: 700,
                        fontSize: { xs: '0.8rem', sm: '0.9rem' },
                        fontFamily: "'Space Grotesk', sans-serif",
                      }}
                    >
                      {formatPrice(cat.price)}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            )
          })}
        </Grid>
      </Box>
    </Fade>
  )
}

/* ------------------------------------------------------------------ */
/*  Step 2 – Participant Data                                         */
/* ------------------------------------------------------------------ */

interface StepParticipantsProps {
  category: Category
}

function ParticipantFields({ index, genderRule, participantCount }: {
  index: number
  genderRule: Category['genderRule']
  participantCount: number
}) {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<RegistrationForm>()

  const pErrors = errors.participants?.[index]

  const genderDisabled =
    genderRule === 'male-only' || genderRule === 'female-only'

  const genderLabel = (() => {
    if (genderRule === 'male-only') return 'Masculino (requerido por categoría)'
    if (genderRule === 'female-only') return 'Femenino (requerido por categoría)'
    return 'Género'
  })()

  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 0,
      '& fieldset': {
        borderColor: 'rgba(230, 242, 177, 0.2)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(230, 242, 177, 0.4)',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#E6F2B1',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#A0A880',
      fontFamily: "'Space Grotesk', sans-serif",
      '&.Mui-focused': {
        color: '#E6F2B1',
      },
    },
    '& .MuiInputBase-input': {
      fontFamily: "'Space Grotesk', sans-serif",
    },
  }

  return (
    <Box>
      {participantCount > 1 && (
        <Typography variant="h6" sx={{ mb: 2, color: '#E6F2B1', fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
          Participante {index + 1}
        </Typography>
      )}

      <Stack spacing={2.5}>
        <TextField
          label="Nombre completo"
          variant="outlined"
          fullWidth
          sx={textFieldSx}
          {...register(`participants.${index}.name`)}
          error={!!pErrors?.name}
          helperText={pErrors?.name?.message}
          FormHelperTextProps={{ sx: { fontFamily: "'Space Grotesk', sans-serif" } }}
        />

        <TextField
          label="Email"
          variant="outlined"
          fullWidth
          type="email"
          sx={textFieldSx}
          {...register(`participants.${index}.email`)}
          error={!!pErrors?.email}
          helperText={pErrors?.email?.message}
          FormHelperTextProps={{ sx: { fontFamily: "'Space Grotesk', sans-serif" } }}
        />

        <TextField
          label="Teléfono (10 dígitos)"
          variant="outlined"
          fullWidth
          sx={textFieldSx}
          slotProps={{ htmlInput: { maxLength: 10, inputMode: 'numeric' } }}
          {...register(`participants.${index}.phone`)}
          error={!!pErrors?.phone}
          helperText={pErrors?.phone?.message}
          FormHelperTextProps={{ sx: { fontFamily: "'Space Grotesk', sans-serif" } }}
        />

        <TextField
          label="Fecha de nacimiento"
          variant="outlined"
          fullWidth
          type="date"
          sx={textFieldSx}
          slotProps={{ inputLabel: { shrink: true } }}
          {...register(`participants.${index}.birthDate`)}
          error={!!pErrors?.birthDate}
          helperText={pErrors?.birthDate?.message}
          FormHelperTextProps={{ sx: { fontFamily: "'Space Grotesk', sans-serif" } }}
        />

        <Controller
          name={`participants.${index}.gender`}
          control={control}
          render={({ field }) => (
            <FormControl fullWidth error={!!pErrors?.gender} variant="outlined">
              <InputLabel
                id={`gender-label-${index}`}
                sx={{ fontFamily: "'Space Grotesk', sans-serif", '&.Mui-focused': { color: '#E6F2B1' } }}
              >
                {genderLabel}
              </InputLabel>
              <Select
                labelId={`gender-label-${index}`}
                label={genderLabel}
                disabled={genderDisabled}
                sx={{
                  borderRadius: 0,
                  fontFamily: "'Space Grotesk', sans-serif",
                  '& fieldset': { borderColor: 'rgba(230, 242, 177, 0.2)' },
                  '&:hover fieldset': { borderColor: 'rgba(230, 242, 177, 0.4)' },
                  '&.Mui-focused fieldset': { borderColor: '#E6F2B1' },
                }}
                {...field}
              >
                <MenuItem value="M">Masculino</MenuItem>
                <MenuItem value="F">Femenino</MenuItem>
              </Select>
              {pErrors?.gender && (
                <FormHelperText sx={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {pErrors.gender.message}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />
      </Stack>
    </Box>
  )
}

function StepParticipants({ category }: StepParticipantsProps) {
  const {
    register,
    formState: { errors },
  } = useFormContext<RegistrationForm>()

  const showTeamName = category.participantCount > 1

  const textFieldSx = {
    '& .MuiOutlinedInput-root': {
      borderRadius: 0,
      '& fieldset': {
        borderColor: 'rgba(230, 242, 177, 0.2)',
      },
      '&:hover fieldset': {
        borderColor: 'rgba(230, 242, 177, 0.4)',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#E6F2B1',
      },
    },
    '& .MuiInputLabel-root': {
      color: '#A0A880',
      fontFamily: "'Space Grotesk', sans-serif",
      '&.Mui-focused': {
        color: '#E6F2B1',
      },
    },
    '& .MuiInputBase-input': {
      fontFamily: "'Space Grotesk', sans-serif",
    },
  }

  return (
    <Fade in timeout={400}>
      <Box>
        <Typography variant="h4" sx={{ mb: 1, fontFamily: "'Space Grotesk', sans-serif" }}>
          {showTeamName ? 'Datos del equipo' : 'Tus datos'}
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, fontFamily: "'Space Grotesk', sans-serif" }}>
          {showTeamName
            ? `Completa la información de tu equipo para ${category.name}.`
            : `Completa tu información para ${category.name}.`}
        </Typography>

        <Stack spacing={3}>
          {showTeamName && (
            <TextField
              label="Nombre del equipo"
              variant="outlined"
              fullWidth
              sx={textFieldSx}
              {...register('teamName')}
              error={!!errors.teamName}
              helperText={errors.teamName?.message}
              FormHelperTextProps={{ sx: { fontFamily: "'Space Grotesk', sans-serif" } }}
            />
          )}

          {Array.from({ length: category.participantCount }).map((_, i) => (
            <Box key={i}>
              {i > 0 && <Divider sx={{ my: 2, borderColor: 'rgba(230, 242, 177, 0.12)' }} />}
              <ParticipantFields
                index={i}
                genderRule={category.genderRule}
                participantCount={category.participantCount}
              />
            </Box>
          ))}
        </Stack>
      </Box>
    </Fade>
  )
}

/* ------------------------------------------------------------------ */
/*  Step 3 – Summary                                                  */
/* ------------------------------------------------------------------ */

interface StepSummaryProps {
  category: Category
}

function StepSummary({ category }: StepSummaryProps) {
  const {
    watch,
    control,
    formState: { errors },
  } = useFormContext<RegistrationForm>()

  const participants = watch('participants')
  const teamName = watch('teamName')

  return (
    <Fade in timeout={400}>
      <Box>
        <Typography variant="h4" sx={{ mb: 1, fontFamily: "'Space Grotesk', sans-serif" }}>
          Resumen de inscripción
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4, fontFamily: "'Space Grotesk', sans-serif" }}>
          Verifica que toda la información sea correcta antes de continuar al pago.
        </Typography>

        {/* Category card */}
        <Card sx={{ mb: 3, bgcolor: '#111111', borderRadius: 0, border: '1px solid rgba(230, 242, 177, 0.15)' }}>
          <CardContent sx={{ p: 3 }}>
            <Stack direction="row" spacing={2} sx={{ alignItems: 'center', mb: 2 }}>
              <Typography sx={{ fontSize: '2.5rem' }}>{category.icon}</Typography>
              <Box>
                <Typography variant="h5" sx={{ fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
                  {category.name}
                </Typography>
                <Chip
                  label={category.type}
                  color={getCategoryChipColor(category.type)}
                  size="small"
                  sx={{ mt: 0.5, borderRadius: 0 }}
                />
              </Box>
            </Stack>

            <Divider sx={{ my: 2, borderColor: 'rgba(230, 242, 177, 0.12)' }} />

            {teamName && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: "'Space Grotesk', sans-serif" }}>
                  Equipo
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600, fontFamily: "'Space Grotesk', sans-serif" }}>
                  {teamName}
                </Typography>
              </Box>
            )}

            <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, fontFamily: "'Space Grotesk', sans-serif" }}>
              {category.participantCount > 1 ? 'Participantes' : 'Participante'}
            </Typography>
            {participants?.map((p, i) => (
              <Box key={i} sx={{ mb: 1, pl: 1 }}>
                <Typography variant="body1" sx={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {category.participantCount > 1 ? `${i + 1}. ` : ''}
                  {p.name || '—'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: "'Space Grotesk', sans-serif" }}>
                  {p.email} · {p.phone}
                </Typography>
              </Box>
            ))}

            <Divider sx={{ my: 2, borderColor: 'rgba(230, 242, 177, 0.12)' }} />

            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body1" sx={{ color: 'text.secondary', fontFamily: "'Space Grotesk', sans-serif" }}>
                Total a pagar
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 800,
                  color: '#E6F2B1',
                  fontFamily: "'Space Grotesk', sans-serif",
                }}
              >
                {formatPrice(category.price)}
              </Typography>
            </Stack>
          </CardContent>
        </Card>

        {/* Contact info */}
        <Card sx={{ mb: 3, bgcolor: '#111111', borderRadius: 0, border: '1px solid rgba(230, 242, 177, 0.15)' }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: 700, fontFamily: "'Space Grotesk', sans-serif" }}>
              Datos de contacto
            </Typography>
            <Stack spacing={1}>
              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: "'Space Grotesk', sans-serif" }}>
                  Email de contacto
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {participants?.[0]?.email || '—'}
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: "'Space Grotesk', sans-serif" }}>
                  Teléfono de contacto
                </Typography>
                <Typography variant="body1" sx={{ fontFamily: "'Space Grotesk', sans-serif" }}>
                  {participants?.[0]?.phone || '—'}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Terms checkbox */}
        <Controller
          name="termsAccepted"
          control={control}
          render={({ field }) => (
            <FormControl error={!!errors.termsAccepted}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={!!field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    sx={{
                      color: 'rgba(230, 242, 177, 0.4)',
                      borderRadius: 0,
                      '&.Mui-checked': { color: '#E6F2B1' },
                    }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: "'Space Grotesk', sans-serif" }}>
                    Acepto los términos y condiciones y el aviso de privacidad
                  </Typography>
                }
              />
              {errors.termsAccepted && (
                <FormHelperText sx={{ ml: 4, fontFamily: "'Space Grotesk', sans-serif" }}>
                  {errors.termsAccepted.message}
                </FormHelperText>
              )}
            </FormControl>
          )}
        />
      </Box>
    </Fade>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Wizard                                                       */
/* ------------------------------------------------------------------ */

export default function RegistroPage() {
  const navigate = useNavigate()
  const [activeStep, setActiveStep] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const methods = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      categoryId: 0,
      teamName: '',
      participants: [emptyParticipant()],
      termsAccepted: false,
    },
    mode: 'onTouched',
  })

  const { handleSubmit, setValue, trigger, getValues } = methods
  const { replace } = useFieldArray({ control: methods.control, name: 'participants' })

  /* ---- Category selection ---- */
  const handleCategorySelect = useCallback(
    (cat: Category) => {
      setSelectedCategory(cat)
      setValue('categoryId', cat.id)

      // Build participant array with correct count and pre-set gender if locked
      const currentParticipants = getValues('participants')
      const newParticipants = Array.from({ length: cat.participantCount }).map((_, i) => {
        const existing = currentParticipants[i] ?? emptyParticipant()
        const gender =
          cat.genderRule === 'male-only'
            ? 'M' as const
            : cat.genderRule === 'female-only'
              ? 'F' as const
              : existing.gender
        return { ...existing, gender }
      })
      replace(newParticipants)
    },
    [setValue, getValues, replace],
  )

  /* ---- Navigation ---- */
  const handleNext = useCallback(async () => {
    if (activeStep === 0) {
      if (!selectedCategory) return
      setActiveStep(1)
      return
    }

    if (activeStep === 1) {
      // Validate team name for team categories
      const fieldsToValidate: (keyof RegistrationForm)[] = ['participants']
      if (selectedCategory && selectedCategory.participantCount > 1) {
        fieldsToValidate.push('teamName')
      }

      // Validate participants + teamName
      const valid = await trigger(fieldsToValidate)

      // Additional gender validation for mixed categories
      if (valid && selectedCategory) {
        const participants = getValues('participants')
        if (selectedCategory.genderRule === 'mixed') {
          const maleCount = participants.filter((p) => p.gender === 'M').length
          const femaleCount = participants.filter((p) => p.gender === 'F').length

          if (selectedCategory.type === 'Dupla' && (maleCount !== 1 || femaleCount !== 1)) {
            methods.setError('participants.0.gender', {
              message: 'La dupla mixta requiere 1 hombre y 1 mujer',
            })
            return
          }
          if (selectedCategory.type === 'Relevo' && (maleCount !== 2 || femaleCount !== 2)) {
            methods.setError('participants.0.gender', {
              message: 'El relevo mixto requiere 2 hombres y 2 mujeres',
            })
            return
          }
        }
      }

      if (valid) {
        setActiveStep(2)
      }
      return
    }
  }, [activeStep, selectedCategory, trigger, getValues, methods])

  const handleBack = useCallback(() => {
    setActiveStep((prev) => prev - 1)
  }, [])

  const onSubmit = useCallback(
    (data: RegistrationForm) => {
      if (!selectedCategory) return

      // Store registration data in sessionStorage before navigating to payment
      const registrationData = {
        teamName: data.teamName || null,
        participants: data.participants.map(p => ({
          name: p.name,
          email: p.email,
          phone: p.phone,
          birth_date: p.birthDate,
          gender: p.gender,
        })),
        contactEmail: data.participants[0].email,
        contactPhone: data.participants[0].phone,
      }
      sessionStorage.setItem('pendingRegistration', JSON.stringify(registrationData))

      navigate({
        to: '/pago',
        search: { categoryId: selectedCategory.id },
      })
    },
    [navigate, selectedCategory],
  )

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background:
          'radial-gradient(ellipse at 50% 0%, rgba(230,242,177,0.06) 0%, #000000 60%)',
      }}
    >
      <Container maxWidth="sm" sx={{ py: 3, px: 2 }}>
        {/* Header */}
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 3 }}>
          {activeStep > 0 && (
            <Button
              onClick={handleBack}
              startIcon={<ArrowBackIcon />}
              sx={{
                color: 'text.secondary',
                textTransform: 'none',
                minWidth: 'auto',
                px: 1,
                fontFamily: "'Space Grotesk', sans-serif",
                '&:hover': { color: '#E6F2B1' },
              }}
            >
              Atrás
            </Button>
          )}
          <Typography
            variant="h4"
            sx={{
              fontWeight: 900,
              color: '#E6F2B1',
              fontFamily: 'tt-norms-pro-extra-black-italic, sans-serif',
              fontStyle: 'italic',
              flex: 1,
            }}
          >
            Inscripción
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', fontFamily: "'Space Grotesk', sans-serif" }}>
            Paso {activeStep + 1} de 3
          </Typography>
        </Stack>

        {/* Stepper */}
        <Stepper
          activeStep={activeStep}
          alternativeLabel
          sx={{
            mb: 4,
            '& .MuiStepLabel-label': {
              color: 'text.secondary',
              fontSize: { xs: '0.75rem', sm: '0.85rem' },
              fontFamily: "'Space Grotesk', sans-serif",
              '&.Mui-active': { color: '#E6F2B1', fontWeight: 700 },
              '&.Mui-completed': { color: '#E6F2B1' },
            },
            '& .MuiStepIcon-root': {
              color: 'rgba(230, 242, 177, 0.12)',
              '&.Mui-active': { color: '#E6F2B1' },
              '&.Mui-completed': { color: '#E6F2B1' },
            },
            '& .MuiStepConnector-line': {
              borderColor: 'rgba(230, 242, 177, 0.12)',
            },
          }}
        >
          {STEP_LABELS.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Form */}
        <FormProvider {...methods}>
          <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Step 1: Category */}
            {activeStep === 0 && (
              <StepCategory
                selectedId={selectedCategory?.id ?? null}
                onSelect={handleCategorySelect}
              />
            )}

            {/* Step 2: Participants */}
            {activeStep === 1 && selectedCategory && (
              <StepParticipants category={selectedCategory} />
            )}

            {/* Step 3: Summary */}
            {activeStep === 2 && selectedCategory && (
              <StepSummary category={selectedCategory} />
            )}

            {/* Navigation buttons */}
            <Box sx={{ mt: 4, mb: 2 }}>
              {activeStep < 2 && (
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  disabled={activeStep === 0 && !selectedCategory}
                  onClick={handleNext}
                  sx={{
                    py: 1.5,
                    borderRadius: 0,
                    fontWeight: 700,
                    fontSize: '1rem',
                    letterSpacing: '0.08em',
                    '&:hover': {
                      bgcolor: '#000000',
                      color: '#E6F2B1',
                      border: '2px solid #E6F2B1',
                    },
                  }}
                >
                  SIGUIENTE
                </Button>
              )}

              {activeStep === 2 && (
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    py: 1.8,
                    fontSize: '1.1rem',
                    fontWeight: 800,
                    letterSpacing: '0.08em',
                    bgcolor: '#E6F2B1',
                    color: '#000000',
                    borderRadius: 0,
                    border: '2px solid #E6F2B1',
                    '&:hover': {
                      bgcolor: '#000000',
                      color: '#E6F2B1',
                    },
                  }}
                >
                  IR A PAGAR
                </Button>
              )}
            </Box>
          </Box>
        </FormProvider>
      </Container>
    </Box>
  )
}