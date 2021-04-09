import { Settings, SettingsRecord, Sort } from "models/settings-record";
import React, {
    createContext,
    Dispatch,
    PropsWithChildren,
    useEffect,
    useReducer,
} from "react";

interface SettingsContextState {
    error?: any;
    settings: SettingsRecord;
    status: "LOADING" | "LOADED";
}

type SettingsContextAction =
    | { type: "Initialize"; settings: Settings }
    | { type: "UpdateIncidentSort"; sort: Sort }
    | {
          type: "SetIncidentTypeFilters";
          incidentTypes: string[];
      }
    | {
          type: "UpdateIncidentTypeFilters";
          incidentTypeFilters: Record<string, boolean>;
      };

const defaultState: SettingsContextState = {
    settings: new SettingsRecord(),
    status: "LOADING",
};

export type SettingsContextType = SettingsContextState & {
    dispatch: Dispatch<SettingsContextAction>;
};

export const SettingsContext = createContext<SettingsContextType>({
    ...defaultState,
    dispatch: () => {},
});

function settingsContextReducer(
    state: SettingsContextState,
    action: SettingsContextAction
): SettingsContextState {
    switch (action.type) {
        case "Initialize":
            return {
                settings: state.settings.with(action.settings),
                status: "LOADED",
            };
        case "UpdateIncidentSort":
            const { sort } = action;
            const settingsWithSort = state.settings.with({ sort });

            localStorage.setItem("@settings", JSON.stringify(settingsWithSort));

            return { ...state, settings: settingsWithSort };
        case "UpdateIncidentTypeFilters":
            const settingsWithIncidentTypeFilter = state.settings.with({
                incidentTypeFilters: {
                    ...state.settings.incidentTypeFilters,
                    ...action.incidentTypeFilters,
                },
            });

            localStorage.setItem(
                "@settings",
                JSON.stringify(settingsWithIncidentTypeFilter)
            );

            return { ...state, settings: settingsWithIncidentTypeFilter };
        case "SetIncidentTypeFilters":
            const { incidentTypes } = action;
            const savedIncidentTypeFilters = Object.keys(
                state.settings.incidentTypeFilters
            );

            const incidentTypeFiltersToAdd = incidentTypes
                .filter((i) => !savedIncidentTypeFilters.includes(i))
                .reduce((prev: Record<string, boolean>, current: string) => {
                    return {
                        ...prev,
                        [current]: true,
                    };
                }, {});

            const settingsWithIncidentTypes = state.settings.with({
                incidentTypeFilters: {
                    ...state.settings.incidentTypeFilters,
                    ...incidentTypeFiltersToAdd,
                },
            });

            localStorage.setItem(
                "@settings",
                JSON.stringify(settingsWithIncidentTypes)
            );

            return { ...state, settings: settingsWithIncidentTypes };
    }
}

const SettingsProvider: React.FC<PropsWithChildren<{}>> = ({ children }) => {
    const [{ settings, status }, dispatch] = useReducer(
        settingsContextReducer,
        {
            settings: new SettingsRecord(),
            status: "LOADING",
        }
    );

    useEffect(() => {
        const settings: Settings = JSON.parse(
            localStorage.getItem("@settings") ?? "{}"
        );

        dispatch({ type: "Initialize", settings });
    }, []);

    return (
        <SettingsContext.Provider value={{ settings, status, dispatch }}>
            {children}
        </SettingsContext.Provider>
    );
};

export default SettingsProvider;
