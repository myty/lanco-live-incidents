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
        <div>
            <div className="flex p-4 bg-blue-900 text-gray-50">
                <div className="flex-grow inline-block text-lg font-semibold ">
                    {headerLeft}
                </div>
                {headerRight}
            </div>
            <div className="m-4">{children}</div>
        </div>
    );
}
