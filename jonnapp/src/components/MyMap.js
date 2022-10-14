import React from 'react';
import { Popup, TileLayer, Marker, MapContainer } from 'react-leaflet'

<link rel="stylesheet" href="https://unpkg.com/leaflet@1.6.0/dist/leaflet.css" 
    integrity="sha512-xwE/Az9zrjBIphAcBb3F6JVqxf46+CDLwfLMHloNu6KEQCAWi6HcDUbeOfBIptF7tcCzusKFjFw2yuvEpDL9wQ==" 
    crossorigin=""/>

class MyMap extends React.Component {
  render() {
    const position = [-33.4420, -70.6544]
    return (
      <div className='App_Card'>
        <MapContainer center={position} zoom={7} id="mapid" scrollWheelZoom={false} >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={position}>
            <Popup>Santiago de Chile</Popup>
          </Marker>
        </MapContainer>
      </div>
    );
  }
}

export { MyMap };