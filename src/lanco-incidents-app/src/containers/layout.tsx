import ConfirmUpdateDialog from "components/confirm-update-dialog";
import useServiceWorker from "hooks/use-service-worker";
import React, { ReactNode } from "react";
import { PropsWithChildren } from "react";

interface LayoutProps {
    headerLeft: ReactNode;
    headerRight?: ReactNode;
    pageBgStyle: "bg-white" | "bg-gray-100";
}

export default function Layout({
    pageBgStyle,
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

    const showUpdateMessage = appNeedsRefresh && !updateIgnored;
    const headerShadowClass = showUpdateMessage ? "" : "shadow";

    return (
        <div className="flex h-screen">
            <div className="flex flex-col flex-1 w-full">
                <header
                    className={`z-40 bg-blue-900 text-gray-50 ${headerShadowClass}`}>
                    <div className="flex items-center h-full px-6 py-4 mx-auto">
                        <div className="flex-grow inline-block pr-6 text-lg font-semibold">
                            {headerLeft}
                        </div>
                        {headerRight}
                    </div>
                </header>
                <ConfirmUpdateDialog
                    showUpdateMessage={showUpdateMessage}
                    onDismiss={ignoreUpdate}
                    onUpdate={updateServiceWorker}
                />
                <main className={`h-full overflow-y-auto ${pageBgStyle}`}>
                    {children}
                </main>
            </div>
        </div>
    );
}
