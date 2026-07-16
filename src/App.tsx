import { Outlet } from '@tanstack/react-router'
import { Box } from '@mui/material'

export default function App() {
  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <Outlet />
    </Box>
  )
}
