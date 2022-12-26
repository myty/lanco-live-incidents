import Layout from "containers/layout";
import IncidentsList from "components/incidents-list";
import useIncidents from "hooks/use-incidents";
import React from "react";
import { LIVE_FEED, SITE_TITLE } from "constants/app-constants";
import RefreshButton from "components/refresh-button";
import SettingsButton from "components/settings-button";
import axios from "axios";
import { FeedIncident } from "models/dtos/feed-incident";
import { queryClient } from "query-client";
import {
    createBrowserRouter,
    RouterProvider,
    useLoaderData,
} from "react-router-dom";
import { IncidentRecord } from "models/view-models/incident-record";

export const Home: React.FC = () => {
    const incidents: IncidentRecord[] = useLoaderData();
    const {
        loaderData: { incidents },
    } = useMatch(createIndexRoute.id);

    const { loading, refresh } = useIncidents();

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

export const createIndexRoute = createRouteConfig().createRoute({
    path: "/",
    component: Home,
    loader: async () => {
        const incidents =
            queryClient.getQueryData<FeedIncident[]>(["incidents"]) ??
            (await queryClient.prefetchQuery(["incidents"], () =>
                axios.get<FeedIncident[]>(LIVE_FEED)
            )) ??
            [];

        return { incidents };
    },
});
