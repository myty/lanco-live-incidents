import React from "react";
import SettingsProvider from "providers/settings-provider";
import { router } from "router";
import { GeolocationStore } from "stores/geolocation-store";
import { RouterProvider } from "react-router-dom";
import ServiceWorkerProvider from "providers/service-worker-provider";

GeolocationStore.Default.setConfig({
    enableHighAccuracy: true,
    maximumAge: 1000,
    timeout: 20000,
    watch: true,
});

function App() {
    return (
        <ServiceWorkerProvider serviceWorkerPath="/sw.js">
            <SettingsProvider>
                <RouterProvider router={router} />
            </SettingsProvider>
        </ServiceWorkerProvider>
    );
}

export default App;
