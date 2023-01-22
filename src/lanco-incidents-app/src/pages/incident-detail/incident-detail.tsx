import React from "react";
import { useMatch, useNavigate, useParams } from "react-router-dom";
import { IncidentDetailContent } from "./incident-detail-content";
import PageTitle from "components/page-title";
import { IncidentRecord } from "models/view-models/incident-record";
import useIncident from "hooks/use-incident";
import { useWebShare } from "hooks/use-web-share";
import { SITE_TITLE } from "constants/app-constants";
import { useAppLayout } from "containers/app-layout";

export function IncidentDetail() {
    const { id } = useParams<"id">();
    const pathMatch = useMatch("share/:id");
    const navigate = useNavigate();
    const { incident } = useIncident({ id });
    const webShare = useWebShare();

    if (pathMatch?.params.id === id) {
        navigate(`/incidents/${id}`, { replace: true });
    }

    const handleGoBack = () => navigate("/", { replace: true });
    const handleShare = () => webShare.share(getShareData(incident));

    useAppLayout(
        () => ({
            pageBgStyle: "bg-gray-100",
            headerLeft: (
                <PageTitle
                    onBack={handleGoBack}
                    showShareButton={webShare.enabled && incident != null}
                    onShare={handleShare}
                >
                    {getTitle(incident)}
                </PageTitle>
            ),
        }),
        [incident]
    );

    if (incident == null) {
        return (
            <>
                <div className="grid h-full grid-cols-1 place-content-center">
                    <p className="px-10 text-center">
                        This incident cannot be found or is no longer active.
                    </p>
                </div>
            </>
        );
    }

    return <IncidentDetailContent incident={incident} />;
}

function getTitle(incident?: IncidentRecord | null): string {
    return incident?.type ?? "Not Found";
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
