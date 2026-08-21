import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  ShoppingCart,
  Users,
  IndianRupee,
  ArrowUpRight,
  RefreshCw,
  Package,
} from "lucide-react";

const Dashboard = () => {
  // =====================================================
  // BACKEND URL
  // =====================================================

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // =====================================================
  // STATE
  // =====================================================

  const [dashboardData, setDashboardData] =
    useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("adminToken");

      const response = await axios.get(
        `${backendUrl}/api/dashboard`,
        {
          headers: token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {},
        }
      );

      console.log(
        "Dashboard Response:",
        response.data
      );

      if (response.data.success) {
        setDashboardData(
          response.data.data
        );
      } else {
        setError(
          response.data.message ||
            "Unable to load dashboard."
        );
      }
    } catch (err) {
      console.error(
        "Dashboard Error:",
        err
      );

      console.error(
        "Server Response:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
          "Unable to connect to dashboard server."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // =====================================================
  // STATUS STYLE
  // =====================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-700";

      case "Processing":
        return "bg-amber-50 text-amber-700";

      case "Packed":
        return "bg-purple-50 text-purple-700";

      case "Shipped":
        return "bg-blue-50 text-blue-700";

      case "Out for Delivery":
        return "bg-cyan-50 text-cyan-700";

      case "Cancelled":
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
            Loading dashboard...
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
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="font-semibold text-red-700">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchDashboardData}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // =====================================================
  // SAFE DATA
  // =====================================================

  const totalProducts =
    dashboardData?.totalProducts || 0;

  const totalCustomers =
    dashboardData?.totalCustomers || 0;

  const totalOrders =
    dashboardData?.totalOrders || 0;

  const totalRevenue =
    dashboardData?.totalRevenue || 0;

  const recentOrders =
    dashboardData?.recentOrders || [];

  const topProducts =
    dashboardData?.topProducts || [];

  const salesData =
    dashboardData?.salesData || [];

  // =====================================================
  // STAT CARDS
  // =====================================================

  const statsCards = [
    {
      title: "Total Products",
      value: totalProducts,
      icon: Box,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },

    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingCart,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },

    {
      title: "Total Customers",
      value: totalCustomers,
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },

    {
      title: "Total Revenue",
      value: `₹${Number(
        totalRevenue
      ).toLocaleString("en-IN")}`,
      icon: IndianRupee,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  // =====================================================
  // MAX SALES
  // =====================================================

  const maxSales = Math.max(
    ...salesData.map(
      (item) =>
        Number(item.amount) || 0
    ),
    1
  );

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
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-slate-500">
            Welcome back! Here's an overview of your
            ecommerce store.
          </p>
        </div>

        <button
          type="button"
          onClick={fetchDashboardData}
          className="flex w-fit items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <RefreshCw size={16} />

          Refresh
        </button>

      </div>

      {/* =================================================
          STATISTICS
      ================================================= */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {statsCards.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >

              <div className="flex items-start justify-between">

                <div>

                  <p className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>

                  <h2 className="mt-2 text-2xl font-bold text-slate-900">
                    {stat.value}
                  </h2>

                </div>

                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.iconBg} ${stat.iconColor}`}
                >
                  <Icon size={21} />
                </div>

              </div>

              <div className="mt-4 flex items-center gap-2">

                <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                  <ArrowUpRight size={14} />

                  Current
                </span>

                <span className="text-xs text-slate-400">
                  store statistics
                </span>

              </div>

            </div>
          );
        })}

      </div>

      {/* =================================================
          SALES OVERVIEW
      ================================================= */}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div>

          <h2 className="text-lg font-bold text-slate-900">
            Sales Overview
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Revenue from delivered orders for the last 7 days
          </p>

        </div>

        {/* CHART */}

        <div className="mt-8 flex h-64 items-end gap-3 sm:gap-5">

          {salesData.map(
            (item, index) => {

              const amount =
                Number(item.amount) || 0;

              const height =
                (amount / maxSales) * 100;

              return (
                <div
                  key={`${item.date}-${index}`}
                  className="flex h-full flex-1 flex-col items-center justify-end gap-3"
                >

                  <div className="flex h-full w-full items-end">

                    <div
                      className="w-full rounded-t-lg bg-indigo-500 transition hover:bg-indigo-600"
                      style={{
                        height: `${Math.max(
                          height,
                          amount > 0 ? 5 : 0
                        )}%`,
                      }}
                      title={`₹${amount.toLocaleString(
                        "en-IN"
                      )}`}
                    />

                  </div>

                  <span className="text-xs font-medium text-slate-400">
                    {item.day}
                  </span>

                </div>
              );
            }
          )}

          {salesData.length === 0 && (
            <div className="flex w-full items-center justify-center text-sm text-slate-400">
              No delivered sales in the last 7 days.
            </div>
          )}

        </div>

      </div>

      {/* =================================================
          RECENT ORDERS
      ================================================= */}

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-100 p-5">

          <h2 className="text-lg font-bold text-slate-900">
            Recent Orders
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Latest orders placed by customers
          </p>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[700px]">

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

              </tr>

            </thead>

            <tbody>

              {recentOrders.length > 0 ? (

                recentOrders.map(
                  (order) => (

                    <tr
                      key={order.id}
                      className="border-b border-slate-100 transition hover:bg-slate-50"
                    >

                      <td className="px-5 py-4">

                        <span className="text-sm font-semibold text-indigo-600">
                          {String(
                            order.id
                          ).slice(-8)}
                        </span>

                      </td>

                      <td className="px-5 py-4">

                        <span className="text-sm font-medium text-slate-700">
                          {order.customer}
                        </span>

                      </td>

                      <td className="px-5 py-4">

                        <span className="text-sm text-slate-500">
                          {order.items}
                        </span>

                      </td>

                      <td className="px-5 py-4">

                        <span className="text-sm font-bold text-slate-800">
                          ₹
                          {Number(
                            order.amount || 0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </span>

                      </td>

                      <td className="px-5 py-4">

                        <div>

                          <p className="text-sm font-medium text-slate-700">
                            {order.paymentMethod ||
                              "COD"}
                          </p>

                          <p className="text-xs text-slate-400">
                            {order.paymentStatus ||
                              "Pending"}
                          </p>

                        </div>

                      </td>

                      <td className="px-5 py-4">

                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(
                            order.status
                          )}`}
                        >
                          {order.status}
                        </span>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="6"
                    className="px-5 py-10 text-center text-sm text-slate-400"
                  >
                    No orders found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =================================================
          TOP PRODUCTS
      ================================================= */}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-100 p-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Package size={20} />
            </div>

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                Top Products
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Best selling products from delivered orders
              </p>

            </div>

          </div>

        </div>

        <div className="divide-y divide-slate-100">

          {topProducts.length > 0 ? (

            topProducts.map(
              (product, index) => (

                <div
                  key={
                    product._id ||
                    index
                  }
                  className="flex items-center gap-4 p-5 transition hover:bg-slate-50"
                >

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-600">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="truncate text-sm font-semibold text-slate-800">
                      {product.name}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {product.sales || 0} sold
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-sm font-bold text-slate-800">
                      ₹
                      {Number(
                        product.revenue || 0
                      ).toLocaleString(
                        "en-IN"
                      )}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Revenue
                    </p>

                  </div>

                </div>

              )
            )

          ) : (

            <div className="p-8 text-center text-sm text-slate-400">
              No delivered product sales yet.
            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default Dashboard;