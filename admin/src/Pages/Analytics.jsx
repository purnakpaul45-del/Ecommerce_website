import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

import {
  IndianRupee,
  ShoppingCart,
  Users,
  RefreshCw,
  Download,
  CalendarDays,
  ChevronDown,
  ArrowUpRight,
  CheckCircle2,
  Clock3,
  Truck,
  XCircle,
  Package,
  CreditCard,
  Activity,
  TrendingUp,
} from "lucide-react";

// =====================================================
// COLORS
// =====================================================

const STATUS_COLORS = {
  Delivered: "#10b981",
  Processing: "#f59e0b",
  Shipped: "#3b82f6",
  "Out for Delivery": "#06b6d4",
  Packed: "#8b5cf6",
  Cancelled: "#ef4444",
  "Order Placed": "#64748b",
};

const CATEGORY_COLORS = [
  "#4f46e5",
  "#7c3aed",
  "#0891b2",
  "#059669",
  "#d97706",
  "#dc2626",
];

// =====================================================
// ANALYTICS
// =====================================================

const Analytics = () => {
  // ===================================================
  // BACKEND
  // ===================================================

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // ===================================================
  // STATE
  // ===================================================

  const [period, setPeriod] = useState("7");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ===================================================
  // FETCH DASHBOARD DATA
  // ===================================================

  const fetchAnalytics = async () => {
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

      console.log("Analytics Response:", response.data);

      if (response.data?.success) {
        setData(response.data.data);
      } else {
        setError(
          response.data?.message ||
            "Failed to load analytics."
        );
      }
    } catch (err) {
      console.error("Analytics Error:", err);
      console.error(
        "Server Response:",
        err.response?.data
      );

      setError(
        err.response?.data?.message ||
          "Failed to load analytics."
      );
    } finally {
      setLoading(false);
    }
  };

  // ===================================================
  // INITIAL LOAD
  // ===================================================

  useEffect(() => {
    fetchAnalytics();
  }, []);

  // ===================================================
  // FORMAT CURRENCY
  // ===================================================

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(Number(value || 0));
  };

  // ===================================================
  // BASIC DATA
  // ===================================================

  const totalRevenue = Number(
    data?.totalRevenue || 0
  );

  const totalOrders = Number(
    data?.totalOrders || 0
  );

  const totalCustomers = Number(
    data?.totalCustomers || 0
  );

  const deliveredOrders = Number(
    data?.deliveredOrders || 0
  );

  const processingOrders = Number(
    data?.processingOrders || 0
  );

  const shippedOrders = Number(
    data?.shippedOrders || 0
  );

  const cancelledOrders = Number(
    data?.cancelledOrders || 0
  );

  // ===================================================
  // AVERAGE ORDER VALUE
  // ===================================================

  const averageOrderValue =
    deliveredOrders > 0
      ? totalRevenue / deliveredOrders
      : 0;

  // ===================================================
  // CHART DATA
  // ===================================================

  const salesData = data?.salesData || [];

  const orderStatusData =
    data?.orderStatusData || [];

  const categoryData =
    data?.categoryData || [];

  const topProducts =
    data?.topProducts || [];

  const recentOrders =
    data?.recentOrders || [];

  // ===================================================
  // FILTER SALES DATA
  // ===================================================

  const currentData = useMemo(() => {
    if (!salesData.length) return [];

    const numberOfDays = Number(period);

    if (period === "365") {
      return salesData;
    }

    return salesData.slice(
      Math.max(
        salesData.length - numberOfDays,
        0
      )
    );
  }, [salesData, period]);

  // ===================================================
  // STATUS TOTAL
  // ===================================================

  const statusTotal = useMemo(() => {
    return orderStatusData.reduce(
      (total, item) =>
        total + Number(item.value || 0),
      0
    );
  }, [orderStatusData]);

  // ===================================================
  // EXPORT
  // ===================================================

  const handleExport = () => {
    const report = {
      generatedAt:
        new Date().toISOString(),

      period,

      summary: {
        totalRevenue,
        totalOrders,
        totalCustomers,
        deliveredOrders,
        processingOrders,
        shippedOrders,
        cancelledOrders,
        averageOrderValue,
      },

      salesData: currentData,
      orderStatusData,
      categoryData,
      topProducts,
      recentOrders,
    };

    const blob = new Blob(
      [
        JSON.stringify(
          report,
          null,
          2
        ),
      ],
      {
        type: "application/json",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "ecommerce-analytics-report.json";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // ===================================================
  // STATUS ICON
  // ===================================================

  const getStatusIcon = (status) => {
    switch (status) {
      case "Delivered":
        return <CheckCircle2 size={15} />;

      case "Processing":
        return <Clock3 size={15} />;

      case "Shipped":
        return <Truck size={15} />;

      case "Out for Delivery":
        return <Truck size={15} />;

      case "Packed":
        return <Package size={15} />;

      case "Cancelled":
        return <XCircle size={15} />;

      default:
        return <Package size={15} />;
    }
  };

  // ===================================================
  // STATUS STYLE
  // ===================================================

  const getStatusStyle = (status) => {
    switch (status) {
      case "Delivered":
        return "bg-emerald-50 text-emerald-700";

      case "Processing":
        return "bg-amber-50 text-amber-700";

      case "Shipped":
        return "bg-blue-50 text-blue-700";

      case "Out for Delivery":
        return "bg-cyan-50 text-cyan-700";

      case "Packed":
        return "bg-purple-50 text-purple-700";

      case "Cancelled":
        return "bg-red-50 text-red-700";

      default:
        return "bg-slate-100 text-slate-600";
    }
  };

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {
    return (
      <div className="flex min-h-[600px] items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-4">
          <RefreshCw
            size={32}
            className="animate-spin text-indigo-600"
          />

          <p className="text-sm font-medium text-slate-500">
            Loading analytics...
          </p>
        </div>
      </div>
    );
  }

  // ===================================================
  // ERROR
  // ===================================================

  if (error) {
    return (
      <div className="flex min-h-[600px] items-center justify-center bg-slate-50 p-6">
        <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
            <XCircle size={28} />
          </div>

          <h2 className="mt-4 text-lg font-bold text-slate-900">
            Unable to load analytics
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchAnalytics}
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // ===================================================
  // KPI CARDS
  // ===================================================

  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(totalRevenue),
      icon: IndianRupee,
      description: "From delivered orders",
    },
    {
      title: "Total Orders",
      value: totalOrders.toLocaleString(),
      icon: ShoppingCart,
      description: "All customer orders",
    },
    {
      title: "Total Customers",
      value: totalCustomers.toLocaleString(),
      icon: Users,
      description: "Registered customers",
    },
    {
      title: "Average Order Value",
      value: formatCurrency(
        averageOrderValue
      ),
      icon: CreditCard,
      description: "Average delivered order",
    },
  ];

  // ===================================================
  // UI
  // ===================================================

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

        <div>
          <div className="flex flex-wrap items-center gap-3">

            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Analytics Overview
            </h1>

            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />
              Live Data
            </span>

          </div>

          <p className="mt-2 text-sm text-slate-500">
            Monitor your store performance,
            orders and revenue in real time.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">

          {/* PERIOD */}

          <div className="relative">

            <CalendarDays
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <select
              value={period}
              onChange={(e) =>
                setPeriod(e.target.value)
              }
              className="h-11 appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            >
              <option value="7">
                Last 7 Days
              </option>

              <option value="30">
                Last 30 Days
              </option>

              <option value="90">
                Last 90 Days
              </option>

              <option value="365">
                Last 12 Months
              </option>
            </select>

            <ChevronDown
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

          </div>

          {/* REFRESH */}

          <button
            type="button"
            onClick={fetchAnalytics}
            className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
          >
            <RefreshCw size={17} />
            Refresh
          </button>

          {/* EXPORT */}

          <button
            type="button"
            onClick={handleExport}
            className="flex h-11 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
          >
            <Download size={17} />
            Export
          </button>

        </div>
      </div>

      {/* =================================================
          KPI CARDS
      ================================================= */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            >

              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    {stat.title}
                  </p>

                  <h2 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
                    {stat.value}
                  </h2>

                  <p className="mt-2 text-xs text-slate-400">
                    {stat.description}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <Icon size={22} />
                </div>

              </div>

              <div className="mt-5 flex items-center gap-2">
                <ArrowUpRight
                  size={14}
                  className="text-emerald-600"
                />

                <span className="text-xs font-bold text-emerald-600">
                  Live
                </span>

                <span className="text-xs text-slate-400">
                  database data
                </span>
              </div>

            </div>
          );
        })}

      </div>

      {/* =================================================
          REVENUE + ORDER SUMMARY
      ================================================= */}

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">

        {/* =================================================
            REVENUE PERFORMANCE
        ================================================= */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2">

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Revenue Performance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Revenue generated from delivered
                orders.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700">
              <TrendingUp size={15} />
              Revenue
            </div>

          </div>

          <div className="mt-6 h-[350px]">

            {currentData.length > 0 ? (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <AreaChart
                  data={currentData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 0,
                  }}
                >

                  <defs>

                    <linearGradient
                      id="revenueGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >

                      <stop
                        offset="0%"
                        stopColor="#4f46e5"
                        stopOpacity={0.35}
                      />

                      <stop
                        offset="100%"
                        stopColor="#4f46e5"
                        stopOpacity={0.02}
                      />

                    </linearGradient>

                  </defs>

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />

                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#64748b",
                      fontSize: 12,
                    }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#64748b",
                      fontSize: 12,
                    }}
                    tickFormatter={(value) =>
                      `₹${(
                        Number(value) / 1000
                      ).toFixed(0)}k`
                    }
                  />

                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid #e2e8f0",
                      boxShadow:
                        "0 10px 30px rgba(0,0,0,0.08)",
                    }}
                    formatter={(value) => [
                      formatCurrency(value),
                      "Revenue",
                    ]}
                  />

                  <Area
                    type="monotone"
                    dataKey="amount"
                    stroke="#4f46e5"
                    strokeWidth={3}
                    fill="url(#revenueGradient)"
                    dot={{
                      r: 3,
                      strokeWidth: 2,
                    }}
                    activeDot={{
                      r: 6,
                    }}
                  />

                </AreaChart>

              </ResponsiveContainer>

            ) : (

              <div className="flex h-full flex-col items-center justify-center">

                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50 text-indigo-500">
                  <IndianRupee size={30} />
                </div>

                <p className="mt-4 text-sm font-semibold text-slate-600">
                  No revenue data available
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Mark orders as Delivered to
                  generate revenue.
                </p>

              </div>

            )}

          </div>
        </div>

        {/* =================================================
            ORDER SUMMARY
        ================================================= */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Order Summary
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current order activity.
            </p>
          </div>

          <div className="mt-6 space-y-4">

            {/* DELIVERED */}

            <div className="flex items-center justify-between rounded-xl bg-emerald-50 p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-emerald-600 shadow-sm">
                  <CheckCircle2 size={19} />
                </div>

                <div>
                  <p className="text-xs font-medium text-emerald-700">
                    Delivered
                  </p>

                  <p className="mt-1 text-xl font-bold text-emerald-900">
                    {deliveredOrders}
                  </p>
                </div>

              </div>

              <span className="text-xs font-semibold text-emerald-600">
                Completed
              </span>

            </div>

            {/* PROCESSING */}

            <div className="flex items-center justify-between rounded-xl bg-amber-50 p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-amber-600 shadow-sm">
                  <Clock3 size={19} />
                </div>

                <div>
                  <p className="text-xs font-medium text-amber-700">
                    Processing
                  </p>

                  <p className="mt-1 text-xl font-bold text-amber-900">
                    {processingOrders}
                  </p>
                </div>

              </div>

              <span className="text-xs font-semibold text-amber-600">
                Pending
              </span>

            </div>

            {/* SHIPPED */}

            <div className="flex items-center justify-between rounded-xl bg-blue-50 p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-blue-600 shadow-sm">
                  <Truck size={19} />
                </div>

                <div>
                  <p className="text-xs font-medium text-blue-700">
                    Shipped
                  </p>

                  <p className="mt-1 text-xl font-bold text-blue-900">
                    {shippedOrders}
                  </p>
                </div>

              </div>

              <span className="text-xs font-semibold text-blue-600">
                In transit
              </span>

            </div>

            {/* CANCELLED */}

            <div className="flex items-center justify-between rounded-xl bg-red-50 p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-red-600 shadow-sm">
                  <XCircle size={19} />
                </div>

                <div>
                  <p className="text-xs font-medium text-red-700">
                    Cancelled
                  </p>

                  <p className="mt-1 text-xl font-bold text-red-900">
                    {cancelledOrders}
                  </p>
                </div>

              </div>

              <span className="text-xs font-semibold text-red-600">
                Cancelled
              </span>

            </div>

          </div>
        </div>
      </div>

      {/* =================================================
          ORDER STATUS + CATEGORY
      ================================================= */}

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">

        {/* =================================================
            ORDER STATUS PIE
        ================================================= */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-start justify-between">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Order Status
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Distribution of all current orders.
              </p>
            </div>

            <div className="rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
              {statusTotal} Orders
            </div>

          </div>

          {orderStatusData.length > 0 ? (

            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">

              {/* DONUT */}

              <div className="relative h-[280px]">

                <ResponsiveContainer
                  width="100%"
                  height="100%"
                >

                  <PieChart>

                    <Pie
                      data={orderStatusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      innerRadius={68}
                      outerRadius={100}
                      paddingAngle={3}
                      stroke="#ffffff"
                      strokeWidth={3}
                    >

                      {orderStatusData.map(
                        (item, index) => (
                          <Cell
                            key={`${item.name}-${index}`}
                            fill={
                              STATUS_COLORS[
                                item.name
                              ] ||
                              STATUS_COLORS[
                                Object.keys(
                                  STATUS_COLORS
                                )[index %
                                  Object.keys(
                                    STATUS_COLORS
                                  ).length]
                              ]
                            }
                          />
                        )
                      )}

                    </Pie>

                    <Tooltip
                      contentStyle={{
                        borderRadius: "12px",
                        border:
                          "1px solid #e2e8f0",
                      }}
                      formatter={(value, name) => [
                        `${value} orders`,
                        name,
                      ]}
                    />

                  </PieChart>

                </ResponsiveContainer>

                {/* CENTER VALUE */}

                <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">

                  <p className="text-3xl font-bold text-slate-900">
                    {statusTotal}
                  </p>

                  <p className="text-xs font-medium text-slate-400">
                    Total Orders
                  </p>

                </div>

              </div>

              {/* LEGEND */}

              <div className="flex flex-col justify-center space-y-4">

                {orderStatusData.map(
                  (item, index) => {

                    const percentage =
                      statusTotal > 0
                        ? (
                            (Number(
                              item.value
                            ) /
                              statusTotal) *
                            100
                          ).toFixed(1)
                        : 0;

                    const color =
                      STATUS_COLORS[
                        item.name
                      ] ||
                      STATUS_COLORS[
                        Object.keys(
                          STATUS_COLORS
                        )[index %
                          Object.keys(
                            STATUS_COLORS
                          ).length]
                      ];

                    return (
                      <div
                        key={`${item.name}-${index}`}
                        className="rounded-xl border border-slate-100 p-3"
                      >

                        <div className="flex items-center justify-between">

                          <div className="flex items-center gap-3">

                            <span
                              className="h-3 w-3 rounded-full"
                              style={{
                                backgroundColor:
                                  color,
                              }}
                            />

                            <span className="text-sm font-semibold text-slate-700">
                              {item.name}
                            </span>

                          </div>

                          <span className="text-sm font-bold text-slate-900">
                            {item.value}
                          </span>

                        </div>

                        <div className="mt-2 flex items-center justify-between">

                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">

                            <div
                              className="h-full rounded-full"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor:
                                  color,
                              }}
                            />

                          </div>

                          <span className="ml-3 w-10 text-right text-xs font-semibold text-slate-400">
                            {percentage}%
                          </span>

                        </div>

                      </div>
                    );
                  }
                )}

              </div>

            </div>

          ) : (

            <div className="flex h-[280px] flex-col items-center justify-center">

              <Package
                size={42}
                className="text-slate-300"
              />

              <p className="mt-4 text-sm font-semibold text-slate-500">
                No order status data
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Order status information will
                appear here.
              </p>

            </div>

          )}

        </div>

        {/* =================================================
            CATEGORY BAR GRAPH
        ================================================= */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex items-start justify-between">

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Sales by Category
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Revenue generated by product category.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-xs font-semibold text-indigo-700">
              <IndianRupee size={14} />
              Sales
            </div>

          </div>

          <div className="mt-6 h-[310px]">

            {categoryData.length > 0 ? (

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <BarChart
                  data={categoryData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 10,
                  }}
                  barCategoryGap="25%"
                >

                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#e2e8f0"
                  />

                  <XAxis
                    dataKey="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#64748b",
                      fontSize: 12,
                    }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#64748b",
                      fontSize: 12,
                    }}
                    tickFormatter={(value) =>
                      `₹${(
                        Number(value) / 1000
                      ).toFixed(0)}k`
                    }
                  />

                  <Tooltip
                    cursor={{
                      fill: "#f8fafc",
                    }}
                    contentStyle={{
                      borderRadius: "12px",
                      border:
                        "1px solid #e2e8f0",
                      boxShadow:
                        "0 10px 30px rgba(0,0,0,0.08)",
                    }}
                    formatter={(value) => [
                      formatCurrency(value),
                      "Sales",
                    ]}
                  />

                  <Bar
                    dataKey="sales"
                    radius={[
                      8,
                      8,
                      0,
                      0,
                    ]}
                  >

                    {categoryData.map(
                      (item, index) => (
                        <Cell
                          key={`${item.category}-${index}`}
                          fill={
                            CATEGORY_COLORS[
                              index %
                                CATEGORY_COLORS.length
                            ]
                          }
                        />
                      )
                    )}

                  </Bar>

                </BarChart>

              </ResponsiveContainer>

            ) : (

              <div className="flex h-full flex-col items-center justify-center">

                <Package
                  size={42}
                  className="text-slate-300"
                />

                <p className="mt-4 text-sm font-semibold text-slate-500">
                  No category sales yet
                </p>

                <p className="mt-1 text-xs text-slate-400">
                  Delivered orders will appear
                  here.
                </p>

              </div>

            )}

          </div>

        </div>

      </div>

      {/* =================================================
          TOP PRODUCTS
      ================================================= */}

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="flex items-center justify-between border-b border-slate-100 p-5">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Package size={21} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Top Selling Products
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Best performing products based
                on delivered orders.
              </p>
            </div>

          </div>

          <span className="hidden rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-500 sm:block">
            Top Products
          </span>

        </div>

        <div className="divide-y divide-slate-100">

          {topProducts.length > 0 ? (

            topProducts.map(
              (product, index) => (

                <div
                  key={
                    product._id ||
                    product.id ||
                    `${product.name}-${index}`
                  }
                  className="flex items-center gap-4 p-5 transition hover:bg-slate-50"
                >

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 font-bold text-indigo-600">
                    {index + 1}
                  </div>

                  <div className="min-w-0 flex-1">

                    <p className="truncate text-sm font-semibold text-slate-800">
                      {product.name ||
                        "Unknown Product"}
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      {product.sales || 0} units sold
                    </p>

                  </div>

                  <div className="text-right">

                    <p className="text-sm font-bold text-slate-800">
                      {formatCurrency(
                        product.revenue
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

            <div className="p-10 text-center">

              <Package
                size={40}
                className="mx-auto text-slate-300"
              />

              <p className="mt-3 text-sm font-semibold text-slate-500">
                No product sales yet
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Products from delivered orders
                will appear here.
              </p>

            </div>

          )}

        </div>

      </div>

      {/* =================================================
          RECENT TRANSACTIONS
      ================================================= */}

      <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-100 p-5">

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <CreditCard size={19} />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900">
                Recent Transactions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Latest customer orders.
              </p>
            </div>

          </div>

        </div>

        <div className="overflow-x-auto">

          <table className="w-full min-w-[850px]">

            <thead>

              <tr className="border-b border-slate-100 bg-slate-50">

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Order
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Customer
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Amount
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Payment
                </th>

                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                  Status
                </th>

              </tr>

            </thead>

            <tbody>

              {recentOrders.length > 0 ? (

                recentOrders.map(
                  (order, index) => (

                    <tr
                      key={
                        order.id ||
                        order._id ||
                        index
                      }
                      className="border-b border-slate-100 transition hover:bg-slate-50"
                    >

                      <td className="px-5 py-4">

                        <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-bold text-indigo-600">
                          #{String(
                            order.id ||
                              order._id ||
                              ""
                          ).slice(-8)}
                        </span>

                      </td>

                      <td className="px-5 py-4">

                        <p className="text-sm font-semibold text-slate-700">
                          {order.customer ||
                            "Customer"}
                        </p>

                      </td>

                      <td className="px-5 py-4">

                        <p className="text-sm font-bold text-slate-900">
                          {formatCurrency(
                            order.amount
                          )}
                        </p>

                      </td>

                      <td className="px-5 py-4">

                        <p className="text-sm font-medium text-slate-700">
                          {order.paymentMethod ||
                            "COD"}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {order.paymentStatus ||
                            "Pending"}
                        </p>

                      </td>

                      <td className="px-5 py-4">

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${getStatusStyle(
                            order.status
                          )}`}
                        >

                          {getStatusIcon(
                            order.status
                          )}

                          {order.status ||
                            "Order Placed"}

                        </span>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="5"
                    className="px-5 py-12 text-center"
                  >

                    <Package
                      size={38}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-3 text-sm font-semibold text-slate-500">
                      No recent transactions
                    </p>

                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

      </div>

      {/* =================================================
          DATABASE CONNECTION FOOTER
      ================================================= */}

      <div className="mt-6 flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
          <Activity size={20} />
        </div>

        <div>

          <p className="text-sm font-bold text-slate-900">
            Analytics connected to your database
          </p>

          <p className="mt-1 text-xs text-slate-500">
            Revenue is calculated from Delivered
            orders and order statistics are based
            on your MongoDB data.
          </p>

        </div>

      </div>

    </div>
  );
};

export default Analytics;