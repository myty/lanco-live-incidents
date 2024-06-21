import { Sort } from "../../models/view-models/settings-record";

interface FilterSortMenuClosedProps {
  onClick: () => void;
  sort: Sort;
}

const FilterSortMenuClosed: React.FC<FilterSortMenuClosedProps> = ({ onClick, sort }) => {
  const sortByText = sort === Sort.Distance ? "Sort by distance" : "Sort by latest";

  return (
    <button
      type="button"
      className="flex flex-row items-center w-full px-4 py-2 mb-2 font-medium text-left bg-gray-200 border-gray-400 rounded-md shadow cursor-pointer"
      onClick={onClick}>
      <div className="flex-grow text-xs">{`${sortByText}, show all incidents`}</div>
      <div className="flex-shrink-0">
        <svg className="w-5 h-5 ml-2 -mr-1" viewBox="0 0 20 20" fill="currentColor">
          <title>Sort</title>
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </button>
  );
};

export default FilterSortMenuClosed;
