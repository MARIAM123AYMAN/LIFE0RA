import API from "./api";

export const getAllBreathing = async () => {
  const response = await API.get("/api/breathingexercises");
  return response.data;
};

export const getBreathingById = async (id: number) => {
  const response = await API.get(`/api/breathingexercises/${id}`);
  return response.data;
};