import React, {
    createContext,
    PropsWithChildren,
    useEffect,
    useState,
} from "react";
import { Workbox, messageSW } from "workbox-window";

export const ServiceWorkerContext = createContext({
    appNeedsRefresh: false,
    offlineAppReady: false,
    updateIgnored: false,
    ignoreUpdate: () => {},
    updateServiceWorker: () => {},
});

interface ServiceWorkerProviderProps {
    immediate?: boolean;
}

const ServiceWorkerProvider: React.FC<
    PropsWithChildren<ServiceWorkerProviderProps>
> = ({ children, immediate }) => {
    const [
        {
            offlineAppReady,
            appNeedsRefresh,
            updateIgnored,
            waitingServiceWorker,
        },
        setState,
    ] = useState({
        offlineAppReady: false,
        appNeedsRefresh: false,
        updateIgnored: false,
        waitingServiceWorker: undefined as ServiceWorker | undefined,
    });

    const updateServiceWorker = async () => {
        if (waitingServiceWorker != null) {
            // Send a message to the waiting service worker,
            // instructing it to activate.
            // Note: for this to work, you have to add a message
            // listener in your service worker. See below.
            await messageSW(waitingServiceWorker, {
                type: "SKIP_WAITING",
            });
        }
    };

    const ignoreUpdate = () => {
        setState((prev) => ({
            ...prev,
            updateIgnored: true,
        }));
    };

    const loadServiceWorker = () => {
        if ("serviceWorker" in navigator) {
            const wb = new Workbox("/sw.js", { scope: "/" });

            wb.addEventListener("controlling", (event) => {
                // Assuming the user accepted the update, set up a listener
                // that will reload the page as soon as the previously waiting
                // service worker has taken control.
                if (event.isUpdate) {
                    window.location.reload();
                    return;
                }

                setState((prev) => ({
                    ...prev,
                    offlineAppReady: true,
                }));
            });

            // Add an event listener to detect when the registered
            // service worker has installed but is waiting to activate.
            wb.addEventListener("waiting", (event) => {
                setState((prev) => ({
                    ...prev,
                    appNeedsRefresh: true,
                    waitingServiceWorker: event.sw,
                }));
            });

            // @ts-ignore
            wb.addEventListener("externalwaiting", (event) => {
                setState((prev) => ({
                    ...prev,
                    appNeedsRefresh: true,
                    waitingServiceWorker: event.sw,
                }));
            });

            wb.register({ immediate });
        }
    };

    useEffect(() => {
        loadServiceWorker();
    }, []);

    return (
        <ServiceWorkerContext.Provider
            value={{
                appNeedsRefresh,
                offlineAppReady,
                updateIgnored,
                ignoreUpdate,
                updateServiceWorker,
            }}>
            {children}
        </ServiceWorkerContext.Provider>
    );
};

export default ServiceWorkerProvider;
