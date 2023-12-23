import { ImmutableRecord } from "simple-immutable-record";

export interface GeolocationStoreConifguration extends PositionOptions {
  watch: boolean;
}

export class GeolocationStoreConifgurationRecord extends ImmutableRecord<GeolocationStoreConifguration>({
  watch: true,
}) {
  equalTo(otherObj: GeolocationStoreConifgurationRecord): boolean {
    return this === otherObj;
  }
}
