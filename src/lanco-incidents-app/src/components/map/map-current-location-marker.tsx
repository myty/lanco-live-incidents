import { Coords } from "google-map-react";
import React from "react";

const MapCurrentLocationMarker: React.FC<Partial<Coords>> = () => {
    return (
        <div className="relative flex items-center justify-center w-6 h-6 bg-green-600 border-4 rounded-full -left-3 -top-3"></div>
    );
};

export default MapCurrentLocationMarker;
