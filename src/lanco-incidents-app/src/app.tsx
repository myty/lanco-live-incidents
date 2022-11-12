import React from "react";
import Home from "pages/home";
import IncidentDetail from "pages/incident-detail/incident-detail";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GeolocationProvider from "providers/geolocation-provider";
import SettingsProvider from "providers/settings-provider";
import Settings from "pages/settings";

function App() {
    return (
        <GeolocationProvider
            enableHighAccuracy={true}
            maximumAge={1000}
            timeout={20000}
            watch={true}
        >
            <SettingsProvider>
                <Router>
                    <Routes>
                        <Route
                            path="/incidents/:id"
                            element={<IncidentDetail />}
                        />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/" element={<Home />} />
                    </Routes>
                </Router>
            </SettingsProvider>
        </GeolocationProvider>
    );
}

export default App;
