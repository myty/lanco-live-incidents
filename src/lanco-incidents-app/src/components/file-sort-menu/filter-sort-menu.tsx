import FilterSortMenuClosed from "components/file-sort-menu/filter-sort-menu-closed";
import FilterSortMenuOpened from "components/file-sort-menu/filter-sort-menu-opened";
import useSettings from "hooks/use-settings";
import { Sort } from "models/view-models/settings-record";
import React, { useState } from "react";

export type FilterSortMenuStatus = "open" | "closed";

const FilterSortMenu: React.FC = () => {
  const { incidentTypeFilters, sort, updateSettings } = useSettings();
  const [status, setStatus] = useState<FilterSortMenuStatus>("closed");

  const handleMenuClose = () => setStatus("closed");

  const handleMenuApply = (incidentTypeFilters: Record<string, boolean>, sort: Sort) => {
    updateSettings(incidentTypeFilters, sort);
    handleMenuClose();
  };

  if (status === "closed") {
    return <FilterSortMenuClosed onClick={() => setStatus("open")} sort={sort} />;
  }

  return (
    <FilterSortMenuOpened
      incidentTypeFilters={incidentTypeFilters}
      sort={sort}
      onClose={handleMenuClose}
      onApply={handleMenuApply}
    />
  );
};

export default FilterSortMenu;
