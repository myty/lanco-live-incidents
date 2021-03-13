import React, { Fragment, PropsWithChildren } from "react";

export interface IncidentDetailSectionProps {
    title: string;
}

export const IncidentDetailSection: React.FC<
    PropsWithChildren<IncidentDetailSectionProps>
> = ({ children, title }) => {
    return (
        <Fragment>
            <h2 className="pt-3 text-sm font-semibold uppercase">{title}</h2>
            {children}
        </Fragment>
    );
};
