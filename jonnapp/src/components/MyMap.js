import React from 'react';
import PropTypes from 'prop-types'
import { MapContainer, Marker, Popup, TileLayer, Circle, CircleMarker, Tooltip } from 'react-leaflet'
import { Paper, Stack, CircularProgress } from '@mui/material';
import { CLCommunes } from './CLCommunes'

class MyMap extends React.Component {

  render() {
    const adr = 'Michimalongo 4873 pob las canchas, Talcahuano'
    const name = 'Donde me crié'
    return (
      <div className='App_Main' align='center' >
        <Stack spacing={1}>
          <Paper elevation={5}> <MapOpenStreet address={adr} name={name} /> </Paper>
          <Paper elevation={5}> <CLCommunes default={'R1'} disabled={false} /> </Paper>
        </Stack>
      </div>
    );
  }
}

class MapOpenStreet extends React.Component {

  constructor(props) {
    super(props)
    this.findGeoPos = this.findGeoPos.bind(this)
    this.state = {
      name: this.props.name,
      address: this.props.address,
      lat: 0.0,
      lon: 0.0,
      loading: true
    }
    this.findGeoPos( this.props.address )
  }


  async findGeoPos( adrs ) {
    var address = adrs.trim()
    console.log('Direccion a Buscar: ' + address )
    var url = 'https://dev.jonnattan.com/page/geo/search'
    
    let dataTx = {
      address: address
    }

    const response = await fetch( url, {
        method: 'POST',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            'Accept': 'application/json',
            'Access-Control-Allow-Origin': 'dev.jonnattan.com',
        },
        body: JSON.stringify(dataTx)
    }).catch((error) => { console.error(`[Swap] ERROR:${error}`) })
      if (response != null) {
        const jsonResponse = await response.json()
        if (response.status === 200) {
          console.log('Respuesta Servidor: ', jsonResponse )
          const latitude = jsonResponse.latitude
          const longitude = jsonResponse.longitude
          const direccion = jsonResponse.name
          this.setState({ lat: latitude, lon: longitude, loading: false, address: direccion })
        }
      }
  }

  render() {
    const { lat, lon, name, address, loading } = this.state
    const p = [lat, lon]

    return loading ?
      <div className='App_Main' align='center' > <CircularProgress /> </div> :
      <Mapa address={address} name={name} position={p} />
  }
}

MapOpenStreet.propTypes = {
  name: PropTypes.string,
  address: PropTypes.string
}

class Mapa extends React.Component {

  render() {

    const fillBlueOptions = { fillColor: 'blue' }
    const redOptions = { color: 'red' }

    const { position, name, address } = this.props
    return (
      <div className='App_LeafMap' align='center'>
        <MapContainer center={position} id="map" scrollWheelZoom={true} zoom={9} >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={position}> <Popup><strong>{name}: </strong> {address} </Popup> </Marker>
          <Circle center={position} pathOptions={fillBlueOptions} radius={20000} />

          <CircleMarker
            center={position}
            pathOptions={redOptions}
            radius={20}>
            <Tooltip>Tooltip for CircleMarker</Tooltip>
          </CircleMarker>

        </MapContainer>
      </div>
    )
  }
}

Mapa.propTypes = {
  position: PropTypes.array,
  name: PropTypes.string,
  address: PropTypes.string
}

export { MyMap };