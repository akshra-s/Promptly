import express from "express";
import "dotenv/config";
import cors from "cors";

const app=express();
const port=8080;

app.use(express.json());
app.use(cors());

app.listen(port,()=>{
    console.log(`Server is listening to port-${port}`);
});
const client = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

const response = await client.chat.completions.create({
  model: "openai/gpt-oss-20b",
  messages: [
    {
      role: "user",
      content: "what comes after A in english alphabets?",
    },
  ],
});

console.log(response.choices[0].message.content);