import { Coords } from "google-map-react";
import React from "react";
import { Link, useHistory } from "react-router-dom";

interface MapMarkerProps extends Partial<Coords> {
    id: string;
    text?: string;
    primary?: boolean;
}

export default function MapMarker({
    id,
    primary = false,
    text,
}: MapMarkerProps) {
    const history = useHistory();
    const handleMapMarkerClick = () => {
        history.replace("", { state: false });
    };

    if (!primary) {
        return (
            <Link
                className="relative flex items-center justify-center w-6 h-6 bg-gray-600 border-4 rounded-full -left-3 -top-3"
                onClick={handleMapMarkerClick}
                to={`/incidents/${id}`}>
                <div className="sr-only">{text}</div>
            </Link>
        );
    }

    return (
        <div>
            <div className="relative flex items-center justify-center w-8 h-8 bg-transparent border-4 border-blue-900 rounded-full -left-4 -top-4">
                <div className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full opacity-30"></div>
            </div>
            <div className="relative flex items-center justify-center w-2 h-2 bg-blue-900 rounded-full opacity-70 -left-1 -top-9"></div>
        </div>
    );
}
