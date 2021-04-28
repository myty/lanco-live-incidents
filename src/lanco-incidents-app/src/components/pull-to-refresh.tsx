import usePullToRefresh from "hooks/use-pull-to-refresh";
import React, { RefObject } from "react";

interface PullToRefreshProps {
    loading: boolean;
    onRefresh: () => void;
    refreshTriggerDistance: number;
    watchRef: RefObject<HTMLElement>;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({
    loading,
    onRefresh,
    refreshTriggerDistance,
    watchRef,
}) => {
    const { pullDistance, pulling, refreshing } = usePullToRefresh({
        element: watchRef.current,
        triggerDistance: refreshTriggerDistance,
        onRefresh,
    });

    const pullToRefreshHeight = calculatePullHeight(
        pullDistance,
        refreshTriggerDistance,
        0
    );

    if (pulling && pullToRefreshHeight > 0) {
        return (
            <div
                className="flex items-center justify-center text-base font-semibold"
                style={{
                    height: pullToRefreshHeight,
                    maxHeight: refreshTriggerDistance,
                }}>
                Pull to Refresh
            </div>
        );
    }

    if (refreshing || loading) {
        return (
            <div className="flex items-center justify-center h-20 text-base font-semibold">
                Refreshing...
            </div>
        );
    }

    return null;
};

export default PullToRefresh;

function calculatePullHeight(
    pullDistance: number,
    maxDistance: number,
    threshold: number
): number {
    if (pullDistance < threshold) {
        return 0;
    }

    return (
        (pullDistance - threshold) * ((maxDistance + threshold) / maxDistance)
    );
}
