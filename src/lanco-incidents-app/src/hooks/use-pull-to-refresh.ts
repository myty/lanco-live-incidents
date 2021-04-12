import { first } from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

interface PullToRefreshOptions {
    element?: HTMLElement;
    onRefresh: () => void;
    triggerDistance?: number;
}

export default function usePullToRefresh(options: PullToRefreshOptions) {
    const { element, onRefresh, triggerDistance = 40 } = options;

    // Private Values
    const _isRefreshing = useRef<boolean>(false);
    const _startY = useRef<number>();
    const _currentY = useRef<number>();

    // Public Values
    const [refreshing, setRefreshing] = useState<boolean>(
        _isRefreshing.current
    );
    const [pullDistance, setPullDistance] = useState<number>(0);

    const pulling = useMemo(() => {
        return pullDistance > 0;
    }, [pullDistance]);

    const handleRefresh = useCallback(() => {
        _isRefreshing.current = true;
        setRefreshing(true);
        setPullDistance(0);
        onRefresh();
        setRefreshing(false);
        _isRefreshing.current = false;
    }, [onRefresh]);

    // Handle TouchStart Event
    useEffect(() => {
        if (element == null) {
            return;
        }

        const handleTouchStart = (event: TouchEvent) => {
            _startY.current = first(event.touches)?.pageY;
        };

        element.addEventListener("touchstart", handleTouchStart, {
            passive: true,
        });

        return () => {
            element.removeEventListener("touchstart", handleTouchStart);
        };
    }, [element]);

    // Handle TouchMove Event
    useEffect(() => {
        if (element == null) {
            return;
        }

        const handleTouchMove = (event: TouchEvent) => {
            _currentY.current = first(event.touches)?.pageY;

            if (
                document.scrollingElement?.scrollTop === 0 &&
                _startY.current != null &&
                _currentY.current != null
            ) {
                const nextPullDistance = Math.round(
                    _currentY.current - _startY.current
                );
                setPullDistance((prev) => {
                    if (nextPullDistance === prev) {
                        return prev;
                    }

                    if (nextPullDistance < 0) {
                        if (prev === 0) return prev;

                        return 0;
                    }

                    return nextPullDistance;
                });
            }
        };

        element.addEventListener("touchmove", handleTouchMove, {
            passive: true,
        });

        return () => {
            element.removeEventListener("touchmove", handleTouchMove);
        };
    }, [element]);

    // Handle TouchEnd Event
    useEffect(() => {
        if (element == null) {
            return;
        }

        const handleTouchEnd = (event: TouchEvent) => {
            // Activate custom pull-to-refresh effects when at the top of the container,
            // the user is scrolling up, they are at or past the trigger distance, and
            // they've triggere a touchend event
            if (
                document.scrollingElement?.scrollTop === 0 &&
                _startY.current != null &&
                _currentY.current != null &&
                _currentY.current - _startY.current > triggerDistance &&
                !_isRefreshing.current
            ) {
                handleRefresh();
                return;
            }

            setPullDistance(0);
        };

        element.addEventListener("touchend", handleTouchEnd, {
            passive: true,
        });

        return () => {
            element.removeEventListener("touchend", handleTouchEnd);
        };
    }, [element, handleRefresh, triggerDistance]);

    return {
        pullDistance,
        pulling,
        refreshing,
    };
}
