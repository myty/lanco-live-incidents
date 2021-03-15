import React, {
    PropsWithChildren,
    useCallback,
    useEffect,
    useState,
} from "react";

type GeolocationPositionStatus =
    | GeolocationPositionError
    | { permissionGranted: true };

interface GeolocationContextState {
    currentPosition?: GeolocationPosition;
    currentStatus?: GeolocationPositionStatus;
}

export const GeolocationContext = React.createContext<
    GeolocationContextState & { refresh: () => void }
>({
    ...{},
    refresh: () => {},
});

interface GeolocationProviderProps extends PositionOptions {
    watch?: boolean;
}

const GeolocationProvider: React.FC<
    PropsWithChildren<GeolocationProviderProps>
> = ({ children, watch = false, ...positionOptions }) => {
    const [
        { currentPosition, currentStatus },
        dispatch,
    ] = useState<GeolocationContextState>({});

    const handlePostionChange = (position: GeolocationPosition) => {
        dispatch((prev) => ({
            ...prev,
            currentPosition: position,
            currentStatus: { permissionGranted: true },
        }));
    };

    const handlePositionError = (status: GeolocationPositionError) => {
        dispatch((prev) => ({
            ...prev,
            currentStatus: status,
        }));
    };

    const processCurrentPosition = useCallback(() => {
        if ("geolocation" in navigator) {
            if (watch) {
                return navigator.geolocation.watchPosition(
                    handlePostionChange,
                    handlePositionError,
                    positionOptions
                );
            }

            navigator.geolocation.getCurrentPosition(
                handlePostionChange,
                handlePositionError,
                positionOptions
            );
        }
    }, [watch]);

    useEffect(() => {
        const watchId = processCurrentPosition();

        return () => {
            if (watchId != null) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [processCurrentPosition]);

    return (
        <GeolocationContext.Provider
            value={{
                currentPosition,
                currentStatus,
                refresh: processCurrentPosition,
            }}>
            {children}
        </GeolocationContext.Provider>
    );
};

export default GeolocationProvider;
