import API from "./api";

export const getCaffeineReference = async () => {
  const response = await API.get("/api/caffeine/reference")
  return response.data;
};