import { ImmutableRecord } from "simple-immutable-record";

export enum Sort {
    Distance,
    Latest,
}

export interface Settings {
    sort: Sort;
}

export class SettingsRecord extends ImmutableRecord<Settings>({
    sort: Sort.Latest,
}) {}
