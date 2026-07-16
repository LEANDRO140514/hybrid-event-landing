import { Outlet } from '@tanstack/react-router'
import { Box } from '@mui/material'
import BottomTabNav from './BottomTabNav'

export default function AppLayout() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        pb: 7, // space for bottom nav
      }}
    >
      <Box sx={{ flex: 1, overflow: 'auto' }}>
        <Outlet />
      </Box>
      <BottomTabNav />
    </Box>
  )
}
