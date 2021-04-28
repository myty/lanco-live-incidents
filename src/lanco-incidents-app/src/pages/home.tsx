import Layout from "containers/layout";
import IncidentsList from "components/incidents-list";
import useIncidents from "hooks/use-incidents";
import React, { useRef } from "react";
import { SITE_TITLE } from "constants/app-constants";
import RefreshButton from "components/refresh-button";
import SettingsButton from "components/settings-button";
import PullToRefresh from "components/pull-to-refresh";

const REFRESH_TRIGGER_DISTANCE = 80;

const Home: React.FC = () => {
    const { incidents, loading, refresh } = useIncidents();

    const listElement = useRef<HTMLDivElement>(null);

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
            <div
                ref={listElement}
                className="px-2 pt-2 text-xs overscroll-y-contain">
                <PullToRefresh
                    loading={loading}
                    onRefresh={refresh}
                    refreshTriggerDistance={REFRESH_TRIGGER_DISTANCE}
                    watchRef={listElement}
                />
                <IncidentsList incidents={incidents} />
            </div>
        </Layout>
    );
};

export default Home;
