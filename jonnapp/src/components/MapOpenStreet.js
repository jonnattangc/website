import React from 'react'
import PropTypes from 'prop-types'
import { MapContainer, Marker, Popup, TileLayer, Tooltip, LayerGroup, Circle } from 'react-leaflet'

export class MapOpenStreet extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            detail: this.props.detail,
            title: this.props.title,
            point: this.props.point,
            center: this.props.center,
            zoom: this.props.zoom
        };
    }

    render() {
        const { title, detail, center, point, zoom } = this.state;
        const fillRedOptions = { fillColor: 'green' }

        console.log('Centro: ', center)
        console.log('Direccion: ', detail)

        return (
            <div className='App_LeafMap' align='center'>
                <MapContainer center={center} id="map" scrollWheelZoom={true} zoom={zoom} >
                    <TileLayer attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Circle center={center} pathOptions={fillRedOptions} radius={100} stroke={false} />
                    <Marker position={center}>
                        <Popup><strong> {title}: </strong> {detail} </Popup>
                        <Tooltip>Tooltip for Marker</Tooltip>
                    </Marker>
                </MapContainer>
            </div>
        )
    }
}

MapOpenStreet.propTypes = {
    title: PropTypes.string,
    detail: PropTypes.string,
    center: PropTypes.array,
    point: PropTypes.array,
    zoom: PropTypes.number,
}