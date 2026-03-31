import express from "express";
import * as taskController from "../controllers/taskController.js";

const router = express.Router();

router
  .route("/")
  .get(taskController.getAllTasks)
  .post(taskController.createTask);

router
  .route("/:id")
  .get(taskController.getTaskById)
  .post(taskController.updateTask)
  .delete(taskController.deleteTask);

export default router;
