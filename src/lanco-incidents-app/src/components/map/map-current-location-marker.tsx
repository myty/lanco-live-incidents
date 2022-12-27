import React from "react";

import { useState, useEffect, memo } from "react";

interface MapCurrentLocationMarkerProps extends google.maps.MarkerOptions {}

const MapCurrentLocationMarker: React.FC<MapCurrentLocationMarkerProps> = ({
    ...options
}) => {
    const [marker, setMarker] = useState<google.maps.Marker>();

    useEffect(() => {
        if (!marker) {
            setMarker(new google.maps.Marker());
        }

        // remove marker from map on unmount
        return () => {
            if (marker) {
                marker.setMap(null);
            }
        };
    }, [marker]);

    return null;
};

export default memo(MapCurrentLocationMarker);
