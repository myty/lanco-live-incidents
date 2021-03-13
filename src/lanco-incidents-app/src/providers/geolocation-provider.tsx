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
    watchPosition?: boolean;
}

const GeolocationProvider: React.FC<
    PropsWithChildren<GeolocationProviderProps>
> = ({ children, watchPosition = false }) => {
    const [
        { currentPosition, currentStatus },
        dispatch,
    ] = useState<GeolocationContextState>({});

    const processCurrentPosition = useCallback(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    dispatch((prev) => ({
                        ...prev,
                        currentPosition: position,
                        currentStatus: { permissionGranted: true },
                    }));
                },
                (status: GeolocationPositionError) => {
                    dispatch((prev) => ({
                        ...prev,
                        currentStatus: status,
                    }));
                }
            );

            if (watchPosition) {
                navigator.geolocation.watchPosition(
                    (position) => {
                        dispatch((prev) => ({
                            ...prev,
                            currentPosition: position,
                            currentStatus: { permissionGranted: true },
                        }));
                    },
                    (status: GeolocationPositionError) => {
                        dispatch((prev) => ({
                            ...prev,
                            currentStatus: status,
                        }));
                    }
                );
            }
        }
    }, [watchPosition]);

    useEffect(() => {
        processCurrentPosition();
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
