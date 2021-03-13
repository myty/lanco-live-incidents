import React from "react";
import Home from "pages/home";
import IncidentDetail from "pages/incident-detail/incident-detail";
import IncidentsProvider from "providers/incidents-provider";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import GeolocationProvider from "providers/geolocation-provider";

function App() {
    return (
        <IncidentsProvider>
            <GeolocationProvider>
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
            </GeolocationProvider>
        </IncidentsProvider>
    );
}

export default App;
