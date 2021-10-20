import React from "react";
import Home from "pages/home";
import IncidentDetail from "pages/incident-detail/incident-detail";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import GeolocationProvider from "providers/geolocation-provider";
import SettingsProvider from "providers/settings-provider";
import Settings from "pages/settings";

function App() {
    return (
        <GeolocationProvider
            enableHighAccuracy
            maximumAge={1000}
            timeout={20000}
            watch>
            <SettingsProvider>
                <Router>
                    <Switch>
                        <Route path="/incidents/:id">
                            <IncidentDetail />
                        </Route>
                        <Route path="/settings">
                            <Settings />
                        </Route>
                        <Route path="/">
                            <Home />
                        </Route>
                    </Switch>
                </Router>
            </SettingsProvider>
        </GeolocationProvider>
    );
}

export default App;
