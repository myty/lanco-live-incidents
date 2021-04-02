import { ImmutableRecord } from "simple-immutable-record";
import { DateTime } from "luxon";

export type Geocode = { lat: number; lng: number };

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
