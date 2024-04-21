import { createContext } from "react";

import type { MapState } from "@/types/map";
import type { Map } from "mapbox-gl";

interface MapContextProps extends MapState {
  // Methods
  setMap: (map: Map) => void;
  getRouteBetweenPoints: (origin: string, destination: string) => Promise<void>;
}

export const MapContext = createContext({} as MapContextProps);
