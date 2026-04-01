import express from "express";
import * as analyticsController from "../controllers/analyticsController.js";

const router = express.Router();

router
  .route("/users-productivity")
  .get(analyticsController.getAllUsersProductivity);

export default router;
