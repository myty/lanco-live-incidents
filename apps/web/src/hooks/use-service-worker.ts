import { useContext } from "react";
import { ServiceWorkerContext } from "../providers/service-worker-provider";

export default function useServiceWorker() {
  const { appNeedsRefresh, offlineAppReady, updateIgnored, ignoreUpdate, updateServiceWorker } =
    useContext(ServiceWorkerContext);

  return {
    appNeedsRefresh,
    offlineAppReady,
    updateIgnored,
    ignoreUpdate,
    updateServiceWorker,
  };
}
