import React, { useState, useEffect } from 'react';
import { Alert, Grid, Stack, CircularProgress } from '@mui/material';
import { Curriculum } from './Curriculum';
import { apiClient, authHeaders } from '../services/api';

function Intranet() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function getAuth() {
      try {
        const response = await apiClient('/checkall', {
          method: 'GET',
          headers: authHeaders(),
        });
        if (!cancelled) {
          if (response.Server === 'dev.jonnattan.com') {
            setAuthorized(true);
          } else {
            setAuthorized(false);
          }
          setLoading(false);
        }
      } catch (error) {
        if (!cancelled) {
          setAuthorized(false);
          setLoading(false);
        }
        console.error('Auth error:', error);
      }
    }
    getAuth();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="App_Main" style={{ textAlign: 'center' }}>
        Solicitando autorización <CircularProgress size={20} />
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="App_Main" style={{ textAlign: 'center' }}>
        <Alert severity="error">El ingreso al sitio privado es restringido</Alert>
      </div>
    );
  }

  return (
    <div className="App_Main">
      <Stack spacing={1}>
        <Grid container rowSpacing={2} columnSpacing={2}>
          <Grid item xs={9}>
            <iframe
              src="https://dev.jonnattan.com/page"
              title="Sitio Interno"
              width="100%"
              height="100%"
              style={{ border: 0, minHeight: 600 }}
            />
          </Grid>
          <Grid item xs={3}>
            <Curriculum />
          </Grid>
        </Grid>
      </Stack>
    </div>
  );
}

export { Intranet };
