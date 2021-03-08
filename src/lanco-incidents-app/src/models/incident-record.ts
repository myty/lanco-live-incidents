import { ImmutableRecord } from "simple-immutable-record";
import { DateTime } from "luxon";

export type Geocode = { lat: number; lng: number };
export type DistanceValueType = { value: number; text: string };

interface Incident {
  id: string;
  incidentDate: DateTime;
  type: string;
  subType: string;
  location: string;
  area: string;
  unitsAssigned: string[];
  geoLocation?: Geocode;
  distance?: DistanceValueType;
}

export class IncidentRecord extends ImmutableRecord<Incident>({
  id: "",
  incidentDate: DateTime.now(),
  type: "",
  subType: "",
  location: "",
  area: "",
  unitsAssigned: [],
}) {
  getTimeSince(): number {
    return this.incidentDate.diffNow("milliseconds").as("milliseconds");
  }

  getIncidentTimeSimple(): string {
    return this.incidentDate.toLocaleString(DateTime.TIME_SIMPLE);
  }

  getIncidentFullDate(): string {
    return this.incidentDate.toLocaleString(DateTime.DATE_FULL);
  }
}
