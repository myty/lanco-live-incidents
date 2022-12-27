import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app";
import ServiceWorkerProvider from "providers/service-worker-provider";
import "./index.css";

const container = document.getElementById("root");
const root = createRoot(container!);

root.render(
    <React.StrictMode>
        <ServiceWorkerProvider serviceWorkerPath="/sw.js">
            <App />
        </ServiceWorkerProvider>
    </React.StrictMode>
);
