import { TypedEventTarget } from "utils/typed-event-target";
import { TypedEvent } from "utils/typed-event";
import {
    GeolocationStoreConifguration,
    GeolocationStoreConifgurationRecord,
} from "../models/view-models/geolocation-store-conifguration-record";

enum GeolocationStatus {
    Initialized,
    PermissionGranted,
    PermissionDenied,
}

interface GeolocationStoreOptions {
    geolocation?: Geolocation;
}

export enum GeoplocationEvent {
    StatusChange = "statusChange",
    PositionChange = "positionChange",
    PositionError = "positionError",
}

class GeoplocationStatusChangeEvent extends TypedEvent<GeolocationStatus>(
    GeoplocationEvent.StatusChange,
) {}

class GeoplocationPositionChangeEvent extends TypedEvent<GeolocationPosition>(
    GeoplocationEvent.PositionChange,
) {}

class GeoplocationPositionErrorEvent extends TypedEvent<GeolocationPositionError>(
    GeoplocationEvent.PositionError,
) {}

export class GeolocationStore extends TypedEventTarget<{
    [GeoplocationEvent.StatusChange]: GeoplocationStatusChangeEvent;
    [GeoplocationEvent.PositionChange]: GeoplocationPositionChangeEvent;
    [GeoplocationEvent.PositionError]: GeoplocationPositionErrorEvent;
}>() {
    static readonly Default = new GeolocationStore();

    private config = new GeolocationStoreConifgurationRecord();
    private status = GeolocationStatus.Initialized;
    private error?: GeolocationPositionError;
    private geolocation?: Geolocation;
    private position?: GeolocationPosition;
    private watchId?: number;

    constructor(options: GeolocationStoreOptions = {}) {
        super();

        this.geolocation =
            options.geolocation == null && "geolocation" in navigator
                ? navigator.geolocation
                : options.geolocation;

        this.setupPermissionCheck();
    }

    get currentState() {
        return {
            error: this.error,
            position: this.position,
            status: this.status,
        };
    }

    setConfig(config: Partial<GeolocationStoreConifguration> = {}) {
        const nextConfig = this.config.with(config);

        if (!this.config.equalTo(nextConfig)) {
            this.checkLocation(nextConfig);
            this.watchId = this.setupWatchPosition(this.config, nextConfig);
            this.config = nextConfig;
        }
    }

    refresh(): void {
        this.checkLocation(this.config);
    }

    private setupWatchPosition(
        currentConfig: GeolocationStoreConifgurationRecord,
        nextConfig: GeolocationStoreConifgurationRecord,
    ): number | undefined {
        if (
            this.geolocation == null ||
            this.status !== GeolocationStatus.PermissionGranted
        ) {
            return;
        }

        if (nextConfig.watch !== currentConfig.watch) {
            const { enableHighAccuracy, maximumAge, timeout } = currentConfig;

            if (nextConfig.watch) {
                return this.geolocation.watchPosition(
                    this.handlePostionChange,
                    this.handlePositionError,
                    { enableHighAccuracy, maximumAge, timeout },
                );
            }

            if (this.watchId != null) {
                this.geolocation.clearWatch(this.watchId);
            }
        }
    }

    private checkLocation(
        nextConfig: GeolocationStoreConifgurationRecord,
    ): void {
        if (
            this.geolocation == null ||
            this.status !== GeolocationStatus.PermissionGranted
        ) {
            return;
        }

        const { enableHighAccuracy, maximumAge, timeout } = nextConfig;

        this.geolocation.getCurrentPosition(
            this.handlePostionChange,
            this.handlePositionError,
            { enableHighAccuracy, maximumAge, timeout },
        );
    }

    private setupPermissionCheck() {
        navigator.permissions
            .query({ name: "geolocation" })
            .then((result: PermissionStatus) => {
                result.onchange = () =>
                    this.handlePermissionStateChange(result.state);

                this.handlePermissionStateChange(result.state);
            });
    }

    private handlePermissionStateChange(state: PermissionState) {
        const nextStatus =
            state === "granted" || state === "prompt"
                ? GeolocationStatus.PermissionGranted
                : GeolocationStatus.PermissionDenied;

        if (this.status !== nextStatus) {
            this.status = nextStatus;
            super.dispatchEvent(new GeoplocationStatusChangeEvent(nextStatus));
        }
    }

    private handlePostionChange(position: GeolocationPosition) {
        this.position = position;
        super.dispatchEvent(new GeoplocationPositionChangeEvent(position));
    }

    private handlePositionError(error: GeolocationPositionError) {
        this.error = error;
        super.dispatchEvent(new GeoplocationPositionErrorEvent(error));
    }
}
