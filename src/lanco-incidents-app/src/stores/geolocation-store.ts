import { GeolocationStateRecord } from "models/view-models/geolocation-state-record";
import { TypedEvent } from "utils/typed-event";
import { TypedEventTarget } from "utils/typed-event-target";
import {
  GeolocationStoreConifguration,
  GeolocationStoreConifgurationRecord,
} from "../models/view-models/geolocation-store-conifguration-record";

enum GeolocationStatus {
  Initialized = 0,
  PermissionGranted = 1,
  PermissionDenied = 2,
}

interface GeolocationStoreOptions {
  geolocation?: Geolocation;
}

export enum GeoplocationEvent {
  StatusChange = "statusChange",
  PositionChange = "positionChange",
  PositionError = "positionError",
}

class GeoplocationStatusChangeEvent extends TypedEvent<GeolocationStatus>(GeoplocationEvent.StatusChange) {}

class GeoplocationPositionChangeEvent extends TypedEvent<GeolocationPosition>(GeoplocationEvent.PositionChange) {}

class GeoplocationPositionErrorEvent extends TypedEvent<GeolocationPositionError>(GeoplocationEvent.PositionError) {}

export class GeolocationStore extends TypedEventTarget<{
  [GeoplocationEvent.StatusChange]: GeoplocationStatusChangeEvent;
  [GeoplocationEvent.PositionChange]: GeoplocationPositionChangeEvent;
  [GeoplocationEvent.PositionError]: GeoplocationPositionErrorEvent;
}>() {
  static readonly Default = new GeolocationStore();

  private config = new GeolocationStoreConifgurationRecord();
  private state = new GeolocationStateRecord();

  private geolocation?: Geolocation;
  private watchId?: number;

  constructor(options: GeolocationStoreOptions = {}) {
    super();

    this.handlePermissionStateChange = this.handlePermissionStateChange.bind(this);
    this.handlePositionError = this.handlePositionError.bind(this);
    this.handlePostionChange = this.handlePostionChange.bind(this);

    this.geolocation =
      options.geolocation == null && "geolocation" in navigator ? navigator.geolocation : options.geolocation;

    this.setupPermissionCheck();
  }

  getSnapshot() {
    return this.state;
  }

  setConfig(config: Partial<GeolocationStoreConifguration> = {}) {
    const nextConfig = this.config.with(config);

    if (!this.config.equalTo(nextConfig)) {
      this.checkLocation(nextConfig);
      this.watchId = this.setupWatchPosition(nextConfig);
      this.config = nextConfig;
    }
  }

  private setupWatchPosition(nextConfig?: GeolocationStoreConifgurationRecord): number | undefined {
    if (this.geolocation == null || this.state.status !== GeolocationStatus.PermissionGranted) {
      return;
    }

    if (this.watchId != null) {
      this.geolocation.clearWatch(this.watchId);
    }

    if (nextConfig == null || nextConfig.watch !== this.config.watch) {
      const { enableHighAccuracy, maximumAge, timeout } = this.config;

      if ((nextConfig == null && this.config.watch) || nextConfig?.watch) {
        return this.geolocation.watchPosition(this.handlePostionChange, this.handlePositionError, {
          enableHighAccuracy,
          maximumAge,
          timeout,
        });
      }
    }
  }

  private checkLocation(config?: GeolocationStoreConifgurationRecord): void {
    if (this.geolocation == null || this.state.status !== GeolocationStatus.PermissionGranted) {
      return;
    }

    const { enableHighAccuracy, maximumAge, timeout } = config ?? this.config;

    this.geolocation.getCurrentPosition(this.handlePostionChange, this.handlePositionError, {
      enableHighAccuracy,
      maximumAge,
      timeout,
    });
  }

  private setupPermissionCheck() {
    navigator.permissions.query({ name: "geolocation" }).then((result: PermissionStatus) => {
      result.onchange = () => this.handlePermissionStateChange(result.state);

      this.handlePermissionStateChange(result.state);
    });
  }

  private handlePermissionStateChange(state: PermissionState) {
    const nextStatus =
      state === "granted" || state === "prompt"
        ? GeolocationStatus.PermissionGranted
        : GeolocationStatus.PermissionDenied;

    const nextState = this.state.withStatus(nextStatus);

    if (this.state !== nextState) {
      this.state = nextState;
      super.dispatchEvent(new GeoplocationStatusChangeEvent(nextStatus));

      if (nextStatus === GeolocationStatus.PermissionGranted) {
        this.checkLocation();
        this.watchId = this.setupWatchPosition();
      }
    }
  }

  private handlePostionChange(position: GeolocationPosition) {
    const nextState = this.state.withPosition(position);

    if (this.state !== nextState) {
      this.state = nextState;
      super.dispatchEvent(new GeoplocationPositionChangeEvent(position));
    }
  }

  private handlePositionError(error: GeolocationPositionError) {
    const nextState = this.state.withError(error);

    if (this.state !== nextState) {
      this.state = nextState;
      super.dispatchEvent(new GeoplocationPositionErrorEvent(error));
    }
  }
}
