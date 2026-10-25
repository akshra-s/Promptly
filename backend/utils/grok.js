
import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const getApiResponse = async (message) => {
  const response = await client.chat.completions.create({
    model: "openai/gpt-oss-20b",
    messages: [{ role: "user", content: message }],
  });

  return response.choices[0].message.content;
};

export default getApiResponse;
