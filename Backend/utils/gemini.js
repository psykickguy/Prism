import "dotenv/config";

const callGemini = async (systemPrompt, userMessage) => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "provider-6/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
    }),
  };

  try {
    const response = await fetch(
      "https://api.a4f.co/v1/chat/completions",
      options
    );
    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error:", error);
  }
};

export default callGemini;

// import "dotenv/config";

// import { GoogleGenAI } from "@google/genai";
// const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

// const callGemini = async (systemPrompt, userMessage) => {
//   try {
//     const response = await ai.models.generateContent({
//       model: "gemini-2.5-flash",
//       messages: [
//         { role: "system", content: systemPrompt },
//         { role: "user", content: userMessage },
//       ],
//     });
//     const data = await response.json();
//     return data.choices[0].message.content;
//   } catch (error) {
//     console.error("Error:", error);
//   }
// };

// export default callGemini;
