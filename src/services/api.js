import axios from "axios";

const API_BASE = "http://localhost:8080/api";

const instance = axios.create({
  baseURL: API_BASE,
});

export function setAuthToken(token) {
  if (token) instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete instance.defaults.headers.common["Authorization"];
}

export default instance;
