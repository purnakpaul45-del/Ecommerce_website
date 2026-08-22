
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import connectDB from "./config/mongoDB.js";
import connectCloudinary from "./config/cloudinary.js";

import userRouter from "./routes/userRoutes.js";
import productRouter from "./routes/productRoutes.js";
import adminRouter from "./routes/adminRoutes.js";
import orderRouter from "./routes/orderRoutes.js";

import { stripeWebhook } from "./controllers/orderControllers.js";
import dashboardRouter from "./routes/dashboardRoutes.js";
import customerRouter from "./routes/customerRoutes.js";
import couponRouter from "./routes/couponRoutes.js";

import aiRoutes from "./routes/aiRoutes.js";
dotenv.config();

const app = express();

const port = process.env.PORT || 8005;

// ==========================================
// CORS
// ==========================================

app.use(cors());

// ==========================================
// STRIPE WEBHOOK
// ==========================================
// IMPORTANT:
// This MUST come before express.json()
// because Stripe needs the raw request body.
// ==========================================

app.post(
  "/api/order/stripe-webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

// ==========================================
// JSON MIDDLEWARE
// ==========================================

app.use(express.json());

// ==========================================
// ROUTES
// ==========================================

app.use("/api/user", userRouter);

app.use("/api/product", productRouter);

app.use("/api/admin", adminRouter);

app.use("/api/order", orderRouter);
app.use("/api/dashboard",dashboardRouter);
app.use("/api/admin/customers",customerRouter);
app.use("/api/admin/coupon",couponRouter);
app.use("/api/ai/",aiRoutes);

// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Purnak Paul - Backend Server Running",
  });
});

// ==========================================
// START SERVER
// ==========================================

const startServer = async () => {
  try {
    await connectDB();

    connectCloudinary();

    app.listen(port, () => {
      console.log(`Server started on PORT: ${port}`);
    });
  } catch (error) {
    console.error(
      "Failed to start server:",
      error.message
    );
  }
};

startServer();

