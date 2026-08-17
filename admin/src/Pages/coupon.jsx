import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  TicketPercent,
  Plus,
  Search,
  Edit,
  Trash2,
  Power,
  X,
  CalendarDays,
  Percent,
  IndianRupee,
  CheckCircle,
  XCircle,
} from "lucide-react";

const Coupon = () => {
  // ======================================================
  // BACKEND
  // ======================================================

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // ======================================================
  // STATES
  // ======================================================

  const [coupons, setCoupons] = useState([]);

  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);

  const [editingCoupon, setEditingCoupon] = useState(null);

  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: "",
    minimumAmount: "",
    maximumDiscount: "",
    expiryDate: "",
    usageLimit: "",
    isActive: true,
  });

  // ======================================================
  // FETCH COUPONS
  // ======================================================

  const fetchCoupons = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${backendUrl}/api/coupon/all`
      );

      if (response.data.success) {
        setCoupons(response.data.coupons || []);
      }
    } catch (error) {
      console.error(
        "Fetch coupons error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to fetch coupons."
      );
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // INITIAL LOAD
  // ======================================================

  useEffect(() => {
    fetchCoupons();
  }, []);

  // ======================================================
  // INPUT CHANGE
  // ======================================================

  const handleChange = (event) => {
    const { name, value, type, checked } =
      event.target;

    setFormData((previous) => ({
      ...previous,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  // ======================================================
  // OPEN CREATE MODAL
  // ======================================================

  const openCreateModal = () => {
    setEditingCoupon(null);

    setFormData({
      code: "",
      description: "",
      discountType: "percentage",
      discountValue: "",
      minimumAmount: "",
      maximumDiscount: "",
      expiryDate: "",
      usageLimit: "",
      isActive: true,
    });

    setShowModal(true);
  };

  // ======================================================
  // OPEN EDIT MODAL
  // ======================================================

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon);

    setFormData({
      code: coupon.code || "",
      description: coupon.description || "",
      discountType:
        coupon.discountType || "percentage",
      discountValue:
        coupon.discountValue || "",
      minimumAmount:
        coupon.minimumAmount || "",
      maximumDiscount:
        coupon.maximumDiscount || "",
      expiryDate: coupon.expiryDate
        ? new Date(coupon.expiryDate)
            .toISOString()
            .split("T")[0]
        : "",
      usageLimit:
        coupon.usageLimit || "",
      isActive:
        coupon.isActive !== false,
    });

    setShowModal(true);
  };

  // ======================================================
  // CLOSE MODAL
  // ======================================================

  const closeModal = () => {
    setShowModal(false);
    setEditingCoupon(null);
  };

  // ======================================================
  // CREATE / UPDATE COUPON
  // ======================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      if (!formData.code.trim()) {
        alert("Please enter coupon code.");
        return;
      }

      if (!formData.discountValue) {
        alert("Please enter discount value.");
        return;
      }

      const data = {
        code: formData.code
          .trim()
          .toUpperCase(),

        description:
          formData.description.trim(),

        discountType:
          formData.discountType,

        discountValue:
          Number(formData.discountValue),

        minimumAmount:
          Number(formData.minimumAmount || 0),

        maximumDiscount:
          formData.maximumDiscount
            ? Number(formData.maximumDiscount)
            : 0,

        expiryDate:
          formData.expiryDate || null,

        usageLimit:
          Number(formData.usageLimit || 0),

        isActive:
          formData.isActive,
      };

      let response;

      // UPDATE
      if (editingCoupon) {
        response = await axios.put(
          `${backendUrl}/api/coupon/${editingCoupon._id}`,
          data
        );
      }

      // CREATE
      else {
        response = await axios.post(
          `${backendUrl}/api/coupon/create`,
          data
        );
      }

      if (response.data.success) {
        alert(
          editingCoupon
            ? "Coupon updated successfully."
            : "Coupon created successfully."
        );

        closeModal();

        fetchCoupons();
      }
    } catch (error) {
      console.error(
        "Coupon save error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to save coupon."
      );
    }
  };

  // ======================================================
  // DELETE COUPON
  // ======================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this coupon?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await axios.delete(
        `${backendUrl}/api/coupon/${id}`
      );

      if (response.data.success) {
        alert(
          "Coupon deleted successfully."
        );

        fetchCoupons();
      }
    } catch (error) {
      console.error(
        "Delete coupon error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to delete coupon."
      );
    }
  };

  // ======================================================
  // TOGGLE COUPON
  // ======================================================

  const handleToggle = async (id) => {
    try {
      const response = await axios.patch(
        `${backendUrl}/api/coupon/${id}/toggle`
      );

      if (response.data.success) {
        fetchCoupons();
      }
    } catch (error) {
      console.error(
        "Toggle coupon error:",
        error
      );

      alert(
        error.response?.data?.message ||
          "Unable to update coupon status."
      );
    }
  };

  // ======================================================
  // FILTER COUPONS
  // ======================================================

  const filteredCoupons =
    coupons.filter((coupon) =>
      coupon.code
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );

  // ======================================================
  // FORMAT DATE
  // ======================================================

  const formatDate = (date) => {
    if (!date) {
      return "No expiry";
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

  // ======================================================
  // RENDER
  // ======================================================

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

      {/* ==================================================
          HEADER
      ================================================== */}

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
              <TicketPercent size={23} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Coupons
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Create and manage discount coupons.
              </p>
            </div>

          </div>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="flex w-fit items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
        >
          <Plus size={18} />

          Create Coupon
        </button>

      </div>

      {/* ==================================================
          SEARCH
      ================================================== */}

      <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">

        <div className="relative max-w-md">

          <Search
            size={19}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="text"
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search coupon code..."
            className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
          />

        </div>

      </div>

      {/* ==================================================
          COUPON TABLE
      ================================================== */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="border-b border-slate-100 px-5 py-4">

          <h2 className="font-bold text-slate-900">
            All Coupons
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            {filteredCoupons.length} coupon
            {filteredCoupons.length !== 1
              ? "s"
              : ""}{" "}
            available
          </p>

        </div>

        {loading ? (
          <div className="flex min-h-[250px] items-center justify-center">

            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

          </div>
        ) : filteredCoupons.length === 0 ? (

          <div className="flex min-h-[300px] flex-col items-center justify-center px-5 text-center">

            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
              <TicketPercent size={28} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-800">
              No coupons found
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Create your first coupon to offer
              discounts to customers.
            </p>

            <button
              onClick={openCreateModal}
              className="mt-5 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              Create Coupon
            </button>

          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="w-full min-w-[950px]">

              <thead>

                <tr className="border-b border-slate-100 bg-slate-50">

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Coupon
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Discount
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Minimum Order
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Expiry
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Usage
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Actions
                  </th>

                </tr>

              </thead>

              <tbody>

                {filteredCoupons.map(
                  (coupon) => (

                    <tr
                      key={coupon._id}
                      className="border-b border-slate-100 transition hover:bg-slate-50"
                    >

                      {/* Coupon */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-3">

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                            <TicketPercent
                              size={19}
                            />
                          </div>

                          <div>

                            <p className="font-bold text-slate-800">
                              {coupon.code}
                            </p>

                            <p className="mt-1 max-w-[220px] truncate text-xs text-slate-400">
                              {coupon.description ||
                                "No description"}
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* Discount */}

                      <td className="px-5 py-4">

                        <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-50 px-3 py-1.5 text-sm font-bold text-emerald-700">

                          {coupon.discountType ===
                          "percentage" ? (
                            <>
                              {coupon.discountValue}%
                              <Percent size={13} />
                            </>
                          ) : (
                            <>
                              <IndianRupee
                                size={13}
                              />
                              {coupon.discountValue}
                            </>
                          )}

                        </span>

                      </td>

                      {/* Minimum Amount */}

                      <td className="px-5 py-4">

                        <span className="text-sm font-semibold text-slate-700">

                          ₹
                          {Number(
                            coupon.minimumAmount || 0
                          ).toLocaleString("en-IN")}

                        </span>

                      </td>

                      {/* Expiry */}

                      <td className="px-5 py-4">

                        <div className="flex items-center gap-2 text-sm text-slate-600">

                          <CalendarDays
                            size={16}
                            className="text-slate-400"
                          />

                          {formatDate(
                            coupon.expiryDate
                          )}

                        </div>

                      </td>

                      {/* Usage */}

                      <td className="px-5 py-4">

                        <span className="text-sm text-slate-600">

                          {coupon.usedCount || 0}

                          {" / "}

                          {coupon.usageLimit ||
                            "∞"}

                        </span>

                      </td>

                      {/* Status */}

                      <td className="px-5 py-4">

                        <button
                          onClick={() =>
                            handleToggle(
                              coupon._id
                            )
                          }
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ${
                            coupon.isActive
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >

                          {coupon.isActive ? (
                            <>
                              <CheckCircle
                                size={13}
                              />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle
                                size={13}
                              />
                              Inactive
                            </>
                          )}

                        </button>

                      </td>

                      {/* Actions */}

                      <td className="px-5 py-4">

                        <div className="flex justify-end gap-2">

                          <button
                            type="button"
                            onClick={() =>
                              openEditModal(
                                coupon
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-indigo-600 transition hover:bg-indigo-50"
                            title="Edit coupon"
                          >
                            <Edit size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleToggle(
                                coupon._id
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-amber-600 transition hover:bg-amber-50"
                            title="Toggle coupon"
                          >
                            <Power size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                coupon._id
                              )
                            }
                            className="flex h-9 w-9 items-center justify-center rounded-lg text-red-600 transition hover:bg-red-50"
                            title="Delete coupon"
                          >
                            <Trash2 size={17} />
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

      {/* ==================================================
          CREATE / EDIT MODAL
      ================================================== */}

      {showModal && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm">

          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">

            {/* Modal Header */}

            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-100 bg-white px-6 py-5">

              <div>

                <h2 className="text-xl font-bold text-slate-900">

                  {editingCoupon
                    ? "Edit Coupon"
                    : "Create Coupon"}

                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Set up your discount coupon.
                </p>

              </div>

              <button
                type="button"
                onClick={closeModal}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X size={20} />
              </button>

            </div>

            {/* Form */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >

              {/* Coupon Code */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Coupon Code
                </label>

                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="Example: SAVE20"
                  className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm uppercase outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  required
                />

              </div>

              {/* Description */}

              <div>

                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Description
                </label>

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Example: Get 20% off on your order"
                  rows="3"
                  className="w-full resize-none rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                />

              </div>

              {/* Discount */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Discount Type
                  </label>

                  <select
                    name="discountType"
                    value={
                      formData.discountType
                    }
                    onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none focus:border-indigo-500"
                  >

                    <option value="percentage">
                      Percentage (%)
                    </option>

                    <option value="fixed">
                      Fixed Amount (₹)
                    </option>

                  </select>

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Discount Value
                  </label>

                  <input
                    type="number"
                    name="discountValue"
                    value={
                      formData.discountValue
                    }
                    onChange={handleChange}
                    placeholder="20"
                    min="0"
                    className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-500"
                    required
                  />

                </div>

              </div>

              {/* Amount Settings */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Minimum Order Amount
                  </label>

                  <input
                    type="number"
                    name="minimumAmount"
                    value={
                      formData.minimumAmount
                    }
                    onChange={handleChange}
                    placeholder="1000"
                    min="0"
                    className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-500"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Maximum Discount
                  </label>

                  <input
                    type="number"
                    name="maximumDiscount"
                    value={
                      formData.maximumDiscount
                    }
                    onChange={handleChange}
                    placeholder="500"
                    min="0"
                    className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-500"
                  />

                  <p className="mt-1 text-xs text-slate-400">
                    Useful for percentage coupons.
                  </p>

                </div>

              </div>

              {/* Expiry + Usage */}

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Expiry Date
                  </label>

                  <input
                    type="date"
                    name="expiryDate"
                    value={
                      formData.expiryDate
                    }
                    onChange={handleChange}
                    className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-500"
                  />

                </div>

                <div>

                  <label className="mb-2 block text-sm font-semibold text-slate-700">
                    Usage Limit
                  </label>

                  <input
                    type="number"
                    name="usageLimit"
                    value={
                      formData.usageLimit
                    }
                    onChange={handleChange}
                    placeholder="100"
                    min="0"
                    className="h-11 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-indigo-500"
                  />

                  <p className="mt-1 text-xs text-slate-400">
                    Leave 0 for unlimited usage.
                  </p>

                </div>

              </div>

              {/* Active */}

              <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">

                <input
                  type="checkbox"
                  name="isActive"
                  checked={
                    formData.isActive
                  }
                  onChange={handleChange}
                  className="h-4 w-4 rounded accent-indigo-600"
                />

                <div>

                  <p className="text-sm font-semibold text-slate-800">
                    Activate coupon
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    Customers can use this coupon
                    when it is active.
                  </p>

                </div>

              </label>

              {/* Buttons */}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">

                <button
                  type="button"
                  onClick={closeModal}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700"
                >
                  {editingCoupon
                    ? "Update Coupon"
                    : "Create Coupon"}
                </button>

              </div>

            </form>

          </div>

        </div>

      )}

    </div>
  );
};

export default Coupon;