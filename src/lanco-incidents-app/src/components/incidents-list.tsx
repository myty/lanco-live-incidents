import { IncidentRecord } from "models/incident-record";
import React from "react";
import { Link } from "react-router-dom";

export interface IncidentsListProps {
    incidents: IncidentRecord[];
}

export default function IncidentsList({ incidents }: IncidentsListProps) {
    return (
        <ul>
            {incidents.map((incident) => (
                <li key={incident.id}>
                    <Link
                        className="flex p-2 mb-1 text-xs text-gray-500 bg-gray-100 border border-gray-200 rounded hover:bg-gray-50"
                        to={`/incidents/${incident.id}`}>
                        <div className="flex-grow">
                            <div className="text-sm font-bold text-gray-900">
                                {incident.type}
                            </div>
                            {incident.subType && (
                                <div className="font-bold text-blue-800">
                                    {incident.subType}
                                </div>
                            )}
                            <div className="">{incident.location}</div>
                            <div className="">{incident.area}</div>
                        </div>
                        <div className="w-16">
                            <div>{incident.getIncidentTimeSimple()}</div>
                            <div>Units: {incident.unitsAssigned.length}</div>
                        </div>
                    </Link>
                </li>
            ))}
        </ul>
    );
}
