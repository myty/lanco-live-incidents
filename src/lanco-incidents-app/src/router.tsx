import React from "react";
import Home from "pages/home";
import { createBrowserRouter } from "react-router-dom";
import Settings from "pages/settings";
import { IncidentDetail } from "pages/incident-detail/incident-detail";
import AppLayout from "containers/app-layout";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <AppLayout />,
        children: [
            {
                index: true,
                element: <Home />,
            },
            {
                path: "settings",
                element: <Settings />,
            },
            {
                path: "incidents/:id",
                element: <IncidentDetail />,
            },
        ],
    },
]);
