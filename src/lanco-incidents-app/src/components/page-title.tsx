import React, { PropsWithChildren } from "react";

interface PageTitleProps {
    onBack?: () => void;
    showBackButton?: boolean;
}

const PageTitle: React.FC<PropsWithChildren<PageTitleProps>> = ({
    children,
    onBack,
    showBackButton = true,
}) => {
    return (
        <div className="flex">
            {showBackButton && (
                <button
                    aria-label="Go Back"
                    className="relative -left-2 w-7"
                    onClick={() => onBack?.()}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 19l-7-7 7-7"
                        />
                    </svg>
                </button>
            )}
            <div>{children}</div>
        </div>
    );
};

export default PageTitle;
