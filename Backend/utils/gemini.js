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
        {
          role: "system",
          content: `${systemPrompt}\n\n IMPORTANT: Always respond in valid JSON format only. Do not include explanations or extra text.`,
        },
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

    // Debug raw response (good for dev only)
    console.log("Gemini raw response:", JSON.stringify(data, null, 2));

    // Extract text output safely
    const rawOutput =
      data?.choices?.[0]?.message?.content ||
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "";

    return rawOutput;
  } catch (error) {
    console.error("Error calling Gemini:", error);
    return { error: "Gemini API call failed" };
  }
};

export default callGemini;
