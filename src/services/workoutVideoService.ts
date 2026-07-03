import API from "./api";

export const getWorkoutVideos = async () => {
  const response = await API.get("/api/workoutvideos");
  return response.data;
};