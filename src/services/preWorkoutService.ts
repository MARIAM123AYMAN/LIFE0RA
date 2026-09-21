import API from "./api";

export const getPreWorkout = async () => {
  const response = await API.get("/api/caffeine/pre-workout")
  return response.data;
};