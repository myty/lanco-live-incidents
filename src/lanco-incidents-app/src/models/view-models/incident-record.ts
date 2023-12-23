import { DateTime } from "luxon";
import { FeedIncident } from "models/dtos/feed-incident";
import { ImmutableRecord } from "simple-immutable-record";
import { Geocode } from "types/geocode";

interface Incident {
  area: string;
  distance?: number;
  geoLocation?: Geocode;
  id: string;
  incidentDate: DateTime;
  location: string;
  subType: string;
  type: string;
  unitsAssigned: string[];
}

const convertToGeocode = ({ lat, lng }: Partial<{ lat: number; lng: number }>): Geocode | undefined => {
  if (lat == null || lng == null) {
    return undefined;
  }

  return { lat, lng };
};

function incidentProcessor(values: Record<string, unknown>) {
  if (typeof values.incidentDate === "string") {
    values.incidentDate = DateTime.fromISO(values.incidentDate, {});
  }

  return values;
}

export class IncidentRecord extends ImmutableRecord<Incident>(
  {
    id: "",
    incidentDate: DateTime.now(),
    type: "",
    subType: "",
    location: "",
    area: "",
    unitsAssigned: [],
  },
  incidentProcessor
) {
  static fromFeedIncident(feedIncident: FeedIncident): IncidentRecord {
    const { incident_dt, id, type, subType, location, area, units_assigned, geocode_location } = feedIncident;

    return new IncidentRecord({
      id,
      incidentDate: DateTime.fromISO(incident_dt, {}),
      type,
      subType,
      location,
      area,
      unitsAssigned: units_assigned,
      geoLocation: convertToGeocode({ ...geocode_location }),
    });
  }

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
