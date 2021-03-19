import React from "react";

interface RefreshButtonProps {
    disabled?: boolean;
    animate?: boolean;
    onClick: () => void;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({
    animate,
    disabled,
    onClick,
}) => {
    const rotateClass = animate ? "animate-reverse-spin" : "";

    return (
        <button
            aria-label="Refresh"
            className="w-6 text-xs font-semibold text-white"
            onClick={onClick}
            disabled={disabled}>
            <svg
                className={`${rotateClass}`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
            </svg>
        </button>
    );
};

export default RefreshButton;
