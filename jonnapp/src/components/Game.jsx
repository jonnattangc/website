import React from 'react';
import { Button, Stack, Paper } from '@mui/material';
import { Memorize } from './Memorize';
import { apiClient, authHeaders } from '../services/api';

function Game() {
  return (
    <div className="App_Main" style={{ textAlign: 'center' }}>
      <Stack spacing={3}>
        <Paper elevation={1}>
          <Jugadores />
        </Paper>
        <Paper elevation={1}>
          <Memorize />
        </Paper>
      </Stack>
    </div>
  );
}

function Jugadores() {
  const mouseClick = async () => {
    try {
      const response = await apiClient('/page/memorize/reset', {
        method: 'GET',
        headers: authHeaders(),
      });
      console.log('GET Response: ', response);
    } catch (error) {
      console.error('Error resetting game:', error);
    }
    window.location.reload();
  };

  return (
    <div className="App_Main" style={{ textAlign: 'center' }}>
      <h3>Este es el juego del memorize, se trata de dar vuelta 2 cartas por jugador</h3>
      <Button variant="contained" color="primary" onClick={mouseClick}>
        Reiniciar
      </Button>
    </div>
  );
}

export { Game };
