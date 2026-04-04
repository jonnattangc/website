import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  AppBar, Toolbar, Box, IconButton, Drawer,
  List, ListItem, ListItemButton, ListItemText, useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';

const HamburgerIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
  </svg>
);

const internalLinks = [
  { label: 'Estados', to: '/check' },
  { label: 'Experimentos', to: '/experiments' },
  { label: 'Juego', to: '/game' },
  { label: 'Chat', to: '/chat' },
];

const externalLinks = [
  { label: 'Blog', href: 'https://www.jonnattan.com' },
  { label: 'GitHub', href: 'https://github.com/jonnattangc' },
  { label: 'Sonar', href: 'https://sonarcloud.io/organizations/jonnattan-org/projects' },
  { label: 'Fundación', href: 'https://www.buenaventuracadiz.cl' },
];

const linkSx = {
  color: 'rgba(255,255,255,0.78)',
  textDecoration: 'none',
  fontSize: '0.875rem',
  fontWeight: 500,
  padding: '6px 12px',
  borderRadius: '6px',
  transition: 'background 0.2s ease, color 0.2s ease',
  whiteSpace: 'nowrap',
};

const activeLinkSx = {
  ...linkSx,
  color: '#fff',
  backgroundColor: 'rgba(125,196,160,0.25)',
};

function Menu() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AppBar
      position="static"
      sx={{
        background: 'linear-gradient(135deg, #0f2440 0%, #1b3a5c 100%)',
        boxShadow: '0 2px 20px rgba(0,0,0,0.25)',
      }}
    >
      <Toolbar sx={{ gap: 0.5 }}>
        {/* Brand */}
        <NavLink to="/" style={{ textDecoration: 'none', marginRight: 24 }}>
          <Box sx={{
            fontWeight: 800,
            fontSize: '1.25rem',
            letterSpacing: '-0.02em',
            background: 'linear-gradient(90deg, #7dc4a0, #b3e0c8)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontFamily: "'Inter', sans-serif",
          }}>
            JG
          </Box>
        </NavLink>

        {/* Desktop nav */}
        {!isMobile && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.25, flex: 1 }}>
            {internalLinks.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                style={({ isActive }) => isActive ? activeLinkSx : linkSx}
              >
                {link.label}
              </NavLink>
            ))}
            <Box sx={{ borderLeft: '1px solid rgba(255,255,255,0.12)', height: 24, mx: 1 }} />
            {externalLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                style={linkSx}
              >
                {link.label}
              </a>
            ))}
          </Box>
        )}

        {/* Mobile hamburger */}
        {isMobile && (
          <IconButton
            color="inherit"
            onClick={() => setDrawerOpen(true)}
            sx={{ ml: 'auto' }}
            aria-label="Abrir menú"
          >
            <HamburgerIcon />
          </IconButton>
        )}
      </Toolbar>

      {/* Mobile drawer */}
      <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 240, pt: 2 }}>
          <List dense>
            <ListItem disablePadding>
              <ListItemButton component={NavLink} to="/" onClick={() => setDrawerOpen(false)}>
                <ListItemText primary="Inicio" />
              </ListItemButton>
            </ListItem>
            {internalLinks.map(link => (
              <ListItem key={link.to} disablePadding>
                <ListItemButton component={NavLink} to={link.to} onClick={() => setDrawerOpen(false)}>
                  <ListItemText primary={link.label} />
                </ListItemButton>
              </ListItem>
            ))}
            <Box sx={{ borderTop: '1px solid #e2e8f0', my: 1 }} />
            {externalLinks.map(link => (
              <ListItem key={link.href} disablePadding>
                <ListItemButton
                  component="a"
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => setDrawerOpen(false)}
                >
                  <ListItemText primary={link.label} primaryTypographyProps={{ color: 'text.secondary' }} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
}

export { Menu };
