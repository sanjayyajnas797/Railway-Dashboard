import axios from "axios";

const API = axios.create({
  baseURL: "https://railway-dashboard-rdii.onrender.com"
});

export default API;