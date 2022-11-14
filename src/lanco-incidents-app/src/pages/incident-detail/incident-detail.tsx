import Layout from "containers/layout";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IncidentDetailContent } from "./incident-detail-content";
import PageTitle from "components/page-title";
import { IncidentRecord } from "models/view-models/incident-record";
import useIncident from "hooks/use-incident";
import { useWebShare } from "hooks/use-web-share";
import { SITE_TITLE } from "constants/app-constants";

export default function IncidentDetail() {
    const { id } = useParams<"id">();
    const navigate = useNavigate();
    const { incident } = useIncident({ id });
    const webShare = useWebShare();

    const handleGoBack = () => navigate(-1);
    const handleShare = () => webShare.share(getShareData(incident));

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

function getShareData(incident?: IncidentRecord | null) {
    const incidentTypeText = incident?.subType
        ? `${incident?.type} (${incident?.subType})`
        : incident?.type;

    const locationText = [incident?.location, incident?.area].join(", ");

    return {
        title: SITE_TITLE,
        text: [incidentTypeText, locationText].join(" - "),
        url: window.location.href,
    };
}
