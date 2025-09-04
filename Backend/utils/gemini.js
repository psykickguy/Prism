import "dotenv/config";

const callGemini = async (systemPrompt, userMessage) => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "provider-2/gemini-2.5-flash",
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

    // Debug log – helps see if the response format changes
    console.log("Gemini raw response:", JSON.stringify(data, null, 2));

    // Safely extract output
    const output =
      data?.choices?.[0]?.message?.content ||
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "⚠️ No output returned from Gemini";

    return output;
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
