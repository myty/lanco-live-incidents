import Layout from "containers/layout";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IncidentDetailContent } from "./incident-detail-content";
import PageTitle from "components/page-title";
import { IncidentRecord } from "models/view-models/incident-record";
import useIncident from "hooks/use-incident";

interface IncidentDetailProps {}

export default function IncidentDetail(props: IncidentDetailProps) {
    const { id } = useParams<"id">();
    const navigate = useNavigate();
    const { incident } = useIncident({ id });

    const handleGoBack = () => navigate(-1);

    return (
        <Layout
            pageBgStyle="bg-white"
            headerLeft={
                <PageTitle onBack={handleGoBack}>
                    {getTitle(incident)}
                </PageTitle>
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
