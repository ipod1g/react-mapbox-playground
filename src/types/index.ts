import type { Map, Marker } from "mapbox-gl";

export interface Props {
  children: JSX.Element | JSX.Element[];
}
export interface DirectionsResponse {
  routes: Route[];
  waypoints: Waypoint[];
  code: string;
  uuid: string;
}

export interface Route {
  weight_name: string;
  weight: number;
  duration: number;
  distance: number;
  geometry: Geometry;
  legs?: unknown;
}

export interface Geometry {
  coordinates: Array<number[]>;
  type: string;
}

export interface Waypoint {
  distance: number;
  name: string;
  location: number[];
}

export type Path = [number, number];

export interface MapState {
  isMapReady: boolean;
  isLoading: boolean;
  map?: Map;
  markers: Marker[];
}
