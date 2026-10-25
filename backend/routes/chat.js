
import express from "express";
import { v4 as uuidv4 } from "uuid";
import Thread from "../models/Thread.js";
import getApiResponse from "../utils/grok.js";

const router = express.Router();

// Test route
router.post("/test", async (req, res) => {
  try {
    const thread = new Thread({
      threadId: uuidv4(),
      title: "Testing New Thread",
    });

    const response = await thread.save();
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save in database" });
  }
});

// Chat route
router.post("/chat", async (req, res) => {
  try {
    const { threadId, message } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }

    let thread;

    if (threadId) {
      thread = await Thread.findOne({ threadId });
    }

    if (!thread) {
      thread = new Thread({
        threadId: uuidv4(),
        title: message.slice(0, 50),
        messages: [],
      });
    }

    thread.messages.push({
      role: "user",
      content: message,
    });

    const reply = await getApiResponse(message);

    thread.messages.push({
      role: "assistant",
      content: reply,
    });

    thread.updatedAt = new Date();
    await thread.save();

    res.json({
      threadId: thread.threadId,
      reply,
      thread,
    });
  } catch (err) {
    console.error("Chat route error:", err);
    res.status(500).json({ error: "Failed to process chat message" });
  }
});

export default router;
