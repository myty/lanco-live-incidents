import { Sort } from "models/settings-record";
import { SettingsContext } from "providers/settings-provider";
import { useContext } from "react";

interface UseSettingsHook {
    addIncidentTypes: (incidentTypes: string[]) => void;
    incidentTypeFilters: Record<string, boolean>;
    sort: Sort;
    updateIncidentTypeFilters: (
        incidentTypeFilters: Record<string, boolean>
    ) => void;
    updateSort: (sort: Sort) => void;
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
        updateIncidentTypeFilters: (
            incidentTypeFilters: Record<string, boolean>
        ) =>
            dispatch({
                type: "UpdateIncidentTypeFilters",
                incidentTypeFilters,
            }),
        updateSort: (sort: Sort) =>
            dispatch({ type: "UpdateIncidentSort", sort }),
    };
}
