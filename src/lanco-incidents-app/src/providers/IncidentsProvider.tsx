import { LIVE_FEED } from "constants/app-constants";
import {
    DistanceValueType,
    Geocode,
    IncidentRecord,
} from "models/incident-record";
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

interface FeedIncident {
    id: string;
    incident_dt: string;
    type: string;
    subType: string;
    location: string;
    area: string;
    units_assigned: string[];
    geo_location?: Geocode | null;
    distance?: DistanceValueType | null;
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
            // TODO: Add de-duping feature for the list, only update the records that should be updated
            return {
                ...state,
                state: action.type,
                incidents: action.incidents,
            };
    }

    return state;
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
                } = fi;

                return new IncidentRecord({
                    id,
                    incidentDate: DateTime.fromISO(incident_dt, {}),
                    type,
                    subType,
                    location,
                    area,
                    unitsAssigned: units_assigned,
                });
            });

            dispatch({ type: "LOADED", incidents });
        } catch (error) {
            console.log(error);
            dispatch({ type: "ERROR", error });
        }
    }, []);

    useEffect(() => {
        if (state === "LOADING") {
            processFeed();
        }
    }, [state]);

    return (
        <IncidentsContext.Provider
            value={{ incidents, state, error, dispatch }}
        >
            {children}
        </IncidentsContext.Provider>
    );
}
