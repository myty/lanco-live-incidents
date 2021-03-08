import { RouteComponentProps, useParams } from "@reach/router";
import Layout from "components/layout";
import React from "react";
import useIncidents from "hooks/use-incidents";

interface IncidentDetailProps extends RouteComponentProps {}

export default function IncidentDetail(props: IncidentDetailProps) {
  const { id } = useParams();
  const { incident } = useIncidents({ id });

  const title = incident?.type ?? "Incident";

  return (
    <Layout headerLeft={title}>
      {incident == null ? "Loading..." : <div>{incident.type}</div>}
    </Layout>
  );
}
