import { LIVE_FEED } from "constants/app-constants";
import { IncidentRecord } from "models/view-models/incident-record";
import {
    Dispatch,
    PropsWithChildren,
    useCallback,
    useEffect,
    useReducer,
} from "react";
import axios from "axios";
import React from "react";
import useSettings from "hooks/use-settings";
import { chain } from "lodash";
import { FeedIncident } from "models/dtos/feed-incident";

interface IncidentsContextState {
    error?: unknown;
    incidents: IncidentRecord[];
    state: "LOADING" | "LOADED" | "FAILED";
}

type IncidentsContextAction =
    | { type: "ERROR"; error: unknown }
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

            const incidents = feedIncidents.data.map(
                IncidentRecord.fromFeedIncident
            );

            addIncidentTypes(
                chain(incidents)
                    .map((i) => i.type)
                    .uniq()
                    .value()
            );

            dispatch({ type: "LOADED", incidents });
        } catch (error: unknown) {
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
