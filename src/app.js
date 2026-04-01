import express from "express";
import path from "path";
import rateLimit from "express-rate-limit";
import AppError from "./utils/appError.js";
import globalErrorHandler from "./utils/globalErrorHandler.js";
import taskRouter from "./routes/taskRoutes.js";
import analyticsRouter from "./routes/analyticsRoutes.js";
import helmet from "helmet";
const app = express();

app.use(express.static(path.join(process.cwd(), "public")));
app.use(helmet());

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});

app.use("/api", limiter);

app.use(express.json({ limit: "10kb" }));

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Server is running",
  });
});

app.use("/api/v1/tasks", taskRouter);
app.use("/api/v1/analytics", analyticsRouter);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
