import React, { useState, useEffect } from 'react';
import { Paper, Grid, CircularProgress } from '@mui/material';
import { CardMemorize } from './CardMemorize';
import { apiClient, authHeaders } from '../services/api';

function Memorize() {
  const [cardState, setCardState] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchStates() {
      try {
        const response = await apiClient('/page/memorize/states', {
          method: 'GET',
          headers: authHeaders(),
        });
        if (!cancelled && response.data) {
          console.log('#### Data Memorize: ', response.data);
          const cards = response.data.map(state => ({
            name: state.name,
            visible: Boolean(state.state === 'up'),
          }));
          setCardState(cards);
        }
      } catch (error) {
        console.error('Error fetching memorize states:', error);
      }
    }
    fetchStates();
    return () => { cancelled = true; };
  }, []);

  if (!cardState) {
    return (
      <div style={{ textAlign: 'center' }}>
        <CircularProgress color="success" size={50} />
      </div>
    );
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <Grid container spacing={2}>
        {cardState.map(value => (
          <Grid item xs={4} key={value.name}>
            <Paper elevation={3}>
              <CardMemorize visible={value.visible} name={value.name} />
            </Paper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

export { Memorize };
