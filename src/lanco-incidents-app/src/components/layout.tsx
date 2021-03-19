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
        <div className="flex h-screen">
            <div className="flex flex-col flex-1 w-full">
                <header className="z-40 py-4 bg-blue-900 text-gray-50">
                    <div className="flex items-center h-full px-6 mx-auto">
                        <div className="flex-grow inline-block text-lg font-semibold ">
                            {headerLeft}
                        </div>
                        {headerRight}
                    </div>
                </header>
                <ConfirmUpdateDialog
                    updateAvailable={appNeedsRefresh && !updateIgnored}
                    onIgnore={ignoreUpdate}
                    onUpdate={updateServiceWorker}
                />
                <main className="h-full overflow-y-auto shadow-inner">
                    {children}
                </main>
            </div>
        </div>
    );
}
