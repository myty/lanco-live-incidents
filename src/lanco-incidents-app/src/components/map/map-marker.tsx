import React, {
    useEffect,
    memo,
    useRef,
    forwardRef,
    ForwardedRef,
    useLayoutEffect,
} from "react";
import { To, useLinkClickHandler } from "react-router-dom";

export enum MarkerType {
    CurrentLocation,
    CurrentIncident,
    Incident,
}

interface MarkerProps {
    to?: To;
    replace?: boolean;
    text?: string;
    type: MarkerType;
    map?: google.maps.Map;
    position: google.maps.LatLngLiteral;
}

const MarkerByType = forwardRef(
    (
        { type, text }: Pick<MarkerProps, "type" | "text">,
        forwardedRef: ForwardedRef<HTMLDivElement>
    ) => {
        if (type === MarkerType.Incident) {
            return (
                <div className="relative flex items-center justify-center w-6 h-6 bg-gray-600 border-4 rounded-full -left-3 -top-3 sr-only">
                    {text}
                </div>
            );
        }

        if (type === MarkerType.CurrentLocation) {
            return (
                <div ref={forwardedRef}>
                    <div className="relative flex items-center justify-center w-8 h-8 bg-transparent border-4 border-blue-900 rounded-full -left-4 -top-4">
                        <div className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full opacity-30" />
                    </div>
                    <div className="relative flex items-center justify-center w-2 h-2 bg-blue-900 rounded-full opacity-70 -left-1 -top-9" />
                </div>
            );
        }

        return (
            <div className="relative flex items-center justify-center w-6 h-6 bg-green-600 border-4 rounded-full -left-3 -top-3" />
        );
    }
);

const Marker: React.FC<MarkerProps> = ({
    to,
    replace = false,
    type,
    text,
    map,
    position,
}) => {
    const markerRef = useRef<HTMLDivElement>(null);

    const handleClick = useLinkClickHandler(to ?? "", {
        replace,
    });

    useEffect(() => {
        if (markerRef.current == null) {
            return;
        }

        const marker = new google.maps.marker.AdvancedMarkerView({
            content: markerRef.current,
            map,
            position,
        });

        if (to != null) {
            marker.addListener("click", handleClick);
        }

        // remove marker from map on unmount
        return () => {
            if (marker != null) {
                marker.map = null;
                google.maps.event.clearListeners(marker, "click");
            }
        };
    }, []);

    return <MarkerByType type={type} text={text} ref={markerRef} />;
};

export default Marker;
