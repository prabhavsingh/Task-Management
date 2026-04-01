import mongoose from "mongoose";
import fs from "fs";
import dotenv from "dotenv";
import Task from "../src/models/taskModel.js"; // adjust path

dotenv.config();

const DB = process.env.DATABASE.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD,
);

const importData = async () => {
  try {
    await mongoose.connect(DB);

    const data = JSON.parse(
      fs.readFileSync("./dev-data/seedData.json", "utf-8"),
    );

    await Task.deleteMany(); // optional clean
    await Task.insertMany(data);

    console.log("✅ Data Imported!");
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

importData();
