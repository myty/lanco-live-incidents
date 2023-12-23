import useIncidents from "hooks/use-incidents";
import { chain } from "lodash";

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
