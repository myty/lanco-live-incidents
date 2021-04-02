import React, { useState } from "react";

interface ConfirmUpdateDialogProps {
    onDismiss: () => void;
    onUpdate: () => void;
    showUpdateMessage: boolean;
}

const ConfirmUpdateDialog: React.FC<ConfirmUpdateDialogProps> = ({
    onDismiss,
    onUpdate,
    showUpdateMessage,
}) => {
    const [isUpdating, setIsUpdating] = useState(false);

    const handleUpdate = () => {
        setIsUpdating(true);
        onUpdate();
    };

    if (!showUpdateMessage) {
        return null;
    }

    const updateButtonClasses = isUpdating
        ? "text-gray-800 bg-gray-200 border-gray-500"
        : "text-white bg-blue-900 border-gray-500";

    return (
        <div className="flex items-center px-4 py-2 text-sm bg-blue-200 shadow">
            <div className="flex-grow text-xs color-gray-900">
                There are new updates available. Would you like to update?
            </div>
            {!isUpdating && (
                <button
                    className="flex-shrink-0 px-2 py-1 mr-2 font-semibold text-gray-800 bg-gray-200 border border-gray-500 rounded"
                    onClick={onDismiss}>
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
