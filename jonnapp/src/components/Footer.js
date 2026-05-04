import React from 'react';
import { Box, Typography, Link } from '@mui/material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        background: 'linear-gradient(135deg, #0f2440 0%, #1b3a5c 100%)',
        py: 3,
        px: 3,
        mt: 'auto',
      }}
    >
      <Typography
        variant="body2"
        align="center"
        sx={{ color: 'rgba(255,255,255,0.45)', fontFamily: "'Inter', sans-serif" }}
      >
        <Link
          href="https://www.jonnattan.com"
          target="_blank"
          rel="noopener noreferrer"
          sx={{ color: 'rgba(255,255,255,0.6)', textDecoration: 'none', '&:hover': { color: '#a5b4fc' }, transition: 'color 0.2s' }}
        >
          © Jonnattan G. 2025-2026
        </Link>
        <Box component="span" sx={{ mx: 1.5, opacity: 0.3 }}>·</Box>
        <Link
          href="https://dev.jonnattan.com/terms"
          target="_blank"
          rel="noreferrer"
          sx={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none', '&:hover': { color: '#a5b4fc' }, transition: 'color 0.2s' }}
        >
          Términos y Condiciones
        </Link>
        <Box component="span" sx={{ mx: 1.5, opacity: 0.3 }}>·</Box>
        <Link
          href="https://dev.jonnattan.com/privacity"
          target="_blank"
          rel="noreferrer"
          sx={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'none', '&:hover': { color: '#a5b4fc' }, transition: 'color 0.2s' }}
        >
          Política de Privacidad
        </Link>
      </Typography>
    </Box>
  );
}

export { Footer };
