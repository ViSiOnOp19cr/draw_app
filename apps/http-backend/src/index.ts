import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { initializeDatabase } from "./config/database";
import authRoutes from "./routes/auth";


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/rooms", roomRoutes);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "draw-app-http-api" });
});

// Start server
const startServer = async () => {
  try {
    // Initialize database connection
    await initializeDatabase();
    
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();