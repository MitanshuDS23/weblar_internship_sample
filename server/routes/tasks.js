const express = require("express");
const Task = require("../models/Task");
const ActionLog = require("../models/ActionLog");
const User = require("../models/User");
const { protect } = require("../middleware/auth");
const router = express.Router();

// helper to log actions
async function log(user, task, action, payload) {
  await ActionLog.create({ user, task, action, payload });
}

// GET /api/tasks
router.get("/", protect, async (req, res, next) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "username").lean();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
});

// POST /api/tasks
router.post("/", protect, async (req, res, next) => {
  try {
    const t = await Task.create(req.body);
    await log(req.user._id, t._id, "create", t);
    req.io.emit("taskCreated", t);
    res.status(201).json(t);
  } catch (err) {
    next(err);
  }
});

// PUT /api/tasks/:id
router.put("/:id", protect, async (req, res, next) => {
  try {
    const existing = await Task.findById(req.params.id);
    if (req.body.version !== existing.version) {
      return res.status(409).json({
        message: "Version conflict",
        serverVersion: existing,
        clientVersion: req.body,
      });
    }
    Object.assign(existing, req.body);
    existing.version++;
    await existing.save();
    await log(req.user._id, existing._id, "update", existing);
    req.io.emit("taskUpdated", existing);
    res.json(existing);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/tasks/:id
router.delete("/:id", protect, async (req, res, next) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    await log(req.user._id, req.params.id, "delete", {});
    req.io.emit("taskDeleted", { id: req.params.id });
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
});

// POST /api/tasks/:id/assign
router.post("/:id/assign", protect, async (req, res, next) => {
  try {
    let userId = req.body.userId;
    if (req.body.smart) {
      // find user with fewest active tasks
      const counts = await Task.aggregate([
        { $match: { status: { $ne: "Done" } } },
        { $group: { _id: "$assignedTo", cnt: { $sum: 1 } } },
      ]);
      const map = counts.reduce((m, x) => ((m[x._id] = x.cnt), m), {});
      const allUsers = await User.find();
      userId = allUsers.sort((a, b) => (map[a._id] || 0) - (map[b._id] || 0))[0]
        ._id;
    }
    const task = await Task.findById(req.params.id);
    task.assignedTo = userId;
    task.version++;
    await task.save();
    await log(req.user._id, task._id, "assign", { assignedTo: userId });
    const populated = await task.populate("assignedTo", "username");
    req.io.emit("taskAssigned", populated);
    res.json(populated);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
