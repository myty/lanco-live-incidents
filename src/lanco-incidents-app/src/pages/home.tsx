import Layout from "containers/layout";
import IncidentsList from "components/incidents-list";
import useIncidents from "hooks/use-incidents";
import React, { useRef } from "react";
import { SITE_TITLE } from "constants/app-constants";
import RefreshButton from "components/refresh-button";
import SettingsButton from "components/settings-button";
import usePullToRefresh from "hooks/use-pull-to-refresh";

const REFRESH_TRIGGER_DISTANCE = 80;

const Home: React.FC = () => {
    const { incidents, loading, refresh } = useIncidents();

    const listElement = useRef<HTMLDivElement>(null);

    const { pullDistance, pulling, refreshing } = usePullToRefresh({
        element: listElement.current as HTMLElement,
        triggerDistance: REFRESH_TRIGGER_DISTANCE,
        onRefresh: refresh,
    });

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
                {pulling && (
                    <div
                        className="flex items-center justify-center text-base font-semibold"
                        style={{
                            height: pullDistance,
                            maxHeight: REFRESH_TRIGGER_DISTANCE,
                        }}>
                        Pull to Refresh
                    </div>
                )}
                {(refreshing || loading) && (
                    <div className="flex items-center justify-center h-20 text-base font-semibold">
                        Refreshing...
                    </div>
                )}
                <IncidentsList incidents={incidents} />
            </div>
        </Layout>
    );
};

export default Home;
