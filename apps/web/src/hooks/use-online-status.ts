import { useSyncExternalStore } from "react";

enum OnlineStatus {
  ONLINE = 0,
  OFFLINE = 1,
}

function subscribe(onStoreChange: () => void) {
  window.addEventListener("online", onStoreChange);
  window.addEventListener("offline", onStoreChange);

  return () => {
    window.removeEventListener("online", onStoreChange);
    window.removeEventListener("offline", onStoreChange);
  };
}

export const useOnlineStatus = () =>
  useSyncExternalStore(
    subscribe,
    () => (navigator.onLine ? OnlineStatus.ONLINE : OnlineStatus.OFFLINE),
    () => OnlineStatus.ONLINE
  );
