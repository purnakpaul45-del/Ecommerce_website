import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Package,
  RefreshCw,
  Search,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  CreditCard,
  User,
  MapPin,
  Phone,
  Mail,
  ChevronDown,
  AlertCircle,
} from "lucide-react";

const Orders = () => {
  // =========================================================
  // BACKEND
  // =========================================================

  const backendUrl = "http://localhost:8005";

  // =========================================================
  // STATES
  // =========================================================

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");

  // =========================================================
  // ORDER STATUSES
  // =========================================================

  const statuses = [
    "Order Placed",
    "Processing",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
    "Cancelled",
  ];

  // =========================================================
  // GET ADMIN TOKEN
  // =========================================================

  const getToken = () => {
    return localStorage.getItem("token");
  };

  // =========================================================
  // AUTH CONFIG
  // =========================================================

  const getAuthConfig = () => {
    const token = getToken();

    return {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
  };

  // =========================================================
  // FETCH ALL ORDERS
  // =========================================================

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const token = getToken();

      console.log("Admin token:", token);

      if (!token) {
        setError("Admin login required. Please login again.");
        setOrders([]);
        return;
      }

      /*
        IMPORTANT:

        Your backend route is:

        orderRouter.post("/list", adminAuth, allorders)

        Therefore we MUST use axios.post()
      */

      const response = await axios.post(
        `${backendUrl}/api/order/list`,
        {},
        getAuthConfig()
      );

      console.log("ADMIN ORDERS RESPONSE:", response.data);

      if (response.data.success) {
        setOrders(response.data.orders || []);
      } else {
        setOrders([]);

        setError(
          response.data.message || "Unable to load orders."
        );
      }
    } catch (err) {
      console.error("FETCH ORDERS ERROR:", err);

      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Data:", err.response.data);

        if (err.response.status === 401) {
          setError(
            "Admin authentication failed. Please login again."
          );

          /*
            Do NOT automatically delete token while debugging.
            Otherwise you cannot inspect the token.
          */
        } else if (err.response.status === 403) {
          setError(
            "Access denied. This account is not an admin."
          );
        } else {
          setError(
            err.response.data?.message ||
              "Failed to load orders."
          );
        }
      } else if (err.request) {
        setError(
          "Cannot connect to backend. Make sure your backend is running on port 8005."
        );
      } else {
        setError("Something went wrong while loading orders.");
      }
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // UPDATE ORDER STATUS
  // =========================================================

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      setError("");

      const token = getToken();

      if (!token) {
        alert("Admin login required.");
        return;
      }

      console.log("Updating order:", orderId);
      console.log("New status:", newStatus);

      const response = await axios.post(
        `${backendUrl}/api/order/status`,
        {
          orderId,
          status: newStatus,
        },
        getAuthConfig()
      );

      console.log("UPDATE STATUS RESPONSE:", response.data);

      if (response.data.success) {
        /*
          Update local UI immediately.
        */

        setOrders((previousOrders) =>
          previousOrders.map((order) =>
            order._id === orderId
              ? {
                  ...order,
                  status: newStatus,
                }
              : order
          )
        );

        /*
          Optional success message.
        */

        console.log(
          `Order ${orderId} updated to ${newStatus}`
        );
      } else {
        alert(
          response.data.message ||
            "Unable to update order status."
        );
      }
    } catch (err) {
      console.error("UPDATE STATUS ERROR:", err);

      if (err.response?.status === 401) {
        alert(
          "Admin authentication failed. Please login again."
        );
      } else if (err.response?.status === 403) {
        alert("Access denied. Admin account required.");
      } else {
        alert(
          err.response?.data?.message ||
            "Failed to update order status."
        );
      }
    } finally {
      setUpdatingId(null);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchOrders();
  }, []);

  // =========================================================
  // SEARCH
  // =========================================================

  const filteredOrders = orders.filter((order) => {
    const searchValue = search.toLowerCase().trim();

    if (!searchValue) {
      return true;
    }

    const orderId =
      order._id?.toLowerCase() || "";

    const firstName =
      order.address?.firstName?.toLowerCase() || "";

    const lastName =
      order.address?.lastName?.toLowerCase() || "";

    const email =
      order.address?.email?.toLowerCase() || "";

    return (
      orderId.includes(searchValue) ||
      firstName.includes(searchValue) ||
      lastName.includes(searchValue) ||
      email.includes(searchValue)
    );
  });

  // =========================================================
  // STATUS ICON
  // =========================================================

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle size={18} />;

      case "Cancelled":
        return <XCircle size={18} />;

      case "Shipped":
      case "Out for Delivery":
        return <Truck size={18} />;

      case "Processing":
      case "Packed":
        return <RefreshCw size={18} />;

      default:
        return <Clock size={18} />;
    }
  };

  // =========================================================
  // STATUS STYLE
  // =========================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-100 text-emerald-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      case "Shipped":
        return "bg-blue-100 text-blue-700";

      case "Out for Delivery":
        return "bg-violet-100 text-violet-700";

      case "Processing":
        return "bg-amber-100 text-amber-700";

      case "Packed":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-indigo-100 text-indigo-700";
    }
  };

  // =========================================================
  // DATE FORMAT
  // =========================================================

  const formatDate = (date) => {
    if (!date) {
      return "N/A";
    }

    return new Date(date).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  };

  // =========================================================
  // PRODUCT IMAGE
  // =========================================================

  const getProductImage = (item) => {
    if (Array.isArray(item?.image)) {
      return item.image[0] || null;
    }

    if (typeof item?.image === "string") {
      return item.image;
    }

    return null;
  };

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-full bg-slate-50 p-4 sm:p-6 lg:p-8">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">

        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Orders
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Manage customer orders and update delivery status.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchOrders}
          disabled={loading}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={18}
            className={loading ? "animate-spin" : ""}
          />

          Refresh Orders
        </button>

      </div>

      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">

          <AlertCircle
            size={20}
            className="mt-0.5 shrink-0 text-red-600"
          />

          <div>
            <p className="font-semibold text-red-700">
              Unable to load orders
            </p>

            <p className="mt-1 text-sm text-red-600">
              {error}
            </p>

            <button
              type="button"
              onClick={fetchOrders}
              className="mt-3 rounded-lg bg-red-600 px-3 py-2 text-xs font-semibold text-white hover:bg-red-700"
            >
              Try Again
            </button>
          </div>

        </div>
      )}

      {/* =====================================================
          SEARCH
      ===================================================== */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="relative">

          <Search
            size={20}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            placeholder="Search order ID, customer name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
          />

        </div>

      </div>

      {/* =====================================================
          COUNT
      ===================================================== */}

      {!loading && !error && (
        <div className="mb-5">

          <p className="text-sm text-slate-500">
            Showing{" "}
            <span className="font-bold text-slate-800">
              {filteredOrders.length}
            </span>{" "}
            {filteredOrders.length === 1
              ? "order"
              : "orders"}
          </p>

        </div>
      )}

      {/* =====================================================
          LOADING
      ===================================================== */}

      {loading && (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

          <RefreshCw
            size={35}
            className="mx-auto animate-spin text-indigo-600"
          />

          <p className="mt-4 text-sm font-medium text-slate-500">
            Loading orders...
          </p>

        </div>
      )}

      {/* =====================================================
          EMPTY
      ===================================================== */}

      {!loading &&
        !error &&
        filteredOrders.length === 0 && (
          <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center shadow-sm">

            <Package
              size={50}
              className="mx-auto text-slate-300"
            />

            <h2 className="mt-4 text-xl font-bold text-slate-800">
              No Orders Found
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              {search
                ? "Try another search."
                : "There are currently no customer orders."}
            </p>

          </div>
        )}

      {/* =====================================================
          ORDER LIST
      ===================================================== */}

      {!loading &&
        !error &&
        filteredOrders.length > 0 && (
          <div className="space-y-6">

            {filteredOrders.map((order) => {

              const currentStatus =
                order.status || "Order Placed";

              return (
                <div
                  key={order._id}
                  className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
                >

                  {/* =================================================
                      ORDER HEADER
                  ================================================= */}

                  <div className="flex flex-col gap-5 border-b border-slate-100 p-5 lg:flex-row lg:items-center lg:justify-between">

                    {/* ORDER ID */}

                    <div>

                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Order ID
                      </p>

                      <p className="mt-1 break-all font-bold text-slate-900">
                        #{order._id}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {formatDate(order.createdAt)}
                      </p>

                    </div>

                    {/* CUSTOMER */}

                    <div className="flex items-center gap-3">

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                        <User size={20} />
                      </div>

                      <div>

                        <p className="font-semibold text-slate-800">
                          {order.address?.firstName ||
                            "Customer"}{" "}
                          {order.address?.lastName || ""}
                        </p>

                        <p className="text-sm text-slate-500">
                          {order.address?.email ||
                            "No email"}
                        </p>

                      </div>

                    </div>

                    {/* STATUS */}

                    <div
                      className={`flex w-fit items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold ${getStatusStyle(
                        currentStatus
                      )}`}
                    >
                      {getStatusIcon(currentStatus)}

                      {currentStatus}
                    </div>

                  </div>

                  {/* =================================================
                      BODY
                  ================================================= */}

                  <div className="grid gap-6 p-5 xl:grid-cols-[1fr_340px]">

                    {/* PRODUCTS */}

                    <div>

                      <h3 className="mb-4 font-bold text-slate-800">
                        Ordered Products
                      </h3>

                      <div className="space-y-4">

                        {order.items?.map(
                          (item, index) => {

                            const image =
                              getProductImage(item);

                            return (
                              <div
                                key={`${item._id || "item"}-${index}`}
                                className="flex gap-4 rounded-xl bg-slate-50 p-4"
                              >

                                {/* IMAGE */}

                                <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white">

                                  {image ? (
                                    <img
                                      src={image}
                                      alt={
                                        item.name ||
                                        "Product"
                                      }
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <Package
                                      size={30}
                                      className="text-slate-300"
                                    />
                                  )}

                                </div>

                                {/* DETAILS */}

                                <div className="min-w-0">

                                  <p className="font-semibold text-slate-800">
                                    {item.name ||
                                      "Product"}
                                  </p>

                                  <div className="mt-2 space-y-1 text-sm text-slate-500">

                                    <p>
                                      Price: ₹
                                      {item.price || 0}
                                    </p>

                                    <p>
                                      Quantity:{" "}
                                      {item.quantity ||
                                        1}
                                    </p>

                                    <p>
                                      Size:{" "}
                                      {item.size ||
                                        "N/A"}
                                    </p>

                                  </div>

                                </div>

                              </div>
                            );
                          }
                        )}

                      </div>

                    </div>

                    {/* RIGHT SIDE */}

                    <div className="space-y-5">

                      {/* =================================================
                          STATUS UPDATE
                      ================================================= */}

                      <div className="rounded-2xl border border-slate-200 p-5">

                        <div className="mb-4">

                          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                            Order Tracking
                          </p>

                          <h3 className="mt-1 text-lg font-bold text-slate-900">
                            Update Status
                          </h3>

                        </div>

                        <div className="relative">

                          <select
                            value={currentStatus}
                            disabled={
                              updatingId ===
                              order._id
                            }
                            onChange={(e) =>
                              updateOrderStatus(
                                order._id,
                                e.target.value
                              )
                            }
                            className="h-12 w-full appearance-none rounded-xl border border-slate-200 bg-white px-4 pr-10 text-sm font-semibold text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                          >

                            {statuses.map(
                              (status) => (
                                <option
                                  key={status}
                                  value={status}
                                >
                                  {status}
                                </option>
                              )
                            )}

                          </select>

                          <ChevronDown
                            size={18}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                          />

                        </div>

                        {updatingId ===
                          order._id && (
                          <div className="mt-3 flex items-center gap-2 text-sm font-medium text-indigo-600">

                            <RefreshCw
                              size={15}
                              className="animate-spin"
                            />

                            Saving status...

                          </div>
                        )}

                      </div>

                      {/* =================================================
                          ADDRESS
                      ================================================= */}

                      <div className="rounded-2xl border border-slate-200 p-5">

                        <h3 className="mb-4 font-bold text-slate-800">
                          Delivery Address
                        </h3>

                        <div className="space-y-3 text-sm text-slate-600">

                          <p className="flex gap-2">

                            <MapPin
                              size={17}
                              className="mt-0.5 shrink-0 text-slate-400"
                            />

                            <span>
                              {order.address?.street ||
                                "N/A"}
                              {order.address?.city
                                ? `, ${order.address.city}`
                                : ""}
                            </span>

                          </p>

                          <p className="flex gap-2">

                            <Phone
                              size={17}
                              className="shrink-0 text-slate-400"
                            />

                            <span>
                              {order.address?.phone ||
                                "N/A"}
                            </span>

                          </p>

                          <p className="flex gap-2 break-all">

                            <Mail
                              size={17}
                              className="shrink-0 text-slate-400"
                            />

                            <span>
                              {order.address?.email ||
                                "N/A"}
                            </span>

                          </p>

                        </div>

                      </div>

                      {/* =================================================
                          PAYMENT
                      ================================================= */}

                      <div className="rounded-2xl border border-slate-200 p-5">

                        <h3 className="mb-4 font-bold text-slate-800">
                          Payment
                        </h3>

                        <div className="flex items-center gap-2 text-sm text-slate-600">

                          <CreditCard
                            size={17}
                            className="text-slate-400"
                          />

                          {order.paymentMethod ||
                            "COD"}

                        </div>

                        <div className="mt-4 border-t border-slate-100 pt-4">

                          <p className="text-xs text-slate-400">
                            Total Amount
                          </p>

                          <p className="mt-1 text-2xl font-bold text-slate-900">
                            ₹{order.amount || 0}
                          </p>

                        </div>

                      </div>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

    </div>
  );
};

export default Orders;