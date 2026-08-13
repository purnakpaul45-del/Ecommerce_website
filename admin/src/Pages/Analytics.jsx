
import React, { useMemo, useState } from "react";
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
  ResponsiveContainer,
  Legend,
} from "recharts";

import {
  IndianRupee,
  ShoppingCart,
  Users,
  TrendingUp,
  TrendingDown,
  Package,
  RefreshCw,
  Download,
  CalendarDays,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock3,
  Truck,
  XCircle,
  AlertTriangle,
  Eye,
  MoreHorizontal,
  Activity,
  CreditCard,
  UserPlus,
} from "lucide-react";


// ======================================================
// ANALYTICS DASHBOARD
// ======================================================

const Analytics = () => {

  // ======================================================
  // STATE
  // ======================================================

  const [period, setPeriod] = useState("30");
  const [loading, setLoading] = useState(false);


  // ======================================================
  // DEMO REVENUE DATA
  // Replace with API data later
  // ======================================================

  const analyticsData = {

    "7": [
      {
        date: "Mon",
        revenue: 18500,
        orders: 22,
        customers: 18,
      },
      {
        date: "Tue",
        revenue: 24200,
        orders: 31,
        customers: 24,
      },
      {
        date: "Wed",
        revenue: 19800,
        orders: 27,
        customers: 21,
      },
      {
        date: "Thu",
        revenue: 31500,
        orders: 39,
        customers: 32,
      },
      {
        date: "Fri",
        revenue: 28400,
        orders: 35,
        customers: 29,
      },
      {
        date: "Sat",
        revenue: 42100,
        orders: 52,
        customers: 44,
      },
      {
        date: "Sun",
        revenue: 48600,
        orders: 61,
        customers: 51,
      },
    ],

    "30": [
      {
        date: "Week 1",
        revenue: 118000,
        orders: 142,
        customers: 104,
      },
      {
        date: "Week 2",
        revenue: 146000,
        orders: 176,
        customers: 138,
      },
      {
        date: "Week 3",
        revenue: 172000,
        orders: 204,
        customers: 165,
      },
      {
        date: "Week 4",
        revenue: 218000,
        orders: 261,
        customers: 208,
      },
    ],

    "90": [
      {
        date: "Jan",
        revenue: 385000,
        orders: 461,
        customers: 362,
      },
      {
        date: "Feb",
        revenue: 462000,
        orders: 548,
        customers: 431,
      },
      {
        date: "Mar",
        revenue: 576000,
        orders: 692,
        customers: 523,
      },
    ],

    "365": [
      {
        date: "Jan",
        revenue: 325000,
        orders: 391,
        customers: 302,
      },
      {
        date: "Feb",
        revenue: 368000,
        orders: 432,
        customers: 341,
      },
      {
        date: "Mar",
        revenue: 421000,
        orders: 503,
        customers: 386,
      },
      {
        date: "Apr",
        revenue: 462000,
        orders: 548,
        customers: 421,
      },
      {
        date: "May",
        revenue: 518000,
        orders: 617,
        customers: 468,
      },
      {
        date: "Jun",
        revenue: 574000,
        orders: 689,
        customers: 521,
      },
      {
        date: "Jul",
        revenue: 621000,
        orders: 741,
        customers: 568,
      },
      {
        date: "Aug",
        revenue: 698000,
        orders: 826,
        customers: 632,
      },
      {
        date: "Sep",
        revenue: 745000,
        orders: 892,
        customers: 684,
      },
      {
        date: "Oct",
        revenue: 812000,
        orders: 963,
        customers: 721,
      },
      {
        date: "Nov",
        revenue: 924000,
        orders: 1092,
        customers: 835,
      },
      {
        date: "Dec",
        revenue: 1085000,
        orders: 1284,
        customers: 962,
      },
    ],

  };


  // ======================================================
  // ORDER STATUS
  // ======================================================

  const orderStatusData = [
    {
      name: "Delivered",
      value: 624,
      icon: CheckCircle2,
    },
    {
      name: "Processing",
      value: 142,
      icon: Clock3,
    },
    {
      name: "Shipped",
      value: 218,
      icon: Truck,
    },
    {
      name: "Cancelled",
      value: 47,
      icon: XCircle,
    },
  ];


  // ======================================================
  // CATEGORY SALES
  // ======================================================

  const categoryData = [
    {
      category: "Men",
      sales: 425000,
    },
    {
      category: "Women",
      sales: 368000,
    },
    {
      category: "Kids",
      sales: 192000,
    },
    {
      category: "Accessories",
      sales: 114000,
    },
  ];


  // ======================================================
  // TOP PRODUCTS
  // ======================================================

  const topProducts = [
    {
      id: "PRD-001",
      name: "Premium Oversized T-Shirt",
      category: "Men",
      sold: 324,
      revenue: 97200,
      stock: 42,
    },
    {
      id: "PRD-002",
      name: "Classic Cotton Shirt",
      category: "Men",
      sold: 286,
      revenue: 85800,
      stock: 28,
    },
    {
      id: "PRD-003",
      name: "Women's Winter Jacket",
      category: "Women",
      sold: 241,
      revenue: 120500,
      stock: 19,
    },
    {
      id: "PRD-004",
      name: "Slim Fit Denim Jeans",
      category: "Men",
      sold: 218,
      revenue: 76300,
      stock: 35,
    },
    {
      id: "PRD-005",
      name: "Casual Summer Dress",
      category: "Women",
      sold: 194,
      revenue: 67900,
      stock: 14,
    },
  ];


  // ======================================================
  // RECENT TRANSACTIONS
  // ======================================================

  const recentOrders = [
    {
      id: "#ORD-1048",
      customer: "Rahul Sharma",
      amount: 2499,
      status: "Delivered",
      date: "Today, 10:42 AM",
    },
    {
      id: "#ORD-1047",
      customer: "Priya Das",
      amount: 1899,
      status: "Processing",
      date: "Today, 09:18 AM",
    },
    {
      id: "#ORD-1046",
      customer: "Arjun Singh",
      amount: 3499,
      status: "Shipped",
      date: "Yesterday",
    },
    {
      id: "#ORD-1045",
      customer: "Sneha Roy",
      amount: 1299,
      status: "Delivered",
      date: "Yesterday",
    },
    {
      id: "#ORD-1044",
      customer: "Amit Paul",
      amount: 4599,
      status: "Cancelled",
      date: "2 days ago",
    },
  ];


  // ======================================================
  // LOW STOCK PRODUCTS
  // ======================================================

  const lowStockProducts = [
    {
      name: "Casual Summer Dress",
      stock: 4,
    },
    {
      name: "Women's Winter Jacket",
      stock: 7,
    },
    {
      name: "Premium Sneakers",
      stock: 9,
    },
  ];


  // ======================================================
  // CURRENT DATA
  // ======================================================

  const currentData =
    analyticsData[period];


  // ======================================================
  // CALCULATIONS
  // ======================================================

  const totalRevenue = currentData.reduce(
    (sum, item) =>
      sum + item.revenue,
    0
  );

  const totalOrders = currentData.reduce(
    (sum, item) =>
      sum + item.orders,
    0
  );

  const totalCustomers = currentData.reduce(
    (sum, item) =>
      sum + item.customers,
    0
  );

  const averageOrderValue =
    totalOrders > 0
      ? totalRevenue / totalOrders
      : 0;

  const conversionRate = 4.86;


  // ======================================================
  // FORMAT CURRENCY
  // ======================================================

  const formatCurrency = (
    value
  ) => {
    return new Intl.NumberFormat(
      "en-IN",
      {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
      }
    ).format(value);
  };


  // ======================================================
  // REFRESH
  // ======================================================

  const handleRefresh = () => {

    setLoading(true);

    setTimeout(() => {
      setLoading(false);
    }, 1000);

  };


  // ======================================================
  // EXPORT
  // ======================================================

  const handleExport = () => {

    const report = {
      generatedAt:
        new Date().toISOString(),

      period,

      totalRevenue,

      totalOrders,

      totalCustomers,

      averageOrderValue,

      conversionRate,

      topProducts,

      recentOrders,
    };


    const blob =
      new Blob(
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
      URL.createObjectURL(
        blob
      );


    const link =
      document.createElement(
        "a"
      );


    link.href = url;

    link.download =
      "ecommerce-analytics-report.json";

    link.click();


    URL.revokeObjectURL(
      url
    );

  };


  // ======================================================
  // STAT CARDS
  // ======================================================

  const stats = [

    {
      title: "Total Revenue",

      value:
        formatCurrency(
          totalRevenue
        ),

      change: "18.6%",

      positive: true,

      icon: IndianRupee,

      subtitle:
        "vs previous period",
    },


    {
      title: "Total Orders",

      value:
        totalOrders.toLocaleString(),

      change: "12.4%",

      positive: true,

      icon: ShoppingCart,

      subtitle:
        "orders received",
    },


    {
      title: "New Customers",

      value:
        totalCustomers.toLocaleString(),

      change: "9.8%",

      positive: true,

      icon: UserPlus,

      subtitle:
        "new registrations",
    },


    {
      title: "Average Order Value",

      value:
        formatCurrency(
          averageOrderValue
        ),

      change: "6.4%",

      positive: true,

      icon: CreditCard,

      subtitle:
        "average customer spend",
    },

  ];


  // ======================================================
  // STATUS ICON
  // ======================================================

  const getStatusIcon = (
    status
  ) => {

    if (
      status ===
      "Delivered"
    ) {
      return (
        <CheckCircle2
          size={15}
        />
      );
    }

    if (
      status ===
      "Processing"
    ) {
      return (
        <Clock3
          size={15}
        />
      );
    }

    if (
      status ===
      "Shipped"
    ) {
      return (
        <Truck
          size={15}
        />
      );
    }

    return (
      <XCircle
        size={15}
      />
    );

  };


  // ======================================================
  // STATUS STYLE
  // ======================================================

  const getStatusStyle = (
    status
  ) => {

    if (
      status ===
      "Delivered"
    ) {
      return "bg-emerald-50 text-emerald-700";
    }

    if (
      status ===
      "Processing"
    ) {
      return "bg-amber-50 text-amber-700";
    }

    if (
      status ===
      "Shipped"
    ) {
      return "bg-blue-50 text-blue-700";
    }

    return "bg-red-50 text-red-700";

  };


  return (

    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">


      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-8 flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">


        <div>

          <div className="flex items-center gap-3">

            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Analytics Overview
            </h1>

            <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">

              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />

              Live Data

            </span>

          </div>


          <p className="mt-2 text-sm text-slate-500">
            Track your store performance,
            revenue, customers and orders.
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
                setPeriod(
                  e.target.value
                )
              }
              className="h-11 appearance-none rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm font-semibold text-slate-700 outline-none focus:border-indigo-500"
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
            onClick={
              handleRefresh
            }
            className="flex h-11 items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
          >

            <RefreshCw
              size={17}
              className={
                loading
                  ? "animate-spin"
                  : ""
              }
            />

            Refresh

          </button>


          {/* EXPORT */}

          <button
            onClick={
              handleExport
            }
            className="flex h-11 items-center gap-2 rounded-xl bg-indigo-600 px-4 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700"
          >

            <Download
              size={17}
            />

            Export Report

          </button>

        </div>

      </div>


      {/* ==================================================
          KPI CARDS
      ================================================== */}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">


        {stats.map(
          (stat) => {

            const Icon =
              stat.icon;


            return (

              <div
                key={
                  stat.title
                }
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >


                <div className="flex items-start justify-between">


                  <div>

                    <p className="text-sm font-medium text-slate-500">
                      {stat.title}
                    </p>


                    <h2 className="mt-3 text-2xl font-bold text-slate-900">
                      {stat.value}
                    </h2>

                  </div>


                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

                    <Icon
                      size={22}
                    />

                  </div>

                </div>


                <div className="mt-5 flex items-center gap-2">

                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">

                    <ArrowUpRight
                      size={14}
                    />

                    {stat.change}

                  </span>


                  <span className="text-xs text-slate-400">

                    {stat.subtitle}

                  </span>

                </div>

              </div>

            );

          }
        )}

      </div>


      {/* ==================================================
          MAIN REVENUE SECTION
      ================================================== */}

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">


        {/* REVENUE CHART */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm xl:col-span-2 sm:p-6">


          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">


            <div>

              <h2 className="text-lg font-bold text-slate-900">
                Revenue Performance
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Revenue growth across the selected period.
              </p>

            </div>


            <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">

              <TrendingUp
                size={17}
              />

              +18.6%

            </div>

          </div>


          <div className="h-[350px]">


            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <AreaChart
                data={
                  currentData
                }
              >

                <defs>

                  <linearGradient
                    id="revenueArea"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >

                    <stop
                      offset="5%"
                      stopOpacity={
                        0.25
                      }
                    />

                    <stop
                      offset="95%"
                      stopOpacity={
                        0
                      }
                    />

                  </linearGradient>

                </defs>


                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />


                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: "#64748b",
                  }}
                />


                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fill: "#64748b",
                  }}
                  tickFormatter={(
                    value
                  ) =>
                    `₹${(
                      value /
                      1000
                    ).toFixed(
                      0
                    )}k`
                  }
                />


                <Tooltip
                  formatter={(
                    value
                  ) =>
                    formatCurrency(
                      value
                    )
                  }
                />


                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#4f46e5"
                  strokeWidth={3}
                  fill="url(#revenueArea)"
                />

              </AreaChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* PERFORMANCE SUMMARY */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">


          <div className="mb-6">

            <h2 className="text-lg font-bold text-slate-900">
              Performance Summary
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Key business indicators.
            </p>

          </div>


          <div className="space-y-6">


            {/* CONVERSION */}

            <div>

              <div className="mb-2 flex justify-between">

                <span className="text-sm font-medium text-slate-600">
                  Conversion Rate
                </span>

                <span className="text-sm font-bold text-slate-900">
                  {conversionRate}%
                </span>

              </div>


              <div className="h-2 overflow-hidden rounded-full bg-slate-100">

                <div
                  className="h-full rounded-full bg-indigo-600"
                  style={{
                    width:
                      `${conversionRate * 10}%`,
                  }}
                />

              </div>

            </div>


            {/* AOV */}

            <div className="rounded-xl bg-slate-50 p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">

                  <CreditCard
                    size={18}
                  />

                </div>


                <div>

                  <p className="text-xs text-slate-500">
                    Average Order Value
                  </p>

                  <p className="mt-1 text-lg font-bold text-slate-900">

                    {formatCurrency(
                      averageOrderValue
                    )}

                  </p>

                </div>

              </div>

            </div>


            {/* CUSTOMER GROWTH */}

            <div className="rounded-xl bg-slate-50 p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">

                  <Users
                    size={18}
                  />

                </div>


                <div>

                  <p className="text-xs text-slate-500">
                    Customer Growth
                  </p>

                  <p className="mt-1 flex items-center gap-1 text-lg font-bold text-slate-900">

                    +9.8%

                    <TrendingUp
                      size={16}
                      className="text-emerald-500"
                    />

                  </p>

                </div>

              </div>

            </div>


            {/* ORDER GROWTH */}

            <div className="rounded-xl bg-slate-50 p-4">

              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">

                  <ShoppingCart
                    size={18}
                  />

                </div>


                <div>

                  <p className="text-xs text-slate-500">
                    Order Growth
                  </p>

                  <p className="mt-1 flex items-center gap-1 text-lg font-bold text-slate-900">

                    +12.4%

                    <TrendingUp
                      size={16}
                      className="text-emerald-500"
                    />

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </div>


      {/* ==================================================
          CHART GRID
      ================================================== */}

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">


        {/* ORDER STATUS */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">


          <div className="mb-6">

            <h2 className="text-lg font-bold text-slate-900">
              Order Status
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Current order fulfillment breakdown.
            </p>

          </div>


          <div className="flex flex-col items-center gap-6 sm:flex-row">


            <div className="h-64 w-full sm:w-1/2">

              <ResponsiveContainer
                width="100%"
                height="100%"
              >

                <PieChart>

                  <Pie
                    data={
                      orderStatusData
                    }
                    dataKey="value"
                    nameKey="name"
                    innerRadius={
                      65
                    }
                    outerRadius={
                      95
                    }
                    paddingAngle={
                      4
                    }
                  >

                    {orderStatusData.map(
                      (
                        _,
                        index
                      ) => (

                        <Cell
                          key={
                            index
                          }
                        />

                      )
                    )}

                  </Pie>

                  <Tooltip />

                </PieChart>

              </ResponsiveContainer>

            </div>


            <div className="w-full space-y-4 sm:w-1/2">

              {orderStatusData.map(
                (
                  item
                ) => {

                  const Icon =
                    item.icon;


                  return (

                    <div
                      key={
                        item.name
                      }
                      className="flex items-center justify-between"
                    >

                      <div className="flex items-center gap-3">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100 text-slate-600">

                          <Icon
                            size={17}
                          />

                        </div>


                        <span className="text-sm font-medium text-slate-700">

                          {
                            item.name
                          }

                        </span>

                      </div>


                      <span className="text-sm font-bold text-slate-900">

                        {
                          item.value
                        }

                      </span>

                    </div>

                  );

                }
              )}

            </div>

          </div>

        </div>


        {/* CATEGORY SALES */}

        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">


          <div className="mb-6">

            <h2 className="text-lg font-bold text-slate-900">
              Sales by Category
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Revenue contribution by category.
            </p>

          </div>


          <div className="h-64">

            <ResponsiveContainer
              width="100%"
              height="100%"
            >

              <BarChart
                data={
                  categoryData
                }
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />


                <XAxis
                  dataKey="category"
                  axisLine={false}
                  tickLine={false}
                />


                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(
                    value
                  ) =>
                    `₹${value / 1000}k`
                  }
                />


                <Tooltip
                  formatter={(
                    value
                  ) =>
                    formatCurrency(
                      value
                    )
                  }
                />


                <Bar
                  dataKey="sales"
                  fill="#4f46e5"
                  radius={[
                    8,
                    8,
                    0,
                    0,
                  ]}
                  barSize={
                    45
                  }
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>


      {/* ==================================================
          BOTTOM SECTION
      ================================================== */}

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">


        {/* TOP PRODUCTS */}

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm xl:col-span-2">


          <div className="flex items-center justify-between border-b border-slate-100 p-5">

            <div>

              <h2 className="text-lg font-bold text-slate-900">
                Top Selling Products
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Best performing products by revenue.
              </p>

            </div>


            <button className="flex items-center gap-1 text-sm font-bold text-indigo-600 hover:text-indigo-700">

              View All

              <ArrowUpRight
                size={16}
              />

            </button>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full">

              <thead>

                <tr className="border-b border-slate-100 bg-slate-50">

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                    Product
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                    Category
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                    Sold
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                    Stock
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-bold uppercase text-slate-500">
                    Revenue
                  </th>

                </tr>

              </thead>


              <tbody>

                {topProducts.map(
                  (
                    product,
                    index
                  ) => (

                    <tr
                      key={
                        product.id
                      }
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                    >

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-600">

                            #
                            {
                              index +
                              1
                            }

                          </div>


                          <div>

                            <p className="text-sm font-semibold text-slate-800">

                              {
                                product.name
                              }

                            </p>


                            <p className="mt-1 text-xs text-slate-400">

                              {
                                product.id
                              }

                            </p>

                          </div>

                        </div>

                      </td>


                      <td className="px-5 py-4 text-sm text-slate-600">

                        {
                          product.category
                        }

                      </td>


                      <td className="px-5 py-4 text-sm font-semibold text-slate-700">

                        {
                          product.sold
                        }

                      </td>


                      <td className="px-5 py-4">

                        <span
                          className={`text-sm font-bold ${
                            product.stock <
                            10
                              ? "text-red-600"
                              : "text-emerald-600"
                          }`}
                        >

                          {
                            product.stock
                          }

                        </span>

                      </td>


                      <td className="px-5 py-4 text-right text-sm font-bold text-slate-900">

                        {
                          formatCurrency(
                            product.revenue
                          )
                        }

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        </div>


        {/* LOW STOCK */}

        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">


          <div className="border-b border-slate-100 p-5">

            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">

                <AlertTriangle
                  size={20}
                />

              </div>


              <div>

                <h2 className="font-bold text-slate-900">
                  Low Stock Alert
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Products that need attention.
                </p>

              </div>

            </div>

          </div>


          <div className="divide-y divide-slate-100">

            {lowStockProducts.map(
              (
                product
              ) => (

                <div
                  key={
                    product.name
                  }
                  className="flex items-center justify-between p-4"
                >

                  <div className="flex items-center gap-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">

                      <Package
                        size={17}
                        className="text-slate-500"
                      />

                    </div>


                    <div>

                      <p className="text-sm font-semibold text-slate-800">

                        {
                          product.name
                        }

                      </p>


                      <p className="mt-1 text-xs text-slate-400">

                        Only {
                          product.stock
                        } units remaining

                      </p>

                    </div>

                  </div>


                  <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600">

                    Low Stock

                  </span>

                </div>

              )
            )}

          </div>


          <div className="border-t border-slate-100 p-4">

            <button className="w-full rounded-xl bg-slate-900 py-3 text-sm font-bold text-white transition hover:bg-slate-800">

              Manage Inventory

            </button>

          </div>

        </div>

      </div>


      {/* ==================================================
          RECENT ORDERS
      ================================================== */}

      <div className="mt-6 rounded-2xl border border-slate-200 bg-white shadow-sm">


        <div className="flex items-center justify-between border-b border-slate-100 p-5">

          <div>

            <h2 className="text-lg font-bold text-slate-900">
              Recent Transactions
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Latest customer orders and payments.
            </p>

          </div>


          <button className="flex items-center gap-2 text-sm font-bold text-indigo-600">

            View All Orders

            <ArrowUpRight
              size={16}
            />

          </button>

        </div>


        <div className="overflow-x-auto">

          <table className="w-full">

            <thead>

              <tr className="border-b border-slate-100 bg-slate-50">

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Order
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Customer
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Date
                </th>

                <th className="px-5 py-4 text-left text-xs font-bold uppercase text-slate-500">
                  Status
                </th>

                <th className="px-5 py-4 text-right text-xs font-bold uppercase text-slate-500">
                  Amount
                </th>

                <th className="px-5 py-4 text-right text-xs font-bold uppercase text-slate-500">
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              {recentOrders.map(
                (
                  order
                ) => (

                  <tr
                    key={
                      order.id
                    }
                    className="border-b border-slate-100 last:border-0 hover:bg-slate-50"
                  >

                    <td className="px-5 py-4 text-sm font-bold text-indigo-600">

                      {
                        order.id
                      }

                    </td>


                    <td className="px-5 py-4 text-sm font-medium text-slate-700">

                      {
                        order.customer
                      }

                    </td>


                    <td className="px-5 py-4 text-sm text-slate-500">

                      {
                        order.date
                      }

                    </td>


                    <td className="px-5 py-4">

                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ${getStatusStyle(
                          order.status
                        )}`}
                      >

                        {
                          getStatusIcon(
                            order.status
                          )
                        }

                        {
                          order.status
                        }

                      </span>

                    </td>


                    <td className="px-5 py-4 text-right text-sm font-bold text-slate-900">

                      {
                        formatCurrency(
                          order.amount
                        )
                      }

                    </td>


                    <td className="px-5 py-4 text-right">

                      <button className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700">

                        <MoreHorizontal
                          size={18}
                        />

                      </button>

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>


      {/* ==================================================
          FOOTER SUMMARY
      ================================================== */}

      <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between">

        <div className="flex items-center gap-3">

          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">

            <Activity
              size={19}
            />

          </div>


          <div>

            <p className="text-sm font-bold text-slate-900">
              Your store is performing well
            </p>

            <p className="mt-1 text-xs text-slate-500">
              Revenue and order volume are trending upward.
            </p>

          </div>

        </div>


        <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">

          <TrendingUp
            size={17}
          />

          18.6% overall growth

        </div>

      </div>

    </div>

  );

};


export default Analytics;

