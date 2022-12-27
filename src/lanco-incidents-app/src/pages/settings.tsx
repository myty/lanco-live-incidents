import React, { useCallback, useEffect, useMemo, useReducer } from "react";
import useSettings, { UseSettingsHook } from "hooks/use-settings";
import _, { chain } from "lodash";
import PageTitle from "components/page-title";
import SettingsSectionSort from "components/settings/settings-sections/settings-section-sortby";
import { Sort } from "models/view-models/settings-record";
import { useNavigate } from "react-router-dom";
import { useAppLayout } from "containers/app-layout";

type TypeOfKey<Type, Key extends keyof Type> = Type[Key];

interface SettingsState {
    incidentFilters: TypeOfKey<UseSettingsHook, "incidentTypeFilters">;
    sort: TypeOfKey<UseSettingsHook, "sort">;
}

type SettingsReducerAction =
    | {
          type: "initialize";
          incidentFilters: TypeOfKey<UseSettingsHook, "incidentTypeFilters">;
          sort: TypeOfKey<UseSettingsHook, "sort">;
      }
    | {
          type: "setSort";
          sort: TypeOfKey<UseSettingsHook, "sort">;
      }
    | {
          type: "toggleIncidentFilter";
          key: string;
      };

const settingsStateDefault: SettingsState = {
    sort: Sort.Latest,
    incidentFilters: {},
};

const settingsReducer = (
    state: SettingsState,
    action: SettingsReducerAction
): SettingsState => {
    switch (action.type) {
        case "initialize": {
            return {
                ...state,
                sort: action.sort,
                incidentFilters: action.incidentFilters,
            };
        }
        case "toggleIncidentFilter": {
            return {
                ...state,
                incidentFilters: {
                    ...state.incidentFilters,
                    [action.key]: !state.incidentFilters[action.key],
                },
            };
        }
        case "setSort": {
            return {
                ...state,
                sort: action.sort,
            };
        }
    }
};

const Settings: React.FC = () => {
    const navigate = useNavigate();

    const {
        sort: originalSort,
        incidentTypeFilters: originalIncidentTypeFilters,
        updateSettings,
    } = useSettings();

    const [{ sort, incidentFilters }, dispatch] = useReducer(
        settingsReducer,
        settingsStateDefault
    );

    const sortedIncidentFilters = useMemo(() => {
        const kvps = Object.keys(incidentFilters).map((key) => ({
            key,
            value: incidentFilters[key],
        }));

        return chain(kvps).sortBy("key").value();
    }, [incidentFilters]);

    const setIncidentFilter = (key: string) => {
        dispatch({ type: "toggleIncidentFilter", key });
    };

    const goBack = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    useAppLayout(
        () => ({
            headerLeft: <PageTitle onBack={goBack}>Settings</PageTitle>,
        }),
        []
    );

    const handleApply = useCallback(() => {
        updateSettings(incidentFilters, sort);
        goBack();
    }, [updateSettings, incidentFilters, sort, goBack]);

    const handleSort = (sort: Sort) => {
        dispatch({ type: "setSort", sort });
    };

    const isDirty =
        originalSort !== sort ||
        !_.isEqual(originalIncidentTypeFilters, incidentFilters);

    useEffect(() => {
        dispatch({
            type: "initialize",
            sort: originalSort,
            incidentFilters: originalIncidentTypeFilters,
        });
    }, [originalSort, originalIncidentTypeFilters]);

    return (
        <div className="flex flex-col flex-auto max-h-full">
            <div className="flex flex-auto overflow-y-auto">
                <div className="block w-full">
                    <SettingsSectionSort
                        onSortChange={handleSort}
                        sort={sort}
                    />

                    <div className="flex-auto p-4 m-2 text-sm bg-white border-gray-400 rounded-md shadow">
                        <div className="font-medium text-gray-500">Filter:</div>
                        {sortedIncidentFilters.map((type) => (
                            <div key={type.key}>
                                <label className="inline-flex items-center pt-2 text-lg">
                                    <input
                                        className="w-6 h-6 text-blue-800 rounded form-checkbox"
                                        type="checkbox"
                                        checked={type.value}
                                        onChange={() =>
                                            setIncidentFilter(type.key)
                                        }
                                    />
                                    <span className="ml-2">{type.key}</span>
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className="p-2">
                <div className="flex w-full">
                    <button
                        className="flex-grow p-2 mr-1 font-medium uppercase border border-gray-400 rounded bg-gray-50"
                        onClick={goBack}
                    >
                        Cancel
                    </button>
                    <button
                        className="flex-grow p-2 ml-1 font-medium text-white uppercase bg-blue-800 border border-gray-400 rounded disabled:bg-gray-50 disabled:text-gray-300"
                        disabled={!isDirty}
                        onClick={handleApply}
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Settings;
