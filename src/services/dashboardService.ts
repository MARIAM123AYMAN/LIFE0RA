// services/dashboardService.ts

import api from "./api";

export const getDashboard = () =>
  api.get("/api/Dashboard");