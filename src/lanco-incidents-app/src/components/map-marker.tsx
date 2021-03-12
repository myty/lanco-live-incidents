import { Coords } from "google-map-react";
import React from "react";

interface MapMarkerProps extends Partial<Coords> {
    text?: string;
    primary?: boolean;
}

export default function MapMarker({ text, primary = false }: MapMarkerProps) {
    const className = `${
        primary ? "border-blue-900 bg-transparent" : "border-gray-500"
    } rounded-full h-8 w-8 flex items-center justify-center border-4 relative -left-4 -top-4`;

    return (
        <div className={className}>
            <div className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full opacity-30"></div>
        </div>
    );
}
