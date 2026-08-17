import React, { useEffect, useState } from "react";
import axios from "axios";

import {
  Box,
  ShoppingCart,
  Users,
  IndianRupee,
  Package,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  RefreshCw,
} from "lucide-react";

const Dashboard = () => {
  // =====================================================
  // BACKEND
  // =====================================================

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // =====================================================
  // STATE
  // =====================================================

  const [dashboardData, setDashboardData] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  // =====================================================
  // FETCH DASHBOARD DATA
  // =====================================================

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("adminToken");

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
        setDashboardData(response.data.data);
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
    if (status === "Delivered") {
      return "bg-emerald-50 text-emerald-700";
    }

    if (status === "Processing") {
      return "bg-amber-50 text-amber-700";
    }

    if (status === "Packed") {
      return "bg-purple-50 text-purple-700";
    }

    if (status === "Shipped") {
      return "bg-blue-50 text-blue-700";
    }

    if (status === "Out for Delivery") {
      return "bg-cyan-50 text-cyan-700";
    }

    if (status === "Cancelled") {
      return "bg-red-50 text-red-700";
    }

    return "bg-slate-50 text-slate-600";
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

  const stats = dashboardData?.stats || {};

  const recentOrders =
    dashboardData?.recentOrders || [];

  const topProducts =
    dashboardData?.topProducts || [];

  const salesOverview =
    dashboardData?.salesOverview || [];

  const inventory =
    dashboardData?.inventory || {};

  // =====================================================
  // STATISTICS
  // =====================================================

  const statsCards = [
    {
      title: "Total Products",
      value: stats.totalProducts || 0,
      change: stats.productChange || "0%",
      positive:
        stats.productChangePositive ?? true,
      icon: Box,
      iconBg: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },

    {
      title: "Total Orders",
      value: stats.totalOrders || 0,
      change: stats.orderChange || "0%",
      positive:
        stats.orderChangePositive ?? true,
      icon: ShoppingCart,
      iconBg: "bg-emerald-50",
      iconColor: "text-emerald-600",
    },

    {
      title: "Total Customers",
      value: stats.totalCustomers || 0,
      change: stats.customerChange || "0%",
      positive:
        stats.customerChangePositive ?? true,
      icon: Users,
      iconBg: "bg-blue-50",
      iconColor: "text-blue-600",
    },

    {
      title: "Total Revenue",
      value: `₹${Number(
        stats.totalRevenue || 0
      ).toLocaleString("en-IN")}`,
      change: stats.revenueChange || "0%",
      positive:
        stats.revenueChangePositive ?? true,
      icon: IndianRupee,
      iconBg: "bg-amber-50",
      iconColor: "text-amber-600",
    },
  ];

  // =====================================================
  // MAX SALES FOR CHART
  // =====================================================

  const maxSales = Math.max(
    ...salesOverview.map(
      (item) => Number(item.amount) || 0
    ),
    1
  );

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="w-full">
      {/* =================================================
          PAGE HEADER
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
                <span
                  className={`flex items-center gap-1 text-xs font-semibold ${
                    stat.positive
                      ? "text-emerald-600"
                      : "text-red-600"
                  }`}
                >
                  {stat.positive ? (
                    <ArrowUpRight size={14} />
                  ) : (
                    <ArrowDownRight size={14} />
                  )}

                  {stat.change}
                </span>

                <span className="text-xs text-slate-400">
                  vs last month
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* =================================================
          SALES + INVENTORY
      ================================================= */}

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* SALES OVERVIEW */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Sales Overview
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Store sales for the last 7 days
              </p>
            </div>

            <button
              type="button"
              onClick={fetchDashboardData}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100"
            >
              <MoreHorizontal size={20} />
            </button>
          </div>

          {/* CHART */}

          <div className="mt-8 flex h-64 items-end gap-3 sm:gap-5">
            {salesOverview.map(
              (item, index) => {
                const amount =
                  Number(item.amount) || 0;

                const height =
                  (amount / maxSales) * 100;

                return (
                  <div
                    key={`${item.day}-${index}`}
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

            {salesOverview.length === 0 && (
              <div className="flex w-full items-center justify-center text-sm text-slate-400">
                No sales data available.
              </div>
            )}
          </div>
        </div>

        {/* INVENTORY */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Product Inventory
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Current store inventory
              </p>
            </div>

            <Package
              size={22}
              className="text-indigo-600"
            />
          </div>

          <div className="mt-7 space-y-6">
            {/* IN STOCK */}

            <div>
              <div className="mb-2 flex justify-between">
                <span className="text-sm text-slate-500">
                  In Stock
                </span>

                <span className="text-sm font-bold text-slate-800">
                  {inventory.inStockPercentage ||
                    0}
                  %
                </span>
              </div>

              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-emerald-500"
                  style={{
                    width: `${
                      inventory.inStockPercentage ||
                      0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* LOW STOCK */}

            <div>
              <div className="mb-2 flex justify-between">
                <span className="text-sm text-slate-500">
                  Low Stock
                </span>

                <span className="text-sm font-bold text-slate-800">
                  {inventory.lowStockPercentage ||
                    0}
                  %
                </span>
              </div>

              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-amber-500"
                  style={{
                    width: `${
                      inventory.lowStockPercentage ||
                      0
                    }%`,
                  }}
                />
              </div>
            </div>

            {/* OUT OF STOCK */}

            <div>
              <div className="mb-2 flex justify-between">
                <span className="text-sm text-slate-500">
                  Out of Stock
                </span>

                <span className="text-sm font-bold text-slate-800">
                  {inventory.outOfStockPercentage ||
                    0}
                  %
                </span>
              </div>

              <div className="h-2 rounded-full bg-slate-100">
                <div
                  className="h-2 rounded-full bg-red-500"
                  style={{
                    width: `${
                      inventory.outOfStockPercentage ||
                      0
                    }%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mt-7 rounded-xl bg-slate-50 p-4">
            <p className="text-xs font-medium text-slate-500">
              Total Products
            </p>

            <p className="mt-1 text-2xl font-bold text-slate-900">
              {stats.totalProducts || 0}
            </p>
          </div>
        </div>
      </div>

      {/* =================================================
          RECENT ORDERS + TOP PRODUCTS
      ================================================= */}

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* RECENT ORDERS */}

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recent Orders
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest orders placed by customers
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px]">
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
                            {order.id}
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
                      colSpan="5"
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

        {/* TOP PRODUCTS */}

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-5">
            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Top Products
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Best selling products
              </p>
            </div>
          </div>

          <div className="divide-y divide-slate-100">
            {topProducts.length > 0 ? (
              topProducts.map(
                (product, index) => (
                  <div
                    key={
                      product.name ||
                      index
                    }
                    className="flex items-center gap-3 p-4 transition hover:bg-slate-50"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-600">
                      {index + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-slate-800">
                        {product.name}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {product.category}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-800">
                        ₹
                        {Number(
                          product.revenue ||
                            0
                        ).toLocaleString(
                          "en-IN"
                        )}
                      </p>

                      <p className="mt-1 text-xs text-slate-400">
                        {product.sales || 0}{" "}
                        sold
                      </p>
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="p-6 text-center text-sm text-slate-400">
                No product sales yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;