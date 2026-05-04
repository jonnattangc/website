import React, { useState, useEffect } from 'react';
import { Grid, Alert, Select, MenuItem, CircularProgress, TextField, FormControl, Button, Box } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { apiClient, authHeaders } from '../services/api';
import { env } from '../config/clientEnv';

function Crud() {
  const [error, setError] = useState(false);
  const [message, setMessage] = useState('');
  const [genOtp, setGenOtp] = useState(false);
  const [validOtp, setValidOtp] = useState(false);
  const [captcha, setCaptcha] = useState(false);
  const [mobile, setMobile] = useState('');
  const [len, setLen] = useState('');
  const [otp, setOtp] = useState('');
  const [ref, setRef] = useState('');
  const [duration, setDuration] = useState(0);

  const handleVerificationSuccess = async (token, ekey) => {
    try {
      await validateCaptcha(token, ekey);
    } catch (error) {
      console.error('Captcha verification failed:', error);
    }
  };

  const validateCaptcha = async (token, ekey) => {
    try {
      console.log('HCaptcha token: ', token);
      console.log('HCaptcha ekey: ', ekey);
      const dataCaptcha = { token, sitekey: env.HCAPTCHA_SITE_KEY };
      const response = await apiClient('/page/hcaptcha', {
        method: 'POST',
        body: JSON.stringify({ data: dataCaptcha }),
        headers: authHeaders(),
      });
      if (response.data) {
        setCaptcha(response.data.success);
      } else {
        setCaptcha(false);
      }
    } catch (error) {
      console.error('Captcha validation error:', error);
      setCaptcha(false);
    }
  };

  const generateOtp = async () => {
    try {
      console.log('Mobile: [' + mobile + '] Len: ' + len);
      setGenOtp(true);
      setValidOtp(false);
      setError(false);

      let mobilePhone = mobile != null ? mobile.replace(/\s/g, '') : '';
      if (mobilePhone.length === 8) mobilePhone = '569' + mobilePhone;
      if (mobilePhone.length === 9) mobilePhone = '56' + mobilePhone;
      if (mobilePhone.startsWith('+56')) mobilePhone = mobilePhone.replace('+56', '56');

      console.log('Formatter number ' + mobilePhone);
      if (mobilePhone.length < 10) {
        setGenOtp(false);
        setValidOtp(false);
        setError(true);
        setCaptcha(false);
        setMessage('Error de numero mobile');
        return;
      }

      const data = {
        number_mobile: mobilePhone,
        duration_min: 5,
        length_otp: len,
      };

      const response = await apiClient('/page/waza/generate', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: authHeaders(),
      });

      if (response.data) {
        const text = 'Referencia: ' + response.ref;
        setGenOtp(false);
        setError(false);
        setMessage(text);
        setCaptcha(true);
      } else {
        setGenOtp(false);
        setValidOtp(false);
        setError(true);
        setCaptcha(false);
        setMessage(response.statusDescription || 'Error');
      }
    } catch (error) {
      setGenOtp(false);
      setValidOtp(false);
      setError(true);
      setMessage(error.message || 'Error');
      setCaptcha(false);
      console.error('Generate OTP error:', error);
    }
  };

  const validateOtp = async () => {
    try {
      console.log('Otp: ' + otp + ' Ref: ' + ref);
      setGenOtp(false);
      setValidOtp(true);
      setError(false);
      setMessage('');

      const data = { reference: ref, otp: otp };
      const response = await apiClient('/page/waza/validate', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: authHeaders(),
      });

      if (response.success) {
        setGenOtp(false);
        setValidOtp(false);
        setError(false);
        setMessage(response.statusDescription);
        setCaptcha(true);
      } else {
        setGenOtp(false);
        setValidOtp(false);
        setError(true);
        setCaptcha(true);
        setMessage(response.statusDescription || 'Error');
      }
    } catch (error) {
      setGenOtp(false);
      setValidOtp(false);
      setError(true);
      setMessage(error.message || 'Error');
      setCaptcha(false);
      console.error('Validate OTP error:', error);
    }
  };

  const msgType = error ? 'error' : 'success';
  const showAlert = message !== '';

  return (
    <div className="App_Main">
      <div>
        <TextField
          id="mobile"
          label="Teléfono móvil"
          helperText="Teléfono del destinatario de la Otp"
          error={error}
          size="small"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
        <TextField
          id="len"
          label="Largo de la Otp"
          helperText="Cantidad de números de la Otp"
          error={error}
          size="small"
          value={len}
          onChange={(e) => setLen(e.target.value)}
        />
        <FormControl variant="standard" sx={{ m: 1, minWidth: 120 }}>
          <Select
            labelId="minutos"
            id="type"
            value={duration}
            label="Duración en minutos"
            onChange={(e) => setDuration(e.target.value)}
          >
            <MenuItem value={0}>5 min.</MenuItem>
            <MenuItem value={1}>10 min.</MenuItem>
            <MenuItem value={2}>15 min.</MenuItem>
            <MenuItem value={3}>20 min.</MenuItem>
            <MenuItem value={4}>30 min.</MenuItem>
          </Select>
        </FormControl>
      </div>
      <div style={{ padding: '10px', border: 'none' }}>
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <div style={{ display: 'contents', padding: '10px' }}>
              <Button type="button" variant="contained" color="success" disabled={!captcha} onClick={generateOtp}>
                Solicitar OTP
              </Button>
            </div>
          </Grid>
          <Grid item xs={2}>
            {genOtp && (
              <div style={{ textAlign: 'left' }}>
                <CircularProgress color="success" size="20px" />
              </div>
            )}
          </Grid>
        </Grid>
      </div>

      <div>
        <TextField
          id="otp"
          label="One-Time Password"
          helperText="Otp Recibida"
          error={error}
          size="small"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
        />
        <TextField
          id="ref"
          label="Referencia al pedir otp"
          helperText="Referencia recibida"
          error={error}
          size="small"
          value={ref}
          onChange={(e) => setRef(e.target.value)}
        />
      </div>
      <div style={{ padding: '10px', border: 'none' }}>
        <Grid container spacing={2}>
          <Grid item xs={10}>
            <div style={{ display: 'contents', padding: '10px' }}>
              <Button type="button" variant="contained" color="primary" disabled={!captcha} onClick={validateOtp}>
                Validar OTP
              </Button>
            </div>
          </Grid>
          <Grid item xs={2}>
            {validOtp && (
              <div style={{ textAlign: 'left' }}>
                <CircularProgress color="primary" size="20px" />
              </div>
            )}
          </Grid>
        </Grid>
      </div>

      <div>
        <HCaptcha sitekey={env.HCAPTCHA_SITE_KEY} onVerify={(token, ekey) => handleVerificationSuccess(token, ekey)} />
      </div>
      <div>
        {showAlert && <Alert severity={msgType}>{message}</Alert>}
      </div>
    </div>
  );
}

function MyTable() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await apiClient('/emulator/page/users', { method: 'GET' });
        if (response.users) {
          const data = response.users.map(user => ({
            id: user.id,
            name: user.name,
            mail: user.mail,
            rut: user.rut,
            city: user.city,
            age: user.age,
            mobile: user.mobile,
            address: user.address,
          }));
          setRows(data);
        }
      } catch (error) {
        console.error('Error loading table:', error);
      }
    }
    fetchData();
  }, []);

  const columns = [
    { field: 'id', headerName: 'ID', width: 30 },
    { field: 'name', headerName: 'Nombre', width: 100, editable: true },
    { field: 'mail', headerName: 'Correo', width: 150, editable: true },
    { field: 'rut', headerName: 'RUT', width: 110, editable: true },
    { field: 'city', headerName: 'Ciudad', width: 110, editable: true },
    { field: 'age', headerName: 'Edad', width: 110, editable: true },
    { field: 'mobile', headerName: 'Celular', width: 110, editable: true },
    { field: 'address', headerName: 'Dirección', description: 'Direccion Usuario', sortable: false, width: 160, valueGetter: (params) => `${params.row.firstName || ''} ${params.row.lastName || ''}` },
  ];

  return (
    <div className="App_Main">
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={5}
          rowsPerPageOptions={[5]}
          checkboxSelection={false}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
    </div>
  );
}

export { Crud, MyTable };
