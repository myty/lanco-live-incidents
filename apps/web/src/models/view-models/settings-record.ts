import { ImmutableRecord } from "simple-immutable-record";

export enum Sort {
  Distance = 0,
  Latest = 1,
}

export interface Settings {
  sort: Sort;
  incidentTypeFilters: Record<string, boolean>;
}

export class SettingsRecord extends ImmutableRecord<Settings>({
  sort: Sort.Latest,
  incidentTypeFilters: {},
}) {}
