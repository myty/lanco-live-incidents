import React, { useEffect, useState } from "react";
import useIncidents from "hooks/use-incidents";
import { Map } from "components/map";
import { Coords } from "google-map-react";
import { IncidentDetailSection } from "./incident-detail-section";
import { IncidentRecord } from "models/incident-record";

export interface IncidentDetailContentProps {
    incident?: IncidentRecord | null;
}

export const IncidentDetailContent: React.FC<IncidentDetailContentProps> = ({
    incident,
}) => {
    const [defaultCenter, setDefaultCenter] = useState<Coords>();
    const { incidents } = useIncidents();

    const otherIncidents = incidents.filter(
        (other) => other.id !== incident?.id
    );

    useEffect(() => {
        if (defaultCenter == null && incident?.geoLocation != null) {
            setDefaultCenter(incident.geoLocation);
        }
    }, [incident]);

    if (incident == null) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {defaultCenter != null && (
                <Map
                    defaultCenter={defaultCenter}
                    incident={incident}
                    otherIncidents={otherIncidents}
                />
            )}

            <div className="text-xs">
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
