import { Sort } from "models/settings-record";
import React from "react";
import { useState } from "react";

interface FilterSortMenuOpenedProps {
    sort: Sort;
    onClose: () => void;
    onApply: (sort: Sort) => void;
}

const FilterSortMenuOpened: React.FC<FilterSortMenuOpenedProps> = ({
    sort: originalSort,
    onClose,
    onApply,
}) => {
    const [sort, setSort] = useState(originalSort);

    const handleMenuApply = () => {
        onApply(sort);
    };

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
                    onClick={onClose}>
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

export default FilterSortMenuOpened;
