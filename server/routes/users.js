const express = require("express");
const { protect } = require("../middleware/auth");
const User = require("../models/User");
const router = express.Router();

// GET /api/users
router.get("/", protect, async (req, res, next) => {
  try {
    const users = await User.find().select("_id username");
    res.json(users);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
