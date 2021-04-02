import { Sort } from "models/settings-record";
import { SettingsContext } from "providers/settings-provider";
import { useContext } from "react";

export default function useSettings() {
    const { settings, dispatch } = useContext(SettingsContext);

    return {
        sort: settings.sort,
        updateSort: (sort: Sort) =>
            dispatch({ type: "UpdateIncidentSort", sort }),
    };
}
