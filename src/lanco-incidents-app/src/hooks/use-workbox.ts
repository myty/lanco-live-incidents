import { useCallback, useEffect, useRef, useState } from "react";
import { messageSW, Workbox } from "workbox-window";

interface UseWorkboxOptions {
	immediate?: boolean;
	serviceWorkerPath: string;
	registerOptions?: { scope: string };
}

export default function useWorkbox(options: UseWorkboxOptions) {
	const { immediate, registerOptions, serviceWorkerPath } =
		useRef(options).current;

	const [state, setState] = useState({
		isReady: false,
		hasUpdate: false,
		serviceWorker: undefined as ServiceWorker | undefined,
	});

	const sendMessage = useCallback(
		(data: any) => {
			if (state.serviceWorker != null) {
				messageSW(state.serviceWorker, data);
			}
		},
		[state.serviceWorker],
	);

	useEffect(() => {
		if ("serviceWorker" in navigator) {
			const wb = new Workbox(serviceWorkerPath, registerOptions);

			wb.getSW().then((sw) => {
				setState((prev) => ({ ...prev, serviceWorker: sw }));
			});

			const onWaiting = (event: any) => {
				setState((prev) => ({
					...prev,
					hasUpdate: true,
					serviceWorker: event.sw,
				}));
			};

			const onControlling = (event: any) => {
				// Assuming the user accepted the update, set up a listener
				// that will reload the page as soon as the previously waiting
				// service worker has taken control.
				if (event.isUpdate) {
					window.location.reload();
					return;
				}

				setState((prev) => ({
					...prev,
					isReady: true,
				}));
			};

			wb.addEventListener("controlling", onControlling);

			// Add an event listener to detect when the registered
			// service worker has installed but is waiting to activate.
			wb.addEventListener("waiting", onWaiting);

			// @ts-ignore
			wb.addEventListener("externalwaiting", onWaiting);

			wb.register({ immediate });

			return function cleanup() {
				wb.removeEventListener("controlling", onControlling);
				// @ts-ignore
				wb.removeEventListener("externalwaiting", onWaiting);
				wb.removeEventListener("waiting", onWaiting);
			};
		}
	}, [immediate, registerOptions, serviceWorkerPath]);

	return { ...state, sendMessage };
}
