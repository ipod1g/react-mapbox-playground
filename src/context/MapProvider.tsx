import { LngLatBounds, Marker, Popup } from "mapbox-gl";
import { useReducer } from "react";

import { fetchDirections, getPaths } from "@/apis/map";
import { INITIAL_MAP_CONFIG } from "@/configs/map";

import { MapContext } from "./MapContext";
import { mapReducer } from "./mapReducer";

import type { FetchPathResponse, Path, Props } from "@/types";
import type { AxiosError } from "axios";
import type {
  AnySourceData,
  GeoJSONSource,
  Map,
  MapboxGeoJSONFeature,
} from "mapbox-gl";

export const MapProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(mapReducer, INITIAL_MAP_CONFIG);
  const setMap = (map: Map) => {
    dispatch({ type: "setMap", payload: map });
  };

  const setMarkers = (paths: Path[]) => {
    const map = state.map as Map;

    // reset if any
    state.markers.forEach((marker) => marker.remove());
    dispatch({ type: "resetMarkers" });

    const newMarkers = paths.map((waypoint, idx) => {
      const marker = new Marker({
        color: "#ff671d",
      })
        .setLngLat([waypoint[1], waypoint[0]])
        .setPopup(
          new Popup({ offset: 25, closeButton: false }).setHTML(
            `<div>Point ${idx + 1}
              <p>Longitude: ${waypoint[1]}</p>
              <p>Latitude:  ${waypoint[0]}</p>
            </div>`
          )
        )
        .addTo(map);

      return marker;
    });

    dispatch({ type: "addMarkers", payload: newMarkers });
    createMarkerSourceAndLayer(newMarkers);
  };

  const createMarkerSourceAndLayer = (markers: Marker[]) => {
    const features = markers.map((marker, idx) => ({
      type: "Feature",
      properties: {
        description: `Point ${idx + 1}`,
        icon: "marker",
      },
      geometry: {
        type: "Point",
        coordinates: [marker.getLngLat().lng, marker.getLngLat().lat],
      },
    }));

    const geojson = {
      type: "FeatureCollection",
      features: features,
    } as unknown as MapboxGeoJSONFeature;

    const map = state.map as Map;

    if (map.getSource("markers")) {
      console.log("Updating marker source and layer");
      (map.getSource("markers") as GeoJSONSource).setData(geojson);
    } else {
      console.log("Adding marker source and layer");
      map.addSource("markers", { type: "geojson", data: geojson });
      map.addLayer({
        id: "markers",
        type: "symbol",
        source: "markers",
        layout: {
          "text-field": "{description}",
          "text-font": ["Open Sans Semibold", "Arial Unicode MS Bold"],
          "text-offset": [0, -3.6],
          "text-anchor": "top",
        },
      });
    }
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

  const resetMap = () => {
    const map = state.map;

    if (map?.getLayer("routeLayer")) {
      map.removeLayer("routeLayer");
      map.removeSource("routeLayer");
    }
    if (map?.getLayer("markers")) {
      map.removeLayer("markers");
      map.removeSource("markers");
    }
    state.markers.forEach((marker) => marker.remove());
    dispatch({ type: "resetMarkers" });
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
    dispatch({ type: "startLoading" });
    try {
      const updateUI = async (data: FetchPathResponse) => {
        switch (data.status) {
          case "in progress":
            dispatch({ type: "setResponseMessage", payload: data });
            break;
          case "success":
            await getDirectionsFromPaths(data.path as Path[]);
            dispatch({ type: "setResponseMessage", payload: data });
            break;
          case "failure":
            dispatch({ type: "setResponseMessage", payload: data });
            return;
          default:
            break;
        }
      };

      await getPaths(origin, destination, updateUI);
    } catch (error) {
      console.error("Error getting route between points:", error);
      dispatch({
        type: "setResponseMessage",
        payload: {
          status: "500",
          error: (error as AxiosError).message,
        },
      });
    } finally {
      dispatch({ type: "stopLoading" });
    }
  };

  const clearResponseMessage = () => {
    dispatch({
      type: "clearResponseMessage",
    });
  };

  return (
    <MapContext.Provider
      value={{
        ...state,
        setMap,
        resetMap,
        clearResponseMessage,
        getRouteBetweenPoints,
      }}
    >
      {children}
    </MapContext.Provider>
  );
};
