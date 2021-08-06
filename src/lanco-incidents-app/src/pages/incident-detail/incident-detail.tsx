import Layout from "containers/layout";
import React from "react";
import useIncidents from "hooks/use-incidents";
import { useHistory, useParams } from "react-router-dom";
import { IncidentDetailContent } from "./incident-detail-content";
import PageTitle from "components/page-title";
import { IncidentRecord } from "models/view-models/incident-record";

interface IncidentDetailProps {}

export default function IncidentDetail(props: IncidentDetailProps) {
    const { id } = useParams<{ id: string }>();
    const { goBack } = useHistory();
    const { incident } = useIncidents({ id });

    return (
        <Layout
            pageBgStyle="bg-white"
            headerLeft={
                <PageTitle onBack={goBack}>{getTitle(incident)}</PageTitle>
            }>
            <IncidentDetailContent incident={incident} />
        </Layout>
    );
}

function getTitle(incident?: IncidentRecord | null): string {
    const { type } = incident ?? {};

    if (type) {
        return type;
    }

    return "Incident";
}
