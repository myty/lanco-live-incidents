import Layout from "containers/layout";
import React, { useCallback, useEffect, useMemo, useReducer } from "react";
import useSettings, { UseSettingsHook } from "hooks/use-settings";
import _, { chain } from "lodash";
import { useHistory } from "react-router";
import PageTitle from "components/page-title";
import SettingsSectionSort from "components/settings/settings-sections/settings-section-sortby";
import { Sort } from "models/settings-record";

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
    const { goBack } = useHistory();

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
        <Layout
            pageBgStyle="bg-gray-100"
            headerLeft={<PageTitle onBack={goBack}>Settings</PageTitle>}>
            <div className="flex flex-col max-h-full">
                <div className="flex flex-col flex-grow">
                    <SettingsSectionSort
                        onSortChange={handleSort}
                        sort={sort}
                    />

                    <div className="flex-auto p-4 mx-2 mt-2 text-sm bg-white border-gray-400 rounded-md shadow">
                        <div className="font-medium">Filter:</div>
                        {sortedIncidentFilters.map((type) => (
                            <div key={type.key}>
                                <label className="inline-flex items-center pt-2">
                                    <input
                                        className="text-blue-800 form-checkbox"
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

                <div className="flex flex-row justify-end flex-grow-0 m-2 mb-2">
                    <button
                        className="flex-grow p-2 mr-1 font-medium uppercase border border-gray-400 rounded bg-gray-50"
                        onClick={goBack}>
                        Cancel
                    </button>
                    <button
                        className="flex-grow p-2 ml-1 font-medium text-white uppercase bg-blue-800 border border-gray-400 rounded disabled:bg-gray-50 disabled:text-gray-300"
                        disabled={!isDirty}
                        onClick={handleApply}>
                        Apply
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default Settings;
