import ConfirmUpdateDialog from "components/confirm-update-dialog";
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
                <ConfirmUpdateDialog />
                <main className="h-full overflow-y-auto shadow-inner bg-gray-100">
                    {children}
                </main>
            </div>
        </div>
    );
}
