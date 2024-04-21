import { LngLatBounds, Marker, Popup } from "mapbox-gl";
import { useReducer } from "react";

import { fetchDirections, getPaths } from "@/apis/map";
import { INITIAL_MAP_CONFIG } from "@/configs/map";

import { MapContext } from "./MapContext";
import { mapReducer } from "./mapReducer";

import type { Path, Props } from "@/types";
import type { AnySourceData, Map } from "mapbox-gl";

export const MapProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(mapReducer, INITIAL_MAP_CONFIG);
  const setMap = (map: Map) => {
    dispatch({ type: "setMap", payload: map });
  };

  const setMarkers = (paths: Path[]) => {
    paths.forEach((waypoint: Path, idx: number) => {
      const waypointLngLat = {
        lng: waypoint[1],
        lat: waypoint[0],
      };

      new Marker({
        color: "#ff671d",
      })
        .setLngLat(waypointLngLat)
        .setPopup(
          new Popup({
            offset: 25,
            closeButton: false,
          }).setHTML(`<span>${idx + 1}</span>`)
        )
        .addTo(state.map as Map);
    });
  };

  const getDirectionsFromPaths = async (paths: Path[]) => {
    try {
      setMarkers(paths);
      const directionPromises = paths
        .slice(1)
        .map((end, i) => fetchDirections(paths[i], end));
      const resolvedDirections = await Promise.all(directionPromises);
      const routeData = createRouteData(resolvedDirections) as AnySourceData;
      updateMapWithRoute(routeData, state.map as Map);
    } catch (error) {
      console.error("Error getting directions from paths:", error);
    }
  };

  const updateMapWithRoute = (routeData: AnySourceData, map: Map) => {
    if (map.getLayer("routeLayer")) {
      map.removeLayer("routeLayer");
      map.removeSource("routeLayer");
    }

    map.addSource("routeLayer", routeData);

    map.addLayer({
      id: "routeLayer",
      type: "line",
      source: "routeLayer",
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "#FF671D",
        "line-width": 3,
      },
    });

    // Adjust the map view to include the entire route
    const bounds = new LngLatBounds();
    // @ts-expect-error -- TODO
    routeData.data.features.forEach((feature) => {
      // @ts-expect-error -- TODO
      feature.geometry.coordinates.forEach((coord) => {
        bounds.extend(coord);
      });
    });

    map.fitBounds(bounds, {
      padding: 60,
    });
  };

  const createRouteData = (resolvedDirections: number[][]) => {
    return {
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: resolvedDirections.map((coordinates) => ({
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: coordinates,
          },
        })),
      },
    };
  };

  const getRouteBetweenPoints = async (origin: string, destination: string) => {
    try {
      dispatch({ type: "startLoading" });
      const pathResponse = await getPaths(origin, destination);
      await getDirectionsFromPaths(pathResponse.path as Path[]);
      dispatch({ type: "stopLoading" });
    } catch (error) {
      console.error("Error getting route between points:", error);
      dispatch({ type: "stopLoading" });
    }
  };

  return (
    <MapContext.Provider
      value={{
        ...state,
        setMap,
        getRouteBetweenPoints,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
