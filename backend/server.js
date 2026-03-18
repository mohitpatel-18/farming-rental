import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./config/mongodb.js";
import connectCloudinary from "./config/cloudinary.js";
import userRouter from "./routes/userRoute.js";
import productRouter from "./routes/productRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";

const app = express();
const port = Number(process.env.PORT) || 4000;

const startupState = {
  db: false,
  cloudinary: false,
};

const startServer = async () => {
  try {
    startupState.db = await connectDB();
    startupState.cloudinary = connectCloudinary();

    app.use(express.json());
    app.use(cors());

    app.use("/api/user", userRouter);
    app.use("/api/product", productRouter);
    app.use("/api/cart", cartRouter);
    app.use("/api/order", orderRouter);

    app.get("/health", (req, res) => {
      const ready = startupState.db;

      res.status(ready ? 200 : 503).json({
        success: ready,
        services: startupState,
      });
    });

    app.get("/", (req, res) => {
      res.send("API is running...");
    });

    app.listen(port, () => {
      console.log(`Backend listening on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start backend:", error.message);
    process.exit(1);
  }
};

startServer();
