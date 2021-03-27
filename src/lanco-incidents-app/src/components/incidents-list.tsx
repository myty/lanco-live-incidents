import { IncidentListItem } from "components/incident-list-item";
import { IncidentRecord } from "models/incident-record";
import React from "react";

export interface IncidentsListProps {
    incidents: IncidentRecord[];
}

export default function IncidentsList({ incidents }: IncidentsListProps) {
    return (
        <div className="container flex flex-col items-center justify-center w-full mx-auto">
            <ul className="flex flex-col">
                {incidents.map((incident) => (
                    <IncidentListItem key={incident.id} incident={incident} />
                ))}
            </ul>
        </div>
    );
}
