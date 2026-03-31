import express from "express";
import AppError from "./utils/appError.js";
import globalErrorHandler from "./utils/globalErrorHandler.js";
import taskRouter from "./routes/taskRoutes.js";

const app = express();

app.use(express.json());
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
  });
});

app.use("/api/v1/tasks", taskRouter);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
