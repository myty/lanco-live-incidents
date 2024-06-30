import axios from "axios";
import { useAtom } from "jotai";
import { chain } from "lodash";
import { useCallback, useEffect, useMemo } from "react";
import { IncidentsAtom } from "../atoms/incidents";
import { LIVE_FEED } from "../constants/app-constants";
import useGeolocation from "../hooks/use-gps-location";
import useSettings from "../hooks/use-settings";
import type { FeedIncident } from "../models/dtos/feed-incident";
import { IncidentRecord } from "../models/view-models/incident-record";
import { Sort } from "../models/view-models/settings-record";
import { DistanceUtils } from "../utils/distance-utils";

export default function useIncidents() {
  const { incidentTypeFilters, sort } = useSettings();
  const [{ incidents: incidentRecords, state, error }, dispatch] = useAtom(IncidentsAtom);
  const { position: currentPosition } = useGeolocation();

  const allowedIncidentTypes = Object.keys(incidentTypeFilters).filter(key => incidentTypeFilters[key]);

  const processFeed = useCallback(async () => {
    try {
      dispatch({ type: "LOAD" });

      const feedIncidents = await axios.get<FeedIncident[]>(LIVE_FEED);

      dispatch({
        type: "LOADED",
        incidents: feedIncidents.data.map(IncidentRecord.fromFeedIncident),
      });
    } catch (error: unknown) {
      dispatch({ type: "ERROR", error });
    }
  }, [dispatch]);

  const incidents = useMemo(() => {
    return chain(incidentRecords)
      .filter(incident => allowedIncidentTypes.includes(incident.type))
      .map(incident => {
        const { geoLocation } = incident;
        if (currentPosition == null || geoLocation?.lat == null || geoLocation?.lng == null) {
          return incident;
        }

        const distance = DistanceUtils.distanceBetween(geoLocation, {
          lat: currentPosition.coords.latitude,
          lng: currentPosition.coords.longitude,
        });

        return incident.with({ distance });
      })
      .orderBy(incident => {
        if (sort === Sort.Latest) {
          return -1 * incident.getTimeSince();
        }

        return incident?.distance ?? Number.MAX_SAFE_INTEGER;
      });
  }, [allowedIncidentTypes, currentPosition, incidentRecords, sort]);

  const refresh = useCallback(() => {
    processFeed();
  }, [processFeed]);

  useEffect(() => {
    if (state === "LOADING") {
      processFeed();
    }
  }, [processFeed, state]);

  return {
    error,
    incidents: incidents.value(),
    loading: state === "LOADING",
    refresh,
  };
}
