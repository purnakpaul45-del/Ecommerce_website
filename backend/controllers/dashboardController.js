import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import ProductModel from "../models/ProductModel.js";

// ======================================================
// GET ADMIN DASHBOARD + ANALYTICS DATA
// ======================================================

const getDashboardData = async (req, res) => {
  try {
    // ==================================================
    // PERIOD
    // ==================================================

    const requestedPeriod = Number(req.query.period || 7);

    const allowedPeriods = [7, 30, 90, 365];

    const period = allowedPeriods.includes(
      requestedPeriod
    )
      ? requestedPeriod
      : 7;

    // ==================================================
    // BASIC COUNTS
    // ==================================================

    const totalProducts =
      await ProductModel.countDocuments();

    const totalCustomers =
      await userModel.countDocuments();

    const totalOrders =
      await orderModel.countDocuments();

    // ==================================================
    // TOTAL REVENUE
    //
    // ONLY DELIVERED ORDERS
    // ==================================================

    const revenueResult =
      await orderModel.aggregate([
        {
          $match: {
            status: "Delivered",
          },
        },

        {
          $group: {
            _id: null,

            totalRevenue: {
              $sum: {
                $ifNull: ["$amount", 0],
              },
            },
          },
        },
      ]);

    const totalRevenue =
      revenueResult.length > 0
        ? Number(
            revenueResult[0].totalRevenue || 0
          )
        : 0;

    // ==================================================
    // RECENT ORDERS
    // ==================================================

    const recentOrders =
      await orderModel
        .find({})
        .sort({ createdAt: -1 })
        .limit(5)
        .lean();

    const formattedOrders =
      recentOrders.map((order) => {
        const totalItems =
          (order.items || []).reduce(
            (total, item) =>
              total +
              Number(item.quantity || 0),
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
            totalItems === 1
              ? "Item"
              : "Items"
          }`,

          amount: Number(
            order.amount || 0
          ),

          status:
            order.status ||
            "Order Placed",

          paymentStatus:
            order.paymentStatus ||
            "Pending",

          paymentMethod:
            order.paymentMethod ||
            "COD",

          createdAt:
            order.createdAt,
        };
      });

    // ==================================================
    // TOP PRODUCTS
    //
    // ONLY DELIVERED ORDERS
    // ==================================================

    const topProducts =
      await orderModel.aggregate([
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
              $sum: {
                $ifNull: [
                  "$items.quantity",
                  0,
                ],
              },
            },

            revenue: {
              $sum: {
                $multiply: [
                  {
                    $ifNull: [
                      "$items.price",
                      0,
                    ],
                  },

                  {
                    $ifNull: [
                      "$items.quantity",
                      0,
                    ],
                  },
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
    // SALES / REVENUE PERFORMANCE
    //
    // ONLY DELIVERED ORDERS
    //
    // PERIOD:
    // 7 DAYS
    // 30 DAYS
    // 90 DAYS
    // 365 DAYS
    // ==================================================

    const startDate = new Date();

    startDate.setDate(
      startDate.getDate() -
        (period - 1)
    );

    startDate.setHours(
      0,
      0,
      0,
      0
    );

    const salesResult =
      await orderModel.aggregate([
        {
          $match: {
            status: "Delivered",

            createdAt: {
              $gte: startDate,
            },
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
              $sum: {
                $ifNull: [
                  "$amount",
                  0,
                ],
              },
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
    // CREATE COMPLETE DATE RANGE
    //
    // This ensures days with zero sales
    // still appear on the chart.
    // ==================================================

    const formattedSalesData = [];

    for (
      let i = period - 1;
      i >= 0;
      i--
    ) {
      const date = new Date();

      date.setDate(
        date.getDate() - i
      );

      date.setHours(
        0,
        0,
        0,
        0
      );

      const dateString =
        date
          .toISOString()
          .split("T")[0];

      const existing =
        salesResult.find(
          (item) =>
            item._id === dateString
        );

      formattedSalesData.push({
        date: dateString,

        day:
          period <= 30
            ? date.toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "short",
                }
              )
            : date.toLocaleDateString(
                "en-IN",
                {
                  month: "short",
                  day: "numeric",
                }
              ),

        amount:
          Number(
            existing?.revenue || 0
          ),

        orders:
          Number(
            existing?.orders || 0
          ),
      });
    }

    // ==================================================
    // ORDER STATUS
    //
    // ALL ORDERS
    // ==================================================

    const orderStatusResult =
      await orderModel.aggregate([
        {
          $group: {
            _id: "$status",

            value: {
              $sum: 1,
            },
          },
        },

        {
          $sort: {
            value: -1,
          },
        },
      ]);

    const orderStatusData =
      orderStatusResult.map(
        (item) => ({
          name:
            item._id ||
            "Order Placed",

          value:
            Number(
              item.value || 0
            ),
        })
      );

    // ==================================================
    // CATEGORY SALES
    //
    // ONLY DELIVERED ORDERS
    // ==================================================

    const categoryResult =
      await orderModel.aggregate([
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
            _id:
              "$items.category",

            sales: {
              $sum: {
                $multiply: [
                  {
                    $ifNull: [
                      "$items.price",
                      0,
                    ],
                  },

                  {
                    $ifNull: [
                      "$items.quantity",
                      0,
                    ],
                  },
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
      ]);

    const categoryData =
      categoryResult.map(
        (item) => ({
          category:
            item._id ||
            "Other",

          sales:
            Number(
              item.sales || 0
            ),
        })
      );

    // ==================================================
    // ORDER COUNTS
    // ==================================================

    const deliveredOrders =
      await orderModel.countDocuments({
        status: "Delivered",
      });

    const processingOrders =
      await orderModel.countDocuments({
        status: "Processing",
      });

    const shippedOrders =
      await orderModel.countDocuments({
        status: "Shipped",
      });

    const cancelledOrders =
      await orderModel.countDocuments({
        status: "Cancelled",
      });

    // ==================================================
    // AVERAGE ORDER VALUE
    // ==================================================

    const averageOrderValue =
      deliveredOrders > 0
        ? totalRevenue /
          deliveredOrders
        : 0;

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,

      data: {
        // ----------------------------------------------
        // BASIC DASHBOARD
        // ----------------------------------------------

        totalProducts,

        totalCustomers,

        totalOrders,

        totalRevenue,

        averageOrderValue,

        // ----------------------------------------------
        // ORDERS
        // ----------------------------------------------

        recentOrders:
          formattedOrders,

        topProducts,

        // ----------------------------------------------
        // REVENUE CHART
        // ----------------------------------------------

        salesData:
          formattedSalesData,

        // ----------------------------------------------
        // ORDER STATUS PIE CHART
        // ----------------------------------------------

        orderStatusData,

        // ----------------------------------------------
        // CATEGORY BAR CHART
        // ----------------------------------------------

        categoryData,

        // ----------------------------------------------
        // ORDER COUNTS
        // ----------------------------------------------

        deliveredOrders,

        processingOrders,

        shippedOrders,

        cancelledOrders,

        // ----------------------------------------------
        // CURRENT PERIOD
        // ----------------------------------------------

        period,
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

export {
  getDashboardData,
};