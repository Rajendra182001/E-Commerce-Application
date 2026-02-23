import axios from "axios";

const API = axios.create({
  baseURL: process.env.REACT_APP_BACKEND_URL, // must match exactly
});

export default API;