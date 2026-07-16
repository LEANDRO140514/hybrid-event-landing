import { useLocation, useNavigate } from '@tanstack/react-router'
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material'
import HomeRoundedIcon from '@mui/icons-material/HomeRounded'
import FitnessCenterRoundedIcon from '@mui/icons-material/FitnessCenterRounded'
import GroupsRoundedIcon from '@mui/icons-material/GroupsRounded'
import EmojiEventsRoundedIcon from '@mui/icons-material/EmojiEventsRounded'
import ShoppingBagRoundedIcon from '@mui/icons-material/ShoppingBagRounded'
import PersonRoundedIcon from '@mui/icons-material/PersonRounded'

const MONO_FONT = '"Space Grotesk", monospace'

const tabs = [
  { path: '/app', label: 'Inicio', icon: <HomeRoundedIcon /> },
  { path: '/app/entrenamiento', label: 'Entrenar', icon: <FitnessCenterRoundedIcon /> },
  { path: '/app/comunidad', label: 'Comunidad', icon: <GroupsRoundedIcon /> },
  { path: '/app/evento', label: 'Evento', icon: <EmojiEventsRoundedIcon /> },
  { path: '/app/shop', label: 'Shop', icon: <ShoppingBagRoundedIcon /> },
  { path: '/app/perfil', label: 'Perfil', icon: <PersonRoundedIcon /> },
]

export default function BottomTabNav() {
  const location = useLocation()
  const navigate = useNavigate()

  // Determine active tab
  const currentPath = location.pathname
  const activeTab = tabs.reduce((best, tab) => {
    if (currentPath.startsWith(tab.path) && tab.path.length > best.path.length) {
      return tab
    }
    return best
  }, tabs[0])

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        bgcolor: '#111111',
        borderTop: '1px solid rgba(230,242,177,0.12)',
        pb: 'env(safe-area-inset-bottom, 0px)',
        borderRadius: 0,
      }}
      elevation={0}
    >
      <BottomNavigation
        value={activeTab.path}
        onChange={(_, newPath) => navigate({ to: newPath })}
        sx={{
          bgcolor: 'transparent',
          '& .MuiBottomNavigationAction-root': {
            color: 'rgba(255,255,255,0.35)',
            minWidth: 0,
            py: 0.5,
            '&.Mui-selected': {
              color: '#E6F2B1',
            },
          },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.6rem',
            fontFamily: MONO_FONT,
            fontWeight: 600,
            letterSpacing: '0.05em',
            '&.Mui-selected': {
              fontSize: '0.6rem',
              fontWeight: 700,
            },
          },
        }}
      >
        {tabs.map((tab) => (
          <BottomNavigationAction
            key={tab.path}
            value={tab.path}
            label={tab.label}
            icon={tab.icon}
          />
        ))}
      </BottomNavigation>
    </Paper>
  )
}