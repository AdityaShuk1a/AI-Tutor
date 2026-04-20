import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000", // Optional: Your site URL
    "X-Title": "Cuemath Tutor App",         // Optional: Your site name
  }
});

export const handleChat = async (req, res) => {
  try {
    const { messages } = req.body;

    // Convert your messages into the format OpenRouter expects
    const apiMessages = messages.map(m => ({
      role: m.role === "model" ? "assistant" : m.role,
      content: m.text
    }));

    const response = await openai.chat.completions.create({
      model: "google/gemini-2.0-flash-001", // Specify the Gemini model ID
      messages: [
        { 
          role: "system", 
          content: "You are a Cuemath tutor. Return JSON with keys: msg, expression, image." 
        },
        ...apiMessages
      ],
      response_format: { type: "json_object" } // OpenRouter supports structured output
    });

    const content = JSON.parse(response.choices[0].message.content);
    res.json({ chat: content });

  } catch (error) {
    console.error("OpenRouter Error:", error);
    res.status(500).json({ error: "API Error", details: error.message });
  }
};