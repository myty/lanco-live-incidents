import FilterSortMenuClosed from "components/file-sort-menu/filter-sort-menu-closed";
import FilterSortMenuOpened from "components/file-sort-menu/filter-sort-menu-opened";
import useSettings from "hooks/use-settings";
import { Sort } from "models/settings-record";
import React, { useState } from "react";

export type FilterSortMenuStatus = "open" | "closed";

const FilterSortMenu: React.FC = () => {
    const { sort, updateSort } = useSettings();
    const [status, setStatus] = useState<FilterSortMenuStatus>("closed");

    const handleMenuClose = () => setStatus("closed");

    const handleMenuApply = (sort: Sort) => {
        updateSort(sort);
        handleMenuClose();
    };

    if (status === "closed") {
        return (
            <FilterSortMenuClosed
                onClick={() => setStatus("open")}
                sort={sort}
            />
        );
    }

    return (
        <FilterSortMenuOpened
            sort={sort}
            onClose={handleMenuClose}
            onApply={handleMenuApply}
        />
    );
};

export default FilterSortMenu;
