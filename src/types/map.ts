import type { Marker, Map } from "mapbox-gl";

export interface MapState {
  isMapReady: boolean;
  isLoading: boolean;
  map?: Map;
  markers: Marker[];
}
