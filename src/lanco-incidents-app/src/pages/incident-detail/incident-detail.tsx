import Layout from "components/layout";
import React from "react";
import useIncidents from "hooks/use-incidents";
import { useHistory, useParams } from "react-router-dom";
import { IncidentDetailTitle } from "./incident-detail-title";
import { IncidentDetailContent } from "./incident-detail-content";

interface IncidentDetailProps {}

export default function IncidentDetail(props: IncidentDetailProps) {
    const { id } = useParams<{ id: string }>();
    const history = useHistory();
    const { incident } = useIncidents({ id });

    return (
        <Layout
            headerLeft={
                <IncidentDetailTitle
                    incident={incident}
                    onBack={() => {
                        history.goBack();
                    }}
                />
            }>
            <IncidentDetailContent incident={incident} />
        </Layout>
    );
}
