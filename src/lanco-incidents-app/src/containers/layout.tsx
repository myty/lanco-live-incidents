import { IsAppUpdatingAtom } from "atoms/app-update";
import ConfirmUpdateDialog from "components/confirm-update-dialog";
import ScreenLoader from "components/screen-loader/screen-loader";
import useServiceWorker from "hooks/use-service-worker";
import { useAtomValue } from "jotai";
import React, { ReactNode } from "react";
import { PropsWithChildren } from "react";

interface LayoutProps {
  headerLeft: ReactNode;
  headerRight?: ReactNode;
  pageBgStyle: "bg-white" | "bg-gray-100";
}

export default function Layout({ pageBgStyle, children, headerLeft, headerRight }: PropsWithChildren<LayoutProps>) {
  const { appNeedsRefresh, ignoreUpdate, updateIgnored, updateServiceWorker } = useServiceWorker();

  const isUpdating = useAtomValue(IsAppUpdatingAtom);

  const showUpdateMessage = appNeedsRefresh && !updateIgnored && !isUpdating;
  const headerShadowClass = showUpdateMessage ? "" : "shadow";

  return (
    <div className="flex h-screen">
      <div className="flex flex-col flex-1 w-full">
        <header className={`z-40 bg-blue-900 text-gray-50 ${headerShadowClass}`}>
          <div className="flex items-center h-full px-6 py-4 mx-auto">
            <div className="flex-grow inline-block text-lg font-semibold">{headerLeft}</div>
            {isUpdating ? null : headerRight}
          </div>
        </header>
        <ConfirmUpdateDialog
          showUpdateMessage={showUpdateMessage}
          onDismiss={ignoreUpdate}
          onUpdate={updateServiceWorker}
        />
        <main className={`h-full overflow-y-auto ${pageBgStyle}`}>
          {isUpdating ? <ScreenLoader text="Updating..." /> : children}
        </main>
      </div>
    </div>
  );
}
