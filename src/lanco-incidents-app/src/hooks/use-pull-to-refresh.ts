import { first } from "lodash";
import { useCallback, useEffect, useReducer, useRef } from "react";

interface PullToRefreshOptions {
    /** Element to watch for touch events */
    element: HTMLElement | null;

    /** Called when the pull distance is greater than the trigger distance */
    onRefresh: () => void;

    /** (Optional) The distance in pixels of a pull event in which the onRefresh callback will be triggered. Defaults to `40` */
    triggerDistance?: number;
}

interface PullToRefreshHook {
    pullDistance: number;
    pulling: boolean;
    refreshing: boolean;
}

type PullToRefreshAction =
    | { type: "CHANGE_PULL_DISTANCE"; pullDistance: number }
    | { type: "RESET_PULL_DISTANCE" }
    | { type: "START_REFRESH" }
    | { type: "FINISH_REFRESH" };

const defaultPullToRefreshHook: PullToRefreshHook = {
    pullDistance: 0,
    pulling: false,
    refreshing: false,
};

export default function usePullToRefresh(
    options: PullToRefreshOptions
): PullToRefreshHook {
    // Props
    const { element, onRefresh, triggerDistance = 40 } = options;

    // Private Values
    const _isRefreshing = useRef<boolean>(false);
    const _startY = useRef<number>();
    const _currentY = useRef<number>();

    // Public Values
    const [
        { pulling, pullDistance, refreshing },
        dispatch,
    ] = useReducer(pullToRefreshReducer, undefined, () =>
        calcultionsAndDefaults()
    );

    // Handlers
    const handleRefresh = useCallback(() => {
        _isRefreshing.current = true;
        dispatch({ type: "START_REFRESH" });
        onRefresh();
        dispatch({ type: "FINISH_REFRESH" });
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
                dispatch({
                    type: "CHANGE_PULL_DISTANCE",
                    pullDistance: Math.round(
                        _currentY.current - _startY.current
                    ),
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

        const handleTouchEnd = () => {
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

            dispatch({ type: "RESET_PULL_DISTANCE" });
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

const pullToRefreshReducer = (
    state: PullToRefreshHook,
    action: PullToRefreshAction
): PullToRefreshHook => {
    switch (action.type) {
        case "RESET_PULL_DISTANCE":
            return calcultionsAndDefaults({
                ...state,
                pullDistance: 0,
            });
        case "CHANGE_PULL_DISTANCE":
            return calcultionsAndDefaults({
                ...state,
                pullDistance: getNextPullDistance(
                    state.pullDistance,
                    action.pullDistance
                ),
            });
        case "START_REFRESH":
            return calcultionsAndDefaults({
                ...state,
                pullDistance: 0,
                refreshing: true,
            });
        case "FINISH_REFRESH":
            return calcultionsAndDefaults({
                ...state,
                pullDistance: 0,
                refreshing: false,
            });
    }
};

const getNextPullDistance = (
    prevDistance: number,
    nextPullDistance: number
): number => {
    if (nextPullDistance === prevDistance) {
        return prevDistance;
    }

    if (nextPullDistance < defaultPullToRefreshHook.pullDistance) {
        if (prevDistance === defaultPullToRefreshHook.pullDistance)
            return prevDistance;

        return defaultPullToRefreshHook.pullDistance;
    }

    return nextPullDistance;
};

const calcultionsAndDefaults = (
    state?: Partial<PullToRefreshHook>
): PullToRefreshHook => {
    const { pullDistance = 0 } = state ?? {};
    const pulling = pullDistance > 0;

    return {
        ...defaultPullToRefreshHook,
        ...state,
        pulling: pulling === state?.pulling ? state.pulling : pulling,
    };
};
