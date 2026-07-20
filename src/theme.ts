import { createTheme, type ThemeOptions } from '@mui/material/styles'

/**
 * HYBRID EXPERIENCE — Design System v2
 * Palette: #000000 (bg), #E6F2B1 (primary/text), #E9C7DF (accent)
 * Fonts: TT Norms Pro ExtraBlack (brand only), Space Grotesk (UI)
 */

const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#E6F2B1',
      light: '#F0F7CD',
      dark: '#C8D97A',
      contrastText: '#000000',
    },
    secondary: {
      main: '#E9C7DF',
      light: '#F2DCEB',
      dark: '#D09FBF',
      contrastText: '#000000',
    },
    background: {
      default: '#000000',
      paper: '#111111',
    },
    text: {
      primary: '#E6F2B1',
      secondary: '#B0B890',
    },
    divider: 'rgba(230, 242, 177, 0.12)',
    error: {
      main: '#FF5252',
    },
  },
  typography: {
    fontFamily: "'Space Grotesk', 'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    h1: {
      fontWeight: 900,
      fontSize: '2.5rem',
      lineHeight: 1.1,
      letterSpacing: '-0.02em',
      '@media (min-width:600px)': {
        fontSize: '3.5rem',
      },
      '@media (min-width:960px)': {
        fontSize: '4.5rem',
      },
    },
    h2: {
      fontWeight: 800,
      fontSize: '2rem',
      lineHeight: 1.2,
      letterSpacing: '-0.01em',
      '@media (min-width:600px)': {
        fontSize: '2.5rem',
      },
      '@media (min-width:960px)': {
        fontSize: '3rem',
      },
    },
    h3: {
      fontWeight: 700,
      fontSize: '1.5rem',
      lineHeight: 1.3,
      '@media (min-width:600px)': {
        fontSize: '1.75rem',
      },
    },
    h4: {
      fontWeight: 700,
      fontSize: '1.25rem',
      lineHeight: 1.3,
      '@media (min-width:600px)': {
        fontSize: '1.5rem',
      },
    },
    h5: {
      fontWeight: 600,
      fontSize: '1.1rem',
      lineHeight: 1.4,
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
    button: {
      fontWeight: 700,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
    },
  },
  shape: {
    borderRadius: 0,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@font-face': {
          fontFamily: 'tt-norms-pro-extra-black-italic',
          src: 'url("/fonts/tt-norms-pro-extra-black-italic/tt-norms-pro-extra-black-italic.ttf") format("truetype")',
          fontWeight: 900,
          fontStyle: 'italic',
          fontDisplay: 'swap',
        },
        body: {
          scrollBehavior: 'smooth',
          overflowX: 'hidden',
          backgroundColor: '#000000',
        },
        '*': {
          boxSizing: 'border-box',
        },
        '::-webkit-scrollbar': {
          width: '6px',
        },
        '::-webkit-scrollbar-track': {
          background: '#000000',
        },
        '::-webkit-scrollbar-thumb': {
          background: '#E6F2B1',
          borderRadius: 0,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          padding: '12px 28px',
          fontSize: '0.9rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          border: '1px solid rgba(230, 242, 177, 0.15)',
          backgroundImage: 'none',
          backgroundColor: '#111111',
          transition: 'transform 0.15s ease, border-color 0.15s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            borderColor: 'rgba(230, 242, 177, 0.4)',
          },
        },
      },
    },
    MuiCardMedia: {
      styleOverrides: {
        root: {
          filter: 'grayscale(100%) contrast(130%)',
          '&::after': {
            content: '""',
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(230, 242, 177, 0.08)',
            mixBlendMode: 'multiply',
            pointerEvents: 'none',
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: '#111111',
          border: '1px solid rgba(230, 242, 177, 0.15)',
          borderRadius: '0 !important',
          marginBottom: 8,
          '&:before': {
            display: 'none',
          },
          '&.Mui-expanded': {
            margin: '0 0 8px 0',
          },
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 16,
          paddingRight: 16,
          '@media (min-width:600px)': {
            paddingLeft: 24,
            paddingRight: 24,
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: 'rgba(230, 242, 177, 0.12)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
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
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
      },
    },
  },
}

export const theme = createTheme(themeOptions)