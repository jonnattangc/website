import React from 'react';
import { Box, Typography, Paper, Chip } from '@mui/material';

const techStack = ['C/C++','Java','Python', 'JavaScript', 'TypeScript', 'React', 'Docker', 'Node.js', 'Base de datos','AWS', 'CI/CD',];

function Home() {
  return (
    <Box>
      {/* Hero section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #0f2440 0%, #1b3a5c 60%, #0f2440 100%)',
        color: 'white',
        py: { xs: 7, md: 11 },
        px: { xs: 3, md: 5 },
        mx: { xs: -2, sm: -3 },
        mb: 5,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: [
            'radial-gradient(circle at 15% 50%, rgba(125,196,160,0.18) 0%, transparent 55%)',
            'radial-gradient(circle at 85% 30%, rgba(45,90,142,0.15) 0%, transparent 50%)',
          ].join(', '),
          pointerEvents: 'none',
        },
      }}>
        <Box sx={{ position: 'relative', zIndex: 1, maxWidth: 700 }}>
          <Typography
            variant="h3"
            component="h1"
            sx={{
              fontWeight: 800,
              mb: 1.5,
              background: 'linear-gradient(90deg, #7dc4a0 0%, #b3e0c8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
              letterSpacing: '-0.03em',
            }}
          >
            Hola, soy Jonnattan
          </Typography>

          <Typography
            variant="h6"
            sx={{ color: 'rgba(255,255,255,0.65)', mb: 4, fontWeight: 500 }}
          >
            Disfruto programando, tomando café y descubriendo cosas nuevas. · Viña del Mar, Chile
          </Typography>

          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            {techStack.map(tech => (
              <Chip
                key={tech}
                label={tech}
                size="small"
                sx={{
                  background: 'rgba(125,196,160,0.18)',
                  color: '#b3e0c8',
                  border: '1px solid rgba(125,196,160,0.35)',
                  fontWeight: 500,
                  fontSize: '0.78rem',
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>

      {/* Bio card */}
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 4 },
          border: '1px solid #d4e8d0',
          mb: 4,
          background: '#fff9f0',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, mb: 2, color: '#1b3a5c' }}>
          Sobre este sitio
        </Typography>

        <Typography variant="body1" paragraph sx={{ color: '#4a6b8a', textAlign: 'justify' }}>
          La intención de desarrollar este sitio (que jamás termina) es mostrar experimentos
          realizados en los momentos de ocio. Muchos se preguntarán: ¿por qué me dedico a programar
          en vez de hacer otras cosas, como ver TV o ir a la playa? La respuesta ni yo la entiendo
          claramente, pero creo que es principalmente porque me gusta y por la curiosidad
          de aprender y experimentar con nuevas cosas del área. Además, por un poco de miedo a
          quedar añejo con mis conocimientos. 
        </Typography>

        <Typography variant="body1" sx={{ color: '#4a6b8a' }}>
          En{' '}
          <a
            href="https://www.jonnattan.com"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#1b3a5c', fontWeight: 600, textDecoration: 'none' }}
          >
            mi blog
          </a>{' '}
          pueden encontrar algunas cosas como mis gustos y forma de pensar. Este sitio está dedicado
          a mis proyectos personales no comerciales. Todos los códigos fuentes —incluso de esta
          página— están disponibles en{' '}
          <a
            href="https://github.com/jonnattangc"
            target="_blank"
            rel="noreferrer"
            style={{ color: '#1b3a5c', fontWeight: 600, textDecoration: 'none' }}
          >
            GitHub
          </a>
          .
        </Typography>

        <Typography variant="body2" sx={{ mt: 3, color: '#7dc4a0', fontStyle: 'italic' }}>
          Espero que sea de su agrado el contenido. Salu2 :)
        </Typography>
      </Paper>
    </Box>
  );
}

export { Home };
