import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

// This function will add token automatically in axios header
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

export default api;
