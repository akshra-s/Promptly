
import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import dns from "node:dns";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import authRoutes from "./routes/auth.js";

import User from "./models/User.js";
import chatRoutes from "./routes/chat.js";

dns.setServers(["8.8.8.8"]);

const app = express();
const port = 8080;

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
    }),
    cookie: {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/api/auth", authRoutes);
app.use("/api", chatRoutes);

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
