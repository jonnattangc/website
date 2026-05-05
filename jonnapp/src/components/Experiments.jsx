import React, { useState } from 'react';
import { Grid, Alert, Button, Paper, Stack, Snackbar, IconButton } from '@mui/material';
import { EnrollChart } from './EnrollChart';
import { Crud, MyTable } from './Crud';
import { MyMap } from './MyMap';
import { MyWebcam } from './MyWebcam';
import { apiClient, authHeaders } from '../services/api';

function Experiments() {
  return (
    <Stack spacing={1}>
      <ThreeRow />
      <ZeroRow />
      <FirsRow />
      <TwoRow />
    </Stack>
  );
}

function ZeroRow() {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Paper elevation={4}><MyMap /></Paper>
      </Grid>
    </Grid>
  );
}

function FirsRow() {
  return (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <Paper elevation={4}><Crud /></Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper elevation={4}><MyTable /></Paper>
      </Grid>
    </Grid>
  );
}

function TwoRow() {
  return (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <Paper elevation={4}><BtnsTest /></Paper>
      </Grid>
      <Grid item xs={6}>
        <Paper elevation={4}><EnrollChart /></Paper>
      </Grid>
    </Grid>
  );
}

function ThreeRow() {
  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Paper elevation={4}><MyWebcam /></Paper>
      </Grid>
    </Grid>
  );
}

function MyImagenToS3() {
  const [data, setData] = useState(null);
  const [name, setName] = useState(null);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const moveMouse = (e) => {
    setCoords({ x: e.clientX, y: e.clientY });
  };

  const handleClick = (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('file');
    if (!fileInput || !fileInput.files || !fileInput.files[0]) return;
    const file = fileInput.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      setData(reader.result);
      setName(file.name);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="App_Main" onMouseMove={moveMouse}>
      <div>
        <p>
          <input type="file" id="file" name="files" accept="image/*" />
          &nbsp;&nbsp;&nbsp;
          <Button type="button" variant="contained" color="primary" onClick={handleClick}>
            Enviar
          </Button>
        </p>
      </div>
      <div>&nbsp;&nbsp;&nbsp; Coordenadas: X({coords.x},{coords.y})</div>
      {data && <img alt="Imagen Producto" src={data} title={name} style={{ maxWidth: '100%' }} />}
    </div>
  );
}

function BtnsTest() {
  const [open, setOpen] = useState(false);

  const handleClick = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const action = (
    <React.Fragment>
      <Button color="secondary" size="small" onClick={handleClose}>
        Close Action
      </Button>
      <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose} />
    </React.Fragment>
  );

  const getData = async () => {
    try {
      const response = await apiClient('/page/aws/contents', {
        method: 'GET',
        headers: authHeaders(),
      });
      console.log('AWS contents:', response.data);
    } catch (error) {
      console.error('Error fetching AWS contents:', error);
    }
  };

  const redirectUcc = () => {
    window.location.href = 'https://www.jonnattan.cl/ucc/15173808-7';
  };

  const redirectCSRF = () => {
    window.location.href = 'https://www.jonnattan.cl/page';
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <MyImagenToS3 />
      </Grid>
      <Grid item xs={6}>
        <div style={{ padding: '30px 10px' }}>
          <Button type="button" variant="contained" color="primary" onClick={redirectUcc}>
            TEST UCC
          </Button>
        </div>
      </Grid>
      <Grid item xs={6}>
        <div style={{ padding: '30px 10px' }}>
          <Button type="button" variant="contained" color="primary" onClick={getData}>
            Test AWS
          </Button>
        </div>
      </Grid>
      <Grid item xs={6}>
        <div style={{ padding: '30px 10px' }}>
          <Button type="button" variant="contained" color="primary" onClick={redirectCSRF}>
            CSRF
          </Button>
        </div>
      </Grid>
      <Grid item xs={6}>
        <div style={{ padding: '30px 10px' }}>
          <Button type="button" variant="contained" color="primary" onClick={handleClick}>
            Notificación
          </Button>
          <Snackbar open={open} autoHideDuration={3000} onClose={handleClose} action={action}>
            <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>
              Mensaje de error !
            </Alert>
          </Snackbar>
        </div>
      </Grid>
    </Grid>
  );
}

export { Experiments };
