import express from "express";

import {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus,
  applyCoupon,
} from "../controllers/couponController.js";

const couponRouter = express.Router();

// ======================================================
// ADMIN - CREATE COUPON
// POST /api/coupon/create
// ======================================================

couponRouter.post(
  "/create",
  createCoupon
);

// ======================================================
// ADMIN - GET ALL COUPONS
// GET /api/coupon/all
// ======================================================

couponRouter.get(
  "/all",
  getAllCoupons
);

// ======================================================
// ADMIN - GET SINGLE COUPON
// GET /api/coupon/:id
// ======================================================

couponRouter.get(
  "/:id",
  getCouponById
);

// ======================================================
// ADMIN - UPDATE COUPON
// PUT /api/coupon/:id
// ======================================================

couponRouter.put(
  "/:id",
  updateCoupon
);

// ======================================================
// ADMIN - DELETE COUPON
// DELETE /api/coupon/:id
// ======================================================

couponRouter.delete(
  "/:id",
  deleteCoupon
);

// ======================================================
// ADMIN - ACTIVATE / DEACTIVATE COUPON
// PATCH /api/coupon/:id/toggle
// ======================================================

couponRouter.patch(
  "/:id/toggle",
  toggleCouponStatus
);

// ======================================================
// CUSTOMER - APPLY COUPON
// POST /api/coupon/apply
// ======================================================

couponRouter.post(
  "/apply",
  applyCoupon
);

export default couponRouter;