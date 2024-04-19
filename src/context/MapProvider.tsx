import { LngLatBounds, Marker, Popup } from "mapbox-gl";
import { useReducer } from "react";

import directionsApi from "@/apis/directionsApi";
import mockApi from "@/apis/mockApi";
import { INITIAL_MAP_CONFIG } from "@/configs/map";

import { MapContext } from "./MapContext";
import { mapReducer } from "./mapReducer";

import type { DirectionsResponse, Props } from "@/types";
import type { AnySourceData, Map } from "mapbox-gl";

export const MapProvider = ({ children }: Props) => {
  const [state, dispatch] = useReducer(mapReducer, INITIAL_MAP_CONFIG);

  const setMap = (map: Map) => {
    new Marker({
      color: "#61DAFB",
    })
      .setLngLat(map.getCenter())
      .addTo(map);

    dispatch({ type: "setMap", payload: map });
  };

  const getRouteBetweenPoints = async (
    start: [number, number],
    end: [number, number]
  ) => {
    // TODO: handle all the responses and retries
    const res = await mockApi.get<any>(`/mock/route/failure`);
    const waypoints = res.data.path;

    const directions = [];

    for (let i = 0; i < waypoints.length - 1; i++) {
      const _start = Array.from(waypoints[i]);
      const _end = Array.from(waypoints[i + 1]);

      const promise = new Promise<number[][]>((resolve) => {
        directionsApi
          .get<DirectionsResponse>(
            `/${_start.reverse().join(",")};${_end.reverse().join(",")}`
          )
          .then((res) => {
            const { coordinates } = res.data.routes[0].geometry;
            resolve(coordinates);
          })
          .catch((error) => {
            console.error("Error fetching directions:", error);
            resolve([]);
          });
      });

      directions.push(promise);
    }

    const resolvedDirections = await Promise.all(directions);
    const bounds = new LngLatBounds(start, start);

    waypoints.forEach((waypoint: [number, number], idx: number) => {
      new Marker({
        color: "#ff671d",
      })
        .setLngLat(waypoint.reverse() as [number, number])
        .setPopup(
          new Popup({
            offset: 25,
            closeButton: false,
          }).setHTML(`<span>${idx + 1}</span>`)
        )
        .addTo(state.map as Map);
    });

    dispatch({
      type: "setMarkers",
      payload: waypoints,
    });

    bounds.extend(waypoints[0] as [number, number]);
    bounds.extend(waypoints[waypoints.length - 1] as [number, number]);

    state.map?.fitBounds(bounds, {
      padding: 100,
    });

    // Polyline
    const routeData: AnySourceData = {
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

    if (state.map?.getLayer("routeLayer")) {
      state.map.removeLayer("routeLayer");
      state.map.removeSource("routeLayer");
    }

    state.map?.addSource("routeLayer", routeData);

    state.map?.addLayer({
      id: "routeLayer",
      type: "line",
      source: "routeLayer",
      layout: {
        "line-cap": "round",
        "line-join": "round",
      },
      paint: {
        "line-color": "black",
        "line-width": 3,
      },
    });
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
