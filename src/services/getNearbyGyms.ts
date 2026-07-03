import API from "./api";

export const getNearbyGyms = async () => {
  const response = await API.get("/gyms/nearby");
  return response.data;
};