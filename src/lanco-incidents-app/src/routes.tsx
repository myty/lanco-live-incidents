import React from "react";
import Home from "pages/home";
import { RouteObject } from "react-router-dom";
import Settings from "pages/settings";
import { IncidentDetail } from "pages/incident-detail/incident-detail";

export const routes: RouteObject[] = [
    {
        element: <Home />,
        path: "/",
    },
    {
        path: "/settings",
        element: <Settings />,
    },
    {
        path: "/incidents/:id",
        element: <IncidentDetail />,
    },
];
