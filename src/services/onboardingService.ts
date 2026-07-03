import axios from "axios";
console.log(import.meta.env.VITE_API_URL);
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
export const createUserProfile = async (data: any) => {
  const response = await API.post("/api/onboarding", data);
  return response.data;
};
export const getOnboardingResult = async () => {
  const response = await API.get("/api/onboarding/result");
  return response.data;
};