import { Sort } from "models/settings-record";
import React from "react";

interface SettingsSectionSortProps {
    onSortChange: (sort: Sort) => void;
    sort: Sort;
}

const SettingsSectionSort: React.FC<SettingsSectionSortProps> = ({
    onSortChange,
    sort,
}) => {
    return (
        <div className="flex-auto p-4 mx-2 mt-2 text-sm bg-white border-gray-400 rounded-md shadow">
            <div className="font-medium ">Sort By:</div>
            <div>
                <label className="inline-flex items-center pt-2">
                    <input
                        className="text-blue-800 form-radio"
                        type="radio"
                        checked={sort === Sort.Distance}
                        value={Sort.Distance}
                        onChange={() => onSortChange(Sort.Distance)}
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
                        onChange={() => onSortChange(Sort.Latest)}
                    />
                    <span className="ml-2">Latest</span>
                </label>
            </div>
        </div>
    );
};

export default SettingsSectionSort;
