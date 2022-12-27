import React, {
    Children,
    cloneElement,
    FC,
    isValidElement,
    PropsWithChildren,
    useEffect,
    useRef,
    useState,
} from "react";
import { Wrapper } from "@googlemaps/react-wrapper";

interface MapProps extends Exclude<google.maps.MapOptions, "center"> {
    center?: google.maps.LatLngLiteral;
}

const apiKey: string = (import.meta.env.VITE_GOOGLE_MAPS_KEY as string) ?? "";

const MapComponent: FC<PropsWithChildren<MapProps>> = ({
    children,
    center,
    zoom = 12,
    ...options
}) => {
    const ref = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map>();

    useEffect(() => {
        if (map) {
            map.setOptions({ ...options, zoom, center });
        }
    }, [map]);

    useEffect(() => {
        if (ref.current && !map) {
            setMap(new window.google.maps.Map(ref.current, {}));
        }
    }, [ref, map]);

    return (
        <>
            <div ref={ref} style={{ flexGrow: "1", height: "100%" }} />
            {Children.map(children, (child) => {
                if (isValidElement(child)) {
                    // rome-ignore lint/suspicious/noExplicitAny: <explanation>
                    return cloneElement<any>(child, { map });
                }
            })}
        </>
    );
};

const MapWrapper: FC<PropsWithChildren<MapProps>> = (props) => {
    return (
        <Wrapper apiKey={apiKey}>
            <MapComponent {...props} />
        </Wrapper>
    );
};

export default MapWrapper;
