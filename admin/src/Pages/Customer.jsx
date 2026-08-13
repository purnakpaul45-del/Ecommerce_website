
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Search,
  Users,
  Mail,
  Phone,
  ShoppingBag,
  IndianRupee,
  Eye,
  RefreshCw,
  UserCheck,
  UserX,
  X,
  MapPin,
} from "lucide-react";

const Customers = () => {
  // =========================================================
  // BACKEND URL
  // =========================================================

  const backendUrl = "http://localhost:8005";

  // =========================================================
  // STATES
  // =========================================================

  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // =========================================================
  // FETCH CUSTOMERS
  // =========================================================

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await axios.get(
        `${backendUrl}/api/admin/customers/all`
      );

      if (response.data.success) {
        setCustomers(response.data.customers || []);
      } else {
        setError(response.data.message || "Failed to load customers");
      }
    } catch (err) {
      console.error("Customer fetch error:", err);

      setError(
        err.response?.data?.message ||
          "Unable to connect to customer server"
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchCustomers();
  }, []);

  // =========================================================
  // SEARCH FILTER
  // =========================================================

  const filteredCustomers = customers.filter((customer) => {
    const searchText = search.toLowerCase();

    return (
      customer.name?.toLowerCase().includes(searchText) ||
      customer.email?.toLowerCase().includes(searchText) ||
      customer.phone?.toLowerCase().includes(searchText)
    );
  });

  // =========================================================
  // FORMAT DATE
  // =========================================================

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // =========================================================
  // CUSTOMER INITIAL
  // =========================================================

  const getInitial = (name) => {
    return name?.charAt(0)?.toUpperCase() || "U";
  };

  // =========================================================
  // TOTAL CUSTOMERS
  // =========================================================

  const totalCustomers = customers.length;

  // =========================================================
  // ACTIVE CUSTOMERS
  // =========================================================

  const activeCustomers = customers.filter(
    (customer) => customer.status !== "inactive"
  ).length;

  // =========================================================
  // TOTAL ORDERS
  // =========================================================

  const totalOrders = customers.reduce(
    (total, customer) =>
      total + Number(customer.orders || customer.orderCount || 0),
    0
  );

  // =========================================================
  // TOTAL REVENUE
  // =========================================================

  const totalRevenue = customers.reduce(
    (total, customer) =>
      total +
      Number(
        customer.totalSpent ||
          customer.totalAmount ||
          customer.spent ||
          0
      ),
    0
  );

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Customers
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage and monitor your ecommerce customers
          </p>
        </div>

        <button
          onClick={fetchCustomers}
          disabled={loading}
          className="flex w-fit items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-100 disabled:opacity-50"
        >
          <RefreshCw
            size={17}
            className={loading ? "animate-spin" : ""}
          />

          Refresh
        </button>
      </div>

      {/* =====================================================
          STAT CARDS
      ====================================================== */}

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {/* Total Customers */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Customers
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                {totalCustomers}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <Users size={22} />
            </div>

          </div>
        </div>

        {/* Active Customers */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Active Customers
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                {activeCustomers}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-green-50 text-green-600">
              <UserCheck size={22} />
            </div>

          </div>
        </div>

        {/* Total Orders */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Customer Orders
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                {totalOrders}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <ShoppingBag size={22} />
            </div>

          </div>
        </div>

        {/* Revenue */}

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">

            <div>
              <p className="text-sm font-medium text-gray-500">
                Total Spending
              </p>

              <h2 className="mt-2 text-2xl font-bold text-gray-900">
                ₹{totalRevenue.toLocaleString("en-IN")}
              </h2>
            </div>

            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
              <IndianRupee size={22} />
            </div>

          </div>
        </div>

      </div>

      {/* =====================================================
          MAIN CUSTOMER TABLE
      ====================================================== */}

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

        {/* Search Header */}

        <div className="flex flex-col gap-4 border-b border-gray-200 p-4 md:flex-row md:items-center md:justify-between">

          <div>
            <h2 className="font-semibold text-gray-900">
              All Customers
            </h2>

            <p className="mt-1 text-xs text-gray-500">
              {filteredCustomers.length} customers found
            </p>
          </div>

          <div className="relative w-full md:w-80">

            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search customers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-100"
            />

          </div>

        </div>

        {/* =================================================
            LOADING
        ================================================== */}

        {loading ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center">

            <RefreshCw
              size={30}
              className="animate-spin text-blue-600"
            />

            <p className="mt-3 text-sm text-gray-500">
              Loading customers...
            </p>

          </div>
        ) : error ? (

          /* =================================================
             ERROR
          ================================================== */

          <div className="flex min-h-[350px] flex-col items-center justify-center px-4 text-center">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
              <UserX size={26} />
            </div>

            <h3 className="mt-4 font-semibold text-gray-900">
              Unable to load customers
            </h3>

            <p className="mt-1 max-w-md text-sm text-gray-500">
              {error}
            </p>

            <button
              onClick={fetchCustomers}
              className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
            >
              Try Again
            </button>

          </div>
        ) : filteredCustomers.length === 0 ? (

          /* =================================================
             EMPTY
          ================================================== */

          <div className="flex min-h-[350px] flex-col items-center justify-center">

            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-400">
              <Users size={27} />
            </div>

            <h3 className="mt-4 font-semibold text-gray-900">
              No customers found
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              Try changing your search.
            </p>

          </div>
        ) : (

          /* =================================================
             TABLE
          ================================================== */

          <div className="overflow-x-auto">

            <table className="w-full min-w-[900px]">

              <thead className="bg-gray-50">

                <tr className="border-b border-gray-200 text-left">

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Customer
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Contact
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Orders
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Total Spent
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Joined
                  </th>

                  <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                    Action
                  </th>

                </tr>

              </thead>

              <tbody className="divide-y divide-gray-100">

                {filteredCustomers.map((customer, index) => {

                  const orderCount =
                    customer.orders ||
                    customer.orderCount ||
                    0;

                  const spent =
                    customer.totalSpent ||
                    customer.totalAmount ||
                    customer.spent ||
                    0;

                  const isActive =
                    customer.status !== "inactive";

                  return (
                    <tr
                      key={customer._id || customer.id || index}
                      className="transition hover:bg-gray-50"
                    >

                      {/* Customer */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-3">

                          {customer.image ? (
                            <img
                              src={customer.image}
                              alt={customer.name}
                              className="h-10 w-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                              {getInitial(customer.name)}
                            </div>
                          )}

                          <div>

                            <p className="font-medium text-gray-900">
                              {customer.name || "Unknown User"}
                            </p>

                            <p className="text-xs text-gray-500">
                              ID:{" "}
                              {customer._id
                                ? customer._id.slice(-8)
                                : "N/A"}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Contact */}

                      <td className="px-6 py-4">

                        <div className="space-y-1">

                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <Mail
                              size={14}
                              className="text-gray-400"
                            />
                            {customer.email || "N/A"}
                          </div>

                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <Phone
                              size={13}
                              className="text-gray-400"
                            />
                            {customer.phone || "N/A"}
                          </div>

                        </div>

                      </td>

                      {/* Orders */}

                      <td className="px-6 py-4">

                        <div className="flex items-center gap-2">

                          <ShoppingBag
                            size={16}
                            className="text-gray-400"
                          />

                          <span className="font-medium text-gray-800">
                            {orderCount}
                          </span>

                        </div>

                      </td>

                      {/* Spent */}

                      <td className="px-6 py-4">

                        <span className="font-semibold text-gray-900">
                          ₹{Number(spent).toLocaleString("en-IN")}
                        </span>

                      </td>

                      {/* Joined */}

                      <td className="px-6 py-4 text-sm text-gray-600">
                        {formatDate(
                          customer.createdAt ||
                            customer.date ||
                            customer.registeredAt
                        )}
                      </td>

                      {/* Status */}

                      <td className="px-6 py-4">

                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${
                            isActive
                              ? "bg-green-50 text-green-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >

                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              isActive
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          />

                          {isActive ? "Active" : "Inactive"}

                        </span>

                      </td>

                      {/* Action */}

                      <td className="px-6 py-4 text-right">

                        <button
                          onClick={() =>
                            setSelectedCustomer(customer)
                          }
                          className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                        >
                          <Eye size={15} />
                          View
                        </button>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>
        )}

      </div>

      {/* =====================================================
          CUSTOMER DETAILS MODAL
      ====================================================== */}

      {selectedCustomer && (

        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setSelectedCustomer(null)}
        >

          <div
            className="w-full max-w-lg rounded-2xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal Header */}

            <div className="flex items-center justify-between border-b border-gray-200 p-5">

              <div>
                <h2 className="text-lg font-bold text-gray-900">
                  Customer Details
                </h2>

                <p className="text-xs text-gray-500">
                  Customer information
                </p>
              </div>

              <button
                onClick={() => setSelectedCustomer(null)}
                className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
              >
                <X size={20} />
              </button>

            </div>

            {/* Customer Profile */}

            <div className="p-5">

              <div className="flex items-center gap-4">

                {selectedCustomer.image ? (
                  <img
                    src={selectedCustomer.image}
                    alt={selectedCustomer.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-900 text-xl font-bold text-white">
                    {getInitial(selectedCustomer.name)}
                  </div>
                )}

                <div>

                  <h3 className="text-lg font-bold text-gray-900">
                    {selectedCustomer.name ||
                      "Unknown User"}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {selectedCustomer.email || "No email"}
                  </p>

                </div>

              </div>

              {/* Details */}

              <div className="mt-6 space-y-4">

                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">

                  <Mail
                    size={18}
                    className="text-gray-400"
                  />

                  <div>
                    <p className="text-xs text-gray-500">
                      Email
                    </p>

                    <p className="text-sm font-medium text-gray-800">
                      {selectedCustomer.email || "N/A"}
                    </p>
                  </div>

                </div>

                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">

                  <Phone
                    size={18}
                    className="text-gray-400"
                  />

                  <div>
                    <p className="text-xs text-gray-500">
                      Phone
                    </p>

                    <p className="text-sm font-medium text-gray-800">
                      {selectedCustomer.phone || "N/A"}
                    </p>
                  </div>

                </div>

                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">

                  <ShoppingBag
                    size={18}
                    className="text-gray-400"
                  />

                  <div>
                    <p className="text-xs text-gray-500">
                      Total Orders
                    </p>

                    <p className="text-sm font-medium text-gray-800">
                      {selectedCustomer.orders ||
                        selectedCustomer.orderCount ||
                        0}
                    </p>
                  </div>

                </div>

                <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">

                  <IndianRupee
                    size={18}
                    className="text-gray-400"
                  />

                  <div>
                    <p className="text-xs text-gray-500">
                      Total Spent
                    </p>

                    <p className="text-sm font-medium text-gray-800">
                      ₹
                      {Number(
                        selectedCustomer.totalSpent ||
                          selectedCustomer.totalAmount ||
                          selectedCustomer.spent ||
                          0
                      ).toLocaleString("en-IN")}
                    </p>
                  </div>

                </div>

                {selectedCustomer.address && (

                  <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-3">

                    <MapPin
                      size={18}
                      className="mt-0.5 text-gray-400"
                    />

                    <div>
                      <p className="text-xs text-gray-500">
                        Address
                      </p>

                      <p className="text-sm font-medium text-gray-800">
                        {typeof selectedCustomer.address ===
                        "string"
                          ? selectedCustomer.address
                          : `${selectedCustomer.address.street || ""}, ${
                              selectedCustomer.address.city || ""
                            }, ${
                              selectedCustomer.address.state || ""
                            } ${
                              selectedCustomer.address.zipcode ||
                              ""
                            }`}
                      </p>
                    </div>

                  </div>

                )}

              </div>

            </div>

            {/* Modal Footer */}

            <div className="border-t border-gray-200 p-5">

              <button
                onClick={() => setSelectedCustomer(null)}
                className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Close
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default Customers;

