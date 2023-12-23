import { useSyncExternalStore } from "react";
import { concat, fromEvent, interval, throttle } from "rxjs";
import { GeolocationStore, GeoplocationEvent } from "stores/geolocation-store";

function subscribe(onStoreChange: () => void) {
  const positionChanges = fromEvent(GeolocationStore.Default, GeoplocationEvent.PositionChange);

  const positionErrors = fromEvent(GeolocationStore.Default, GeoplocationEvent.PositionError);

  const statusChanges = fromEvent(GeolocationStore.Default, GeoplocationEvent.StatusChange);

  const subscription = concat(positionChanges, positionErrors, statusChanges)
    .pipe(throttle(() => interval(250)))
    .subscribe(() => onStoreChange());

  return () => {
    subscription.unsubscribe();
  };
}

export default function useGeolocation() {
  return useSyncExternalStore(
    subscribe,
    () => GeolocationStore.Default.getSnapshot(),
    () => GeolocationStore.Default.getSnapshot()
  );
}
