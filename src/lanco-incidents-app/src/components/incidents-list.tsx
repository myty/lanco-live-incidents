import { IncidentRecord } from "models/incident-record";
import React from "react";

export interface IncidentsListProps {
  incidents: IncidentRecord[];
}

export default function IncidentsList({ incidents }: IncidentsListProps) {
  return (
    <ul>
      {incidents.map((incident) => (
        <li>{incident.location}</li>
      ))}
    </ul>
  );
}
