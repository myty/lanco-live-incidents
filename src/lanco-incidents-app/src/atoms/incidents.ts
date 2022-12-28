import { atom, Getter } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { IncidentRecord } from "models/view-models/incident-record";

interface IncidentsState {
    error?: unknown;
    incidents: IncidentRecord[];
    state: "LOADING" | "LOADED" | "FAILED";
}

type IncidentsAction =
    | { type: "ERROR"; error: unknown }
    | { type: "LOAD" }
    | { type: "LOADED"; incidents: IncidentRecord[] };

const reducer = (
    state: IncidentsState,
    action: IncidentsAction,
): IncidentsState => {
    switch (action.type) {
        case "LOAD": {
            if (action.type === "LOAD" && state.state !== "LOADING") {
                return {
                    ...state,
                    state: "LOADING",
                };
            }
            break;
        }
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
                    action.incidents,
                ).sort((a, b) => b.getTimeSince() - a.getTimeSince()),
            };
    }

    return state;
};

function updateIncidents(
    originalList: IncidentRecord[],
    newList: IncidentRecord[],
): IncidentRecord[] {
    const comparer = (
        sourceItem: IncidentRecord,
        mergeItem: IncidentRecord,
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

const persistedIncidentsAtom = atomWithStorage<Array<IncidentRecord>>(
    "incidents",
    [],
);

const baseAtom = atom<Omit<IncidentsState, "incidents">>({
    state: "LOADING",
});

export const IncidentsAtom = atom<IncidentsState, IncidentsAction>(
    (get) => ({
        ...get(baseAtom),
        incidents: convertIncidents(get),
    }),
    (get, set, action) => {
        const currentState = {
            ...get(baseAtom),
            incidents: convertIncidents(get),
        };

        const { incidents, ...rest } = reducer(currentState, action);

        set(persistedIncidentsAtom, incidents);
        set(baseAtom, rest);
    },
);
function convertIncidents(get: Getter): IncidentRecord[] {
    const incidents = get(persistedIncidentsAtom);

    return incidents.map((val) => new IncidentRecord(val));
}
