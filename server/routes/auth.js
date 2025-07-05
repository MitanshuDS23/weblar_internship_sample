const express = require("express");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const router = express.Router();
const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

function issueToken(id) {
  return jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// POST /api/auth/register
router.post("/register", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Username & password required" });

    if (await User.exists({ username }))
      return res.status(409).json({ message: "Username already taken" });

    const user = await User.create({ username, password });
    res.status(201).json({ token: issueToken(user._id) });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: "Username & password required" });

    const user = await User.findOne({ username });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: "Invalid credentials" });

    res.json({ token: issueToken(user._id) });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
router.get("/me", protect, (req, res) => {
  res.json({ id: req.user._id, username: req.user.username });
});

module.exports = router;
