import React, { useEffect } from "react";
import Home from "pages/home";
import IncidentDetail from "pages/incident-detail/incident-detail";
import IncidentsProvider from "providers/incidents-provider";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import GeolocationProvider from "providers/geolocation-provider";
import useServiceWorker from "hooks/use-service-worker";

function App() {
    const { appNeedsRefresh, updateServiceWorker } = useServiceWorker();

    useEffect(() => {
        if (appNeedsRefresh) {
            if (
                confirm(
                    "There is a new version of the app.  Would like to load the updates?"
                ) == true
            ) {
                updateServiceWorker();
            }
        }
    }, [appNeedsRefresh]);

    return (
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
    );
}

export default App;
