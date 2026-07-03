import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
  import.meta.env.VITE_GEMINI_API_KEY
);

export const analyzeMeal = async (
  foodName: string,
  quantity: string
) => {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
Analyze this meal:

Food: ${foodName}
Quantity: ${quantity}

Return ONLY valid JSON:

{
  "calories": number,
  "protein": number,
  "carbs": number,
  "fats": number
}
`;

  const result = await model.generateContent(prompt);

  const text = result.response.text();

  console.log(text);

  return JSON.parse(
    text.replace(/```json|```/g, "").trim()
  );
};