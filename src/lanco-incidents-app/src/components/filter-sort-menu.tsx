import useSettings from "hooks/use-settings";
import { Sort } from "models/settings-record";
import React, { useEffect, useState } from "react";

export type FilterSortMenuStatus = "open" | "closed";

interface FilterSortMenuProps {
    onStatusChange: (status: FilterSortMenuStatus) => void;
    status: FilterSortMenuStatus;
}

const FilterSortMenu: React.FC<FilterSortMenuProps> = ({
    onStatusChange,
    status,
}) => {
    const { sort: settingsSort, updateSort } = useSettings();

    const [sort, setSort] = useState(settingsSort);

    const sortByText =
        settingsSort === Sort.Distance ? "Sort by distance" : "Sort by latest";

    const handleMenuOpen = () => {
        onStatusChange("open");
    };

    const handleMenuClose = () => {
        onStatusChange("closed");
    };

    const handleMenuApply = () => {
        updateSort(sort);
        onStatusChange("closed");
    };

    useEffect(() => {
        if (status === "open") {
            setSort(settingsSort);
        }
    }, [status]);

    if (status === "closed") {
        return (
            <button
                className="flex flex-row w-full px-4 py-1 mb-2 font-medium text-left bg-gray-200 border-gray-400 rounded-md shadow cursor-pointer item-center"
                onClick={handleMenuOpen}>
                <div className="flex-grow text-xs">
                    {`${sortByText}, show all incidents`}
                </div>
                <div className="flex-shrink-0">
                    <svg
                        className="w-5 h-5 ml-2 -mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                            fill-rule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clip-rule="evenodd"></path>
                    </svg>
                </div>
            </button>
        );
    }

    return (
        <div className="flex flex-col w-full p-4 mb-2 text-left bg-gray-200 border-gray-400 rounded-md shadow item-center">
            <div>
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
            <div className="flex flex-row justify-end">
                <button
                    className="px-2 py-1 ml-2 font-medium uppercase border-gray-400 rounded bg-gray-50"
                    onClick={handleMenuClose}>
                    Cancel
                </button>
                <button
                    className="px-2 py-1 ml-2 font-medium uppercase border-gray-400 rounded bg-gray-50"
                    onClick={handleMenuApply}>
                    Apply
                </button>
            </div>
        </div>
    );
};

export default FilterSortMenu;
