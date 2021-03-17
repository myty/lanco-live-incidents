import useGeolocation from "hooks/use-gps-location";
import { IncidentRecord } from "models/incident-record";
import React from "react";
import { Link } from "react-router-dom";

interface IncidentListItemProps {
    incident: IncidentRecord;
}

export const IncidentListItem: React.FC<IncidentListItemProps> = ({
    incident,
}) => {
    const { distance } = useGeolocation({
        fromLocation: incident.geoLocation,
        measurement: "miles",
    });

    return (
        <li>
            <Link
                className="flex p-2 mb-1 text-xs text-gray-500 bg-gray-100 border border-gray-200 rounded shadow-sm hover:bg-gray-50"
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
                <div className="flex-shrink-0 ml-2 w-14">
                    <div>{incident.getIncidentTimeSimple()}</div>
                    <div>
                        {distance == null ? "--" : `${distance.toFixed(2)} mi`}
                    </div>
                    <div>Units: {incident.unitsAssigned.length}</div>
                </div>
            </Link>
        </li>
    );
};
