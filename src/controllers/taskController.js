import Task from "../models/taskModel.js";
import CatchAyncError from "../utils/catchAsyncError.js";

export const getAllTasks = CatchAyncError(async (req, res) => {
  const task = await Task.find();

  res
    .status(200)
    .json({ status: "success", results: task.length, data: { task } });
});

export const getTaskById = CatchAyncError(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(new AppError("Task not found with that id", 404));
  }

  res.status(200).json({ status: "success", data: { task } });
});

export const createTask = CatchAyncError(async (req, res, next) => {
  const task = await Task.create(req.body);

  res.status(201).json({ status: "success", data: { task } });
});

export const updateTask = CatchAyncError(async (req, res, next) => {
  const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!task) {
    return next(new AppError("Task not found with that id", 404));
  }

  res.status(200).json({ status: "success", data: { task } });
});

export const deleteTask = CatchAyncError(async (req, res) => {
  const task = await Task.findByIdAndDelete(req.params.id);
  if (!task) {
    return next(new AppError("Task not found with that id", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});
