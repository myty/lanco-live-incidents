import React from "react";
import SettingsProvider from "providers/settings-provider";
import { routes } from "routes";
import { GeolocationStore } from "stores/geolocation-store";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

GeolocationStore.Default.setConfig({
    enableHighAccuracy: true,
    maximumAge: 1000,
    timeout: 20000,
    watch: true,
});

const router = createBrowserRouter(routes);

function App() {
    return (
        <SettingsProvider>
            <RouterProvider router={router} />
        </SettingsProvider>
    );
}

export default App;
