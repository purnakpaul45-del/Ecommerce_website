import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import adminModel from "../models/adminModel.js";
import orderModel from "../models/orderModel.js";

// ======================================================
// ADMIN LOGIN
// ======================================================

const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(
      "========== ADMIN LOGIN =========="
    );

    console.log("Email:", email);

    // --------------------------------------------------
    // VALIDATE INPUT
    // --------------------------------------------------

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message:
          "Please enter email and password.",
      });
    }

    // --------------------------------------------------
    // FIND ADMIN
    // --------------------------------------------------

    const admin = await adminModel.findOne({
      email: email.trim().toLowerCase(),
    });

    if (!admin) {
      console.log("Admin not found");

      return res.status(401).json({
        success: false,
        message:
          "Invalid admin email or password.",
      });
    }

    // --------------------------------------------------
    // CHECK PASSWORD
    // --------------------------------------------------

    const isPasswordValid =
      await bcrypt.compare(
        password,
        admin.password
      );

    if (!isPasswordValid) {
      console.log(
        "Invalid admin password"
      );

      return res.status(401).json({
        success: false,
        message:
          "Invalid admin email or password.",
      });
    }

    // --------------------------------------------------
    // CREATE ADMIN JWT
    // --------------------------------------------------

    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: "admin",
      },

      process.env.JWT_SECRET ||
        "my_admin_secret_key",

      {
        expiresIn: "7d",
      }
    );

    console.log(
      "Admin login successful"
    );

    // --------------------------------------------------
    // RESPONSE
    // --------------------------------------------------

    return res.status(200).json({
      success: true,

      message:
        "Admin login successful.",

      token,

      admin: {
        id: admin._id,
        email: admin.email,
        role: "admin",
      },
    });
  } catch (error) {
    console.error(
      "Admin Login Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message:
        "Internal server error.",
    });
  }
};

// ======================================================
// ADMIN DASHBOARD STATISTICS
// ======================================================

const getDashboardStats = async (
  req,
  res
) => {
  try {
    console.log(
      "========== ADMIN DASHBOARD =========="
    );

    // ==================================================
    // GET ALL ORDERS
    // ==================================================

    const orders =
      await orderModel
        .find({})
        .sort({
          createdAt: -1,
        });

    console.log(
      "Total orders:",
      orders.length
    );

    // ==================================================
    // TOTAL ORDERS
    // ==================================================

    const totalOrders =
      orders.length;

    // ==================================================
    // PAID ORDERS
    // ==================================================

    const paidOrders =
      orders.filter(
        (order) =>
          order.payment === true ||
          order.paymentStatus ===
            "Paid"
      );

    // ==================================================
    // PENDING ORDERS
    // ==================================================

    const pendingOrders =
      orders.filter(
        (order) =>
          order.paymentStatus ===
          "Pending"
      );

    // ==================================================
    // FAILED ORDERS
    // ==================================================

    const failedOrders =
      orders.filter(
        (order) =>
          order.paymentStatus ===
          "Failed"
      );

    // ==================================================
    // TOTAL REVENUE
    // ==================================================
    //
    // Only successfully paid orders
    // are counted as revenue.
    //
    // ==================================================

    const totalRevenue =
      paidOrders.reduce(
        (total, order) => {
          return (
            total +
            Number(order.amount || 0)
          );
        },
        0
      );

    // ==================================================
    // PAYMENT METHOD COUNTS
    // ==================================================

    const codOrders =
      orders.filter(
        (order) =>
          order.paymentMethod ===
          "COD"
      );

    const razorpayOrders =
      orders.filter(
        (order) =>
          order.paymentMethod ===
          "Razorpay"
      );

    const stripeOrders =
      orders.filter(
        (order) =>
          order.paymentMethod ===
          "Stripe"
      );

    // ==================================================
    // ORDER STATUS COUNTS
    // ==================================================

    const orderStatus = {
      orderPlaced: 0,
      packing: 0,
      shipped: 0,
      outForDelivery: 0,
      delivered: 0,
      cancelled: 0,
    };

    orders.forEach((order) => {
      const status =
        order.status;

      switch (status) {
        case "Order Placed":
          orderStatus.orderPlaced++;
          break;

        case "Packing":
          orderStatus.packing++;
          break;

        case "Shipped":
          orderStatus.shipped++;
          break;

        case "Out for Delivery":
          orderStatus.outForDelivery++;
          break;

        case "Delivered":
          orderStatus.delivered++;
          break;

        case "Cancelled":
        case "Canceled":
          orderStatus.cancelled++;
          break;

        default:
          break;
      }
    });

    // ==================================================
    // TODAY
    // ==================================================

    const now = new Date();

    const todayStart =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );

    const tomorrowStart =
      new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1
      );

    // ==================================================
    // TODAY'S ORDERS
    // ==================================================

    const todayOrders =
      orders.filter((order) => {
        const orderDate =
          new Date(
            order.date ||
              order.createdAt
          );

        return (
          orderDate >= todayStart &&
          orderDate < tomorrowStart
        );
      });

    // ==================================================
    // TODAY'S REVENUE
    // ==================================================

    const todayRevenue =
      paidOrders
        .filter((order) => {
          const orderDate =
            new Date(
              order.date ||
                order.createdAt
            );

          return (
            orderDate >= todayStart &&
            orderDate < tomorrowStart
          );
        })
        .reduce(
          (total, order) => {
            return (
              total +
              Number(
                order.amount || 0
              )
            );
          },
          0
        );

    // ==================================================
    // LAST 7 DAYS REVENUE
    // ==================================================

    const revenueByDate = [];

    for (
      let i = 6;
      i >= 0;
      i--
    ) {
      const date =
        new Date();

      date.setHours(
        0,
        0,
        0,
        0
      );

      date.setDate(
        date.getDate() - i
      );

      const nextDate =
        new Date(date);

      nextDate.setDate(
        nextDate.getDate() + 1
      );

      const revenue =
        paidOrders
          .filter((order) => {
            const orderDate =
              new Date(
                order.date ||
                  order.createdAt
              );

            return (
              orderDate >= date &&
              orderDate < nextDate
            );
          })
          .reduce(
            (total, order) => {
              return (
                total +
                Number(
                  order.amount || 0
                )
              );
            },
            0
          );

      revenueByDate.push({
        date:
          date
            .toISOString()
            .split("T")[0],

        revenue,
      });
    }

    // ==================================================
    // RECENT ORDERS
    // ==================================================

    const recentOrders =
      orders
        .slice(0, 10)
        .map((order) => ({
          _id: order._id,

          userId:
            order.userId,

          amount:
            order.amount,

          payment:
            order.payment,

          paymentStatus:
            order.paymentStatus,

          paymentMethod:
            order.paymentMethod,

          status:
            order.status,

          date:
            order.date,

          createdAt:
            order.createdAt,

          address:
            order.address,

          items:
            order.items,
        }));

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,

      stats: {
        totalOrders,

        totalRevenue,

        todayOrders:
          todayOrders.length,

        todayRevenue,

        paidOrders:
          paidOrders.length,

        pendingOrders:
          pendingOrders.length,

        failedOrders:
          failedOrders.length,

        codOrders:
          codOrders.length,

        razorpayOrders:
          razorpayOrders.length,

        stripeOrders:
          stripeOrders.length,

        orderStatus,
      },

      revenueByDate,

      recentOrders,
    });
  } catch (error) {
    console.error(
      "Dashboard Stats Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to load dashboard statistics.",
    });
  }
};

// ======================================================
// EXPORT
// ======================================================

export {
  adminLogin,
  getDashboardStats,
};