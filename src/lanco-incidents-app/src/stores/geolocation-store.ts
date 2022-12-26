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

enum GeoplocationEvent {
    StatusChange = "statusChange",
}

class GeoplocationStatusChangeEvent extends Event {
    constructor() {
        super(GeoplocationEvent.StatusChange, {
            detail: "",
        });
    }
}

export class GeolocationStore extends EventTarget {
    static readonly Default = new GeolocationStore();

    private config = new GeolocationStoreConifgurationRecord();
    private currentStatus = GeolocationStatus.Initialized;
    private geolocation?: Geolocation;
    private watchId?: number;

    constructor(options: GeolocationStoreOptions = {}) {
        super();

        this.geolocation =
            options.geolocation == null && "geolocation" in navigator
                ? navigator.geolocation
                : options.geolocation;

        this.setupPermissionCheck();
    }

    get status() {
        return this.currentStatus;
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
            this.currentStatus !== GeolocationStatus.PermissionGranted
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
            this.currentStatus !== GeolocationStatus.PermissionGranted
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

        if (this.currentStatus !== nextStatus) {
            this.currentStatus = nextStatus;
            this.dispatchEvent(
                new Event("statusChange", { status: nextStatus }),
            );
        }
    }

    private handlePostionChange(position: GeolocationPosition) {
        this.emit("positionChange", position);
    }

    private handlePositionError(error: GeolocationPositionError) {
        this.emit("positionError", error);
    }
}
