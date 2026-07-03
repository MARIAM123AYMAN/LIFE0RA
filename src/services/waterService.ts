import api from "./api";

export const getWaterToday = async () => {
  const { data } = await api.get("/api/water/today");
  return data;
};