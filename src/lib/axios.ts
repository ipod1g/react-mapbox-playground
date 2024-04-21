import axios from "axios";

export const directionsApi = axios.create({
  baseURL: "https://api.mapbox.com/directions/v5/mapbox/driving",
  params: {
    alternatives: false,
    geometries: "geojson",
    overview: "simplified",
    steps: false,
    access_token: process.env.MAPBOX_ACCESS_TOKEN,
  },
});

export const mockApi = axios.create({
  baseURL: process.env.API_URL,
});

mockApi.interceptors.response.use(null, (error) => {
  if (error.config && error.response && error.response.status === 401) {
    //   return updateToken().then((token) => {
    //     error.config.headers.xxxx <= set the token
    //     return axios.request(config);
    //   });
    return axios.request(error.config);
  }

  return Promise.reject(error);
});
