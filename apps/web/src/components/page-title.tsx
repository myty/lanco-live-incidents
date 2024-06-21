import React, { PropsWithChildren } from "react";

interface PageTitleProps {
  onBack?: () => void;
  onShare?: () => void;
  showBackButton?: boolean;
  showShareButton?: boolean;
}

const PageTitle: React.FC<PropsWithChildren<PageTitleProps>> = ({
  children,
  onBack,
  onShare,
  showBackButton = true,
  showShareButton = false,
}) => {
  return (
    <div className="flex">
      {showBackButton && (
        <button type="button" aria-label="Go Back" className="relative -left-2 w-7" onClick={() => onBack?.()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-label="Icon">
            <title>Back</title>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      <div className="flex-grow">{children}</div>
      {showShareButton && (
        <button type="button" aria-label="Go Back" className="w-7" onClick={() => onShare?.()}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
            className="w-6 h-6">
            <title>Share</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
            />
          </svg>
        </button>
      )}
    </div>
  );
};

export default PageTitle;
