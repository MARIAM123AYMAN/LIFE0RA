import api from "./api";

export const askCoach = async (message: string) => {
  const { data } = await api.post("/api/AICoach/chat", {
    message,
  });

  return data.reply;
};