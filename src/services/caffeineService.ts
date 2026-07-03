import API from "./api";

export const getCaffeineTips = async () => {
  const response = await API.get("/api/caffeine");
  return response.data;
};