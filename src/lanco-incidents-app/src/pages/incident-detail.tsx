import Layout from "components/layout";
import React, { Fragment, PropsWithChildren, useEffect, useState } from "react";
import useIncidents from "hooks/use-incidents";
import { IncidentRecord } from "models/incident-record";
import { useHistory, useParams } from "react-router-dom";
import { Map } from "components/map";
import { Coords } from "google-map-react";

interface IncidentDetailProps {}

interface IncidentDetailContentProps {
    incident?: IncidentRecord | null;
}

interface IncidentDetailTitleProps {
    incident?: IncidentRecord | null;
    onBack: () => void;
}

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

function IncidentDetailTitle({ incident, onBack }: IncidentDetailTitleProps) {
    const title = !!incident?.subType
        ? incident?.subType
        : !!incident?.type
        ? incident?.type
        : "Incident";

    return (
        <div className="flex">
            <button aria-label="Go Back" className="mr-2 w-7" onClick={onBack}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
            </button>
            <div>{title}</div>
        </div>
    );
}

function IncidentDetailContent({ incident }: IncidentDetailContentProps) {
    const [defaultCenter, setDefaultCenter] = useState<Coords>();
    const { incidents } = useIncidents();

    const otherIncidents = incidents.filter(
        (other) => other.id !== incident?.id
    );

    useEffect(() => {
        if (defaultCenter == null && incident?.geoLocation != null) {
            setDefaultCenter(incident.geoLocation);
        }
    }, [incident]);

    if (incident == null) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            {defaultCenter != null && (
                <Map
                    defaultCenter={defaultCenter}
                    incident={incident}
                    otherIncidents={otherIncidents}
                />
            )}

            <div className="text-xs">
                <IncidentDetailSection title={incident.type}>
                    <div>{incident.location}</div>
                    <div>{incident.area}</div>
                </IncidentDetailSection>
                <IncidentDetailSection title={"Date & Time"}>
                    <div>{incident.getIncidentFullDate()}</div>
                </IncidentDetailSection>
                <IncidentDetailSection title={"Responding"}>
                    <div>
                        {incident.unitsAssigned.map((unit) => (
                            <div key={unit}>{unit}</div>
                        ))}
                    </div>
                </IncidentDetailSection>
            </div>
        </div>
    );
}

interface IncidentDetailSectionProps {
    title: string;
}

function IncidentDetailSection({
    children,
    title,
}: PropsWithChildren<IncidentDetailSectionProps>) {
    return (
        <Fragment>
            <h2 className="pt-3 text-sm font-semibold uppercase">{title}</h2>
            {children}
        </Fragment>
    );
}
