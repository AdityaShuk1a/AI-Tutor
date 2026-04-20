import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  timeout: 90000, // increased to 90s
  defaultHeaders: {
    "HTTP-Referer": "http://localhost:3000",
    "X-Title": "Cuemath Tutor App",
  },
});

const MODELS = [
  "google/gemini-2.0-flash-001",
  "google/gemini-2.0-flash-lite-001",
  "meta-llama/llama-3.3-70b-instruct:free",
];

let prevChat = [
  {
    role: "system",
    content:
      "You are a Cuemath tutor. Return JSON with keys: msg, expression, image.",
  },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const is429 = (e) => e.status === 429;
const is504 = (e) =>
  e.status === 504 ||
  (e.message && e.message.includes("504")) ||
  (e.message && e.message.toLowerCase().includes("aborted")) ||
  (e.message && e.message.toLowerCase().includes("timeout"));

const createWithRetryAndFallback = async (messages) => {
  for (const model of MODELS) {
    const maxRetries = 3;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        console.log(`[AI] Trying model: ${model} (attempt ${attempt + 1})`);
        const response = await openai.chat.completions.create({
          model,
          messages,
          response_format: { type: "json_object" },
        });
        console.log(`[AI] Success with model: ${model}`);
        return response;
      } catch (error) {
        const isLastAttempt = attempt === maxRetries - 1;

        if ((is429(error) || is504(error)) && !isLastAttempt) {
          const delay = 2000 * (attempt + 1);
          const reason = is429(error) ? "Rate limited" : "504 timeout";
          console.warn(`[AI] ${reason} on ${model}. Retrying in ${delay}ms...`);
          await sleep(delay);
        } else if ((is429(error) || is504(error)) && isLastAttempt) {
          console.warn(
            `[AI] All retries exhausted for ${model}. Trying next model...`,
          );
          break;
        } else {
          throw error;
        }
      }
    }
  }

  throw new Error("All models are unavailable. Please try again in a moment.");
};

let isProcessing = false;
const queue = [];

const processQueue = async () => {
  if (isProcessing || queue.length === 0) return;
  isProcessing = true;
  const { resolve, reject, task } = queue.shift();
  try {
    resolve(await task());
  } catch (e) {
    reject(e);
  } finally {
    isProcessing = false;
    processQueue();
  }
};

const enqueue = (task) =>
  new Promise((resolve, reject) => {
    queue.push({ resolve, reject, task });
    processQueue();
  });

export const handleChatSSE = async (req, res) => {
  const text = req.query.text || (req.body && req.body.text);

  if (!text || typeof text !== "string" || text.trim() === "") {
    return res.status(400).json({ error: "text field is required." });
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.flushHeaders();

  const send = (data) => res.write(`data: ${JSON.stringify(data)}\n\n`);

  const heartbeat = setInterval(() => res.write(": ping\n\n"), 5000);

  try {
    send({ status: "thinking" });

    const userMessage = { role: "user", content: text.trim() };
    prevChat.push(userMessage);
    const messagesSnapshot = [...prevChat];

    const response = await enqueue(() =>
      createWithRetryAndFallback(messagesSnapshot),
    );
    const aiResponseText = response.choices[0].message.content;

    let content;
    try {
      content = JSON.parse(aiResponseText);
    } catch {
      send({ error: "Model did not return valid JSON." });
      res.end();
      return;
    }

    send({ status: "done", chat: content });

    prevChat.push({ role: "assistant", content: aiResponseText });
    if (prevChat.length > 21) {
      prevChat = [prevChat[0], ...prevChat.slice(-20)];
    }
  } catch (error) {
    console.error("[AI] SSE error:", error.message);
    send({ error: error.message });
  } finally {
    clearInterval(heartbeat);
    res.end();
  }
};

export const handleChat = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || typeof text !== "string" || text.trim() === "") {
      return res.status(400).json({ error: "text field is required." });
    }

    const userMessage = { role: "user", content: text.trim() };
    prevChat.push(userMessage);
    const messagesSnapshot = [...prevChat];

    const response = await enqueue(() =>
      createWithRetryAndFallback(messagesSnapshot),
    );
    const aiResponseText = response.choices[0].message.content;

    let content;
    try {
      content = JSON.parse(aiResponseText);
    } catch {
      return res
        .status(502)
        .json({ error: "Model did not return valid JSON." });
    }

    res.json({ chat: content });

    prevChat.push({ role: "assistant", content: aiResponseText });
    if (prevChat.length > 21) {
      prevChat = [prevChat[0], ...prevChat.slice(-20)];
    }
  } catch (error) {
    console.error("[AI] Controller error:", error.message);
    res.status(500).json({ error: "API Error", details: error.message });
  }
};
