import { getDistance } from "geolib";
import { GeolocationContext } from "providers/geolocation-provider";
import { useContext } from "react";

interface UseGeolocationOptions {
    fromLocation?: { lat: number; lng: number };
    measurement?: "meters" | "miles";
}

export default function useGeolocation(options?: UseGeolocationOptions) {
    const { measurement, fromLocation } = options ?? {};

    const { currentPosition, currentStatus, refresh } = useContext(
        GeolocationContext
    );

    const measurementMultiplier = measurement === "miles" ? 0.00062137 : 1;

    const distance =
        fromLocation != null && currentPosition != null
            ? getDistance(
                  {
                      lat: currentPosition.coords.latitude,
                      lng: currentPosition.coords.longitude,
                  },
                  fromLocation
              ) * measurementMultiplier
            : undefined;

    return {
        currentPosition,
        currentStatus,
        distance,
        refresh,
    };
}
