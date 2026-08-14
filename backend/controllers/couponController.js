import couponModel from "../models/couponModel.js";

// ======================================================
// CREATE COUPON - ADMIN
// ======================================================

const createCoupon = async (req, res) => {
  try {
    const {
      code,
      discountType,
      discountValue,
      minimumAmount,
      maximumDiscount,
      startDate,
      expiryDate,
      usageLimit,
    } = req.body;

    // --------------------------------------------------
    // VALIDATION
    // --------------------------------------------------

    if (
      !code ||
      !discountType ||
      discountValue === undefined ||
      !startDate ||
      !expiryDate
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required coupon details.",
      });
    }

    // --------------------------------------------------
    // VALIDATE DISCOUNT TYPE
    // --------------------------------------------------

    if (
      discountType !== "percentage" &&
      discountType !== "fixed"
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid discount type.",
      });
    }

    // --------------------------------------------------
    // VALIDATE DISCOUNT VALUE
    // --------------------------------------------------

    if (Number(discountValue) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Discount value must be greater than 0.",
      });
    }

    // Percentage cannot be greater than 100
    if (
      discountType === "percentage" &&
      Number(discountValue) > 100
    ) {
      return res.status(400).json({
        success: false,
        message: "Percentage discount cannot exceed 100%.",
      });
    }

    // --------------------------------------------------
    // VALIDATE DATES
    // --------------------------------------------------

    const start = new Date(startDate);
    const expiry = new Date(expiryDate);

    if (
      Number.isNaN(start.getTime()) ||
      Number.isNaN(expiry.getTime())
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid coupon dates.",
      });
    }

    if (expiry <= start) {
      return res.status(400).json({
        success: false,
        message:
          "Expiry date must be after the start date.",
      });
    }

    // --------------------------------------------------
    // CHECK EXISTING COUPON
    // --------------------------------------------------

    const existingCoupon = await couponModel.findOne({
      code: code.trim().toUpperCase(),
    });

    if (existingCoupon) {
      return res.status(409).json({
        success: false,
        message: "Coupon code already exists.",
      });
    }

    // --------------------------------------------------
    // CREATE COUPON
    // --------------------------------------------------

    const coupon = await couponModel.create({
      code: code.trim().toUpperCase(),

      discountType,

      discountValue: Number(discountValue),

      minimumAmount:
        minimumAmount !== undefined
          ? Number(minimumAmount)
          : 0,

      maximumDiscount:
        maximumDiscount !== undefined &&
        maximumDiscount !== "" &&
        maximumDiscount !== null
          ? Number(maximumDiscount)
          : null,

      startDate: start,

      expiryDate: expiry,

      usageLimit:
        usageLimit !== undefined &&
        usageLimit !== "" &&
        usageLimit !== null
          ? Number(usageLimit)
          : null,

      usedCount: 0,

      isActive: true,
    });

    return res.status(201).json({
      success: true,
      message: "Coupon created successfully.",
      coupon,
    });
  } catch (error) {
    console.error("Create Coupon Error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to create coupon.",
    });
  }
};

// ======================================================
// GET ALL COUPONS - ADMIN
// ======================================================

const getAllCoupons = async (req, res) => {
  try {
    const coupons = await couponModel
      .find({})
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      coupons,
    });
  } catch (error) {
    console.error("Get Coupons Error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to fetch coupons.",
    });
  }
};

// ======================================================
// GET SINGLE COUPON - ADMIN
// ======================================================

const getCouponById = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await couponModel.findById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    return res.status(200).json({
      success: true,
      coupon,
    });
  } catch (error) {
    console.error("Get Coupon Error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to fetch coupon.",
    });
  }
};

// ======================================================
// UPDATE COUPON - ADMIN
// ======================================================

const updateCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      code,
      discountType,
      discountValue,
      minimumAmount,
      maximumDiscount,
      startDate,
      expiryDate,
      usageLimit,
      isActive,
    } = req.body;

    // --------------------------------------------------
    // FIND COUPON
    // --------------------------------------------------

    const coupon = await couponModel.findById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    // --------------------------------------------------
    // CODE
    // --------------------------------------------------

    if (code !== undefined) {
      const newCode = code.trim().toUpperCase();

      const duplicateCoupon =
        await couponModel.findOne({
          code: newCode,
          _id: { $ne: id },
        });

      if (duplicateCoupon) {
        return res.status(409).json({
          success: false,
          message: "Coupon code already exists.",
        });
      }

      coupon.code = newCode;
    }

    // --------------------------------------------------
    // DISCOUNT TYPE
    // --------------------------------------------------

    if (discountType !== undefined) {
      if (
        discountType !== "percentage" &&
        discountType !== "fixed"
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid discount type.",
        });
      }

      coupon.discountType = discountType;
    }

    // --------------------------------------------------
    // DISCOUNT VALUE
    // --------------------------------------------------

    if (discountValue !== undefined) {
      const value = Number(discountValue);

      if (value <= 0) {
        return res.status(400).json({
          success: false,
          message:
            "Discount value must be greater than 0.",
        });
      }

      const type =
        discountType || coupon.discountType;

      if (
        type === "percentage" &&
        value > 100
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Percentage discount cannot exceed 100%.",
        });
      }

      coupon.discountValue = value;
    }

    // --------------------------------------------------
    // MINIMUM AMOUNT
    // --------------------------------------------------

    if (minimumAmount !== undefined) {
      coupon.minimumAmount = Number(
        minimumAmount
      );
    }

    // --------------------------------------------------
    // MAXIMUM DISCOUNT
    // --------------------------------------------------

    if (maximumDiscount !== undefined) {
      coupon.maximumDiscount =
        maximumDiscount === "" ||
        maximumDiscount === null
          ? null
          : Number(maximumDiscount);
    }

    // --------------------------------------------------
    // START DATE
    // --------------------------------------------------

    if (startDate !== undefined) {
      coupon.startDate = new Date(startDate);
    }

    // --------------------------------------------------
    // EXPIRY DATE
    // --------------------------------------------------

    if (expiryDate !== undefined) {
      coupon.expiryDate = new Date(expiryDate);
    }

    // --------------------------------------------------
    // CHECK DATE VALIDITY
    // --------------------------------------------------

    if (coupon.expiryDate <= coupon.startDate) {
      return res.status(400).json({
        success: false,
        message:
          "Expiry date must be after start date.",
      });
    }

    // --------------------------------------------------
    // USAGE LIMIT
    // --------------------------------------------------

    if (usageLimit !== undefined) {
      coupon.usageLimit =
        usageLimit === "" ||
        usageLimit === null
          ? null
          : Number(usageLimit);
    }

    // --------------------------------------------------
    // ACTIVE STATUS
    // --------------------------------------------------

    if (isActive !== undefined) {
      coupon.isActive = Boolean(isActive);
    }

    await coupon.save();

    return res.status(200).json({
      success: true,
      message: "Coupon updated successfully.",
      coupon,
    });
  } catch (error) {
    console.error("Update Coupon Error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to update coupon.",
    });
  }
};

// ======================================================
// DELETE COUPON - ADMIN
// ======================================================

const deleteCoupon = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon =
      await couponModel.findByIdAndDelete(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Coupon deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Coupon Error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to delete coupon.",
    });
  }
};

// ======================================================
// TOGGLE COUPON STATUS - ADMIN
// ======================================================

const toggleCouponStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const coupon = await couponModel.findById(id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found.",
      });
    }

    coupon.isActive = !coupon.isActive;

    await coupon.save();

    return res.status(200).json({
      success: true,
      message: coupon.isActive
        ? "Coupon activated successfully."
        : "Coupon deactivated successfully.",
      coupon,
    });
  } catch (error) {
    console.error(
      "Toggle Coupon Status Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to update coupon status.",
    });
  }
};

// ======================================================
// APPLY / VALIDATE COUPON - CUSTOMER
// ======================================================

const applyCoupon = async (req, res) => {
  try {
    const { code, cartAmount } = req.body;

    // --------------------------------------------------
    // VALIDATION
    // --------------------------------------------------

    if (!code) {
      return res.status(400).json({
        success: false,
        message: "Please enter a coupon code.",
      });
    }

    const amount = Number(cartAmount);

    if (Number.isNaN(amount) || amount < 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid cart amount.",
      });
    }

    // --------------------------------------------------
    // FIND COUPON
    // --------------------------------------------------

    const coupon = await couponModel.findOne({
      code: code.trim().toUpperCase(),
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon code.",
      });
    }

    // --------------------------------------------------
    // ACTIVE CHECK
    // --------------------------------------------------

    if (!coupon.isActive) {
      return res.status(400).json({
        success: false,
        message: "This coupon is currently inactive.",
      });
    }

    // --------------------------------------------------
    // DATE CHECK
    // --------------------------------------------------

    const now = new Date();

    if (now < coupon.startDate) {
      return res.status(400).json({
        success: false,
        message:
          "This coupon is not active yet.",
      });
    }

    if (now > coupon.expiryDate) {
      return res.status(400).json({
        success: false,
        message: "This coupon has expired.",
      });
    }

    // --------------------------------------------------
    // USAGE LIMIT
    // --------------------------------------------------

    if (
      coupon.usageLimit !== null &&
      coupon.usedCount >= coupon.usageLimit
    ) {
      return res.status(400).json({
        success: false,
        message:
          "This coupon usage limit has been reached.",
      });
    }

    // --------------------------------------------------
    // MINIMUM ORDER AMOUNT
    // --------------------------------------------------

    if (amount < coupon.minimumAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount is ₹${coupon.minimumAmount}.`,
      });
    }

    // --------------------------------------------------
    // CALCULATE DISCOUNT
    // --------------------------------------------------

    let discountAmount = 0;

    if (
      coupon.discountType === "percentage"
    ) {
      discountAmount =
        (amount * coupon.discountValue) /
        100;

      // Apply maximum discount
      if (
        coupon.maximumDiscount !== null &&
        discountAmount >
          coupon.maximumDiscount
      ) {
        discountAmount =
          coupon.maximumDiscount;
      }
    } else {
      discountAmount =
        coupon.discountValue;
    }

    // Never discount more than cart amount
    discountAmount = Math.min(
      discountAmount,
      amount
    );

    const finalAmount =
      amount - discountAmount;

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    return res.status(200).json({
      success: true,
      message: "Coupon applied successfully.",

      coupon: {
        id: coupon._id,
        code: coupon.code,
        discountType:
          coupon.discountType,
        discountValue:
          coupon.discountValue,
      },

      discountAmount,

      finalAmount,
    });
  } catch (error) {
    console.error("Apply Coupon Error:", error);

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to apply coupon.",
    });
  }
};

// ======================================================
// EXPORT CONTROLLERS
// ======================================================

export {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  toggleCouponStatus,
  applyCoupon,
};