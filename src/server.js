import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import app from "./app.js";

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);

const dbConnection = async () => {
  try {
    await mongoose.connect(DB);
    console.log("Database connection successful");
  } catch (error) {
    console.error("Database connection error:", error);
  }
};

dbConnection();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
