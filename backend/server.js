import express from "express";
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import adminRoutes from './routes/adminRoutes.js';
import ownerRoutes from './routes/ownerRoutes.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';

dotenv.config();

// Recreate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use("/admin", adminRoutes);
app.use("/owner", ownerRoutes);
app.use("/user", userRoutes);
app.use("/auth", authRoutes);

// Start server inside async function
const startServer = async () => {
  try {
    const PORT = process.env.PORT || 10000;
    app.listen(PORT, () => {
      console.log(`✅ Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect to DB:", error);
    process.exit(1);
  }
};

startServer();
