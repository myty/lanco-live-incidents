import Layout from "containers/layout";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IncidentDetailContent } from "./incident-detail-content";
import PageTitle from "components/page-title";
import { IncidentRecord } from "models/view-models/incident-record";
import useIncident from "hooks/use-incident";
import { useWebShare } from "hooks/use-web-share";

export default function IncidentDetail() {
    const { id } = useParams<"id">();
    const navigate = useNavigate();
    const { incident } = useIncident({ id });
    const webShare = useWebShare();

    const handleGoBack = () => navigate(-1);

    const handleShare = () =>
        webShare.share({
            url: window.location.href,
        });

    return (
        <Layout
            pageBgStyle="bg-white"
            headerLeft={
                <PageTitle
                    onBack={handleGoBack}
                    showShareButton={webShare.enabled}
                    onShare={handleShare}
                >
                    {getTitle(incident)}
                </PageTitle>
            }
        >
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
