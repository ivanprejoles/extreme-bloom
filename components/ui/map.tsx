"use client"

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from 'leaflet';
import Image from "next/image";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";


interface MapProps {
    posix: LatLngExpression | LatLngTuple,
    zoom?: number,
}

const defaults = {
    zoom: 19,
}

const Map = (Map: MapProps) => {
    const { zoom = defaults.zoom, posix } = Map

    return (
        <MapContainer
            center={posix}
            zoom={zoom}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
            className="rounded-md overflow-hidden shadow-lg z-10 w-max min-w-[100%]"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            <Marker position={posix} draggable={false}>
                <Popup className="rounded-full">
                    <div className="w-[20rem] h-[20rem]
                     relative flex justify-center items-center p-0">
                        <Image 
                            width={0}
                            height={0}
                            layout="fill" 
                            alt="Image"  
                            src="/store-front.png" 
                            className="w-4/5 h-full bottom-0 left-0 object-cover object-top" 
                        />
                    </div>
                </Popup>
            </Marker>
        </MapContainer>
    )
}

export default Map