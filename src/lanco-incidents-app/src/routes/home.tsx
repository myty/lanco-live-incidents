import Layout from "containers/layout";
import IncidentsList from "components/incidents-list";
import useIncidents from "hooks/use-incidents";
import React from "react";
import { LIVE_FEED, SITE_TITLE } from "constants/app-constants";
import RefreshButton from "components/refresh-button";
import SettingsButton from "components/settings-button";
import { queryClient } from "query-client";
import { FeedIncident } from "models/dtos/feed-incident";
import axios from "axios";
import { useLoaderData } from "react-router-dom";
import { IncidentRecord } from "models/view-models/incident-record";

const Home: React.FC = () => {
    const incidents = useLoaderData();

    if (!isIncidentsArray(incidents)) {
        return <div>We got an unexpected thing from the server ...</div>;
    }

    // const { incidents, loading, refresh } = useIncidents();

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
            }
        >
            <div className="px-2 pt-2 text-xs overscroll-y-contain">
                <IncidentsList incidents={incidents} loading={loading} />
            </div>
        </Layout>
    );
};

function isIncidentsArray(incidents: unknown): incidents is IncidentRecord[] {
    return true;
}

export async function homeLoader() {
    return (
        queryClient.getQueryData<FeedIncident[]>(["incidents"]) ??
        (await queryClient.prefetchQuery(["incidents"], () =>
            axios.get<FeedIncident[]>(LIVE_FEED)
        )) ??
        []
    );
}

export default Home;
