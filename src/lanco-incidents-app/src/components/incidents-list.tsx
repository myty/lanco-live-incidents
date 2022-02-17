import { IncidentListItem } from "components/incident-list-item";
import ScreenLoader from "components/screen-loader/screen-loader";
import { IncidentRecord } from "models/view-models/incident-record";
import React from "react";

export interface IncidentsListProps {
    incidents: IncidentRecord[];
    loading?: boolean;
}

export default function IncidentsList({
    loading = false,
    incidents,
}: IncidentsListProps) {
    const emptyList = (incidents?.length ?? 0) === 0;

    if (loading && emptyList) {
        return <ScreenLoader text="Loading incidents" />;
    }

    if (emptyList) {
        return (
            <div className="flex items-center justify-center text-xl font-light text-gray-400 h-96">
                No incidents found
            </div>
        );
    }

    return (
        <div className="items-center justify-center w-full mx-auto">
            <ul className="flex flex-col">
                {incidents.map((incident) => (
                    <IncidentListItem key={incident.id} incident={incident} />
                ))}
            </ul>
        </div>
    );
}
