import express from "express";

import {
  adminLogin,
  getDashboardStats,
} from "../controllers/adminController.js";

const adminRouter = express.Router();

// ======================================================
// ADMIN LOGIN
// ======================================================

adminRouter.post("/login", adminLogin);

// ======================================================
// ADMIN DASHBOARD
// ======================================================

adminRouter.get("/dashboard", getDashboardStats);

export default adminRouter;