import React from 'react'
import { Paper, Stack } from '@mui/material'
import { CLCommunes } from './CLCommunes'
import { MapOpenStreet } from './MapOpenStreet'

class MyMap extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      detail : '',
      title: 'Resultado',
      point: [-33.01604584903938, -71.54956691862895],
      zoom: 17
    }
  }

  onMoveMap = async ( point, title, description ) => {
    console.log("##### onMoveMap: ", description);
    this.setState({ detail: description, title: title, point: point, center: point, zoom: 9 });
  }

  render() {
    const {point, detail, title, zoom} = this.state;
    return (
      <div className='App_Main' align='center' >
        <Stack spacing={1}>
          <Paper elevation={5}> <MapOpenStreet title={title} detail={detail} center={point} point={point} zoom={zoom} /> </Paper>
          <Paper elevation={5}> <CLCommunes disabled={false} mapfunc={this.onMoveMap} /> </Paper>
        </Stack>
      </div>
    );
  }
}

export { MyMap };