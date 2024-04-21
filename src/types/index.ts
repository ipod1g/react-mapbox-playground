import type { Map, Marker } from "mapbox-gl";
export interface Props {
  children: JSX.Element | JSX.Element[];
}

export interface MapState {
  isMapReady: boolean;
  isLoading: boolean;
  responseMessage: FetchPathResponse | null;
  map?: Map;
  markers: Marker[];
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

export type FetchPathResponse =
  | {
      status: "in progress";
    }
  | {
      status: "success";
      path: number[][];
      total_distance: number;
      total_time: number;
    }
  | {
      status: "failure";
      error: string;
    }
  | {
      status: "500";
      error: string;
    };
