import useWorkbox from "hooks/use-workbox";
import React, { PropsWithChildren, createContext, useState } from "react";

export const ServiceWorkerContext = createContext({
  appNeedsRefresh: false,
  offlineAppReady: false,
  updateIgnored: false,
  ignoreUpdate: () => {},
  updateServiceWorker: () => {},
});

interface ServiceWorkerProviderProps {
  immediate?: boolean;
  registerOptions?: {
    scope: string;
  };
  serviceWorkerPath: string;
}

const ServiceWorkerProvider: React.FC<PropsWithChildren<ServiceWorkerProviderProps>> = ({
  children,
  immediate,
  registerOptions = { scope: "/" },
  serviceWorkerPath,
}) => {
  const [updateIgnored, setUpdateIgnored] = useState<boolean>(false);

  const {
    isReady: offlineAppReady,
    hasUpdate: appNeedsRefresh,
    sendMessage,
  } = useWorkbox({
    serviceWorkerPath,
    registerOptions,
    immediate,
  });

  const updateServiceWorker = () =>
    sendMessage({
      type: "SKIP_WAITING",
    });

  const ignoreUpdate = () => setUpdateIgnored(true);

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
