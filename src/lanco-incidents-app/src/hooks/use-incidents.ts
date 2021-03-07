import { LIVE_FEED } from "constants/app-constants";
import { IncidentRecord } from "models/incident-record";
import { useCallback, useEffect, useReducer } from "react";
import RssParser from "rss-parser";
import { DateTime } from "luxon";

type CustomFeed = {};
type CustomItem = { description: string };

const rssParser = new RssParser<CustomFeed, CustomItem>({
  customFields: {
    item: ["description"],
  },
});

interface UseIncidentsState {
  error?: any;
  incidents: IncidentRecord[];
  state: "LOADING" | "LOADED" | "FAILED";
}

type UseIncidentsAction =
  | { type: "ERROR"; error: any }
  | { type: "LOAD" }
  | { type: "LOADED"; incidents: IncidentRecord[] };

const reducer = (
  state: UseIncidentsState,
  action: UseIncidentsAction
): UseIncidentsState => {
  switch (action.type) {
    case "LOAD":
      if (action.type === "LOAD" && state.state !== "LOADING") {
        return {
          ...state,
          state: "LOADING",
        };
      }
      break;
    case "ERROR":
      return {
        ...state,
        state: "FAILED",
        error: action.error,
      };
    case "LOADED":
      return {
        ...state,
        state: action.type,
        incidents: action.incidents,
      };
  }

  return state;
};

const defaultState: UseIncidentsState = {
  incidents: [],
  state: "LOADING",
};

export default function useIncidents() {
  const [{ incidents, state, error }, dispatch] = useReducer(
    reducer,
    defaultState
  );

  const processFeed = useCallback(async () => {
    const feed = await rssParser.parseURL(LIVE_FEED);

    const incidents = feed.items.map(
      ({ title, description, pubDate, guid }) => {
        var descSplit = description.split(";");
        var area = descSplit.length >= 1 ? descSplit[0].trim() : "";
        var isCounty = area.toUpperCase().includes("COUNTY");
        var numSections = isCounty ? 1 : 2;
        var typeSplit = title?.split("-") ?? [];
        var unitsAssigned =
          descSplit.length > numSections
            ? descSplit[numSections]
                .toLowerCase()
                .split("<br>")
                .map((s) => s.trim().toUpperCase())
            : [];

        return new IncidentRecord({
          id: guid,
          incidentDate: DateTime.fromHTTP(pubDate!),
          type: typeSplit.length >= 1 ? typeSplit[0].trim() : "",
          subType: typeSplit.length > 1 ? typeSplit[1].trim() : "",
          location:
            isCounty || descSplit.length < 1 ? undefined : descSplit[1].trim(),
          area,
          unitsAssigned,
        });
      }
    );

    dispatch({ type: "LOADED", incidents });
  }, []);

  useEffect(() => {
    if (state === "LOADING") {
      processFeed();
    }
  }, [state]);

  return {
    error,
    incidents,
    refresh: () => dispatch({ type: "LOAD" }),
  };
}
