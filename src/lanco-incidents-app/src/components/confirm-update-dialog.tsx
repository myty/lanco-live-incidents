import React from "react";

interface ConfirmUpdateDialogProps {
    updateAvailable: boolean;
    onIgnore: () => void;
    onUpdate: () => void;
}

const ConfirmUpdateDialog: React.FC<ConfirmUpdateDialogProps> = ({
    onIgnore,
    onUpdate,
    updateAvailable,
}) => {
    if (!updateAvailable) {
        return null;
    }

    return (
        <div className="flex items-center px-4 py-2 text-sm bg-blue-200">
            <div className="flex-grow color-gray-900">
                There are new updates available. Would you like to update?
            </div>
            <button
                className="px-2 py-1 mr-2 font-semibold text-gray-800 bg-gray-200 border border-gray-800 rounded"
                onClick={onIgnore}>
                Not Now
            </button>
            <button
                className="px-2 py-1 font-semibold text-white bg-blue-900 border border-white rounded"
                onClick={onUpdate}>
                Update
            </button>
        </div>
    );
};

export default ConfirmUpdateDialog;
