import React from "react";
import GoogleMapReact, { Coords } from "google-map-react";
import { IncidentRecord } from "models/view-models/incident-record";
import MapMarker from "components/map/map-marker";
import MapCurrentLocationMarker from "components/map/map-current-location-marker";
import { Geocode } from "types/geocode";

interface MapProps {
    currentPosition?: Geocode;
    defaultCenter?: Coords;
    incident: IncidentRecord;
    otherIncidents?: IncidentRecord[];
}

const apiKey: string = (import.meta.env.VITE_GOOGLE_MAPS_KEY as string) ?? "";

export const Map: React.FC<MapProps> = (props: MapProps) => {
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
        <div
            style={{
                height: "calc(40vh)",
                width: "100%",
            }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: apiKey }}
                defaultCenter={defaultCenter}
                defaultZoom={15}>
                {currentPosition != null && (
                    <MapCurrentLocationMarker
                        lat={currentPosition.lat}
                        lng={currentPosition.lng}
                    />
                )}
                {otherIncidents.map(({ geoLocation, id, location }) => {
                    const { lat, lng } = geoLocation ?? {};

                    if (lat == null || lng == null) {
                        return null;
                    }

                    return (
                        <MapMarker
                            id={id}
                            key={id}
                            lat={lat}
                            lng={lng}
                            text={location}
                        />
                    );
                })}
                <MapMarker
                    id={incident.id}
                    key={incident.id}
                    lat={lat}
                    lng={lng}
                    primary={true}
                    text={incident.location}
                />
            </GoogleMapReact>
        </div>
    );
};
