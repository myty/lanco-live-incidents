import { useAtom } from "jotai";
import { useCallback, useContext, useEffect } from "react";
import { IncidentsAtom } from "../atoms/incidents";
import type { Sort } from "../models/view-models/settings-record";
import { SettingsContext } from "../providers/settings-provider";

export interface UseSettingsHook {
  incidentTypeFilters: Record<string, boolean>;
  sort: Sort;
  updateSettings: (incidentTypeFilters: Record<string, boolean>, sort: Sort) => void;
}

export default function useSettings(): UseSettingsHook {
  const {
    settings: { incidentTypeFilters, sort },
    dispatch,
  } = useContext(SettingsContext);

  const [{ incidents: incidentRecords }] = useAtom(IncidentsAtom);

  useEffect(() => {
    const incidentTypes = incidentRecords.map(incident => incident.type);
    dispatch({ type: "SetIncidentTypeFilters", incidentTypes });
  }, [dispatch, incidentRecords]);

  return {
    incidentTypeFilters,
    sort,
    updateSettings: useCallback(
      (incidentTypeFilters: Record<string, boolean>, sort: Sort) =>
        dispatch({
          type: "UpdateSettings",
          incidentTypeFilters,
          sort,
        }),
      [dispatch]
    ),
  };
}
