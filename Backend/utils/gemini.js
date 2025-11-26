import "dotenv/config";

const callGemini = async (systemPrompt, userMessage) => {
  const options = {
    method: "POST",
    headers: {
      // Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
      Authorization: `Bearer ${process.env.GPT_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "provider-2/gpt-4.1-mini",
      // model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: `${systemPrompt}\n\n IMPORTANT: Do not include explanations or extra text.`,
        },
        { role: "user", content: userMessage },
      ],
    }),
  };

  try {
    const response = await fetch(
      "https://api.a4f.co/v1/chat/completions",
      // "https://api.groq.com/openai/v1/chat/completions",
      options
    );
    const data = await response.json();

    // // Debug raw response (good for dev only)
    // console.log("Gemini raw response:", JSON.stringify(data, null, 2));

    // // Extract text output safely
    // const rawOutput =
    //   data?.choices?.[0]?.message?.content ||
    //   data?.candidates?.[0]?.content?.parts?.[0]?.text ||
    //   "";

    // Debug raw response
    console.log("gpt raw response:", JSON.stringify(data, null, 2));

    // Extract assistant text
    const rawOutput = data?.choices?.[0]?.message?.content || "";

    return rawOutput;
  } catch (error) {
    console.error("Error calling gpt:", error);
    return { error: "gpt API call failed" };
  }
};

export default callGemini;
