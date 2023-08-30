import './App.css';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Container, Alert, AlertTitle, Grid, CircularProgress } from '@mui/material';

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
          <Route path="/check" exact element={<CheckPages/>} />
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

class CheckPages extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
        loading: true,
        msg: null,
        monitors: []
    };
    this.statusRequest()
  }
  
  statusRequest = async () => {
    try {
      this.setState({ loading: true });

      var request = await fetch(
          'https://dev.jonnattan.com/page/status', {
          method: 'GET',
          mode: 'cors',
          headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': 'dev.jonnattan.com',
              'Authorization': 'Basic ' + process.env.AUTH_JONNA_SERVER
          },
      });
      var response = await request.json();
      console.log('GET: ', response);
      if (request.status === 200) {
        if( response.data.stat === 'ok' )
          this.setState({ loading: false, msg: null, monitors: response.data.monitors });
      }
      else {
          console.log('Código Error: ' + response.data.stat );
          this.setState({ loading: false, msg: "error", monitors: [] });
      }
    }
    catch (error) {
      this.setState({ loading: false, msg: error, monitors: [] });
      throw Error(error);
    }
  }

  render() {
    const { monitors, loading, msg } = this.state;
    let listItems = null

    if (loading)
      return (<div className='App_Main' align='center' > <CircularProgress /> </div>);
    else if (msg != null)
      return (<div className='App_Main' align='center'> <Alert severity="error">{msg}</Alert> </div>);
    else {
      if (monitors != null) {
        listItems = monitors.map((monitor) =>
            <Grid item xs={6}>
                <DetailStatus detail={monitor}/> 
            </Grid>
        )
      }
      return (
          <div className='App_Main' align='center' >
              <Grid container spacing={2}>
                {
                  listItems
                } 
              </Grid>
          </div>
      );
    }
  }
}

class DetailStatus extends React.Component {
  render() {
    const { detail } = this.props
    const type = detail.status === 2 ? "success" : "error"
    const msg = detail.status === 2 ? "UP" : "DOWN"

    return (
      <div className='App_Card' align='center' >
        <Alert severity={type} >
            <AlertTitle>{msg}</AlertTitle>
                El sitio {detail.friendly_name} <strong> {detail.url} </strong>
        </Alert>
      </div>);
  }
}

export default App;
