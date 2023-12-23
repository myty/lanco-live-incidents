import { SettingsRecord, Sort } from "models/view-models/settings-record";
import React, { Dispatch, PropsWithChildren, createContext, useReducer } from "react";

interface SettingsContextState {
  error?: Error;
  settings: SettingsRecord;
}

type SettingsContextAction =
  | {
      type: "UpdateSettings";
      sort: Sort;
      incidentTypeFilters: Record<string, boolean>;
    }
  | {
      type: "SetIncidentTypeFilters";
      incidentTypes: string[];
    };

const defaultState: SettingsContextState = {
  settings: new SettingsRecord(),
};

export type SettingsContextType = SettingsContextState & {
  dispatch: Dispatch<SettingsContextAction>;
};

export const SettingsContext = createContext<SettingsContextType>({
  ...defaultState,
  dispatch: () => {},
});

function settingsContextReducer(state: SettingsContextState, action: SettingsContextAction): SettingsContextState {
  switch (action.type) {
    case "UpdateSettings": {
      const settingsWithIncidentTypeFilter = state.settings.with({
        sort: action.sort,
        incidentTypeFilters: {
          ...state.settings.incidentTypeFilters,
          ...action.incidentTypeFilters,
        },
      });

      localStorage.setItem("@settings", JSON.stringify(settingsWithIncidentTypeFilter));

      return { ...state, settings: settingsWithIncidentTypeFilter };
    }
    case "SetIncidentTypeFilters": {
      const { incidentTypes } = action;
      const savedIncidentTypeFilters = Object.keys(state.settings.incidentTypeFilters);

      const incidentTypeFiltersToAdd = incidentTypes
        .filter(i => !savedIncidentTypeFilters.includes(i))
        .reduce((acc: Record<string, boolean>, current: string) => {
          acc[current] = true;
          return acc;
        }, {});

      const settingsWithIncidentTypes = state.settings.with({
        incidentTypeFilters: {
          ...state.settings.incidentTypeFilters,
          ...incidentTypeFiltersToAdd,
        },
      });

      localStorage.setItem("@settings", JSON.stringify(settingsWithIncidentTypes));

      return { ...state, settings: settingsWithIncidentTypes };
    }
  }
}

const SettingsProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [{ settings }, dispatch] = useReducer(settingsContextReducer, {
    settings: new SettingsRecord(JSON.parse(localStorage.getItem("@settings") ?? "{}")),
  });

  return <SettingsContext.Provider value={{ settings, dispatch }}>{children}</SettingsContext.Provider>;
};

export default SettingsProvider;
