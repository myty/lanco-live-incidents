import useServiceWorker from "hooks/use-service-worker";
import React, { useState } from "react";

const ConfirmUpdateDialog: React.FC = () => {
    const {
        appNeedsRefresh,
        updateIgnored,
        ignoreUpdate,
        updateServiceWorker,
    } = useServiceWorker();

    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdate = () => {
        setIsUpdating(true);
        updateServiceWorker();
    };

    if (!appNeedsRefresh || updateIgnored) {
        return null;
    }

    const updateButtonClasses = isUpdating
        ? "text-gray-800 bg-gray-200 border-gray-800"
        : "text-white bg-blue-900 border-white";

    return (
        <div className="flex items-center px-4 py-2 text-sm bg-blue-200">
            <div className="flex-grow text-xs color-gray-900">
                There are new updates available. Would you like to update?
            </div>
            {!isUpdating && (
                <button
                    className="flex-shrink-0 px-2 py-1 mr-2 font-semibold text-gray-800 bg-gray-200 border border-gray-800 rounded"
                    onClick={ignoreUpdate}>
                    Not Now
                </button>
            )}
            <button
                className={`flex-shrink-0 px-2 py-1 font-semibold border rounded ${updateButtonClasses}`}
                disabled={isUpdating}
                onClick={handleUpdate}>
                {!isUpdating ? "Update" : "Updating..."}
            </button>
        </div>
    );
};

export default ConfirmUpdateDialog;
