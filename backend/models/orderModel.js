
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    // ======================================================
    // USER WHO PLACED THE ORDER
    // ======================================================

    userId: {
      type: String,
      required: true,
    },

    // ======================================================
    // ORDERED PRODUCTS
    // ======================================================

    items: [
      {
        _id: {
          type: String,
          required: true,
        },

        name: {
          type: String,
          required: true,
        },

        image: {
          type: Array,
          required: true,
        },

        price: {
          type: Number,
          required: true,
        },

        quantity: {
          type: Number,
          required: true,
          min: 1,
        },

        size: {
          type: String,
          required: true,
        },
      },
    ],

    // ======================================================
    // DELIVERY ADDRESS
    // ======================================================

    address: {
      firstName: {
        type: String,
        required: true,
      },

      lastName: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
      },

      street: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },

      pincode: {
        type: String,
        required: true,
      },

      country: {
        type: String,
        required: true,
      },

      phone: {
        type: String,
        required: true,
      },
    },

    // ======================================================
    // TOTAL ORDER AMOUNT
    // ======================================================

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    // ======================================================
    // PAYMENT METHOD
    // ======================================================

    paymentMethod: {
      type: String,

      enum: [
        "COD",
        "Razorpay",
        "Stripe",
      ],

      default: "COD",
    },

    // ======================================================
    // PAYMENT STATUS
    // ======================================================

    payment: {
      type: Boolean,
      default: false,
    },

    // ======================================================
    // PAYMENT STATUS TEXT
    // ======================================================

    paymentStatus: {
      type: String,

      enum: [
        "Pending",
        "Paid",
        "Failed",
        "Refunded",
      ],

      default: "Pending",
    },

    // ======================================================
    // STRIPE INFORMATION
    // ======================================================

    stripeSessionId: {
      type: String,
      default: "",
    },

    stripePaymentIntentId: {
      type: String,
      default: "",
    },

    // ======================================================
    // RAZORPAY INFORMATION
    // ======================================================

    razorpayOrderId: {
      type: String,
      default: "",
    },

    razorpayPaymentId: {
      type: String,
      default: "",
    },

    razorpaySignature: {
      type: String,
      default: "",
    },

    // ======================================================
    // ORDER STATUS
    // ======================================================

    status: {
      type: String,

      enum: [
        "Order Placed",
        "Processing",
        "Packed",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],

      default: "Order Placed",
    },

    // ======================================================
    // ORDER DATE
    // ======================================================

    date: {
      type: Number,
      default: Date.now,
    },
  },

  {
    timestamps: true,
  }
);

// ======================================================
// MODEL
// ======================================================

const orderModel =
  mongoose.models.order ||
  mongoose.model("order", orderSchema);

export default orderModel;

