const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ["Todo", "In Progress", "Done"],
      default: "Todo",
    },
    priority: { type: Number, default: 0 },
    version: { type: Number, default: 0 }, 
  },
  { timestamps: true }
);

TaskSchema.index({ title: 1 }, { unique: true });

module.exports = mongoose.model("Task", TaskSchema);
