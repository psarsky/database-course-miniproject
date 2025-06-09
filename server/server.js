import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connect } from "mongoose";

import userRoutes from "./routes/userRoutes.js";
import equipmentRoutes from "./routes/equipmentRoutes.js";
import rentalRoutes from "./routes/rentalRoutes.js";

dotenv.config();

const app = express();

// --- Middleware ---
app.use(cors());
app.use(express.json());

// --- Routes ---
app.use("/api/users", userRoutes);
app.use("/api/equipment", equipmentRoutes);
app.use("/api/rentals", rentalRoutes);

// --- Test endpoint ---
app.get("/", (req, res) => {
  res.send("Ski rental backend is running!");
});

// --- MongoDB connection and server initialization ---
(async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    const port = process.env.PORT || 5000;

    console.log("Attempting to connect to MongoDB with URI:", mongoUri);
    await connect(mongoUri);

    console.log("✅ Connected to MongoDB");
    app.listen(port, () => {
      console.log(`🚀 Server running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
})();
