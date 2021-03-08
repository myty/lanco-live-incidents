import React, { useState } from "react";
import { Router } from "@reach/router";
import Home from "pages/home";
import IncidentDetail from "pages/incident-detail";
import { IncidentRecord } from "models/incident-record";

interface IncidentsContextState {
  incidents: IncidentRecord[];
  setIncidents: (incidents: IncidentRecord[]) => void;
}

const IncidentsContext = React.createContext<IncidentsContextState>({
  incidents: [],
  setIncidents: (incidents: IncidentRecord[]) => {},
});

function App() {
  const [incidents, setIncidents] = useState<IncidentRecord[]>([]);

  return (
    <IncidentsContext.Provider value={{ incidents, setIncidents }}>
      <Router>
        <Home path="/" />
        <IncidentDetail path="incidents/:id" />
      </Router>
    </IncidentsContext.Provider>
  );
}

export default App;
