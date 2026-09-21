import API from "./api";

export const getTodaySteps = async () => {
  const response = await API.get("/api/steps/today");
  return response.data;
};

export const getWeeklySteps = async () => {
  const response = await API.get("/api/steps/weekly");
  return response.data;
};
export const addStep = async (steps: number) => {
  const response = await API.post(
    "/api/steps/add",
    JSON.stringify(steps),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

export const resetSteps = async () => {
  const response = await API.post("/api/steps/reset");
  return response.data;
};