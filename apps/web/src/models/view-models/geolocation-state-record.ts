import { ImmutableRecord } from "simple-immutable-record";

export enum GeolocationStatus {
  Initialized = 0,
  PermissionGranted = 1,
  PermissionDenied = 2,
}

export interface GeolocationState {
  status: GeolocationStatus;
  error?: GeolocationPositionError;
  position?: GeolocationPosition;
}

export class GeolocationStateRecord extends ImmutableRecord<GeolocationState>({
  status: GeolocationStatus.Initialized,
}) {
  withError(error: GeolocationPositionError): this {
    return this.with({ error });
  }

  withPosition(position: GeolocationPosition): this {
    return this.with({ position });
  }

  withStatus(status: GeolocationStatus): this {
    return this.with({ status });
  }
}
