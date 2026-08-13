import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShopContext } from "../Context/ShopContext";

const TrackOrder = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const { backendUrl, token } =
    useContext(ShopContext);

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const statuses = [
    "Order Placed",
    "Processing",
    "Packed",
    "Shipped",
    "Out for Delivery",
    "Delivered",
  ];

  const fetchOrder = async () => {
    try {
      const response = await axios.post(
        `${backendUrl}/api/order/userorders`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        const foundOrder =
          response.data.orders.find(
            (item) => item._id === orderId
          );

        setOrder(foundOrder || null);
      }
    } catch (error) {
      console.error(
        "Track Order Error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token && orderId) {
      fetchOrder();
    }
  }, [token, orderId]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        Loading order...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-xl font-semibold">
          Order not found
        </h2>

        <button
          onClick={() => navigate("/orders")}
          className="mt-5 rounded-lg bg-black px-6 py-3 text-white"
        >
          Back to Orders
        </button>
      </div>
    );
  }

  const currentStatusIndex =
    statuses.indexOf(order.status);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-gray-900">
          Track Your Order
        </h1>

        <p className="mt-2 text-sm text-gray-500">
          Order ID: #{order._id}
        </p>
      </div>

      {/* CURRENT STATUS */}
      <div className="rounded-2xl border bg-white p-6 shadow-sm">
        <p className="text-sm text-gray-500">
          Current Status
        </p>

        <h2 className="mt-2 text-2xl font-bold text-green-600">
          {order.status}
        </h2>
      </div>

      {/* TRACKING */}
      <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-gray-900">
          Order Progress
        </h2>

        <div className="mt-8 space-y-7">
          {statuses.map((status, index) => {
            const completed =
              index <= currentStatusIndex;

            return (
              <div
                key={status}
                className="flex items-center gap-4"
              >
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                    completed
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {index + 1}
                </div>

                <div>
                  <p
                    className={`font-semibold ${
                      completed
                        ? "text-gray-900"
                        : "text-gray-400"
                    }`}
                  >
                    {status}
                  </p>

                  {completed && (
                    <p className="text-xs text-green-600">
                      Completed
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DELIVERY ADDRESS */}
      <div className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold">
          Delivery Address
        </h2>

        <div className="mt-4 text-sm leading-6 text-gray-600">
          <p>
            {order.address.firstName}{" "}
            {order.address.lastName}
          </p>

          <p>{order.address.street}</p>

          <p>
            {order.address.city},{" "}
            {order.address.state}
          </p>

          <p>
            {order.address.pincode},{" "}
            {order.address.country}
          </p>

          <p>
            Phone: {order.address.phone}
          </p>
        </div>
      </div>

      {/* BACK BUTTON */}
      <button
        onClick={() => navigate("/orders")}
        className="mt-8 rounded-lg bg-black px-6 py-3 text-sm font-semibold text-white"
      >
        Back to My Orders
      </button>
    </div>
  );
};

export default TrackOrder;