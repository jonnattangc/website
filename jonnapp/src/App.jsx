import './App.css';
import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container, Alert, AlertTitle, Grid, CircularProgress, Box } from '@mui/material';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { Home } from './components/Home';
import { Menu } from './components/Menu';
import { Footer } from './components/Footer';
import { NoFound } from './components/NoFound';
import theme from './theme';
import { apiClient, authHeaders } from './services/api';

const Experiments = React.lazy(() => import('./components/Experiments').then(m => ({ default: m.Experiments })));
const Game = React.lazy(() => import('./components/Game').then(m => ({ default: m.Game })));
const Chat = React.lazy(() => import('./components/Chat').then(m => ({ default: m.Chat })));
const Intranet = React.lazy(() => import('./components/Intranet').then(m => ({ default: m.Intranet })));

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <BrowserRouter>
          <Menu />
          <Box sx={{ flex: 1 }}>
            <Container maxWidth="xl">
              <Suspense fallback={<LoadingFallback />}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/experiments" element={<Experiments />} />
                  <Route path="/game" element={<Game />} />
                  <Route path="/check" element={<CheckPages />} />
                  <Route path="/chat" element={<Chat />} />
                  <Route path="/private" element={<Intranet />} />
                  <Route path="*" element={<NoFound />} />
                </Routes>
              </Suspense>
            </Container>
          </Box>
          <Footer />
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  );
}

function LoadingFallback() {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', py: 8 }}>
      <CircularProgress />
    </Box>
  );
}

function CheckPages() {
  const [loading, setLoading] = React.useState(true);
  const [msg, setMsg] = React.useState(null);
  const [monitors, setMonitors] = React.useState([]);

  React.useEffect(() => {
    let cancelled = false;
    async function statusRequest() {
      try {
        setLoading(true);
        const response = await apiClient('/page/status', {
          method: 'GET',
          headers: authHeaders(),
        });
        if (!cancelled) {
          if (response.data?.stat === 'ok') {
            setLoading(false);
            setMsg(null);
            setMonitors(response.data.monitors || []);
          } else {
            setLoading(false);
            setMsg('Error al obtener estado');
            setMonitors([]);
          }
        }
      } catch (error) {
        if (!cancelled) {
          setLoading(false);
          setMsg(error.message || 'Error');
          setMonitors([]);
        }
        console.error('Status request error:', error);
      }
    }
    statusRequest();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="App_Main" style={{ textAlign: 'center' }}>
        <CircularProgress />
      </div>
    );
  }

  if (msg) {
    return (
      <div className="App_Main" style={{ textAlign: 'center' }}>
        <Alert severity="error">{msg}</Alert>
      </div>
    );
  }

  return (
    <div className="App_Main" style={{ textAlign: 'center' }}>
      <Grid container spacing={2}>
        {monitors.map((monitor) => (
          <Grid item xs={6} key={monitor.id}>
            <DetailStatus detail={monitor} />
          </Grid>
        ))}
      </Grid>
      <p>&nbsp;</p>
    </div>
  );
}

function DetailStatus({ detail }) {
  const type = detail.status === 2 ? 'success' : 'error';
  const msg = detail.status === 2 ? 'EN LÍNEA' : 'FUERA DE LÍNEA';

  return (
    <div className="App_Card" style={{ textAlign: 'center' }}>
      <Alert severity={type}>
        <AlertTitle>{msg}</AlertTitle>
        El sitio {detail.friendly_name} <strong>{detail.url}</strong>
      </Alert>
    </div>
  );
}

export default App;
