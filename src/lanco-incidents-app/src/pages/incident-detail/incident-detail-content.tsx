import React from "react";
import useIncidents from "hooks/use-incidents";
import { IncidentDetailSection } from "./incident-detail-section";
import { IncidentRecord } from "models/view-models/incident-record";
import useGeolocation from "hooks/use-gps-location";
import { IncidentMap } from "components/map/incident-map";

export interface IncidentDetailContentProps {
    incident?: IncidentRecord | null;
}

export const IncidentDetailContent: React.FC<IncidentDetailContentProps> = ({
    incident,
}) => {
    const { incidents } = useIncidents();

    const { position } = useGeolocation();
    const currentPosition =
        position != null
            ? { lat: position.coords.latitude, lng: position.coords.longitude }
            : undefined;

    const otherIncidents = incidents.filter(
        (other) => other.id !== incident?.id
    );

    if (incident == null) {
        return (
            <div className="px-6 py-2 text-sm font-semibold">Loading...</div>
        );
    }

    return (
        <div>
            {incident?.geoLocation != null && (
                <IncidentMap
                    currentPosition={currentPosition}
                    defaultCenter={incident.geoLocation}
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
