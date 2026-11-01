
import express from "express";
import passport from "passport";
import User from "../models/User.js";

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (password.length < 6) {
      return res.status(400).json({
        error: "Password must be at least 6 characters",
      });
    }

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      return res.status(409).json({
        error: "An account with this email already exists",
      });
    }

    const newUser = new User({
      email: normalizedEmail,
    });

    const registeredUser = await User.register(
      newUser,
      password
    );

    req.login(registeredUser, (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({
          error: "Login failed after registration",
        });
      }

      res.status(201).json({
        message: "Account created successfully",
        user: {
          id: registeredUser._id,
          email: registeredUser.email,
        },
      });
    });
  } catch (err) {
    console.error("Signup error:", err);

    res.status(500).json({
      error: "Failed to create account",
    });
  }
});

// Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }

    if (!user) {
      return res.status(401).json({
        error: info?.message || "Invalid email or password",
      });
    }

    req.login(user, (loginErr) => {
      if (loginErr) {
        return next(loginErr);
      }

      res.json({
        message: "Login successful",
        user: {
          id: user._id,
          email: user.email,
        },
      });
    });
  })(req, res, next);
});

// Check logged-in user
router.get("/user", (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      error: "Not authenticated",
    });
  }

  res.json({
    user: {
      id: req.user._id,
      email: req.user.email,
    },
  });
});

// Logout
router.post("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }

    req.session.destroy((sessionErr) => {
      if (sessionErr) {
        return next(sessionErr);
      }

      res.clearCookie("connect.sid");

      res.json({
        message: "Logged out successfully",
      });
    });
  });
});

export default router;
