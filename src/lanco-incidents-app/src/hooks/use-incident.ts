import { chain } from "lodash";
import useIncidents from "hooks/use-incidents";

interface UseIncidentsHookOptions {
    id?: string | null;
}

export default function useIncident(options: UseIncidentsHookOptions) {
    const { id } = options;

    const { incidents, error, loading, refresh } = useIncidents();

    const incident = id != null ? chain(incidents).find({ id }).value() : null;

    return {
        error,
        incident,
        loading,
        refresh,
    };
}
