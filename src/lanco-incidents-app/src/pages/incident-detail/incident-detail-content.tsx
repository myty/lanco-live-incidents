import React, { useEffect, useState } from "react";
import useIncidents from "hooks/use-incidents";
import { Map } from "components/map/map";
import { Coords } from "google-map-react";
import { IncidentDetailSection } from "./incident-detail-section";
import { IncidentRecord } from "models/incident-record";
import useGeolocation from "hooks/use-gps-location";

export interface IncidentDetailContentProps {
    incident?: IncidentRecord | null;
}

export const IncidentDetailContent: React.FC<IncidentDetailContentProps> = ({
    incident,
}) => {
    const [defaultCenter, setDefaultCenter] = useState<Coords>();
    const { incidents } = useIncidents();

    const { currentPosition: position } = useGeolocation();
    const currentPosition =
        position != null
            ? { lat: position.coords.latitude, lng: position.coords.longitude }
            : undefined;

    const otherIncidents = incidents.filter(
        (other) => other.id !== incident?.id
    );

    useEffect(() => {
        if (defaultCenter == null && incident?.geoLocation != null) {
            setDefaultCenter(incident.geoLocation);
        }
    }, [defaultCenter, incident]);

    if (incident == null) {
        return (
            <div className="px-6 py-2 text-sm font-semibold">Loading...</div>
        );
    }

    return (
        <div>
            {defaultCenter != null && (
                <Map
                    currentPosition={currentPosition}
                    defaultCenter={defaultCenter}
                    incident={incident}
                    otherIncidents={otherIncidents}
                />
            )}

            <div className="px-6 py-2 text-xs">
                <IncidentDetailSection title={incident.type}>
                    {incident.subType && (
                        <div className="font-bold text-blue-800">
                            {incident.subType}
                        </div>
                    )}
                    <div>{incident.location}</div>
                    <div>{incident.area}</div>
                </IncidentDetailSection>
                <IncidentDetailSection title={"Date & Time"}>
                    <div>{incident.getIncidentFullDate()}</div>
                </IncidentDetailSection>
                <IncidentDetailSection title={"Responding"}>
                    <div>
                        {incident.unitsAssigned.map((unit) => (
                            <div key={unit}>{unit}</div>
                        ))}
                    </div>
                </IncidentDetailSection>
            </div>
        </div>
    );
};
