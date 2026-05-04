import React, { useState, useEffect } from 'react';
import { Alert, Box } from '@mui/material';
import { CargaTexto } from './CargaTexto';
import { apiClient, authHeaders } from '../services/api';

function Curriculum() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function loadCV() {
      let dataCV = null;
      let msgError = null;
      try {
        const response = await apiClient('/page/cv/jonnattan', {
          method: 'GET',
          headers: authHeaders(),
        });
        if (!cancelled) {
          if (response.data && response.data !== '') {
            dataCV = response.data.cv;
          } else {
            msgError = `El CV de ${response.data?.name || 'desconocido'} no se ha recuperado`;
          }
        }
      } catch (error) {
        msgError = error.message || 'Error al cargar el CV';
        console.error('CV load error:', error);
      }
      if (!cancelled) {
        setLoading(false);
        setData(dataCV);
        setErrorMsg(msgError);
      }
    }
    loadCV();
    return () => { cancelled = true; };
  }, []);

  if (loading) return <CargaTexto />;
  if (errorMsg) return <ErrorCv msg={errorMsg} />;
  return <CVBase64 data={data} />;
}

function ErrorCv({ msg }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <Alert severity="error">{msg}</Alert>
    </div>
  );
}

function CVBase64({ data }) {
  if (!data) return null;
  return (
    <Box>
      <iframe
        title="Curriculum Jonnattan"
        width="100%"
        height="400px"
        src={`data:application/pdf;base64,${data}`}
        style={{ border: 0 }}
      />
    </Box>
  );
}

export { Curriculum };
