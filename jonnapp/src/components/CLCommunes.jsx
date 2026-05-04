import React, { useState, useEffect } from 'react';
import { Alert, Grid, CircularProgress, TextField, Button, Stack } from '@mui/material';
import Select from 'react-select';
import HCaptcha from '@hcaptcha/react-hcaptcha';
import { apiClient, authHeaders } from '../services/api';
import { env } from '../config/clientEnv';

export function CLCommunes({ disabled, mapfunc }) {
  const [loadingGral, setLoadingGral] = useState(true);
  const [loadingReg, setLoadingReg] = useState(false);
  const [searching, setSearching] = useState(false);
  const [captchaOk, setCaptchaOk] = useState(false);
  const [communes, setCommunes] = useState(null);
  const [commune, setCommune] = useState(null);
  const [regions, setRegions] = useState(null);
  const [region, setRegion] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [address, setAddress] = useState('');

  useEffect(() => {
    let cancelled = false;
    async function getRegions() {
      try {
        setLoadingReg(true);
        const response = await apiClient('/geo/regions', {
          method: 'GET',
          headers: authHeaders(env.GEO_API_KEY),
        });
        if (!cancelled && response.data?.regions) {
          const regiones = response.data.regions.map(r => ({ value: r.id, label: r.value }));
          setRegions(regiones);
          setLoadingGral(false);
          setLoadingReg(false);
        } else {
          setLoadingGral(false);
          setLoadingReg(false);
          setErrorMsg('Error cargando regiones');
        }
      } catch (error) {
        if (!cancelled) {
          setLoadingGral(false);
          setLoadingReg(false);
          setErrorMsg(error.message || 'Algo salió mal');
        }
        console.error(error);
      }
    }
    getRegions();
    return () => { cancelled = true; };
  }, []);

  const getCommunes = async (regionId) => {
    try {
      setLoadingReg(true);
      const response = await apiClient(`/geo/${regionId}/communes`, {
        method: 'GET',
        headers: authHeaders(env.GEO_API_KEY),
      });
      if (response.data?.communes) {
        const comunas = response.data.communes.map(c => ({ value: c.id, label: c.value }));
        setCommunes(comunas);
        setRegion(response.data.region);
        setLoadingReg(false);
      } else {
        setLoadingReg(false);
        setErrorMsg('Error cargando comunas');
      }
    } catch (error) {
      setLoadingReg(false);
      setErrorMsg(error.message || 'Algo salió mal');
      console.error(error);
    }
  };

  const onChangeCommune = (event) => {
    setCommune(event?.label || null);
  };

  const onSearchMap = async () => {
    try {
      setSearching(true);
      const addressTx = {
        street: encodeURIComponent(address),
        city: encodeURIComponent(commune || ''),
        state: encodeURIComponent(region || ''),
        country: 'Chile',
      };
      const place = await findGeoPos(addressTx);
      if (place != null) {
        const point = [place.latitude, place.longitude];
        mapfunc(point, 'Busqueda', place.detail);
        const msg = `Lat: ${place.latitude} Lon: ${place.longitude} ${place.detail}`;
        setSearching(false);
        setErrorMsg(msg);
      } else {
        setSearching(false);
        setErrorMsg('No hay resultados en la busqueda');
      }
    } catch (error) {
      setSearching(false);
      setErrorMsg(error.message || 'Error en búsqueda');
      console.error(error);
    }
  };

  const findGeoPos = async (dataTx) => {
    const response = await apiClient('/geo/search', {
      method: 'POST',
      headers: authHeaders(env.GEO_API_KEY),
      body: JSON.stringify({ data: dataTx }),
    });
    return response.data || null;
  };

  const onChangeRegion = (event) => {
    setCommunes(null);
    setCommune(null);
    getCommunes(event.value);
  };

  const handleVerificationSuccess = async (token, ekey) => {
    try {
      await validateCaptcha(token, ekey);
    } catch (error) {
      console.error('Captcha verification failed:', error);
    }
  };

  const onChangeAddress = (event) => {
    setAddress(event.target.value);
  };

  const validateCaptcha = async (token, ekey) => {
    try {
      const dataCaptcha = { token, sitekey: env.HCAPTCHA_SITE_KEY };
      const response = await apiClient('/page/hcaptcha', {
        method: 'POST',
        body: JSON.stringify({ data: dataCaptcha }),
        headers: authHeaders(),
      });
      if (response.data) {
        setCaptchaOk(response.data.success);
      } else {
        setCaptchaOk(false);
      }
    } catch (error) {
      console.error('Captcha validation error:', error);
      setCaptchaOk(false);
    }
  };

  if (loadingGral) {
    return (
      <div className="App_Main" style={{ textAlign: 'center' }}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <div className="App_Main" style={{ textAlign: 'center' }}>
      <Stack spacing={2}>
        <Grid container spacing={0} rowSpacing={2} columnSpacing={1}>
          <Grid item xs={3}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <div style={{ width: '100%' }}>
                <Select labelId="Regiones" id="reg" options={regions} isSearchable={true} onChange={onChangeRegion} />
              </div>
              {loadingReg && <CircularProgress color="success" size={20} />}
            </Stack>
          </Grid>

          <Grid item xs={2}>
            {communes && (
              <Select labelId="Comunas" id="com" options={communes} isSearchable={true} onChange={onChangeCommune} />
            )}
          </Grid>

          <Grid item xs={2}>
            {communes && regions && (
              <TextField id="dir" fullWidth label="Dirección personal" helperText="Dirección cualquiera dentro de Chile" size="small" onChange={onChangeAddress} />
            )}
          </Grid>

          <Grid item xs={3}>
            {communes && regions && (
              <div style={{ width: '80%' }}>
                <HCaptcha sitekey={env.HCAPTCHA_SITE_KEY} onVerify={(token, ekey) => handleVerificationSuccess(token, ekey)} />
              </div>
            )}
          </Grid>

          <Grid item xs={2}>
            <Stack direction="row" alignItems="center" spacing={2}>
              {communes && regions && (
                <Button type="button" disabled={!captchaOk} variant="contained" color="success" onClick={onSearchMap}>
                  Buscar
                </Button>
              )}
              {searching && <CircularProgress color="success" size={20} />}
            </Stack>
          </Grid>

          <Grid item xs={12}>
            {errorMsg && (
              <div style={{ width: '70%', textAlign: 'left' }}>
                <Alert severity={errorMsg.startsWith('Lat:') ? 'info' : 'error'}>{errorMsg}</Alert>
              </div>
            )}
          </Grid>
        </Grid>
      </Stack>
    </div>
  );
}
