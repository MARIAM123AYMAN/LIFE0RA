// services/workoutService.ts

import api from "./api";

export const getWorkouts = (category: string) =>
  api.get(`/api/workouts?category=${category}`);

export const startWorkout = (workoutId: number) =>
  api.post("/api/workouts/start", {
    workoutId,
  });

export const endWorkout = (sessionId: number) =>
  api.post("/api/workouts/end", {
    sessionId,
  });

export const getActiveWorkout = () =>
  api.get("/api/workouts/active");

export const getTodaySummary = () =>
  api.get("/api/workouts/today-summary");

export const getGroupedWorkouts = () =>
    api.get("/api/workouts/grouped");

export const getWorkoutHistory = () =>
  api.get("/api/workouts/history");