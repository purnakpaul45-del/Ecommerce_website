import dotenv from "dotenv";
dotenv.config();

import crypto from "crypto";
import Razorpay from "razorpay";
import Stripe from "stripe";

import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

// ======================================================
// STRIPE CONFIGURATION
// ======================================================

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

console.log(
  "Stripe Secret Key:",
  stripeSecretKey ? "LOADED" : "NOT LOADED"
);

const stripe = stripeSecretKey
  ? new Stripe(stripeSecretKey)
  : null;

// ======================================================
// RAZORPAY CONFIGURATION
// ======================================================

const razorpayKeyId = process.env.RAZORPAY_KEY_ID;
const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET;

console.log(
  "Razorpay Key ID:",
  razorpayKeyId ? "LOADED" : "NOT LOADED"
);

console.log(
  "Razorpay Secret:",
  razorpayKeySecret ? "LOADED" : "NOT LOADED"
);

const razorpay =
  razorpayKeyId && razorpayKeySecret
    ? new Razorpay({
        key_id: razorpayKeyId,
        key_secret: razorpayKeySecret,
      })
    : null;

// ======================================================
// COMMON ADDRESS VALIDATION
// ======================================================

const validateAddress = (address) => {
  if (!address) {
    return "Delivery address is required.";
  }

  const requiredFields = [
    "firstName",
    "lastName",
    "email",
    "street",
    "city",
    "state",
    "pincode",
    "country",
    "phone",
  ];

  for (const field of requiredFields) {
    if (
      !address[field] ||
      !String(address[field]).trim()
    ) {
      return `${field} is required.`;
    }
  }

  return null;
};

// ======================================================
// COMMON ITEM VALIDATION
// ======================================================

const validateItems = (items) => {
  if (
    !items ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    return "No items found in cart.";
  }

  for (const item of items) {
    if (!item.name) {
      return "Product name is missing.";
    }

    if (
      item.price === undefined ||
      item.price === null ||
      Number(item.price) <= 0
    ) {
      return `Invalid price for product: ${
        item.name || "Unknown Product"
      }`;
    }

    if (
      item.quantity === undefined ||
      Number(item.quantity) <= 0
    ) {
      return `Invalid quantity for product: ${
        item.name || "Unknown Product"
      }`;
    }

    if (!item.size) {
      return `Size is required for product: ${
        item.name || "Unknown Product"
      }`;
    }
  }

  return null;
};

// ======================================================
// PLACE COD ORDER
// ======================================================

const placeOrder = async (req, res) => {
  try {
    const {
      items,
      amount,
      address,
    } = req.body;

    const userId = req.userId;

    console.log("========== COD ORDER ==========");
    console.log("User ID:", userId);
    console.log("Amount:", amount);

    // --------------------------------------------------
    // AUTHENTICATION
    // --------------------------------------------------

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated.",
      });
    }

    // --------------------------------------------------
    // ITEMS
    // --------------------------------------------------

    const itemsError = validateItems(items);

    if (itemsError) {
      return res.status(400).json({
        success: false,
        message: itemsError,
      });
    }

    // --------------------------------------------------
    // AMOUNT
    // --------------------------------------------------

    const numericAmount = Number(amount);

    if (
      !Number.isFinite(numericAmount) ||
      numericAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid order amount.",
      });
    }

    // --------------------------------------------------
    // ADDRESS
    // --------------------------------------------------

    const addressError =
      validateAddress(address);

    if (addressError) {
      return res.status(400).json({
        success: false,
        message: addressError,
      });
    }

    // --------------------------------------------------
    // CREATE ORDER
    // --------------------------------------------------

    const orderData = {
      userId,

      items,

      amount: numericAmount,

      address: {
        firstName: address.firstName,
        lastName: address.lastName,
        email: address.email,
        street: address.street,
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        country: address.country,
        phone: address.phone,
      },

      paymentMethod: "COD",

      payment: false,

      paymentStatus: "Pending",

      status: "Order Placed",

      date: Date.now(),
    };

    const newOrder =
      new orderModel(orderData);

    const savedOrder =
      await newOrder.save();

    console.log(
      "COD Order Saved:",
      savedOrder._id
    );

    // --------------------------------------------------
    // CLEAR USER CART
    // --------------------------------------------------

    await userModel.findByIdAndUpdate(
      userId,
      {
        cartData: {},
      }
    );

    console.log(
      "COD cart cleared."
    );

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    return res.status(201).json({
      success: true,
      message: "Order placed successfully.",
      order: savedOrder,
    });

  } catch (error) {
    console.error(
      "Place COD Order Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to place order.",
    });
  }
};

// ======================================================
// PLACE STRIPE ORDER
// ======================================================

const placeOrderStripe = async (
  req,
  res
) => {
  try {
    const {
      items,
      amount,
      address,
    } = req.body;

    const userId = req.userId;

    console.log(
      "========== STRIPE ORDER =========="
    );

    // --------------------------------------------------
    // CHECK STRIPE
    // --------------------------------------------------

    if (!stripe) {
      return res.status(500).json({
        success: false,
        message:
          "Stripe is not configured on the server.",
      });
    }

    // --------------------------------------------------
    // AUTHENTICATION
    // --------------------------------------------------

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "User not authenticated.",
      });
    }

    // --------------------------------------------------
    // ITEMS
    // --------------------------------------------------

    const itemsError =
      validateItems(items);

    if (itemsError) {
      return res.status(400).json({
        success: false,
        message: itemsError,
      });
    }

    // --------------------------------------------------
    // AMOUNT
    // --------------------------------------------------

    const numericAmount =
      Number(amount);

    if (
      !Number.isFinite(
        numericAmount
      ) ||
      numericAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid order amount.",
      });
    }

    // --------------------------------------------------
    // ADDRESS
    // --------------------------------------------------

    const addressError =
      validateAddress(address);

    if (addressError) {
      return res.status(400).json({
        success: false,
        message: addressError,
      });
    }

    // --------------------------------------------------
    // CREATE MONGODB ORDER
    // --------------------------------------------------

    const orderData = {
      userId,

      items,

      amount: numericAmount,

      address: {
        firstName:
          address.firstName,

        lastName:
          address.lastName,

        email:
          address.email,

        street:
          address.street,

        city:
          address.city,

        state:
          address.state,

        pincode:
          address.pincode,

        country:
          address.country,

        phone:
          address.phone,
      },

      paymentMethod: "Stripe",

      payment: false,

      paymentStatus: "Pending",

      status: "Order Placed",

      date: Date.now(),
    };

    const newOrder =
      new orderModel(orderData);

    const savedOrder =
      await newOrder.save();

    // --------------------------------------------------
    // STRIPE LINE ITEMS
    // --------------------------------------------------

    const lineItems =
      items.map((item) => ({
        price_data: {
          currency: "inr",

          product_data: {
            name:
              item.name ||
              "Product",
          },

          unit_amount:
            Math.round(
              Number(item.price) * 100
            ),
        },

        quantity:
          Number(item.quantity),
      }));

    // --------------------------------------------------
    // FRONTEND URL
    // --------------------------------------------------

    const frontendUrl =
      process.env.FRONTEND_URL ||
      "http://localhost:5173";

    // --------------------------------------------------
    // CREATE STRIPE SESSION
    // --------------------------------------------------

    const session =
      await stripe.checkout.sessions.create({
        payment_method_types: [
          "card",
        ],

        mode: "payment",

        line_items:
          lineItems,

        customer_email:
          address.email,

        metadata: {
          orderId:
            savedOrder._id.toString(),

          userId:
            userId.toString(),
        },

        success_url:
          `${frontendUrl}/verify?success=true&orderId=${savedOrder._id}`,

        cancel_url:
          `${frontendUrl}/verify?success=false&orderId=${savedOrder._id}`,
      });

    // --------------------------------------------------
    // SAVE STRIPE SESSION
    // --------------------------------------------------

    await orderModel.findByIdAndUpdate(
      savedOrder._id,
      {
        stripeSessionId:
          session.id,
      }
    );

    return res.status(200).json({
      success: true,

      message:
        "Stripe checkout session created.",

      sessionId:
        session.id,

      url:
        session.url,

      orderId:
        savedOrder._id.toString(),
    });

  } catch (error) {
    console.error(
      "Stripe Order Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to create Stripe order.",
    });
  }
};

// ======================================================
// STRIPE WEBHOOK
// ======================================================

const stripeWebhook = async (
  req,
  res
) => {
  const signature =
    req.headers["stripe-signature"];

  let event;

  try {
    if (!stripe) {
      return res.status(500).send(
        "Stripe is not configured."
      );
    }

    event =
      stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env
          .STRIPE_WEBHOOK_SECRET
      );

  } catch (error) {
    console.error(
      "Stripe Webhook Error:",
      error.message
    );

    return res.status(400).send(
      `Webhook Error: ${error.message}`
    );
  }

  try {
    // --------------------------------------------------
    // PAYMENT COMPLETED
    // --------------------------------------------------

    if (
      event.type ===
      "checkout.session.completed"
    ) {
      const session =
        event.data.object;

      const orderId =
        session.metadata?.orderId;

      if (!orderId) {
        return res.json({
          received: true,
        });
      }

      const updatedOrder =
        await orderModel.findByIdAndUpdate(
          orderId,
          {
            payment: true,

            paymentStatus:
              "Paid",

            stripeSessionId:
              session.id,

            stripePaymentIntentId:
              session.payment_intent ||
              "",
          },
          {
            new: true,
          }
        );

      if (updatedOrder) {
        await userModel.findByIdAndUpdate(
          updatedOrder.userId,
          {
            cartData: {},
          }
        );

        console.log(
          "Stripe payment successful:",
          orderId
        );
      }
    }

    // --------------------------------------------------
    // SESSION EXPIRED
    // --------------------------------------------------

    if (
      event.type ===
      "checkout.session.expired"
    ) {
      const session =
        event.data.object;

      const orderId =
        session.metadata?.orderId;

      if (orderId) {
        await orderModel.findByIdAndUpdate(
          orderId,
          {
            payment: false,
            paymentStatus:
              "Failed",
          }
        );
      }
    }

    return res.json({
      received: true,
    });

  } catch (error) {
    console.error(
      "Stripe Webhook Processing Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message,
    });
  }
};

// ======================================================
// CREATE RAZORPAY ORDER
// ======================================================

const placeOrderRazorpay = async (
  req,
  res
) => {
  try {
    const {
      items,
      amount,
      address,
    } = req.body;

    const userId = req.userId;

    console.log(
      "========== RAZORPAY ORDER =========="
    );

    console.log(
      "User ID:",
      userId
    );

    console.log(
      "Amount:",
      amount
    );

    // --------------------------------------------------
    // CHECK RAZORPAY CONFIG
    // --------------------------------------------------

    if (!razorpay) {
      console.error(
        "Razorpay is not configured."
      );

      return res.status(500).json({
        success: false,
        message:
          "Razorpay is not configured on the server.",
      });
    }

    if (
      !razorpayKeyId ||
      !razorpayKeySecret
    ) {
      return res.status(500).json({
        success: false,
        message:
          "Razorpay credentials are missing.",
      });
    }

    // --------------------------------------------------
    // AUTHENTICATION
    // --------------------------------------------------

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "User not authenticated.",
      });
    }

    // --------------------------------------------------
    // ITEMS
    // --------------------------------------------------

    const itemsError =
      validateItems(items);

    if (itemsError) {
      return res.status(400).json({
        success: false,
        message: itemsError,
      });
    }

    // --------------------------------------------------
    // AMOUNT
    // --------------------------------------------------

    const numericAmount =
      Number(amount);

    if (
      !Number.isFinite(
        numericAmount
      ) ||
      numericAmount <= 0
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid order amount.",
      });
    }

    // --------------------------------------------------
    // ADDRESS
    // --------------------------------------------------

    const addressError =
      validateAddress(address);

    if (addressError) {
      return res.status(400).json({
        success: false,
        message: addressError,
      });
    }

    // --------------------------------------------------
    // CONVERT INR TO PAISE
    // --------------------------------------------------

    const razorpayAmount =
      Math.round(
        numericAmount * 100
      );

    // --------------------------------------------------
    // CREATE MONGODB ORDER
    // --------------------------------------------------

    const orderData = {
      userId,

      items,

      amount:
        numericAmount,

      address: {
        firstName:
          address.firstName,

        lastName:
          address.lastName,

        email:
          address.email,

        street:
          address.street,

        city:
          address.city,

        state:
          address.state,

        pincode:
          address.pincode,

        country:
          address.country,

        phone:
          address.phone,
      },

      paymentMethod:
        "Razorpay",

      payment: false,

      paymentStatus:
        "Pending",

      status:
        "Order Placed",

      date: Date.now(),
    };

    const newOrder =
      new orderModel(orderData);

    const savedOrder =
      await newOrder.save();

    console.log(
      "MongoDB Order Saved:",
      savedOrder._id
    );

    // --------------------------------------------------
    // CREATE RAZORPAY ORDER
    // --------------------------------------------------

    const razorpayOrder =
      await razorpay.orders.create({
        amount:
          razorpayAmount,

        currency:
          "INR",

        receipt:
          savedOrder._id.toString(),

        notes: {
          mongoOrderId:
            savedOrder._id.toString(),

          userId:
            userId.toString(),
        },
      });

    console.log(
      "Razorpay Order Created:",
      razorpayOrder.id
    );

    // --------------------------------------------------
    // SAVE RAZORPAY ORDER ID
    // --------------------------------------------------

    await orderModel.findByIdAndUpdate(
      savedOrder._id,
      {
        razorpayOrderId:
          razorpayOrder.id,
      }
    );

    // --------------------------------------------------
    // RESPONSE TO FRONTEND
    // --------------------------------------------------

    return res.status(200).json({
      success: true,

      message:
        "Razorpay order created successfully.",

      key:
        razorpayKeyId,

      razorpayOrderId:
        razorpayOrder.id,

      amount:
        razorpayOrder.amount,

      currency:
        razorpayOrder.currency,

      orderId:
        savedOrder._id.toString(),

      name:
        `${address.firstName} ${address.lastName}`,

      email:
        address.email,

      phone:
        address.phone,
    });

  } catch (error) {
    console.error(
      "Razorpay Order Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to create Razorpay order.",
    });
  }
};

// ======================================================
// VERIFY RAZORPAY PAYMENT
// ======================================================

const verifyRazorpayPayment = async (
  req,
  res
) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;

    const userId =
      req.userId;

    console.log(
      "========== VERIFY RAZORPAY PAYMENT =========="
    );

    // --------------------------------------------------
    // AUTHENTICATION
    // --------------------------------------------------

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "User not authenticated.",
      });
    }

    // --------------------------------------------------
    // RAZORPAY CONFIG
    // --------------------------------------------------

    if (
      !razorpayKeySecret
    ) {
      return res.status(500).json({
        success: false,
        message:
          "Razorpay secret key is missing.",
      });
    }

    // --------------------------------------------------
    // PAYMENT DATA
    // --------------------------------------------------

    if (
      !razorpay_payment_id ||
      !razorpay_order_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Incomplete Razorpay payment information.",
      });
    }

    // --------------------------------------------------
    // FIND ORDER
    // --------------------------------------------------

    const order =
      await orderModel.findOne({
        razorpayOrderId:
          razorpay_order_id,

        userId,
      });

    if (!order) {
      return res.status(404).json({
        success: false,
        message:
          "Razorpay order not found.",
      });
    }

    // --------------------------------------------------
    // PREVENT DUPLICATE VERIFICATION
    // --------------------------------------------------

    if (order.payment === true) {
      return res.status(200).json({
        success: true,
        message:
          "Payment already verified.",
        order,
      });
    }

    // --------------------------------------------------
    // GENERATE EXPECTED SIGNATURE
    // --------------------------------------------------

    const body =
      `${razorpay_order_id}|${razorpay_payment_id}`;

    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          razorpayKeySecret
        )
        .update(body)
        .digest("hex");

    // --------------------------------------------------
    // COMPARE SIGNATURE
    // --------------------------------------------------

    const expectedBuffer =
      Buffer.from(
        expectedSignature,
        "utf8"
      );

    const receivedBuffer =
      Buffer.from(
        razorpay_signature,
        "utf8"
      );

    if (
      expectedBuffer.length !==
      receivedBuffer.length
    ) {
      await orderModel.findByIdAndUpdate(
        order._id,
        {
          payment: false,
          paymentStatus:
            "Failed",
        }
      );

      return res.status(400).json({
        success: false,
        message:
          "Invalid Razorpay payment signature.",
      });
    }

    const signatureValid =
      crypto.timingSafeEqual(
        expectedBuffer,
        receivedBuffer
      );

    if (!signatureValid) {
      await orderModel.findByIdAndUpdate(
        order._id,
        {
          payment: false,
          paymentStatus:
            "Failed",
        }
      );

      return res.status(400).json({
        success: false,
        message:
          "Payment verification failed.",
      });
    }

    console.log(
      "Razorpay signature verified successfully."
    );

    // --------------------------------------------------
    // UPDATE PAYMENT
    // --------------------------------------------------

    const updatedOrder =
      await orderModel.findByIdAndUpdate(
        order._id,
        {
          payment: true,

          paymentStatus:
            "Paid",

          razorpayPaymentId:
            razorpay_payment_id,

          razorpaySignature:
            razorpay_signature,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    // --------------------------------------------------
    // CLEAR CART
    // --------------------------------------------------

    await userModel.findByIdAndUpdate(
      userId,
      {
        cartData: {},
      }
    );

    console.log(
      "Razorpay payment successful."
    );

    console.log(
      "Cart cleared."
    );

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    return res.status(200).json({
      success: true,

      message:
        "Razorpay payment verified successfully.",

      order:
        updatedOrder,
    });

  } catch (error) {
    console.error(
      "Razorpay Verification Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Payment verification failed.",
    });
  }
};

// ======================================================
// GET ALL ORDERS - ADMIN
// ======================================================

const allorders = async (
  req,
  res
) => {
  try {
    const orders =
      await orderModel
        .find({})
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      orders,
    });

  } catch (error) {
    console.error(
      "All Orders Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to fetch orders.",
    });
  }
};

// ======================================================
// GET USER ORDERS
// ======================================================

const userOrders = async (
  req,
  res
) => {
  try {
    const userId =
      req.userId;

    console.log(
      "Getting orders for user:",
      userId
    );

    if (!userId) {
      return res.status(401).json({
        success: false,
        message:
          "User not authenticated.",
      });
    }

    const orders =
      await orderModel
        .find({
          userId,
        })
        .sort({
          createdAt: -1,
        });

    return res.status(200).json({
      success: true,
      orders,
    });

  } catch (error) {
    console.error(
      "User Orders Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to fetch user orders.",
    });
  }
};

// ======================================================
// UPDATE ORDER STATUS - ADMIN
// ======================================================

const updateStatus = async (
  req,
  res
) => {
  try {
    const {
      orderId,
      status,
    } = req.body;

    // --------------------------------------------------
    // VALIDATION
    // --------------------------------------------------

    if (!orderId || !status) {
      return res.status(400).json({
        success: false,
        message:
          "Order ID and status are required.",
      });
    }

    // --------------------------------------------------
    // ALLOWED STATUSES
    // --------------------------------------------------

    const allowedStatuses = [
      "Order Placed",
      "Processing",
      "Packed",
      "Shipped",
      "Out for Delivery",
      "Delivered",
      "Cancelled",
    ];

    if (
      !allowedStatuses.includes(
        status
      )
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Invalid order status.",
      });
    }

    // --------------------------------------------------
    // UPDATE ORDER
    // --------------------------------------------------

    const updatedOrder =
      await orderModel.findByIdAndUpdate(
        orderId,
        {
          status,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message:
          "Order not found.",
      });
    }

    console.log(
      `Order ${orderId} status changed to ${status}`
    );

    return res.status(200).json({
      success: true,

      message:
        "Order status updated successfully.",

      order:
        updatedOrder,
    });

  } catch (error) {
    console.error(
      "Update Status Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        error.message ||
        "Unable to update order status.",
    });
  }
};

// ======================================================
// EXPORT
// ======================================================

export {
  placeOrder,
  placeOrderStripe,
  stripeWebhook,

  placeOrderRazorpay,
  verifyRazorpayPayment,

  allorders,
  userOrders,
  updateStatus,
};