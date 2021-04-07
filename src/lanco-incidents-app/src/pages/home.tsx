import Layout from "components/layout";
import IncidentsList from "components/incidents-list";
import useIncidents from "hooks/use-incidents";
import React, { useState } from "react";
import { SITE_TITLE } from "constants/app-constants";
import RefreshButton from "components/refresh-button";
import FilterSortMenu, {
    FilterSortMenuStatus,
} from "components/filter-sort-menu";

const Home: React.FC = () => {
    const { incidents, loading, refresh } = useIncidents();
    const [status, setStatus] = useState<FilterSortMenuStatus>("closed");

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
                <FilterSortMenu status={status} onStatusChange={setStatus} />
                <IncidentsList incidents={incidents} />
            </div>
        </Layout>
    );
};

export default Home;
