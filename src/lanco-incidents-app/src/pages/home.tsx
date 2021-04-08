import Layout from "components/layout";
import IncidentsList from "components/incidents-list";
import useIncidents from "hooks/use-incidents";
import React from "react";
import { SITE_TITLE } from "constants/app-constants";
import RefreshButton from "components/refresh-button";
import FilterSortMenu from "components/file-sort-menu/filter-sort-menu";

const Home: React.FC = () => {
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
                <FilterSortMenu />
                <IncidentsList incidents={incidents} />
            </div>
        </Layout>
    );
};

export default Home;
