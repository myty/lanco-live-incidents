import { RouteComponentProps } from "@reach/router";
import Layout from "components/layout";
import IncidentsList from "components/incidents-list";
import useIncidents from "hooks/use-incidents";
import React from "react";
import { SITE_TITLE } from "constants/app-constants";

interface HomeProps extends RouteComponentProps {}

export default function Home(props: HomeProps) {
  const { incidents, loading, refresh } = useIncidents();

  const buttonText = `Refresh${loading ? "ing..." : ""}`;

  const refreshButton = (
    <button
      className="px-3 text-xs font-semibold bg-blue-900 hover:bg-blue-500"
      onClick={refresh}
      disabled={loading}
    >
      {buttonText}
    </button>
  );

  return (
    <Layout headerLeft={SITE_TITLE} headerRight={refreshButton}>
      <IncidentsList incidents={incidents} />
    </Layout>
  );
}
