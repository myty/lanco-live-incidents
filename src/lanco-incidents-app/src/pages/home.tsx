import Layout from "components/layout";
import IncidentsList from "components/incidents-list";
import useIncidents from "hooks/use-incidents";
import React from "react";
import { SITE_TITLE } from "constants/app-constants";
import RefreshButton from "components/refresh-button";
import { Menu, Transition } from "@headlessui/react";
import useSettings from "hooks/use-settings";
import { Sort } from "models/settings-record";

const Home: React.FC = () => {
    const { sort, updateSort } = useSettings();
    const { incidents, loading, refresh } = useIncidents();

    return (
        <Layout
            pageBgStyle="bg-gray-100"
            headerLeft={SITE_TITLE}
            headerRight={
                <RefreshButton
                    disabled={loading}
                    animate={loading}
                    onClick={refresh}
                />
            }>
            <div className="px-2 pt-2 text-xs">
                <div className="flex items-center justify-between h-12 pb-2">
                    <div className=""></div>
                    <div>
                        <Menu>
                            {({ open }) => (
                                <>
                                    <span className="rounded-md shadow-sm">
                                        <Menu.Button className="inline-flex justify-center w-full px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out bg-white border border-gray-300 rounded-md hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-50 active:text-gray-800">
                                            <span>Sort By</span>
                                            <svg
                                                className="w-5 h-5 ml-2 -mr-1"
                                                viewBox="0 0 20 20"
                                                fill="currentColor">
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </Menu.Button>
                                    </span>

                                    <Transition
                                        show={open}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95">
                                        <Menu.Items
                                            static
                                            className="absolute right-0 w-56 mt-2 mr-2 origin-top-right bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg outline-none">
                                            <div className="py-1">
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button
                                                            onClick={() =>
                                                                updateSort(
                                                                    Sort.Distance
                                                                )
                                                            }
                                                            className={`${
                                                                active
                                                                    ? "bg-gray-100 text-gray-900"
                                                                    : "text-gray-700"
                                                            } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}>
                                                            {sort ===
                                                            Sort.Distance
                                                                ? "◾ "
                                                                : ""}
                                                            Distance
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                                <Menu.Item>
                                                    {({ active }) => (
                                                        <button
                                                            onClick={() =>
                                                                updateSort(
                                                                    Sort.Latest
                                                                )
                                                            }
                                                            className={`${
                                                                active
                                                                    ? "bg-gray-100 text-gray-900"
                                                                    : "text-gray-700"
                                                            } flex justify-between w-full px-4 py-2 text-sm leading-5 text-left`}>
                                                            {sort ===
                                                            Sort.Latest
                                                                ? "◾ "
                                                                : ""}
                                                            Latest
                                                        </button>
                                                    )}
                                                </Menu.Item>
                                            </div>
                                        </Menu.Items>
                                    </Transition>
                                </>
                            )}
                        </Menu>
                    </div>
                </div>
                <IncidentsList incidents={incidents} />
            </div>
        </Layout>
    );
};

export default Home;
