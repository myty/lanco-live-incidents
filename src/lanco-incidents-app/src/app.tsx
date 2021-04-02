import React from "react";
import Home from "pages/home";
import IncidentDetail from "pages/incident-detail/incident-detail";
import IncidentsProvider from "providers/incidents-provider";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import GeolocationProvider from "providers/geolocation-provider";
import SettingsProvider from "providers/settings-provider";

function App() {
    return (
        <SettingsProvider>
            <GeolocationProvider
                enableHighAccuracy
                maximumAge={1000}
                timeout={20000}
                watch>
                <IncidentsProvider>
                    <Router>
                        <Switch>
                            <Route path="/incidents/:id">
                                <IncidentDetail />
                            </Route>
                            <Route path="/">
                                <Home />
                            </Route>
                        </Switch>
                    </Router>
                </IncidentsProvider>
            </GeolocationProvider>
        </SettingsProvider>
    );
}

export default App;
