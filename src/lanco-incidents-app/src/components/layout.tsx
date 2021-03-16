import ConfirmUpdateDialog from "components/confirm-update-dialog";
import useServiceWorker from "hooks/use-service-worker";
import React, { ReactNode } from "react";
import { PropsWithChildren } from "react";

interface LayoutProps {
    headerLeft: ReactNode;
    headerRight?: ReactNode;
}

export default function Layout({
    children,
    headerLeft,
    headerRight,
}: PropsWithChildren<LayoutProps>) {
    const {
        appNeedsRefresh,
        ignoreUpdate,
        updateIgnored,
        updateServiceWorker,
    } = useServiceWorker();

    return (
        <div>
            <div className="flex p-4 bg-blue-900 text-gray-50">
                <div className="flex-grow inline-block text-lg font-semibold ">
                    {headerLeft}
                </div>
                {headerRight}
            </div>
            <ConfirmUpdateDialog
                updateAvailable={appNeedsRefresh && !updateIgnored}
                onIgnore={ignoreUpdate}
                onUpdate={updateServiceWorker}
            />
            <div className="m-4">{children}</div>
        </div>
    );
}
