import type { FetchPathResponse, MapState } from "@/types";
import type { Map, Marker } from "mapbox-gl";

type MapAction =
  | { type: "setMap"; payload: Map }
  | { type: "addMarkers"; payload: Marker[] }
  | { type: "resetMarkers" }
  | { type: "startLoading" }
  | { type: "stopLoading" }
  | { type: "setResponseMessage"; payload: FetchPathResponse }
  | { type: "clearResponseMessage" };

export const mapReducer = (state: MapState, action: MapAction): MapState => {
  switch (action.type) {
    case "setMap":
      return {
        ...state,
        isMapReady: true,
        map: action.payload,
      };

    case "addMarkers":
      return {
        ...state,
        markers: action.payload,
      };
    case "resetMarkers":
      return { ...state, markers: [] };
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
    case "setResponseMessage":
      return {
        ...state,
        responseMessage: action.payload,
      };
    case "clearResponseMessage":
      return {
        ...state,
        responseMessage: null,
      };
    default:
      return state;
  }
};
