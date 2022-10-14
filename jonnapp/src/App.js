import './App.css';
import React from 'react';
import { Container, Grid } from '@mui/material';
import { CLCommunes } from './components/CLCommunes'
import { Curriculum } from './components/Curriculum'
import { Experiments } from './components/Experiments'
import { BrowserRouter, Routes, Route, NavLink, } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Container maxWidth='xl'>
        <Menu />
        <Routes>
          <Route path="/" exact element={<Curriculum />} />
          <Route path="communes" exact element={<CLCommunes default={'R1'} disabled={false} />} />
          <Route path="/experiments" exact element={<Experiments/>} />
          <Route path='*' element={<NoFound />} />
        </Routes>
      </Container >
    </BrowserRouter>
  );
}

class Menu extends React.Component {
  render() {
    return (
      <Grid container rowSpacing={5} columnSpacing={0} >
        <Grid item xs={2}>
          <NavLink to="/">
            <div className='App_Menu' align='center'>
              Home
            </div>
          </NavLink>
        </Grid>
        <Grid item xs={2}>
          <NavLink to="/communes">
            <div className='App_Menu' align='center'>
              Comunas
            </div>
          </NavLink>
        </Grid>
        <Grid item xs={2}>
          <NavLink to="/experiments">
            <div className='App_Menu' align='center'>
              Experimentos
            </div>
          </NavLink>
        </Grid>
        <Grid item xs={2}>
          <a href='https://dev.jonnattan.com/wp/' target='_blank' rel='noreferrer' >
            <div className='App_Menu' align='center'>
              Wordpress
            </div>
          </a>
        </Grid>
        <Grid item xs={2}>
          <a href='https://www.jonnattan.com' target='_blank' rel='noreferrer' >
            <div className='App_Menu' align='center'>
              Personal
            </div>
          </a>
        </Grid>
        <Grid item xs={2}>
          <a href='https://www.condominio-atlantico.com' target='_blank' rel='noreferrer' >
            <div className='App_Menu' align='center'>
              Comunidad
            </div>
          </a>
        </Grid>
      </Grid>

    );
  }
}

class NoFound extends React.Component {
  render() {
    return (<div className='App_Main' align='center'><h3> Pagina no encontrada </h3></div>);
  }
}

export default App;
