import api from "./api";

export const getGoals = () =>
  api.get("/api/UserGoals");

export const updateGoals = (data: {
  caloriesGoal: number;
  waterGoal: number;
  activityGoal: number;
}) =>
  api.put("/api/UserGoals", data);

export const setDefaultGoals = () =>
  api.post("/api/UserGoals/set-default");