import { chain } from "lodash";
import { Sort } from "models/view-models/settings-record";
import React, { useCallback, useMemo } from "react";
import { useState } from "react";

interface FilterSortMenuOpenedProps {
    incidentTypeFilters: Record<string, boolean>;
    sort: Sort;
    onClose: () => void;
    onApply: (incidentTypeFilters: Record<string, boolean>, sort: Sort) => void;
}

const FilterSortMenuOpened: React.FC<FilterSortMenuOpenedProps> = ({
    sort: originalSort,
    incidentTypeFilters: originalIncidentTypeFilters,
    onClose,
    onApply,
}) => {
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
        onApply(incidentTypeFilters, sort);
    }, [onApply, incidentTypeFilters, sort]);

    return (
        <div className="flex flex-col w-full p-4 mb-2 text-left bg-gray-200 border-gray-400 rounded-md shadow item-center">
            <div className="flex flex-row">
                <div className="flex-1">
                    <div className="font-medium">Sort By:</div>
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
                <div className="flex-1 pb-4 pl-4">
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
            </div>
            <div className="flex flex-row justify-end">
                <button
                    className="px-2 py-1 ml-2 font-medium uppercase border-gray-400 rounded bg-gray-50"
                    onClick={onClose}>
                    Cancel
                </button>
                <button
                    className="px-2 py-1 ml-2 font-medium uppercase border-gray-400 rounded bg-gray-50"
                    onClick={handleApply}>
                    Apply
                </button>
            </div>
        </div>
    );
};

export default FilterSortMenuOpened;
