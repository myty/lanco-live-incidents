import { chain } from "lodash";
import useIncidents from "hooks/use-incidents";

interface UseIncidentsHookOptions {
    id: string;
}

export default function useIncident(options: UseIncidentsHookOptions) {
    const { id } = options;

    const { incidents, error, loading, refresh } = useIncidents();

    const incident =
        id != null
            ? chain(incidents)
                  .filter((i) => i.id === id)
                  .first()
                  .value()
            : null;

    return {
        error,
        incident,
        loading,
        refresh,
    };
}
