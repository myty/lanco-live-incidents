import { ServiceWorkerContext } from "providers/service-worker-provider";
import { useContext } from "react";

export default function useServiceWorker() {
    const {
        appNeedsRefresh,
        offlineAppReady,
        updateIgnored,
        ignoreUpdate,
        updateServiceWorker,
    } = useContext(ServiceWorkerContext);

    return {
        appNeedsRefresh,
        offlineAppReady,
        updateIgnored,
        ignoreUpdate,
        updateServiceWorker,
    };
}
