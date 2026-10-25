
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

    if (typeof message !== "string" || !message.trim()) {
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

// Get all threads
router.get("/thread", async (req, res) => {
  try {
    const threads = await Thread.find({}).sort({ updatedAt: -1 });
    res.json(threads);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch threads" });
  }
});

// Get messages of a specific thread
router.get("/thread/:threadId", async (req, res) => {
  try {
    const thread = await Thread.findOne({
      threadId: req.params.threadId,
    });

    if (!thread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.json(thread.messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch chat" });
  }
});

// Delete a thread
router.delete("/thread/:threadId", async (req, res) => {
  try {
    const deletedThread = await Thread.findOneAndDelete({
      threadId: req.params.threadId,
    });

    if (!deletedThread) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.status(200).json({
      success: "Thread deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to delete thread" });
  }
});

export default router;
