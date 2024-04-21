import { directionsApi, mockApi } from "@/lib/axios";
import { delay } from "@/utils";

import type { FetchPathResponse } from "@/types";
import type { AxiosError } from "axios";

export const getPaths = async (
  origin: string,
  destination: string,
  callback: (data: FetchPathResponse) => void
) => {
  try {
    const response = await mockApi.post("/route", {
      origin,
      destination,
    });
    const token = response.data.token;
    return await fetchPathWithToken(token, callback);
  } catch (error) {
    console.error("Error getting token or fetching data: ", error);
    throw error;
  }
};

export const fetchPathWithToken = async (
  token: string,
  callback: (data: FetchPathResponse) => void,
  retries = 10,
  interval = 2000
): Promise<FetchPathResponse> => {
  try {
    const res = await mockApi.get<FetchPathResponse>(`/route/${token}`);
    callback(res.data);

    if (res.data.status === "in progress" && retries > 0) {
      await delay(interval);
      console.log("Retrying...");
      return await fetchPathWithToken(token, callback, retries - 1);
    }
    if (res.data.status === "failure") {
      return res.data;
    }
    if (res.data.status === "success") {
      return res.data;
    }
    throw new Error("Path fetching failed or status is not recognized.");
  } catch (error: unknown) {
    if (retries > 0 && (error as AxiosError).response?.status !== 500) {
      await delay(interval);
      return await fetchPathWithToken(token, callback, retries - 1);
    }
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const fetchDirections = async (
  start: [number, number],
  end: [number, number]
) => {
  try {
    const startLngLat = {
      lat: start[0],
      lng: start[1],
    };
    const endLngLat = {
      lat: end[0],
      lng: end[1],
    };

    const res = await directionsApi.get(
      `/${startLngLat.lng},${startLngLat.lat};${endLngLat.lng},${endLngLat.lat}`
    );
    return res.data.routes[0].geometry.coordinates;
  } catch (error) {
    console.error("Error fetching directions:", error);
    return []; // return an empty array to avoid breaking the map rendering
  }
};
