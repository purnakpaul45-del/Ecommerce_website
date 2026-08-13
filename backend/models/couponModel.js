import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    // ======================================================
    // COUPON CODE
    // ======================================================

    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },

    // ======================================================
    // DISCOUNT TYPE
    // percentage = 10 means 10%
    // fixed = 200 means ₹200
    // ======================================================

    discountType: {
      type: String,
      enum: ["percentage", "fixed"],
      required: true,
    },

    // ======================================================
    // DISCOUNT VALUE
    // ======================================================

    discountValue: {
      type: Number,
      required: true,
      min: 0,
    },

    // ======================================================
    // MINIMUM ORDER AMOUNT
    // ======================================================

    minimumAmount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ======================================================
    // MAXIMUM DISCOUNT
    // Mainly useful for percentage coupons
    // Example:
    // 20% discount but maximum ₹500
    // ======================================================

    maximumDiscount: {
      type: Number,
      default: null,
      min: 0,
    },

    // ======================================================
    // START DATE
    // ======================================================

    startDate: {
      type: Date,
      required: true,
    },

    // ======================================================
    // EXPIRY DATE
    // ======================================================

    expiryDate: {
      type: Date,
      required: true,
    },

    // ======================================================
    // USAGE LIMIT
    // ======================================================

    usageLimit: {
      type: Number,
      default: null,
      min: 1,
    },

    // ======================================================
    // NUMBER OF TIMES COUPON HAS BEEN USED
    // ======================================================

    usedCount: {
      type: Number,
      default: 0,
      min: 0,
    },

    // ======================================================
    // COUPON STATUS
    // ======================================================

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// ======================================================
// MODEL
// ======================================================

const couponModel =
  mongoose.models.coupon ||
  mongoose.model("coupon", couponSchema);

export default couponModel;