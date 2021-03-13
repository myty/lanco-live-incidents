import React from "react";
import GoogleMapReact from "google-map-react";
import { IncidentRecord } from "models/incident-record";
import MapMarker from "components/map-marker";

interface MapProps {
    incident: IncidentRecord;
    otherIncidents?: IncidentRecord[];
}

const apiKey: string = (import.meta.env.VITE_GOOGLE_MAPS_KEY as string) ?? "";

export function Map(props: MapProps) {
    const { incident, otherIncidents = [] } = props;
    const { geoLocation } = incident;
    const { lat, lng } = geoLocation ?? {};

    if (lat == null || lng == null) {
        return null;
    }

    return (
        <div
            style={{
                height: "calc(40vh)",
                width: "100%",
            }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: apiKey }}
                defaultCenter={{ lat, lng }}
                defaultZoom={15}>
                <MapMarker
                    id={incident.id}
                    lat={lat}
                    lng={lng}
                    primary={true}
                />
                {otherIncidents.map(({ geoLocation, id }) => {
                    const { lat, lng } = geoLocation ?? {};

                    if (lat == null || lng == null) {
                        return null;
                    }

                    return <MapMarker id={id} lat={lat} lng={lng} />;
                })}
            </GoogleMapReact>
        </div>
    );
}
