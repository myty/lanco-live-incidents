import { GeolocationContext } from "providers/geolocation-provider";
import { useContext } from "react";

export default function useGeolocation() {
    const { currentPosition, currentStatus, refresh } = useContext(
        GeolocationContext
    );

    return {
        currentPosition,
        currentStatus,
        refresh,
    };
}
