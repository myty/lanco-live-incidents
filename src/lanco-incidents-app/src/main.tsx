import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./app";
import ServiceWorkerProvider from "providers/service-worker-provider";

ReactDOM.render(
    <React.StrictMode>
        <ServiceWorkerProvider>
            <App />
        </ServiceWorkerProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
