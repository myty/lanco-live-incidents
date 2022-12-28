import React from "react";
import Home from "pages/home";
import { createBrowserRouter, Navigate } from "react-router-dom";
import Settings from "pages/settings";
import { IncidentDetail } from "pages/incident-detail/incident-detail";
import AppLayout from "containers/app-layout";
import { NotFound } from "pages/not-found";

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
            { path: "/not-found", element: <NotFound /> },
            { path: "*", element: <Navigate to="not-found" /> },
        ],
    },
]);
