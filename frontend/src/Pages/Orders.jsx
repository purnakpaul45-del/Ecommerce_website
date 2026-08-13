import React, {
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  RefreshCw,
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  MapPin,
  CreditCard,
} from "lucide-react";

import { ShopContext } from "../Context/ShopContext";
import Title from "../Components/Title";

const Orders = () => {
  const { backendUrl, token, currency } =
    useContext(ShopContext);

  const navigate = useNavigate();

  // =====================================================
  // STATES
  // =====================================================

  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // GET USER ORDERS
  // =====================================================

  const loadOrders = useCallback(
    async (showLoading = false) => {
      try {
        if (!token) {
          setOrderData([]);
          setLoading(false);
          return;
        }

        if (showLoading) {
          setLoading(true);
        } else {
          setRefreshing(true);
        }

        setError("");

        console.log(
          "Fetching latest user orders..."
        );

        const response = await axios.post(
          `${backendUrl}/api/order/userorders`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log(
          "Latest Orders Response:",
          response.data
        );

        if (response.data?.success) {
          setOrderData(
            response.data.orders || []
          );
        } else {
          setError(
            response.data?.message ||
              "Unable to load your orders."
          );
        }
      } catch (error) {
        console.error(
          "Load Orders Error:",
          error
        );

        if (error.response) {
          setError(
            error.response.data?.message ||
              "Unable to load your orders."
          );
        } else if (error.request) {
          setError(
            "Unable to connect to the server."
          );
        } else {
          setError(
            "Something went wrong while loading orders."
          );
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [backendUrl, token]
  );

  // =====================================================
  // INITIAL LOAD
  // =====================================================

  useEffect(() => {
    loadOrders(true);
  }, [loadOrders]);

  // =====================================================
  // AUTOMATIC ORDER STATUS REFRESH
  //
  // Checks MongoDB every 5 seconds.
  //
  // Example:
  //
  // Admin changes:
  // Order Placed
  //       ↓
  // Processing
  //
  // User page automatically gets:
  // Processing
  // =====================================================

  useEffect(() => {
    if (!token) {
      return;
    }

    const interval = setInterval(() => {
      loadOrders(false);
    }, 5000);

    return () => {
      clearInterval(interval);
    };
  }, [token, loadOrders]);

  // =====================================================
  // REFRESH WHEN USER RETURNS TO TAB
  // =====================================================

  useEffect(() => {
    if (!token) {
      return;
    }

    const handleVisibilityChange = () => {
      if (
        document.visibilityState === "visible"
      ) {
        loadOrders(false);
      }
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [token, loadOrders]);

  // =====================================================
  // TRACK ORDER
  // =====================================================

  const handleTrackOrder = (orderId) => {
    navigate(`/track-order/${orderId}`);
  };

  // =====================================================
  // STATUS ICON
  // =====================================================

  const getStatusIcon = (status) => {
    switch (status) {
      case "Order Placed":
        return <Clock size={17} />;

      case "Processing":
        return <RefreshCw size={17} />;

      case "Packed":
        return <Package size={17} />;

      case "Shipped":
        return <Truck size={17} />;

      case "Out for Delivery":
        return <Truck size={17} />;

      case "Delivered":
        return <CheckCircle size={17} />;

      case "Cancelled":
        return <XCircle size={17} />;

      default:
        return <Clock size={17} />;
    }
  };

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Order Placed":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";

      case "Processing":
        return "bg-amber-50 text-amber-700 border-amber-200";

      case "Packed":
        return "bg-orange-50 text-orange-700 border-orange-200";

      case "Shipped":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "Out for Delivery":
        return "bg-violet-50 text-violet-700 border-violet-200";

      case "Delivered":
        return "bg-emerald-50 text-emerald-700 border-emerald-200";

      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  // =====================================================
  // FORMAT DATE
  // =====================================================

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

  // =====================================================
  // FORMAT TIME
  // =====================================================

  const formatTime = (date) => {
    if (!date) {
      return "";
    }

    return new Date(date).toLocaleTimeString(
      "en-IN",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  };

  // =====================================================
  // NOT LOGGED IN
  // =====================================================

  if (!token) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <Title text1="MY" text2="ORDERS" />

        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <Package
            size={55}
            className="mx-auto text-gray-300"
          />

          <h2 className="mt-5 text-xl font-semibold text-gray-800">
            Please login to view your orders
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Login to see your order history and
            track your deliveries.
          </p>

          <button
            onClick={() =>
              navigate("/login")
            }
            className="mt-6 rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // INITIAL LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <Title text1="MY" text2="ORDERS" />

        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-12 text-center">
          <RefreshCw
            size={35}
            className="mx-auto animate-spin text-gray-600"
          />

          <p className="mt-4 text-sm text-gray-500">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error && orderData.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <Title text1="MY" text2="ORDERS" />

        <div className="mt-10 rounded-2xl border border-red-200 bg-red-50 p-10 text-center">
          <AlertCircle
            size={45}
            className="mx-auto text-red-500"
          />

          <h2 className="mt-4 text-xl font-semibold text-red-700">
            Unable to load orders
          </h2>

          <p className="mt-2 text-sm text-red-600">
            {error}
          </p>

          <button
            onClick={() =>
              loadOrders(true)
            }
            className="mt-6 rounded-lg bg-red-600 px-6 py-3 text-sm font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // NO ORDERS
  // =====================================================

  if (orderData.length === 0) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
        <Title text1="MY" text2="ORDERS" />

        <div className="mt-10 rounded-2xl border border-gray-200 bg-white p-12 text-center">
          <Package
            size={55}
            className="mx-auto text-gray-300"
          />

          <h2 className="mt-5 text-xl font-semibold text-gray-800">
            No Orders Yet
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            You haven't placed any orders yet.
          </p>

          <button
            onClick={() => navigate("/")}
            className="mt-6 rounded-lg bg-black px-6 py-3 text-sm font-medium text-white hover:bg-gray-800"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // ORDERS PAGE
  // =====================================================

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <Title text1="MY" text2="ORDERS" />

          <p className="mt-2 text-sm text-gray-500">
            Track your orders and delivery status.
          </p>
        </div>

        <button
          type="button"
          onClick={() =>
            loadOrders(false)
          }
          disabled={refreshing}
          className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={17}
            className={
              refreshing
                ? "animate-spin"
                : ""
            }
          />

          {refreshing
            ? "Refreshing..."
            : "Refresh Orders"}
        </button>

      </div>

      {/* =================================================
          BACKGROUND REFRESH INDICATOR
      ================================================= */}

      {refreshing && (
        <div className="mb-5 flex items-center gap-2 text-xs text-gray-400">
          <RefreshCw
            size={13}
            className="animate-spin"
          />

          Checking for latest order updates...
        </div>
      )}

      {/* =================================================
          ERROR WITHOUT REMOVING EXISTING ORDERS
      ================================================= */}

      {error && orderData.length > 0 && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* =================================================
          ORDER LIST
      ================================================= */}

      <div className="space-y-6">

        {orderData.map((order) => {

          const currentStatus =
            order.status ||
            "Order Placed";

          return (
            <div
              key={order._id}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md"
            >

              {/* =================================================
                  ORDER HEADER
              ================================================= */}

              <div className="border-b border-gray-100 p-5">

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                  <div>
                    <p className="text-xs uppercase tracking-wide text-gray-400">
                      Order ID
                    </p>

                    <p className="mt-1 break-all text-sm font-semibold text-gray-800">
                      #{order._id}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                      {formatDate(
                        order.createdAt ||
                          order.date
                      )}

                      {" • "}

                      {formatTime(
                        order.createdAt ||
                          order.date
                      )}
                    </p>
                  </div>

                  {/* STATUS */}

                  <div
                    className={`flex w-fit items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${getStatusStyle(
                      currentStatus
                    )}`}
                  >
                    {getStatusIcon(
                      currentStatus
                    )}

                    {currentStatus}
                  </div>

                </div>

              </div>

              {/* =================================================
                  PRODUCTS
              ================================================= */}

              <div className="p-5">

                <div className="space-y-4">

                  {order.items?.map(
                    (item, index) => {

                      const image =
                        Array.isArray(
                          item.image
                        )
                          ? item.image[0]
                          : item.image;

                      return (
                        <div
                          key={`${item._id || "item"}-${index}`}
                          className="flex gap-4 border-b border-gray-100 pb-4 last:border-0 last:pb-0"
                        >

                          {/* PRODUCT IMAGE */}

                          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100">

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
                              <div className="flex h-full w-full items-center justify-center">
                                <Package
                                  size={28}
                                  className="text-gray-300"
                                />
                              </div>
                            )}

                          </div>

                          {/* PRODUCT DETAILS */}

                          <div className="min-w-0 flex-1">

                            <p className="font-semibold text-gray-800">
                              {item.name ||
                                "Product"}
                            </p>

                            <div className="mt-2 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-500">

                              <span>
                                {currency}
                                {item.price ||
                                  0}
                              </span>

                              <span>
                                Quantity:{" "}
                                {item.quantity ||
                                  1}
                              </span>

                              <span>
                                Size:{" "}
                                {item.size ||
                                  "N/A"}
                              </span>

                            </div>

                          </div>

                        </div>
                      );
                    }
                  )}

                </div>

              </div>

              {/* =================================================
                  ORDER INFORMATION
              ================================================= */}

              <div className="grid gap-5 border-t border-gray-100 bg-gray-50/50 p-5 md:grid-cols-3">

                {/* TOTAL */}

                <div className="flex items-start gap-3">

                  <div className="rounded-lg bg-white p-2 shadow-sm">
                    <CreditCard
                      size={18}
                      className="text-gray-500"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Total Amount
                    </p>

                    <p className="mt-1 font-bold text-gray-900">
                      {currency}
                      {order.amount ||
                        0}
                    </p>
                  </div>

                </div>

                {/* PAYMENT */}

                <div className="flex items-start gap-3">

                  <div className="rounded-lg bg-white p-2 shadow-sm">
                    <Package
                      size={18}
                      className="text-gray-500"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Payment
                    </p>

                    <p className="mt-1 font-semibold text-gray-800">
                      {order.paymentMethod ||
                        "COD"}
                    </p>

                    <p
                      className={`text-xs ${
                        order.payment
                          ? "text-emerald-600"
                          : "text-orange-500"
                      }`}
                    >
                      {order.payment
                        ? "Paid"
                        : "Payment Pending"}
                    </p>
                  </div>

                </div>

                {/* ADDRESS */}

                <div className="flex items-start gap-3">

                  <div className="rounded-lg bg-white p-2 shadow-sm">
                    <MapPin
                      size={18}
                      className="text-gray-500"
                    />
                  </div>

                  <div>
                    <p className="text-xs text-gray-400">
                      Delivery Address
                    </p>

                    <p className="mt-1 text-sm font-medium text-gray-800">
                      {order.address
                        ?.city ||
                        "N/A"}
                    </p>

                    <p className="text-xs text-gray-500">
                      {order.address
                        ?.state ||
                        ""}
                    </p>
                  </div>

                </div>

              </div>

              {/* =================================================
                  FOOTER
              ================================================= */}

              <div className="flex flex-col gap-4 border-t border-gray-100 p-5 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <p className="text-xs text-gray-400">
                    Current Order Status
                  </p>

                  <div
                    className={`mt-2 flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${getStatusStyle(
                      currentStatus
                    )}`}
                  >
                    {getStatusIcon(
                      currentStatus
                    )}

                    {currentStatus}
                  </div>

                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleTrackOrder(
                      order._id
                    )
                  }
                  className="rounded-lg border border-black px-6 py-3 text-sm font-medium text-black transition hover:bg-black hover:text-white"
                >
                  Track Order
                </button>

              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
};

export default Orders;