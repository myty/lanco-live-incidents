import React from "react";
import { Router } from "@reach/router";
import Home from "pages/home";
import IncidentDetail from "pages/incident-detail";
import IncidentsProvider from "providers/IncidentsProvider";

function App() {
  return (
    <IncidentsProvider>
      <Router>
        <Home path="/" />
        <IncidentDetail path="incidents/:id" />
      </Router>
    </IncidentsProvider>
  );
}

export default App;
