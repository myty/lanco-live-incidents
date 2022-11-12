import { useState } from "react";

export function useWebShare() {
	const [error, setError] = useState<string>();
	const [isSharing, setIsSharing] = useState(false);
	const enabled = window.navigator.share != null;

	const share = ({ title, text, url }: Omit<ShareData, "files">) => {
		if (!navigator.share) {
			return;
		}

		setIsSharing(true);

		navigator
			.share({ title, text, url })
			.catch((error) => {
				const errorMessage: string =
					error instanceof Error
						? error.message
						: typeof error === "string"
						? error
						: error?.toString();

				setError(errorMessage);
			})
			.finally(() => setIsSharing(false));
	};

	return {
		isSharing,
		enabled,
		error,
		share,
	};
}
