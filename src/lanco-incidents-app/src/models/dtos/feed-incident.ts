import { Geocode } from "types/geocode";

export interface FeedIncident {
  id: string;
  incident_dt: string;
  type: string;
  subType: string;
  location: string;
  area: string;
  units_assigned: string[];
  geocode_location?: Geocode | null;
}
