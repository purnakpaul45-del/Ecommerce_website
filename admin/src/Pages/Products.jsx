
import React, { useMemo, useState } from "react";
import {
  Search,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Package,
  ChevronLeft,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Link } from "react-router-dom";

const Products = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [openMenu, setOpenMenu] = useState(null);

  const products = [
    {
      id: 1,
      name: "Men Round Neck Pure Cotton T-shirt",
      category: "Men",
      subcategory: "Topwear",
      price: 799,
      stock: 45,
      status: "In Stock",
      image: "https://via.placeholder.com/100",
    },
    {
      id: 2,
      name: "Women Round Neck Cotton Top",
      category: "Women",
      subcategory: "Topwear",
      price: 999,
      stock: 32,
      status: "In Stock",
      image: "https://via.placeholder.com/100",
    },
    {
      id: 3,
      name: "Men Slim Fit Jeans",
      category: "Men",
      subcategory: "Bottomwear",
      price: 1499,
      stock: 18,
      status: "Low Stock",
      image: "https://via.placeholder.com/100",
    },
    {
      id: 4,
      name: "Women High Waist Trousers",
      category: "Women",
      subcategory: "Bottomwear",
      price: 1299,
      stock: 25,
      status: "In Stock",
      image: "https://via.placeholder.com/100",
    },
    {
      id: 5,
      name: "Men Casual Sneakers",
      category: "Men",
      subcategory: "Footwear",
      price: 1999,
      stock: 0,
      status: "Out of Stock",
      image: "https://via.placeholder.com/100",
    },
    {
      id: 6,
      name: "Women Running Shoes",
      category: "Women",
      subcategory: "Footwear",
      price: 2299,
      stock: 12,
      status: "Low Stock",
      image: "https://via.placeholder.com/100",
    },
    {
      id: 7,
      name: "Kids Printed T-shirt",
      category: "Kids",
      subcategory: "Topwear",
      price: 599,
      stock: 50,
      status: "In Stock",
      image: "https://via.placeholder.com/100",
    },
    {
      id: 8,
      name: "Men Formal Shirt",
      category: "Men",
      subcategory: "Topwear",
      price: 1199,
      stock: 27,
      status: "In Stock",
      image: "https://via.placeholder.com/100",
    },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesCategory =
        categoryFilter === "All" ||
        product.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" ||
        product.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [searchTerm, categoryFilter, statusFilter]);

  const getStatusStyle = (status) => {
    if (status === "In Stock") {
      return "bg-emerald-50 text-emerald-700";
    }

    if (status === "Low Stock") {
      return "bg-amber-50 text-amber-700";
    }

    return "bg-red-50 text-red-700";
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleDelete = (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (confirmed) {
      console.log("Delete product:", productId);
    }

    setOpenMenu(null);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <main className="p-4 sm:p-6 lg:p-8">
        {/* Page Header */}
        <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Products
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your store products and inventory.
            </p>
          </div>

          <Link
            to="/add-product"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700"
          >
            <Plus size={19} />
            Add Product
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500">
                  Total Products
                </p>

                <h2 className="mt-2 text-2xl font-bold text-slate-900">
                  {products.length}
                </h2>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                <Package size={22} />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              In Stock
            </p>

            <h2 className="mt-2 text-2xl font-bold text-emerald-600">
              {products.filter(
                (product) => product.status === "In Stock"
              ).length}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Low Stock
            </p>

            <h2 className="mt-2 text-2xl font-bold text-amber-600">
              {products.filter(
                (product) => product.status === "Low Stock"
              ).length}
            </h2>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              Out of Stock
            </p>

            <h2 className="mt-2 text-2xl font-bold text-red-600">
              {products.filter(
                (product) => product.status === "Out of Stock"
              ).length}
            </h2>
          </div>
        </div>

        {/* Products Container */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          {/* Toolbar */}
          <div className="border-b border-slate-100 p-4 sm:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              {/* Search */}
              <div className="relative w-full xl:max-w-md">
                <Search
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    setCurrentPage(1);
                  }}
                  placeholder="Search products..."
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative">
                  <Filter
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />

                  <select
                    value={categoryFilter}
                    onChange={(event) => {
                      setCategoryFilter(event.target.value);
                      setCurrentPage(1);
                    }}
                    className="h-11 w-full appearance-none rounded-xl border border-slate-200 bg-white pl-9 pr-10 text-sm font-medium text-slate-600 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 sm:w-40"
                  >
                    <option value="All">All Categories</option>
                    <option value="Men">Men</option>
                    <option value="Women">Women</option>
                    <option value="Kids">Kids</option>
                  </select>
                </div>

                <select
                  value={statusFilter}
                  onChange={(event) => {
                    setStatusFilter(event.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-600 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                >
                  <option value="All">All Status</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">
                    Out of Stock
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px]">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/70">
                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Product
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Category
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Price
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Stock
                  </th>

                  <th className="px-5 py-4 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                    Status
                  </th>

                  <th className="px-5 py-4 text-right text-xs font-bold uppercase tracking-wider text-slate-500">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredProducts.length > 0 ? (
                  filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-slate-100 transition hover:bg-slate-50"
                    >
                      {/* Product */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-4">
                          <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-xs truncate text-sm font-semibold text-slate-800">
                              {product.name}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              ID: #{product.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium text-slate-700">
                          {product.category}
                        </p>

                        <p className="mt-1 text-xs text-slate-400">
                          {product.subcategory}
                        </p>
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-bold text-slate-800">
                          {formatPrice(product.price)}
                        </p>
                      </td>

                      {/* Stock */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-semibold text-slate-700">
                          {product.stock} units
                        </p>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${getStatusStyle(
                            product.status
                          )}`}
                        >
                          {product.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="relative px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() =>
                            setOpenMenu(
                              openMenu === product.id
                                ? null
                                : product.id
                            )
                          }
                          className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
                        >
                          <MoreVertical size={19} />
                        </button>

                        {openMenu === product.id && (
                          <div className="absolute right-5 top-14 z-20 w-40 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 text-left shadow-xl">
                            <button
                              type="button"
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                              onClick={() =>
                                console.log(
                                  "View product:",
                                  product.id
                                )
                              }
                            >
                              <Eye size={16} />
                              View
                            </button>

                            <button
                              type="button"
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                              onClick={() =>
                                console.log(
                                  "Edit product:",
                                  product.id
                                )
                              }
                            >
                              <Edit size={16} />
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                handleDelete(product.id)
                              }
                              className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-5 py-16 text-center"
                    >
                      <Package
                        size={40}
                        className="mx-auto text-slate-300"
                      />

                      <h3 className="mt-4 text-lg font-bold text-slate-800">
                        No products found
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Try changing your search or filters.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col gap-3 border-t border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filteredProducts.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {products.length}
              </span>{" "}
              products
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) => Math.max(1, page - 1))
                }
                disabled={currentPage === 1}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={18} />
              </button>

              <button className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-sm font-semibold text-white">
                {currentPage}
              </button>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) => page + 1)
                }
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Products;

