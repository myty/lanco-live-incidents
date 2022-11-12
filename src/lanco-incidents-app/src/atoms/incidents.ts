import { atomWithReducer } from "jotai/utils";
import { IncidentRecord } from "models/view-models/incident-record";

interface IncidentsState {
	error?: unknown;
	incidents: IncidentRecord[];
	state: "LOADING" | "LOADED" | "FAILED";
}

type IncidentsAction =
	| { type: "ERROR"; error: unknown }
	| { type: "LOAD" }
	| { type: "LOADED"; incidents: IncidentRecord[] };

const reducer = (
	state: IncidentsState,
	action: IncidentsAction,
): IncidentsState => {
	switch (action.type) {
		case "LOAD": {
			if (action.type === "LOAD" && state.state !== "LOADING") {
				return {
					...state,
					state: "LOADING",
				};
			}
			break;
		}
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
				incidents: updateIncidents(state.incidents, action.incidents).sort(
					(a, b) => b.getTimeSince() - a.getTimeSince(),
				),
			};
	}

	return state;
};

function updateIncidents(
	originalList: IncidentRecord[],
	newList: IncidentRecord[],
): IncidentRecord[] {
	const comparer = (sourceItem: IncidentRecord, mergeItem: IncidentRecord) => {
		return sourceItem.id === mergeItem.id;
	};

	const isEqual = (a: IncidentRecord) => (b: IncidentRecord) => comparer(b, a);
	const areNotIn = (a: IncidentRecord[]) => (b: IncidentRecord) =>
		!a.some(isEqual(b));

	const itemsToAdd = newList.filter(areNotIn(originalList));
	const itemsToKeep = originalList
		.map((item) => {
			const foundItem = newList.find(isEqual(item));

			if (foundItem == null) {
				return undefined;
			}

			return item.with(foundItem);
		})
		.filter((item) => item != null) as IncidentRecord[];

	return [...itemsToKeep, ...itemsToAdd];
}

export const IncidentsAtom = atomWithReducer(
	{
		state: "LOADING",
		incidents: [],
	},
	reducer,
);
