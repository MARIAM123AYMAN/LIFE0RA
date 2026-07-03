import API from "./api";

export const startActivity = async (activityType: string) => {
  const response = await API.post("/api/activity/start", {
    activityType,
  });
  return response.data;
};

export const getActiveActivity = async () => {
  const response = await API.get("/api/activity/active");
  return response.data;
};

export const endActivity = async (sessionId: number) => {
  const response = await API.post("/api/activity/end", {
    sessionId,
  });
  return response.data;
};

export const getActivityHistory = async () => {
  const response = await API.get("/api/activity/history");
  return response.data;
};
export const getActivitySummary = async () => {
  const response = await API.get("/api/activity/weekly-summary");
  return response.data;
};

// chat bot
import api from "./api";

export const getSummaryActivity = async () => {
  const { data } = await api.get("/api/activity/weekly-summary");
  return data;
};