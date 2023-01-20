import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { Container} from '@mui/material';
import { Curriculum } from './components/Curriculum'
import { Experiments } from './components/Experiments'
import { Game } from './components/Game'
import { Menu } from './components/Menu'
import { Intranet } from './components/Intranet'
import { MyMap } from './components/MyMap'

import img from './images/no_found.png'
function App() {
  return (
    <BrowserRouter>
      <Container maxWidth='xl'>
        <Menu />
        <Routes>
          <Route path="/" exact element={<Curriculum />} />
          <Route path="/experiments" exact element={<Experiments/>} />
          <Route path="/game" exact element={<Game/>} />
          <Route path="/check" exact element={<Checkly/>} />
          <Route path="/maps" exact element={ <MyMap/>} />
          <Route path="/private"  exact element={<Intranet/>} />
          <Route path='*' element={<NoFound />} />
        </Routes>
      </Container >
    </BrowserRouter>
  );
}

class NoFound extends React.Component {
  render() {
    return (<div className='App_Main' align='center'>
      <img alt="Imagen de pagina no encontrada" src={img} />
    </div>);
  }
}

class Checkly extends React.Component {
  render() {
    return (<div className='App_Main' align='center'>
      <iframe id="inlineFrameExample" title="Inline Frame Example" width="100%" height="500" src="https://jonnattan.checklyhq.com"> </iframe></div>);
    }
}


export default App;
