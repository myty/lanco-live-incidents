import { useContext, useMemo } from "react";
import { IncidentsContext } from "providers/incidents-provider";
import { Sort } from "models/view-models/settings-record";
import { chain } from "lodash";
import useGeolocation from "hooks/use-gps-location";
import { DistanceUtils } from "utils/distance-utils";
import useSettings from "hooks/use-settings";

interface UseIncidentsHookOptions {
    id?: string;
}

export default function useIncidents(options?: UseIncidentsHookOptions) {
    const { id } = options ?? {};
    const { incidentTypeFilters, sort } = useSettings();
    const { incidents: incidentRecords, state, error, dispatch } = useContext(
        IncidentsContext
    );
    const { currentPosition } = useGeolocation();

    const allowedIncidentTypes = Object.keys(incidentTypeFilters).filter(
        (key) => incidentTypeFilters[key]
    );

    const incidents = useMemo(() => {
        return chain(incidentRecords)
            .filter((incident) => {
                if (id != null) {
                    return incident.id === id;
                }

                return allowedIncidentTypes.includes(incident.type);
            })
            .map((incident) => {
                const { geoLocation } = incident;
                if (
                    currentPosition == null ||
                    geoLocation?.lat == null ||
                    geoLocation?.lng == null
                ) {
                    return incident;
                }

                const distance = DistanceUtils.distanceBetween(geoLocation, {
                    lat: currentPosition.coords.latitude,
                    lng: currentPosition.coords.longitude,
                });

                return incident.with({ distance });
            })
            .orderBy((incident) => {
                if (sort === Sort.Latest) {
                    return -1 * incident.getTimeSince();
                }

                return incident?.distance ?? Number.MAX_SAFE_INTEGER;
            });
    }, [allowedIncidentTypes, currentPosition, id, incidentRecords, sort]);

    const incident = id != null ? incidents.first().value() : null;

    return {
        error,
        incident,
        incidents: incidents.value(),
        loading: state === "LOADING",
        refresh: () => dispatch({ type: "LOAD" }),
    };
}
