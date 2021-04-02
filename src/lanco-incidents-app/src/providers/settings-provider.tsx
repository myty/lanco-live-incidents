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
    | { type: "UpdateIncidentSort"; sort: Sort };

const defaultState: SettingsContextState = {
    settings: new SettingsRecord(),
    status: "LOADING",
};

export type SettingsContextType = SettingsContextState & {
    dispatch: Dispatch<SettingsContextAction>;
};

export const SettingsContext = createContext<SettingsContextType>({
    ...defaultState,
    dispatch: (value: SettingsContextAction) => {},
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
            const settings = state.settings.with({ sort });

            localStorage.setItem("@settings", JSON.stringify(settings));

            return { ...state, settings };
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
