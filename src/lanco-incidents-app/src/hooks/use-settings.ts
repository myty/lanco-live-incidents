import { Sort } from "models/view-models/settings-record";
import { SettingsContext } from "providers/settings-provider";
import { useCallback, useContext } from "react";

export interface UseSettingsHook {
    addIncidentTypes: (incidentTypes: string[]) => void;
    incidentTypeFilters: Record<string, boolean>;
    sort: Sort;
    updateSettings: (
        incidentTypeFilters: Record<string, boolean>,
        sort: Sort
    ) => void;
}

export default function useSettings(): UseSettingsHook {
    const {
        settings: { incidentTypeFilters, sort },
        dispatch,
    } = useContext(SettingsContext);

    return {
        addIncidentTypes: useCallback(
            (incidentTypes: string[]) =>
                dispatch({ type: "SetIncidentTypeFilters", incidentTypes }),
            [dispatch]
        ),
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
