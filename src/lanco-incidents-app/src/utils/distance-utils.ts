import { getDistance } from "geolib";

type LatLng = { lat: number; lng: number };

const distanceBetween = (
    from: LatLng,
    to: LatLng,
    measurement: "meters" | "miles" = "miles"
): number | undefined => {
    const measurementMultiplier = measurement === "miles" ? 0.00062137 : 1;

    const distance =
        from != null && to != null
            ? getDistance(to, from) * measurementMultiplier
            : undefined;

    return distance;
};

export const DistanceUtils = {
    distanceBetween,
};
