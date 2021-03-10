import { useContext } from "react";
import { IncidentsContext } from "providers/IncidentsProvider";

interface UseIncidentsHookOptions {
    id?: string;
}

export default function useIncidents(options?: UseIncidentsHookOptions) {
    const { id } = options ?? {};
    const { incidents, state, error, dispatch } = useContext(IncidentsContext);

    const incident =
        id && incidents.length >= 1
            ? incidents.filter((incident) => incident.id === id)[0]
            : null;

    return {
        error,
        incident,
        incidents,
        loading: state === "LOADING",
        refresh: () => dispatch({ type: "LOAD" }),
    };
}
