
import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import dns from "node:dns";
dns.setServers(["8.8.8.8"]);
import chatRoutes from "./routes/chat.js";

const app = express();
const port = 8080;

app.use(express.json());
app.use(cors());

app.use("/api",chatRoutes);

app.get("/", (req, res) => {
  res.send("Promptly backend is running!");
});

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected with Database!");
  } catch (err) {
    console.error("Failed to connect with database:", err.message);
    process.exit(1);
  }
};

const startServer = async () => {
  await connectDB();

  app.listen(port, () => {
    console.log(`Server is listening to port-${port}`);
  });
};

startServer();
