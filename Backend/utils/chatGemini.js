import "dotenv/config";

const chatGemini = async (messages) => {
  const options = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "provider-3/gpt-4o-mini",
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    }),
  };

  try {
    const response = await fetch(
      "https://api.a4f.co/v1/chat/completions",
      options
    );
    const data = await response.json();

    // Debugging
    console.log("Groq raw response:", JSON.stringify(data, null, 2));

    // Extract assistant reply
    const rawOutput =
      data?.choices?.[0]?.message?.content ||
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "";

    // 🧹 Clean output: remove <think> ... </think> blocks and trim
    const cleaned = rawOutput
      .replace(/<think>[\s\S]*?<\/think>/g, "") // remove thinking tags + content
      .trim();

    return cleaned;
  } catch (error) {
    console.error("Error in chatGemini:", error);
    return "⚠️ Sorry, something went wrong with the chatbot.";
  }
};

export default chatGemini;
