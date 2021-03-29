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
        <li className="flex flex-row mb-2 border-gray-400">
            <Link className="w-full" to={`/incidents/${incident.id}`}>
                <div className="flex items-center flex-1 p-4 bg-white rounded-md shadow cursor-pointer select-none">
                    <div className="flex-grow pr-2">
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
                    <div className="flex-shrink-0 w-16 ml-2">
                        <div>{incident.getIncidentTimeSimple()}</div>
                        <div>
                            {distance == null
                                ? "--"
                                : `${distance.toFixed(2)} mi`}
                        </div>
                        <div>Units: {incident.unitsAssigned.length}</div>
                    </div>
                    <div className="flex-shrink-0 w-4 text-right">
                        <svg
                            width="12"
                            fill="currentColor"
                            height="12"
                            className="text-gray-500 hover:text-gray-800 dark:hover:text-white dark:text-gray-200"
                            viewBox="0 0 1792 1792"
                            xmlns="http://www.w3.org/2000/svg">
                            <path d="M1363 877l-742 742q-19 19-45 19t-45-19l-166-166q-19-19-19-45t19-45l531-531-531-531q-19-19-19-45t19-45l166-166q19-19 45-19t45 19l742 742q19 19 19 45t-19 45z"></path>
                        </svg>
                    </div>
                </div>
            </Link>
        </li>
    );
};
