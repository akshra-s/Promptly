
import express from "express";
import { v4 as uuidv4 } from "uuid";
import Thread from "../models/Thread.js";
import getApiResponse from "../utils/grok.js";
import isLoggedIn from "../middleware/isLoggedIn.js";

const router = express.Router();

// Test route
router.post("/test", isLoggedIn, async (req, res) => {
  try {
    const thread = new Thread({
      threadId: uuidv4(),
      title: "Testing New Thread",
      user: req.user._id,
    });

    const response = await thread.save();
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to save in database",
    });
  }
});

// Chat route
router.post("/chat", isLoggedIn, async (req, res) => {
  try {
    const { threadId, message } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    let thread;

    if (threadId) {
      thread = await Thread.findOne({
        threadId,
        user: req.user._id,
      });
    }

    if (!thread) {
      thread = new Thread({
        threadId: uuidv4(),
        title: message.slice(0, 50),
        messages: [],
        user: req.user._id,
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
    res.status(500).json({
      error: "Failed to process chat message",
    });
  }
});

// Get all threads of logged-in user
router.get("/thread", isLoggedIn, async (req, res) => {
  try {
    const threads = await Thread.find({
      user: req.user._id,
    }).sort({ updatedAt: -1 });

    res.json(threads);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch threads",
    });
  }
});

// Get messages of a specific thread
router.get("/thread/:threadId", isLoggedIn, async (req, res) => {
  try {
    const thread = await Thread.findOne({
      threadId: req.params.threadId,
      user: req.user._id,
    });

    if (!thread) {
      return res.status(404).json({
        error: "Thread not found",
      });
    }

    res.json(thread.messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to fetch chat",
    });
  }
});

// Delete a thread
router.delete("/thread/:threadId", isLoggedIn, async (req, res) => {
  try {
    const deletedThread = await Thread.findOneAndDelete({
      threadId: req.params.threadId,
      user: req.user._id,
    });

    if (!deletedThread) {
      return res.status(404).json({
        error: "Thread not found",
      });
    }

    res.status(200).json({
      success: "Thread deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Failed to delete thread",
    });
  }
});

export default router;
