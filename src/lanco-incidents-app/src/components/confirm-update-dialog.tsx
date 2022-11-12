import { IsAppUpdatingAtom } from "atoms/app-update";
import { useAtom } from "jotai";
import React from "react";

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
    const [isUpdating, setIsUpdating] = useAtom(IsAppUpdatingAtom);

    const handleUpdate = () => {
        setIsUpdating(true);
        onUpdate();
    };

    if (!showUpdateMessage || isUpdating) {
        return null;
    }

    const updateButtonClasses = isUpdating
        ? "text-gray-800 bg-gray-200 border-gray-500"
        : "text-white bg-blue-900 border-gray-500";

    return (
        <div className="flex flex-col items-center p-2 text-base bg-blue-200 shadow">
            <div className="flex-grow text-sm color-gray-900">
                New functionality is available. Would you like to update now?
            </div>
            <div className="flex w-full">
                <div className="grow" />
                <div className="flex-none">
                    <button
                        className="flex-shrink-0 px-2 py-1 mr-2 font-semibold text-gray-800 bg-gray-200 border border-gray-500 rounded"
                        onClick={onDismiss}
                    >
                        Not Now
                    </button>
                    <button
                        className={`flex-shrink-0 px-2 py-1 font-semibold border rounded ${updateButtonClasses}`}
                        disabled={isUpdating}
                        onClick={handleUpdate}
                    >
                        Update
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmUpdateDialog;
