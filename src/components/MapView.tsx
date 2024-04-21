import { Map, NavigationControl } from "mapbox-gl";
import { useLayoutEffect, useRef } from "react";

import { INITIAL_USER_LOCATION } from "@/configs/map";
import { useMapContext } from "@/context/MapContext";

export const MapView = () => {
  const { setMap } = useMapContext();

  const mapDiv = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const map = new Map({
      container: mapDiv.current as HTMLDivElement,
      style: "mapbox://styles/mapbox/light-v10",
      center: INITIAL_USER_LOCATION,
      zoom: 12,
      accessToken: process.env.MAPBOX_ACCESS_TOKEN,
    });
    map.addControl(new NavigationControl(), "top-right");

    setMap(map);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div className="w-full h-[100svh] fixed inset-0" ref={mapDiv} />;
};
