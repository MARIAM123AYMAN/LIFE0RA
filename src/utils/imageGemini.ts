import { GoogleGenerativeAI }
from "@google/generative-ai";

const genAI =
  new GoogleGenerativeAI(
    import.meta.env.VITE_GEMINI_API_KEY
  );

export const analyzeMealImage =
async (file: File) => {

const model =
genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

const imageData =
await file.arrayBuffer();

const result =
await model.generateContent([
  {
    inlineData: {
      data: btoa(
        String.fromCharCode(
          ...new Uint8Array(imageData)
        )
      ),
      mimeType: file.type,
    },
  },

  `
Analyze this food image.

Return ONLY JSON:

{
  "foodName":"",
  "calories":0,
  "protein":0,
  "carbs":0,
  "fats":0
}
`
]);

const text =
result.response.text();

return JSON.parse(
text.replace(/```json|```/g,"")
);
};
