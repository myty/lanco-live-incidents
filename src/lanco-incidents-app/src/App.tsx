import React from "react";
import Header from "components/header";
import IncidentsList from "components/incidents-list";
import useIncidents from "hooks/use-incidents";

function App() {
  const { incidents } = useIncidents();

  return (
    <div>
      <Header />
      <IncidentsList incidents={incidents} />
    </div>
  );
}

export default App;
