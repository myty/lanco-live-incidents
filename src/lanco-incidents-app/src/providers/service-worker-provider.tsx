import React, {
    createContext,
    PropsWithChildren,
    useEffect,
    useState,
} from "react";
import { Workbox, messageSW } from "workbox-window";

export const ServiceWorkerContext = createContext({
    offlineAppReady: false,
    appNeedsRefresh: false,
    updateServiceWorker: () => {},
});

interface ServiceWorkerProviderProps {
    immediate?: boolean;
}

const ServiceWorkerProvider: React.FC<
    PropsWithChildren<ServiceWorkerProviderProps>
> = ({ children, immediate }) => {
    const [offlineAppReady, setOfflineAppReady] = useState<boolean>(false);
    const [appNeedsRefresh, setAppNeedsRefresh] = useState<boolean>(false);

    let registration: ServiceWorkerRegistration;

    const updateServiceWorker = async () => {
        if (registration && registration.waiting) {
            // Send a message to the waiting service worker,
            // instructing it to activate.
            // Note: for this to work, you have to add a message
            // listener in your service worker. See below.
            await messageSW(registration.waiting, { type: "SKIP_WAITING" });
        }
    };

    const loadServiceWorker = () => {
        if ("serviceWorker" in navigator) {
            const wb = new Workbox("/sw.js", { scope: "/" });

            const showSkipWaitingPrompt = () => {
                // `event.wasWaitingBeforeRegister` will be false if this is
                // the first time the updated service worker is waiting.
                // When `event.wasWaitingBeforeRegister` is true, a previously
                // updated service worker is still waiting.
                // You may want to customize the UI prompt accordingly.

                // Assumes your app has some sort of prompt UI element
                // that a user can either accept or reject.
                setAppNeedsRefresh(true);
            };

            wb.addEventListener("controlling", (event) => {
                // Assuming the user accepted the update, set up a listener
                // that will reload the page as soon as the previously waiting
                // service worker has taken control.
                if (event.isUpdate) {
                    window.location.reload();
                    return;
                }

                setOfflineAppReady(true);
            });

            // Add an event listener to detect when the registered
            // service worker has installed but is waiting to activate.
            wb.addEventListener("waiting", showSkipWaitingPrompt);
            // @ts-ignore
            wb.addEventListener("externalwaiting", showSkipWaitingPrompt);

            wb.register({ immediate }).then((r) => (registration = r!));
        }
    };

    useEffect(() => {
        loadServiceWorker();
    }, []);

    return (
        <ServiceWorkerContext.Provider
            value={{ offlineAppReady, appNeedsRefresh, updateServiceWorker }}>
            {children}
        </ServiceWorkerContext.Provider>
    );
};

export default ServiceWorkerProvider;
