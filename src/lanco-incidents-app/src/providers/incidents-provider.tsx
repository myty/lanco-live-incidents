import { LIVE_FEED } from "constants/app-constants";
import { Geocode, IncidentRecord } from "models/incident-record";
import {
    Dispatch,
    PropsWithChildren,
    useCallback,
    useEffect,
    useReducer,
} from "react";
import { DateTime } from "luxon";
import axios from "axios";
import React from "react";
import useSettings from "hooks/use-settings";
import { chain } from "lodash";

interface FeedIncident {
    id: string;
    incident_dt: string;
    type: string;
    subType: string;
    location: string;
    area: string;
    units_assigned: string[];
    geocode_location?: Geocode | null;
}

interface IncidentsContextState {
    error?: any;
    incidents: IncidentRecord[];
    state: "LOADING" | "LOADED" | "FAILED";
}

type IncidentsContextAction =
    | { type: "ERROR"; error: any }
    | { type: "LOAD" }
    | { type: "LOADED"; incidents: IncidentRecord[] };

const reducer = (
    state: IncidentsContextState,
    action: IncidentsContextAction
): IncidentsContextState => {
    switch (action.type) {
        case "LOAD":
            if (action.type === "LOAD" && state.state !== "LOADING") {
                return {
                    ...state,
                    state: "LOADING",
                };
            }
            break;
        case "ERROR":
            return {
                ...state,
                state: "FAILED",
                error: action.error,
            };
        case "LOADED":
            return {
                ...state,
                state: action.type,
                incidents: updateIncidents(
                    state.incidents,
                    action.incidents
                ).sort((a, b) => b.getTimeSince() - a.getTimeSince()),
            };
    }

    return state;
};

function updateIncidents(
    originalList: IncidentRecord[],
    newList: IncidentRecord[]
): IncidentRecord[] {
    const comparer = (
        sourceItem: IncidentRecord,
        mergeItem: IncidentRecord
    ) => {
        return sourceItem.id === mergeItem.id;
    };

    const isEqual = (a: IncidentRecord) => (b: IncidentRecord) =>
        comparer(b, a);
    const areNotIn = (a: IncidentRecord[]) => (b: IncidentRecord) =>
        !a.some(isEqual(b));

    const itemsToAdd = newList.filter(areNotIn(originalList));
    const itemsToKeep = originalList
        .map((item) => {
            const foundItem = newList.find(isEqual(item));

            if (foundItem == null) {
                return undefined;
            }

            return item.with(foundItem);
        })
        .filter((item) => item != null) as IncidentRecord[];

    return [...itemsToKeep, ...itemsToAdd];
}

const convertToGeocode = ({
    lat,
    lng,
}: Partial<{ lat: number; lng: number }>): Geocode | undefined => {
    if (lat == null || lng == null) {
        return undefined;
    }

    return { lat, lng };
};

const defaultState: IncidentsContextState = {
    incidents: [],
    state: "LOADING",
};

export type IncidentsContextType = IncidentsContextState & {
    dispatch: Dispatch<IncidentsContextAction>;
};

export const IncidentsContext = React.createContext<IncidentsContextType>({
    ...defaultState,
    dispatch: (value: IncidentsContextAction) => {},
});

export default function IncidentsProvider({ children }: PropsWithChildren<{}>) {
    const { addIncidentTypes } = useSettings();
    const [{ incidents, state, error }, dispatch] = useReducer(
        reducer,
        defaultState
    );

    const processFeed = useCallback(async () => {
        try {
            const feedIncidents = await axios.get<FeedIncident[]>(LIVE_FEED);

            const incidents = feedIncidents.data.map((fi) => {
                const {
                    incident_dt,
                    id,
                    type,
                    subType,
                    location,
                    area,
                    units_assigned,
                    geocode_location,
                } = fi;

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
            });

            addIncidentTypes(
                chain(incidents)
                    .map((i) => i.type)
                    .uniq()
                    .value()
            );

            dispatch({ type: "LOADED", incidents });
        } catch (error) {
            console.log(error);
            dispatch({ type: "ERROR", error });
        }
    }, [addIncidentTypes]);

    useEffect(() => {
        if (state === "LOADING") {
            processFeed();
        }
    }, [processFeed, state]);

    return (
        <IncidentsContext.Provider
            value={{ incidents, state, error, dispatch }}>
            {children}
        </IncidentsContext.Provider>
    );
}
