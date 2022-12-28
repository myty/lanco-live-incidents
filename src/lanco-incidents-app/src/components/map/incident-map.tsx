import React from "react";
import { IncidentRecord } from "models/view-models/incident-record";
import { Geocode } from "types/geocode";
import { LatLngLiteral } from "leaflet";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { IncidentMarker } from "components/map/incident-marker";

interface MapProps {
    currentPosition?: Geocode;
    defaultCenter?: LatLngLiteral;
    incident: IncidentRecord;
    otherIncidents?: IncidentRecord[];
}

export const IncidentMap: React.FC<MapProps> = (props: MapProps) => {
    const {
        currentPosition,
        defaultCenter,
        incident,
        otherIncidents = [],
    } = props;
    const { geoLocation } = incident;
    const { lat, lng } = geoLocation ?? {};

    if (lat == null || lng == null) {
        return null;
    }

    return (
        <MapContainer
            center={defaultCenter}
            zoom={13}
            style={{
                height: "calc(40vh)",
                width: "100%",
            }}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {currentPosition != null && (
                <IncidentMarker
                    key="currentPostion"
                    position={{
                        lat: currentPosition.lat,
                        lng: currentPosition.lng,
                    }}
                    html={`<div class="relative flex items-center justify-center w-6 h-6 bg-green-600 border-4 rounded-full -left-1.5 -top-1.5" />`}
                />
            )}

            {otherIncidents.map((incident) => {
                const { lat, lng } = incident.geoLocation ?? {};

                if (lat == null || lng == null) {
                    return null;
                }

                return (
                    <IncidentMarker
                        key={incident.id}
                        position={{ lat, lng }}
                        to={`/incidents/${incident.id}`}
                        html={`<div class="relative flex items-center justify-center w-6 h-6 bg-gray-600 border-4 rounded-full -top-1.5 -left-1.5">
                                 <div class="sr-only">${incident.location}</div>
                               </div>`}
                    />
                );
            })}

            <IncidentMarker
                key={incident.id}
                position={{ lat, lng }}
                html={`<div class="relative flex items-center justify-center w-8 h-8 bg-transparent border-4 border-blue-900 rounded-full -top-[10px] -left-[10px]">
                           <div clas="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full opacity-30" />
                       </div>
                       <div class="relative flex items-center justify-center w-2 h-2 bg-blue-900 rounded-full opacity-70" />`}
            />
        </MapContainer>
    );
};
