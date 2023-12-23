import IncidentsList from "components/incidents-list";
import RefreshButton from "components/refresh-button";
import SettingsButton from "components/settings-button";
import { useAppLayout } from "containers/app-layout";
import useIncidents from "hooks/use-incidents";
import React from "react";

const Home: React.FC = () => {
  const { loading, incidents, refresh } = useIncidents();

  useAppLayout(
    () => ({
      headerRight: (
        <>
          <SettingsButton />
          <RefreshButton disabled={loading} animate={loading} onClick={refresh} />
        </>
      ),
    }),
    [loading, refresh]
  );

  return (
    <div className="px-2 pt-2 text-xs overscroll-y-contain">
      <IncidentsList incidents={incidents} loading={loading} />
    </div>
  );
};

export default Home;
