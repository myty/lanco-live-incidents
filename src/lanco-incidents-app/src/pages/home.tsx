import Layout from "containers/layout";
import IncidentsList from "components/incidents-list";
import useIncidents from "hooks/use-incidents";
import React from "react";
import { SITE_TITLE } from "constants/app-constants";
import RefreshButton from "components/refresh-button";
import SettingsButton from "components/settings-button";

const Home: React.FC = () => {
    const { incidents, loading, refresh } = useIncidents();

    return (
        <Layout
            pageBgStyle="bg-gray-100"
            headerLeft={SITE_TITLE}
            headerRight={
                <>
                    <SettingsButton />
                    <RefreshButton
                        disabled={loading}
                        animate={loading}
                        onClick={refresh}
                    />
                </>
            }>
            <div className="px-2 pt-2 text-xs overscroll-y-contain">
                <IncidentsList incidents={incidents} loading={loading} />
            </div>
        </Layout>
    );
};

export default Home;
