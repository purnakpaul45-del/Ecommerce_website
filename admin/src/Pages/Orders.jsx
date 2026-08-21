import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  RefreshCw,
  Package,
  IndianRupee,
  User,
  CreditCard,
  ChevronDown,
} from "lucide-react";

const Orders = () => {
  // =====================================================
  // BACKEND URL
  // =====================================================

  const backendUrl =
    import.meta.env.VITE_BACKEND_URL;

  // =====================================================
  // STATE
  // =====================================================

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [updatingOrder, setUpdatingOrder] =
    useState(null);

  // =====================================================
  // FETCH ORDERS
  // =====================================================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      // -----------------------------------------------
      // GET ADMIN TOKEN
      // -----------------------------------------------

      const token =
        localStorage.getItem(
          "adminToken"
        );

      console.log(
        "================================="
      );

      console.log(
        "FETCHING ADMIN ORDERS"
      );

      console.log(
        "Admin token:",
        token
      );

      // -----------------------------------------------
      // TOKEN CHECK
      // -----------------------------------------------

      if (!token) {
        setError(
          "Admin session expired. Please login again."
        );

        setLoading(false);

        return;
      }

      // -----------------------------------------------
      // IMPORTANT:
      // Backend uses POST /api/order/list
      // -----------------------------------------------

      const response =
        await axios.post(
          `${backendUrl}/api/order/list`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      console.log(
        "Orders Response:",
        response.data
      );

      // -----------------------------------------------
      // HANDLE RESPONSE
      // -----------------------------------------------

      if (response.data.success) {
        setOrders(
          response.data.orders || []
        );
      } else {
        setError(
          response.data.message ||
            "Unable to load orders."
        );
      }
    } catch (err) {
      console.error(
        "FETCH ORDERS ERROR:",
        err
      );

      console.error(
        "Status:",
        err.response?.status
      );

      console.error(
        "Data:",
        err.response?.data
      );

      // -----------------------------------------------
      // 401
      // -----------------------------------------------

      if (
        err.response?.status === 401
      ) {
        setError(
          "Your admin session has expired. Please login again."
        );

        localStorage.removeItem(
          "adminToken"
        );

        return;
      }

      // -----------------------------------------------
      // 403
      // -----------------------------------------------

      if (
        err.response?.status === 403
      ) {
        setError(
          err.response?.data?.message ||
            "Access denied. Admin authorization failed."
        );

        return;
      }

      // -----------------------------------------------
      // OTHER ERRORS
      // -----------------------------------------------

      setError(
        err.response?.data?.message ||
          "Unable to connect to the server."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // UPDATE ORDER STATUS
  // =====================================================

  const updateOrderStatus = async (
    orderId,
    status
  ) => {
    try {
      setUpdatingOrder(orderId);

      const token =
        localStorage.getItem(
          "adminToken"
        );

      if (!token) {
        setError(
          "Admin session expired. Please login again."
        );

        return;
      }

      const response =
        await axios.post(
          `${backendUrl}/api/order/status`,
          {
            orderId,
            status,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

      console.log(
        "Update Status Response:",
        response.data
      );

      if (response.data.success) {
        // Refresh orders
        await fetchOrders();
      } else {
        setError(
          response.data.message ||
            "Unable to update order."
        );
      }
    } catch (err) {
      console.error(
        "UPDATE ORDER ERROR:",
        err
      );

      console.error(
        "Status:",
        err.response?.status
      );

      console.error(
        "Data:",
        err.response?.data
      );

      if (
        err.response?.status === 401
      ) {
        localStorage.removeItem(
          "adminToken"
        );

        setError(
          "Your admin session has expired. Please login again."
        );

        return;
      }

      if (
        err.response?.status === 403
      ) {
        setError(
          "Access denied. Admin authorization failed."
        );

        return;
      }

      setError(
        err.response?.data?.message ||
          "Unable to update order."
      );
    } finally {
      setUpdatingOrder(null);
    }
  };

  // =====================================================
  // LOAD ORDERS
  // =====================================================

  useEffect(() => {
    fetchOrders();
  }, []);

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (
    status
  ) => {
    switch (status) {
      case "Order Placed":
        return "bg-indigo-50 text-indigo-700";

      case "Packing":
      case "Processing":
        return "bg-amber-50 text-amber-700";

      case "Shipped":
        return "bg-blue-50 text-blue-700";

      case "Out for Delivery":
        return "bg-cyan-50 text-cyan-700";

      case "Delivered":
        return "bg-emerald-50 text-emerald-700";

      case "Cancelled":
      case "Canceled":
        return "bg-red-50 text-red-700";

      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  // =====================================================
  // PAYMENT STYLE
  // =====================================================

  const getPaymentStyle = (
    paymentStatus
  ) => {
    switch (paymentStatus) {
      case "Paid":
        return "bg-emerald-50 text-emerald-700";

      case "Pending":
        return "bg-amber-50 text-amber-700";

      case "Failed":
        return "bg-red-50 text-red-700";

      default:
        return "bg-slate-50 text-slate-600";
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw
            size={30}
            className="animate-spin text-indigo-600"
          />

          <p className="text-sm text-slate-500">
            Loading orders...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error) {
    return (
      <div className="flex min-h-[500px] items-center justify-center">
        <div className="max-w-md rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-semibold text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchOrders}
            className="mt-4 flex mx-auto items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            <RefreshCw size={15} />

            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="w-full">
      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            Orders
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage and track customer orders.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          className="flex w-fit items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <RefreshCw size={16} />

          Refresh
        </button>
      </div>

      {/* =================================================
          ORDER COUNT
      ================================================= */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Package size={21} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Total Orders
              </p>

              <p className="text-2xl font-bold text-slate-900">
                {orders.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <IndianRupee size={21} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Paid Orders
              </p>

              <p className="text-2xl font-bold text-slate-900">
                {
                  orders.filter(
                    (order) =>
                      order.payment ===
                        true ||
                      order.paymentStatus ===
                        "Paid"
                  ).length
                }
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <User size={21} />
            </div>

            <div>
              <p className="text-sm text-slate-500">
                Customers
              </p>

              <p className="text-2xl font-bold text-slate-900">
                {
                  new Set(
                    orders.map(
                      (order) =>
                        String(
                          order.userId
                        )
                    )
                  ).size
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* =================================================
          ORDERS TABLE
      ================================================= */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 p-5">
          <h2 className="text-lg font-bold text-slate-900">
            All Orders
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            View and manage all customer orders.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[1100px]">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Order
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Customer
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Items
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Amount
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Payment
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Status
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase text-slate-500">
                  Update
                </th>
              </tr>
            </thead>

            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => {
                  const customerName =
                    `${order.address?.firstName || ""} ${
                      order.address?.lastName || ""
                    }`.trim() ||
                    "Customer";

                  const totalItems =
                    order.items?.reduce(
                      (total, item) =>
                        total +
                        Number(
                          item.quantity || 0
                        ),
                      0
                    ) || 0;

                  return (
                    <tr
                      key={order._id}
                      className="border-b border-slate-100 transition hover:bg-slate-50"
                    >
                      {/* ORDER ID */}

                      <td className="px-5 py-4">
                        <span className="text-sm font-semibold text-indigo-600">
                          #
                          {String(
                            order._id
                          ).slice(-8)}
                        </span>

                        <p className="mt-1 text-xs text-slate-400">
                          {order.createdAt
                            ? new Date(
                                order.createdAt
                              ).toLocaleDateString(
                                "en-IN"
                              )
                            : ""}
                        </p>
                      </td>

                      {/* CUSTOMER */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
                            <User size={16} />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-slate-700">
                              {
                                customerName
                              }
                            </p>

                            <p className="text-xs text-slate-400">
                              {order.address
                                ?.email ||
                                ""}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* ITEMS */}

                      <td className="px-5 py-4">
                        <span className="text-sm text-slate-600">
                          {totalItems}{" "}
                          {totalItems ===
                          1
                            ? "Item"
                            : "Items"}
                        </span>
                      </td>

                      {/* AMOUNT */}

                      <td className="px-5 py-4">
                        <span className="text-sm font-bold text-slate-800">
                          ₹
                          {Number(
                            order.amount ||
                              0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </span>
                      </td>

                      {/* PAYMENT */}

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <CreditCard
                            size={16}
                            className="text-slate-400"
                          />

                          <div>
                            <p className="text-xs font-semibold text-slate-700">
                              {order.paymentMethod ||
                                "COD"}
                            </p>

                            <span
                              className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${getPaymentStyle(
                                order.paymentStatus
                              )}`}
                            >
                              {order.paymentStatus ||
                                (order.payment
                                  ? "Paid"
                                  : "Pending")}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* STATUS */}

                      <td className="px-5 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                            order.status
                          )}`}
                        >
                          {order.status ||
                            "Order Placed"}
                        </span>
                      </td>

                      {/* UPDATE */}

                      <td className="px-5 py-4">
                        <div className="relative">
                          <select
                            value={
                              order.status ||
                              "Order Placed"
                            }
                            disabled={
                              updatingOrder ===
                              order._id
                            }
                            onChange={(e) =>
                              updateOrderStatus(
                                order._id,
                                e.target.value
                              )
                            }
                            className="appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-3 pr-8 text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            <option value="Order Placed">
                              Order Placed
                            </option>

                            <option value="Packing">
                              Packing
                            </option>

                            <option value="Shipped">
                              Shipped
                            </option>

                            <option value="Out for Delivery">
                              Out for Delivery
                            </option>

                            <option value="Delivered">
                              Delivered
                            </option>

                            <option value="Cancelled">
                              Cancelled
                            </option>
                          </select>

                          <ChevronDown
                            size={14}
                            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-slate-400"
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="px-5 py-16 text-center"
                  >
                    <Package
                      size={40}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-3 text-sm font-semibold text-slate-500">
                      No orders found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Customer orders will appear
                      here.
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;