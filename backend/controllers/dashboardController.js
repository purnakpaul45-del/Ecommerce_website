
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import ProductModel from "../models/ProductModel.js";

// ======================================================
// GET ADMIN DASHBOARD DATA
// ======================================================

const getDashboardData = async (req, res) => {
  try {
    console.log("=================================");
    console.log("ADMIN DASHBOARD REQUEST");
    console.log("=================================");

    // ==================================================
    // TOTAL PRODUCTS
    // ==================================================

    const totalProducts = await ProductModel.countDocuments();

    // ==================================================
    // TOTAL CUSTOMERS
    // ==================================================

    const totalCustomers = await userModel.countDocuments();

    // ==================================================
    // TOTAL ORDERS
    // ==================================================

    const totalOrders = await orderModel.countDocuments();

    // ==================================================
    // TOTAL REVENUE
    // Only Delivered orders count as revenue
    // ==================================================

    const revenueResult = await orderModel.aggregate([
      {
        $match: {
          status: "Delivered",
        },
      },

      {
        $group: {
          _id: null,

          totalRevenue: {
            $sum: "$amount",
          },
        },
      },
    ]);

    const totalRevenue =
      revenueResult.length > 0
        ? revenueResult[0].totalRevenue
        : 0;

    // ==================================================
    // RECENT ORDERS
    // Show all recent orders
    // ==================================================

    const recentOrders = await orderModel
      .find({})
      .sort({ createdAt: -1 })
      .limit(5)
      .lean();

    // ==================================================
    // FORMAT RECENT ORDERS
    // ==================================================

    const formattedOrders = recentOrders.map((order) => {
      const totalItems = order.items.reduce(
        (total, item) => total + item.quantity,
        0
      );

      return {
        id: order._id,
        orderId: order._id,

        customer:
          `${order.address?.firstName || ""} ${
            order.address?.lastName || ""
          }`.trim() || "Customer",

        items: `${totalItems} ${
          totalItems === 1 ? "Item" : "Items"
        }`,

        amount: order.amount,

        status: order.status,

        paymentStatus: order.paymentStatus,

        paymentMethod: order.paymentMethod,

        createdAt: order.createdAt,
      };
    });

    // ==================================================
    // TOP SELLING PRODUCTS
    // Only Delivered orders count as sales
    // ==================================================

    const topProducts = await orderModel.aggregate([
      {
        $match: {
          status: "Delivered",
        },
      },

      {
        $unwind: "$items",
      },

      {
        $group: {
          _id: "$items._id",

          name: {
            $first: "$items.name",
          },

          image: {
            $first: "$items.image",
          },

          sales: {
            $sum: "$items.quantity",
          },

          revenue: {
            $sum: {
              $multiply: [
                "$items.price",
                "$items.quantity",
              ],
            },
          },
        },
      },

      {
        $sort: {
          sales: -1,
        },
      },

      {
        $limit: 5,
      },
    ]);

    // ==================================================
    // SALES OVERVIEW - LAST 7 DAYS
    // Only Delivered orders count
    // ==================================================

    const sevenDaysAgo = new Date();

    sevenDaysAgo.setDate(
      sevenDaysAgo.getDate() - 6
    );

    sevenDaysAgo.setHours(
      0,
      0,
      0,
      0
    );

    const salesData = await orderModel.aggregate([
      {
        $match: {
          createdAt: {
            $gte: sevenDaysAgo,
          },

          status: "Delivered",
        },
      },

      {
        $group: {
          _id: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt",
            },
          },

          revenue: {
            $sum: "$amount",
          },

          orders: {
            $sum: 1,
          },
        },
      },

      {
        $sort: {
          _id: 1,
        },
      },
    ]);

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,

      data: {
        totalProducts,

        totalCustomers,

        totalOrders,

        totalRevenue,

        recentOrders: formattedOrders,

        topProducts,

        salesData,
      },
    });
  } catch (error) {
    console.error(
      "Dashboard Controller Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        "Failed to load dashboard data.",

      error: error.message,
    });
  }
};

// ======================================================
// EXPORT
// ======================================================

export {
  getDashboardData,
};

