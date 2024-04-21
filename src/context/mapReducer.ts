import type { MapState } from "@/types";
import type { Map, Marker } from "mapbox-gl";

type MapAction =
  | { type: "setMap"; payload: Map }
  | { type: "setMarkers"; payload: Marker[] }
  | { type: "startLoading" }
  | { type: "stopLoading" };

export const mapReducer = (state: MapState, action: MapAction): MapState => {
  switch (action.type) {
    case "setMap":
      return {
        ...state,
        isMapReady: true,
        map: action.payload,
      };

    case "setMarkers":
      return {
        ...state,
        markers: action.payload,
      };

    case "startLoading":
      return {
        ...state,
        isLoading: true,
      };

    case "stopLoading":
      return {
        ...state,
        isLoading: false,
      };

    default:
      return state;
  }
};
