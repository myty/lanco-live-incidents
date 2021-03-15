import { ServiceWorkerContext } from "providers/service-worker-provider";
import { useContext } from "react";

export default function useServiceWorker() {
    const {
        appNeedsRefresh,
        offlineAppReady,
        updateServiceWorker,
    } = useContext(ServiceWorkerContext);

    return {
        offlineAppReady,
        appNeedsRefresh,
        updateServiceWorker,
    };
}
