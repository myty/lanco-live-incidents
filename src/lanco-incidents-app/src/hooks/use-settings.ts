import { Sort } from "models/settings-record";
import { SettingsContext } from "providers/settings-provider";
import { useContext } from "react";

interface UseSettingsHook {
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
        addIncidentTypes: (incidentTypes: string[]) =>
            dispatch({ type: "SetIncidentTypeFilters", incidentTypes }),
        incidentTypeFilters,
        sort,
        updateSettings: (
            incidentTypeFilters: Record<string, boolean>,
            sort: Sort
        ) =>
            dispatch({
                type: "UpdateSettings",
                incidentTypeFilters,
                sort,
            }),
    };
}
