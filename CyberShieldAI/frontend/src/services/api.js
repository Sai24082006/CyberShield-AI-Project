import axios from "axios";

const API = axios.create({
  baseURL: "https://cybershield-ai-backend-8xyr.onrender.com",
  headers: {
    "Content-Type": "application/json",
  },
});

export default API;
