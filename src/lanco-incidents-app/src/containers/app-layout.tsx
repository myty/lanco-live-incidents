import { useAtomValue } from "jotai";
import type React from "react";
import { type ReactNode, useEffect, useState } from "react";
import { Outlet, useOutletContext } from "react-router-dom";
import { IsAppUpdatingAtom } from "../atoms/app-update";
import ConfirmUpdateDialog from "../components/confirm-update-dialog";
import ScreenLoader from "../components/screen-loader/screen-loader";
import { SITE_TITLE } from "../constants/app-constants";
import useServiceWorker from "../hooks/use-service-worker";

interface AppLayoutContext {
  headerLeft: ReactNode;
  headerRight?: ReactNode;
  pageBgStyle: "bg-white" | "bg-gray-100";
}

const defaultAppLayoutContext: AppLayoutContext = {
  headerLeft: SITE_TITLE,
  pageBgStyle: "bg-gray-100",
};

export default function AppLayout() {
  const [state, setState] = useState(defaultAppLayoutContext);

  const { appNeedsRefresh, ignoreUpdate, updateIgnored, updateServiceWorker } = useServiceWorker();

  const isUpdating = useAtomValue(IsAppUpdatingAtom);

  const showUpdateMessage = appNeedsRefresh && !updateIgnored && !isUpdating;
  const headerShadowClass = showUpdateMessage ? "" : "shadow";

  return (
    <div className="flex h-screen">
      <div className="flex flex-col flex-1 w-full">
        <header className={`z-40 bg-blue-900 text-gray-50 ${headerShadowClass}`}>
          <div className="flex items-center h-full px-6 py-4 mx-auto">
            <div className="flex-grow inline-block text-lg font-semibold">{state.headerLeft}</div>
            {isUpdating ? null : state.headerRight}
          </div>
        </header>
        <ConfirmUpdateDialog
          showUpdateMessage={showUpdateMessage}
          onDismiss={ignoreUpdate}
          onUpdate={updateServiceWorker}
        />
        <main className={`h-full overflow-y-auto ${state.pageBgStyle}`}>
          {isUpdating ? <ScreenLoader text="Updating..." /> : <Outlet context={setState} />}
        </main>
      </div>
    </div>
  );
}

export function useAppLayout(
  setConfig: () => Partial<AppLayoutContext>,
  deps?: React.DependencyList | undefined
): void {
  const setState = useOutletContext<React.Dispatch<React.SetStateAction<AppLayoutContext>>>();

  // biome-ignore lint/correctness/useExhaustiveDependencies: dependencies are set by the caller
  useEffect(() => {
    setState({
      ...defaultAppLayoutContext,
      ...setConfig(),
    });
  }, deps);
}
