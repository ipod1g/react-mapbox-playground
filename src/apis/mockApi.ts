import axios from "axios";

const mockApi = axios.create({
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

export default mockApi;
