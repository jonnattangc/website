import React from 'react'
import PropTypes from 'prop-types'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { Paper, Stack } from '@mui/material'
import { CLCommunes } from './CLCommunes'

class MyMap extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      detail : '',
      title: '',
      point: [-38.688824957701655,-74.1142747419317],
      zoom: 3
    }
  }

  onMoveMap = async ( point, title, description ) => {
    this.setState({ detail: description, title: title, point: point, zoom:15 });
  }

  render() {
    const {point, detail, title, zoom} = this.state;
    return (
      <div className='App_Main' align='center' >
        <Stack spacing={1}>
          <Paper elevation={5}> <MapOpenStreet description={detail} title={title} point={point} zoom={zoom} /> </Paper>
          <Paper elevation={5}> <CLCommunes default={'08'} disabled={false} mapfunc={this.onMoveMap} /> </Paper>
        </Stack>
      </div>
    );
  }
}

class MapOpenStreet extends React.Component {
  render() {
    const { title, description, point, zoom } = this.props
    return (
      <div className='App_LeafMap' align='center'>
        <MapContainer center={point} id="map" scrollWheelZoom={true} zoom={zoom} >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {
            point[0] !== 0.0 && point[1] !== 0.0 && description !== '' ? 
              <Marker position={point}> 
                <Popup><strong> {title}: </strong> {description} </Popup>
              </Marker> : null
          }
        </MapContainer>
      </div>
    )
  }
}

MapOpenStreet.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  point: PropTypes.array,
  zoom: PropTypes.number,
}

export { MyMap };