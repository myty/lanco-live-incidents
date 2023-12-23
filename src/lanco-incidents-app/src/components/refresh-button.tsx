import IconLoader from "components/icons/icon-refresh";
import React from "react";

interface RefreshButtonProps {
  disabled?: boolean;
  animate?: boolean;
  onClick: () => void;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({ animate, disabled, onClick }) => {
  return (
    <button
      type="button"
      aria-label="Refresh"
      className="w-6 text-xs font-semibold text-white"
      onClick={onClick}
      disabled={disabled}>
      <IconLoader animate={animate} />
    </button>
  );
};

export default RefreshButton;
