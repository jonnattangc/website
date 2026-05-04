import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { MapContainer, Marker, Popup, TileLayer, Tooltip, Circle, useMap } from 'react-leaflet';

function ChangeMapView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

function MapOpenStreet({ title, detail, center, zoom }) {
  const fillOptions = { fillColor: 'green' };

  return (
    <div className="App_LeafMap" style={{ textAlign: 'center' }}>
      <MapContainer center={center} id="map" scrollWheelZoom={true} zoom={zoom}>
        <ChangeMapView center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Circle center={center} pathOptions={fillOptions} radius={100} stroke={false} />
        <Marker position={center}>
          <Popup><strong>{title}:</strong> {detail}</Popup>
          <Tooltip>Tooltip for Marker</Tooltip>
        </Marker>
      </MapContainer>
    </div>
  );
}

MapOpenStreet.propTypes = {
  title: PropTypes.string,
  detail: PropTypes.string,
  center: PropTypes.array,
  point: PropTypes.array,
  zoom: PropTypes.number,
};

export { MapOpenStreet };
