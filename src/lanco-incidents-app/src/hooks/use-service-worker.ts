import { ServiceWorkerContext } from "providers/service-worker-provider";
import { useContext } from "react";

export default function useServiceWorker() {
    const {
        appNeedsRefresh,
        offlineAppReady,
        ignoreUpdate,
        updateIgnored,
        updateServiceWorker,
    } = useContext(ServiceWorkerContext);

    return {
        ignoreUpdate,
        offlineAppReady,
        appNeedsRefresh,
        updateIgnored,
        updateServiceWorker,
    };
}
