import { useSyncExternalStore } from "react";
import { GeolocationStore, GeoplocationEvent } from "stores/geolocation-store";

function subscribe(onStoreChange: () => void) {
    GeolocationStore.Default.addEventListener(
        GeoplocationEvent.PositionChange,
        onStoreChange,
    );

    GeolocationStore.Default.addEventListener(
        GeoplocationEvent.PositionError,
        onStoreChange,
    );

    GeolocationStore.Default.addEventListener(
        GeoplocationEvent.StatusChange,
        onStoreChange,
    );

    return () => {
        GeolocationStore.Default.removeEventListener(
            GeoplocationEvent.PositionChange,
            onStoreChange,
        );

        GeolocationStore.Default.removeEventListener(
            GeoplocationEvent.PositionError,
            onStoreChange,
        );

        GeolocationStore.Default.removeEventListener(
            GeoplocationEvent.StatusChange,
            onStoreChange,
        );
    };
}

export default function useGeolocation() {
    return useSyncExternalStore(
        subscribe,
        () => ({
            ...GeolocationStore.Default.currentState,
            refresh: GeolocationStore.Default.refresh,
        }),
        () => ({
            ...GeolocationStore.Default.currentState,
            refresh() {},
        }),
    );
}
