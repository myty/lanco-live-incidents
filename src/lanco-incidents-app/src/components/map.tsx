import React from "react";
import GoogleMapReact, { Coords } from "google-map-react";
import { IncidentRecord } from "models/incident-record";

interface MapProps {
    incident: IncidentRecord;
}

interface MarkerComponentInterface extends Partial<Coords> {
    text: string;
    primary: boolean;
}

const MarkerComponent = ({ text, primary }: MarkerComponentInterface) => {
    const className = `${
        primary ? "bg-blue-700" : "bg-gray-500"
    } w-64 p-2 -ml-8 text-base font-semibold text-center text-white bg-opacity-75 rounded left`;

    return (
        <div className={className}>
            <p className="w-full truncate">{text}</p>
        </div>
    );
};

const apiKey: string = (import.meta.env.VITE_GOOGLE_MAPS_KEY as string) ?? "";

export function Map(props: MapProps) {
    const { incident } = props;
    const { geoLocation, type } = incident;
    const { lat, lng } = geoLocation ?? {};

    if (lat == null || lng == null) {
        return null;
    }

    return (
        <div
            style={{
                height: "calc(40vh)",
                width: "100%",
            }}>
            <GoogleMapReact
                bootstrapURLKeys={{ key: apiKey }}
                defaultCenter={{ lat, lng }}
                defaultZoom={15}>
                <MarkerComponent
                    lat={lat}
                    lng={lng}
                    text={type}
                    primary={true}
                />
            </GoogleMapReact>
        </div>
    );
}
