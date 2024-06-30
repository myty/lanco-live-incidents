import { Navigate, createBrowserRouter } from "react-router-dom";
import AppLayout from "./containers/app-layout";
import Home from "./pages/home";
import { IncidentDetail } from "./pages/incident-detail/incident-detail";
import { NotFound } from "./pages/not-found";
import Settings from "./pages/settings";

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
