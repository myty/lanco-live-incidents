import Layout from "containers/layout";
import React, { useCallback, useMemo, useState } from "react";
import useSettings from "hooks/use-settings";
import { chain } from "lodash";
import { Sort } from "models/settings-record";
import { useHistory } from "react-router";
import PageTitle from "components/page-title";

const Settings: React.FC = () => {
    const { goBack } = useHistory();

    const {
        sort: originalSort,
        incidentTypeFilters: originalIncidentTypeFilters,
        updateSettings,
    } = useSettings();

    const [sort, setSort] = useState(originalSort);
    const [incidentTypeFilters, setIncidentFilters] = useState(
        originalIncidentTypeFilters
    );

    const incidentTypeFilterList = useMemo(() => {
        const kvps = Object.keys(incidentTypeFilters).map((key) => ({
            key,
            value: incidentTypeFilters[key],
        }));

        return chain(kvps).sortBy("key").value();
    }, [incidentTypeFilters]);

    const setIncidentFilter = (key: string) => {
        setIncidentFilters((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const handleApply = useCallback(() => {
        updateSettings(incidentTypeFilters, sort);
        goBack();
    }, [updateSettings, incidentTypeFilters, sort, goBack]);

    return (
        <Layout
            pageBgStyle="bg-gray-100"
            headerLeft={<PageTitle onBack={goBack}>Settings</PageTitle>}>
            <div className="flex flex-col">
                <div className="flex-auto p-4 mx-2 mt-2 text-sm bg-white border-gray-400 rounded-md shadow">
                    <div className="font-medium ">Sort By:</div>
                    <div>
                        <label className="inline-flex items-center pt-2">
                            <input
                                className="text-blue-800 form-radio"
                                type="radio"
                                checked={sort === Sort.Distance}
                                value={Sort.Distance}
                                onChange={() => setSort(Sort.Distance)}
                            />
                            <span className="ml-2">Distance</span>
                        </label>
                    </div>
                    <div>
                        <label className="inline-flex items-center pt-2">
                            <input
                                className="text-blue-800 form-radio"
                                type="radio"
                                checked={sort === Sort.Latest}
                                value={Sort.Latest}
                                onChange={() => setSort(Sort.Latest)}
                            />
                            <span className="ml-2">Latest</span>
                        </label>
                    </div>
                </div>

                <div className="flex-auto p-4 mx-2 mt-2 text-sm bg-white border-gray-400 rounded-md shadow">
                    <div className="font-medium">Filter:</div>
                    {incidentTypeFilterList.map((type) => (
                        <div key={type.key}>
                            <label className="inline-flex items-center pt-2">
                                <input
                                    className="text-blue-800 form-checkbox"
                                    type="checkbox"
                                    checked={type.value}
                                    onChange={() => setIncidentFilter(type.key)}
                                />
                                <span className="ml-2">{type.key}</span>
                            </label>
                        </div>
                    ))}
                </div>

                <div className="flex flex-row justify-end flex-auto m-2 mb-2">
                    <button
                        className="flex-grow px-2 py-1 mr-1 font-medium uppercase border border-gray-400 rounded bg-gray-50"
                        onClick={goBack}>
                        Cancel
                    </button>
                    <button
                        className="flex-grow px-2 py-1 ml-1 font-medium text-white uppercase bg-blue-800 border border-gray-400 rounded"
                        onClick={handleApply}>
                        Apply
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default Settings;
