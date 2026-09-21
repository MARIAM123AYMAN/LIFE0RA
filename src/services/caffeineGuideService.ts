import API from "./api";

export const getCaffeineGuide = async () => {
  const response = await API.get("/api/caffeine/guide")
  return response.data;
};