import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  status: {
    type: String,
    enum: ["pending", "in progress", "completed"],
    default: "pending",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low",
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  dueDate: Date,
  completedAt: Date,
  username: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
});

const Task = mongoose.model("Task", taskSchema);

export default Task;
