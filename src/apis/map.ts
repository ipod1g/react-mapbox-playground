import { directionsApi, mockApi } from "@/lib/axios";
import { delay } from "@/utils";

import type { AxiosError } from "axios";

export const getPaths = async (origin: string, destination: string) => {
  try {
    const response = await mockApi.post("/route", {
      origin,
      destination,
    });
    // const response = await mockApi.post("/mock/route/success");
    const token = response.data.token;
    return await fetchPathWithToken(token);
  } catch (error) {
    console.error("Error getting token or fetching data:", error);
    throw error;
  }
};

type FetchPathResponse = {
  status: "in progress" | "success";
  path?: number[][];
};

export const fetchPathWithToken = async (
  token: string,
  retries = 10,
  interval = 2000
  // TODO: fix return type
): Promise<{
  status: "in progress" | "success" | "failure";
  path?: number[][];
  total_distance?: number;
  total_time?: number;
}> => {
  try {
    const res = await mockApi.get<FetchPathResponse>(`/mock/route/success`);
    // const res = await mockApi.get<FetchPathResponse>(`/route/${token}`);
    // const res = await mockApi.get<FetchPathResponse>(`/mock/route/500`);
    if (res.status === 500) {
      throw new Error("Server error");
    }
    if (res.data.status === "in progress" && retries > 0) {
      await delay(interval);
      console.log("Retrying...");
      return await fetchPathWithToken(token, retries - 1);
    } else if (res.data.status === "success") {
      console.log(res);

      return res.data;
      // return res.data.path as number[][];
    }
    throw new Error("Path fetching failed or status is not recognized.");
  } catch (error: unknown) {
    if (retries > 0 && (error as AxiosError).response?.status !== 500) {
      await delay(interval);
      return await fetchPathWithToken(token, retries - 1);
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
