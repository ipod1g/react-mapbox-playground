import { createContext } from "react";

import type { MapState } from "@/types/map";
import type { Map } from "mapbox-gl";

interface MapContextProps extends MapState {
  // Methods
  setMap: (map: Map) => void;
  getRouteBetweenPoints: (
    start: [number, number],
    end: [number, number]
  ) => Promise<void>;
}

export const MapContext = createContext({} as MapContextProps);
