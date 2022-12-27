import React from "react";
import { IncidentRecord } from "models/view-models/incident-record";
import MapMarker, { MarkerType } from "components/map/map-marker";
import { Geocode } from "types/geocode";
import MapWrapper from "components/map/map";

interface MapProps {
    currentPosition?: Geocode;
    defaultCenter?: google.maps.LatLngLiteral;
    incident: IncidentRecord;
    otherIncidents?: IncidentRecord[];
}

export const IncidentMap: React.FC<MapProps> = (props: MapProps) => {
    const { defaultCenter, incident, otherIncidents = [] } = props;
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
            }}
        >
            <MapWrapper zoom={15} center={defaultCenter}>
                <MapMarker
                    key={incident.id}
                    type={MarkerType.CurrentIncident}
                    position={{ lat, lng }}
                />
                {otherIncidents
                    .filter((incident) => incident.geoLocation != null)
                    .map((incident) => {
                        const { lat, lng } = geoLocation ?? {};

                        if (lat == null || lng == null) {
                            return null;
                        }

                        return (
                            <MapMarker
                                key={incident.id}
                                to={`incidents/${incident.id}`}
                                type={MarkerType.Incident}
                                replace={true}
                                position={{ lat, lng }}
                            />
                        );
                    })}
            </MapWrapper>
        </div>
    );
};
