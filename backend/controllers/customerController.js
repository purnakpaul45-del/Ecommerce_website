
import userModel from "../models/userModel.js";
import orderModel from "../models/orderModel.js";

// ======================================================
// GET ALL CUSTOMERS - ADMIN
// ======================================================

const getCustomers = async (req, res) => {
  try {
    console.log("=================================");
    console.log("ADMIN CUSTOMERS REQUEST");
    console.log("=================================");

    // ==================================================
    // GET ALL USERS
    // ==================================================

    const customers = await userModel
      .find({})
      .select("-password")
      .sort({ createdAt: -1 })
      .lean();

    // ==================================================
    // GET ORDER INFORMATION
    // ==================================================

    const customerData = await Promise.all(
      customers.map(async (customer) => {
        // ------------------------------------------------
        // GET CUSTOMER ORDERS
        // ------------------------------------------------

        const orders = await orderModel
          .find({
            userId: customer._id.toString(),
          })
          .select("amount status")
          .lean();

        // ------------------------------------------------
        // TOTAL ORDERS
        // ------------------------------------------------

        const totalOrders = orders.length;

        // ------------------------------------------------
        // TOTAL SPENT
        // Only Delivered orders count
        // ------------------------------------------------

        const totalSpent = orders
          .filter(
            (order) =>
              order.status === "Delivered"
          )
          .reduce(
            (total, order) =>
              total + Number(order.amount || 0),
            0
          );

        // ------------------------------------------------
        // CUSTOMER STATUS
        // ------------------------------------------------

        const isActive =
          orders.length > 0;

        return {
          id: customer._id,

          name: customer.name,

          email: customer.email,

          createdAt: customer.createdAt,

          totalOrders,

          totalSpent,

          status: isActive
            ? "Active"
            : "New",
        };
      })
    );

    // ==================================================
    // RESPONSE
    // ==================================================

    return res.status(200).json({
      success: true,

      customers: customerData,
    });
  } catch (error) {
    console.error(
      "Get Customers Error:",
      error
    );

    return res.status(500).json({
      success: false,

      message:
        error.message ||
        "Unable to fetch customers.",
    });
  }
};

export {
  getCustomers,
};

