import type { MapState } from "@/types/map";

// [lng, lat]
export const INITIAL_USER_LOCATION: [number, number] = [114.2, 22.3];

export const INITIAL_MAP_CONFIG: MapState = {
  isMapReady: false,
  isLoading: false,
  map: undefined,
  markers: [],
} as const;
