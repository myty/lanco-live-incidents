import Layout from "components/layout";
import React from "react";
import useIncidents from "hooks/use-incidents";
import { useHistory, useParams } from "react-router-dom";
import { IncidentDetailTitle } from "./incident-detail-title";
import { IncidentDetailContent } from "./incident-detail-content";
import RefreshButton from "components/refresh-button";

interface IncidentDetailProps {}

export default function IncidentDetail(props: IncidentDetailProps) {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const { incident, loading, refresh } = useIncidents({ id });

    return (
        <Layout
            pageBgStyle="bg-white"
            headerLeft={
                <IncidentDetailTitle
                    incident={incident}
                    onBack={() => {
                        history.goBack();
                    }}
                />
            }
            headerRight={
                <RefreshButton
                    disabled={loading}
                    animate={loading}
                    onClick={refresh}
                />
            }>
            <IncidentDetailContent incident={incident} />
        </Layout>
    );
}
