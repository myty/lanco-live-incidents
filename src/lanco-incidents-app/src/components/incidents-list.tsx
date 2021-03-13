import { IncidentListItem } from "components/incident-list-item";
import { IncidentRecord } from "models/incident-record";
import React from "react";

export interface IncidentsListProps {
    incidents: IncidentRecord[];
}

export default function IncidentsList({ incidents }: IncidentsListProps) {
    return (
        <ul>
            {incidents.map((incident) => (
                <IncidentListItem key={incident.id} incident={incident} />
            ))}
        </ul>
    );
}
