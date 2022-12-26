import React from "react";
import GeolocationProvider from "providers/geolocation-provider";
import SettingsProvider from "providers/settings-provider";
import Settings from "pages/settings";
import {
    Outlet,
    RouterProvider,
    createReactRouter,
    createRouteConfig,
} from "@tanstack/react-router";
import { createIndexRoute } from "routes";
import { IncidentDetail } from "pages/incident-detail/incident-detail";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "query-client";
import { GeolocationStore } from "stores/geolocation-store";

const routeConfig = createRouteConfig().createChildren((createRoute) => [
    createIndexRoute,
    createRoute({
        path: "/settings",
        component: Settings,
    }),
    createRoute({
        path: "/incidents/:id",
        component: IncidentDetail,
    }),
]);

const Router = createReactRouter({ routeConfig });

GeolocationStore.Default.setConfig({
    enableHighAccuracy: true,
    maximumAge: 1000,
    timeout: 20000,
    watch: true,
});

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <SettingsProvider>
                <RouterProvider router={Router}>
                    <Outlet />
                </RouterProvider>
            </SettingsProvider>
        </QueryClientProvider>
    );
}

export default App;
