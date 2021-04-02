import Layout from "components/layout";
import IncidentsList from "components/incidents-list";
import useIncidents from "hooks/use-incidents";
import React from "react";
import { SITE_TITLE } from "constants/app-constants";
import RefreshButton from "components/refresh-button";

const Home: React.FC = () => {
    const { incidents, loading, refresh } = useIncidents();

    return (
        <Layout
            headerLeft={SITE_TITLE}
            headerRight={
                <RefreshButton
                    disabled={loading}
                    animate={loading}
                    onClick={refresh}
                />
            }>
            <div className="px-2 pt-2 text-xs bg-gray-100">
                <IncidentsList incidents={incidents} />
            </div>
        </Layout>
    );
};

export default Home;
