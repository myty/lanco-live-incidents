import { IncidentRecord } from "models/incident-record";
import React from "react";

export interface IncidentDetailTitleProps {
    incident?: IncidentRecord | null;
    onBack: () => void;
}

export const IncidentDetailTitle: React.FC<IncidentDetailTitleProps> = ({
    incident,
    onBack,
}) => {
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
            <div>{getTitle(incident)}</div>
        </div>
    );
};

function getTitle(incident?: IncidentRecord | null): string {
    const { type } = incident ?? {};

    if (type) {
        return type;
    }

    return "Incident";
}
