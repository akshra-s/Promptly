
import express from "express";
import "dotenv/config";
import cors from "cors";
import OpenAI from "openai";

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

app.get("/", (req, res) => {
  res.send("Promptly backend is running!");
});

app.post("/api/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required." });
    }

    const response = await client.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [{ role: "user", content: message }],
    });

    res.json({
      reply: response.choices[0].message.content,
    });
  } catch (error) {
    console.error("Groq API error:", error.message);
    res.status(500).json({ error: "Failed to generate a response." });
  }
});

app.listen(port, () => {
  console.log(`Server is listening to port-${port}`);
});
