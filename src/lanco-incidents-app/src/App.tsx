import React from "react";
import Home from "pages/home";
import IncidentDetail from "pages/incident-detail/incident-detail";
import IncidentsProvider from "providers/IncidentsProvider";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
    return (
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
    );
}

export default App;
