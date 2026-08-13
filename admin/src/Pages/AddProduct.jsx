
import React, { useState } from "react";
import axios from "axios";
import {
  Upload,
  X,
  Plus,
  Package,
  Tag,
  DollarSign,
  FileText,
  Layers,
  CheckCircle,
  Loader2,
} from "lucide-react";

const AddProduct = () => {
  // ==========================================
  // FORM DATA
  // ==========================================
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
    bestseller: false,
  });

  // ==========================================
  // PRODUCT SIZES
  // ==========================================
  const [selectedSizes, setSelectedSizes] = useState([]);

  // ==========================================
  // PRODUCT IMAGES
  // ==========================================
  const [images, setImages] = useState([]);

  // ==========================================
  // UI STATES
  // ==========================================
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // AVAILABLE SIZES
  // ==========================================
  const sizes = ["S", "M", "L", "XL", "XXL"];

  // ==========================================
  // CATEGORIES
  // ==========================================
  const categories = [
    "Men",
    "Women",
    "Kids",
  ];

  // ==========================================
  // SUBCATEGORIES
  // ==========================================
  const subcategories = [
    "Topwear",
    "Bottomwear",
    "Winterwear",
    "Footwear",
    "Accessories",
  ];

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setError("");
    setMessage("");
  };

  // ==========================================
  // HANDLE SIZE SELECTION
  // ==========================================
  const handleSizeChange = (size) => {
    setSelectedSizes((prev) => {
      if (prev.includes(size)) {
        return prev.filter((item) => item !== size);
      }

      return [...prev, size];
    });
  };

  // ==========================================
  // HANDLE IMAGE UPLOAD
  // ==========================================
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) {
      return;
    }

    if (images.length + files.length > 4) {
      setError("You can upload a maximum of 4 images.");
      return;
    }

    const newImages = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);

    setError("");
  };

  // ==========================================
  // REMOVE IMAGE
  // ==========================================
  const removeImage = (index) => {
    setImages((prev) => {
      const updatedImages = [...prev];

      URL.revokeObjectURL(updatedImages[index].preview);

      updatedImages.splice(index, 1);

      return updatedImages;
    });
  };

  // ==========================================
  // FORM SUBMIT
  // ==========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!formData.name.trim()) {
      setError("Please enter the product name.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Please enter the product description.");
      return;
    }

    if (!formData.price) {
      setError("Please enter the product price.");
      return;
    }

    if (Number(formData.price) <= 0) {
      setError("Product price must be greater than 0.");
      return;
    }

    if (!formData.category) {
      setError("Please select a category.");
      return;
    }

    if (!formData.subcategory) {
      setError("Please select a subcategory.");
      return;
    }

    if (selectedSizes.length === 0) {
      setError("Please select at least one product size.");
      return;
    }

    if (images.length === 0) {
      setError("Please upload at least one product image.");
      return;
    }

    try {
      setLoading(true);

      // ==========================================
      // CREATE FORMDATA
      // ==========================================
      const productData = new FormData();

      productData.append(
        "name",
        formData.name.trim()
      );

      productData.append(
        "description",
        formData.description.trim()
      );

      productData.append(
        "price",
        formData.price
      );

      productData.append(
        "category",
        formData.category
      );

      productData.append(
        "subcategory",
        formData.subcategory
      );

      productData.append(
        "bestseller",
        formData.bestseller
      );

      // Send sizes as JSON string
      productData.append(
        "sizes",
        JSON.stringify(selectedSizes)
      );

      // ==========================================
      // ADD IMAGES
      // ==========================================
      images.forEach((image, index) => {
        productData.append(
          `image${index + 1}`,
          image.file
        );
      });

      // ==========================================
      // SEND TO BACKEND
      // ==========================================
      const response = await axios.post(
        "http://localhost:8005/api/product/add",
        productData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(
        "Product Response:",
        response.data
      );

      if (response.data.success) {
        setMessage(
          response.data.message ||
            "Product added successfully!"
        );

        // Reset form
        setFormData({
          name: "",
          description: "",
          price: "",
          category: "",
          subcategory: "",
          bestseller: false,
        });

        setSelectedSizes([]);

        images.forEach((image) => {
          URL.revokeObjectURL(image.preview);
        });

        setImages([]);
      } else {
        setError(
          response.data.message ||
            "Failed to add product."
        );
      }
    } catch (error) {
      console.error(
        "Add Product Error:",
        error
      );

      if (error.response) {
        setError(
          error.response.data?.message ||
            "Failed to add product."
        );
      } else if (error.request) {
        setError(
          "Unable to connect to server. Please make sure your backend is running on port 8005."
        );
      } else {
        setError(
          "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">

      {/* ==========================================
          PAGE HEADER
      ========================================== */}
      <div className="mx-auto max-w-6xl">

        <div className="mb-8">

          <div className="flex items-center gap-3">

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-lg">
              <Package size={24} />
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
                Add Product
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                Add a new product to your ecommerce store.
              </p>
            </div>

          </div>

        </div>

        {/* ==========================================
            SUCCESS MESSAGE
        ========================================== */}
        {message && (
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
            <CheckCircle size={20} />
            {message}
          </div>
        )}

        {/* ==========================================
            ERROR MESSAGE
        ========================================== */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-600">
            {error}
          </div>
        )}

        {/* ==========================================
            FORM
        ========================================== */}
        <form onSubmit={handleSubmit}>

          <div className="grid gap-6 lg:grid-cols-3">

            {/* ==========================================
                LEFT / MAIN FORM
            ========================================== */}
            <div className="space-y-6 lg:col-span-2">

              {/* PRODUCT BASIC INFORMATION */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="mb-6 flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <FileText size={20} />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      Product Information
                    </h2>

                    <p className="text-xs text-slate-500">
                      Enter the basic product details.
                    </p>
                  </div>

                </div>

                <div className="space-y-5">

                  {/* ==========================================
                      PRODUCT NAME
                  ========================================== */}
                  <div>

                    <label
                      htmlFor="name"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Product Name
                    </label>

                    <input
                      id="name"
                      name="name"
                      type="text"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Enter product name"
                      autoComplete="off"
                      disabled={loading}
                      required
                      className="block w-full cursor-text rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />

                  </div>

                  {/* ==========================================
                      PRODUCT DESCRIPTION
                  ========================================== */}
                  <div>

                    <label
                      htmlFor="description"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Product Description
                    </label>

                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Write a detailed description of your product..."
                      rows={6}
                      autoComplete="off"
                      disabled={loading}
                      required
                      className="block w-full cursor-text resize-y rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm leading-6 text-slate-900 outline-none transition placeholder:text-slate-400 hover:border-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:bg-slate-100"
                    />

                  </div>

                </div>

              </div>

              {/* ==========================================
                  PRODUCT IMAGES
              ========================================== */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="mb-6 flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                    <Upload size={20} />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      Product Images
                    </h2>

                    <p className="text-xs text-slate-500">
                      Upload up to 4 product images.
                    </p>
                  </div>

                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">

                  {/* UPLOAD BUTTON */}
                  {images.length < 4 && (
                    <label className="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 transition hover:border-indigo-500 hover:bg-indigo-50">

                      <Plus
                        size={28}
                        className="text-slate-400"
                      />

                      <span className="mt-2 text-xs font-semibold text-slate-500">
                        Add Image
                      </span>

                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        disabled={loading}
                        className="hidden"
                      />

                    </label>
                  )}

                  {/* IMAGE PREVIEWS */}
                  {images.map((image, index) => (
                    <div
                      key={`${image.file.name}-${index}`}
                      className="group relative aspect-square overflow-hidden rounded-2xl border border-slate-200 bg-slate-100"
                    >

                      <img
                        src={image.preview}
                        alt={`Product ${index + 1}`}
                        className="h-full w-full object-cover"
                      />

                      <button
                        type="button"
                        onClick={() =>
                          removeImage(index)
                        }
                        disabled={loading}
                        className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-white opacity-0 shadow-lg transition group-hover:opacity-100"
                      >
                        <X size={16} />
                      </button>

                    </div>
                  ))}

                </div>

              </div>

            </div>

            {/* ==========================================
                RIGHT SIDEBAR
            ========================================== */}
            <div className="space-y-6">

              {/* PRICE */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="mb-5 flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                    <DollarSign size={20} />
                  </div>

                  <h2 className="font-bold text-slate-900">
                    Pricing
                  </h2>

                </div>

                <label
                  htmlFor="price"
                  className="mb-2 block text-sm font-semibold text-slate-700"
                >
                  Product Price
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 font-semibold text-slate-500">
                    ₹
                  </span>

                  <input
                    id="price"
                    name="price"
                    type="number"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    disabled={loading}
                    required
                    className="block w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                  />

                </div>

              </div>

              {/* CATEGORY */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="mb-5 flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <Tag size={20} />
                  </div>

                  <h2 className="font-bold text-slate-900">
                    Category
                  </h2>

                </div>

                <div className="space-y-4">

                  <div>

                    <label
                      htmlFor="category"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Category
                    </label>

                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      disabled={loading}
                      required
                      className="block w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    >

                      <option value="">
                        Select Category
                      </option>

                      {categories.map(
                        (category) => (
                          <option
                            key={category}
                            value={category}
                          >
                            {category}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                  <div>

                    <label
                      htmlFor="subcategory"
                      className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                      Subcategory
                    </label>

                    <select
                      id="subcategory"
                      name="subcategory"
                      value={formData.subcategory}
                      onChange={handleChange}
                      disabled={loading}
                      required
                      className="block w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10"
                    >

                      <option value="">
                        Select Subcategory
                      </option>

                      {subcategories.map(
                        (subcategory) => (
                          <option
                            key={subcategory}
                            value={subcategory}
                          >
                            {subcategory}
                          </option>
                        )
                      )}

                    </select>

                  </div>

                </div>

              </div>

              {/* SIZES */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="mb-5 flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Layers size={20} />
                  </div>

                  <h2 className="font-bold text-slate-900">
                    Available Sizes
                  </h2>

                </div>

                <div className="flex flex-wrap gap-2">

                  {sizes.map((size) => (

                    <button
                      key={size}
                      type="button"
                      onClick={() =>
                        handleSizeChange(size)
                      }
                      disabled={loading}
                      className={`flex h-11 min-w-11 items-center justify-center rounded-xl border px-4 text-sm font-semibold transition ${
                        selectedSizes.includes(size)
                          ? "border-indigo-600 bg-indigo-600 text-white"
                          : "border-slate-300 bg-white text-slate-600 hover:border-indigo-400 hover:text-indigo-600"
                      }`}
                    >
                      {size}
                    </button>

                  ))}

                </div>

              </div>

              {/* BESTSELLER */}
              <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <label className="flex cursor-pointer items-center gap-3">

                  <input
                    type="checkbox"
                    name="bestseller"
                    checked={formData.bestseller}
                    onChange={handleChange}
                    disabled={loading}
                    className="h-5 w-5 cursor-pointer rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />

                  <div>

                    <p className="text-sm font-bold text-slate-900">
                      Add to Bestseller
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Show this product in your bestseller collection.
                    </p>

                  </div>

                </label>

              </div>

              {/* SUBMIT */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >

                {loading ? (
                  <>
                    <Loader2
                      size={20}
                      className="animate-spin"
                    />

                    Adding Product...
                  </>
                ) : (
                  <>
                    <Plus size={20} />

                    Add Product
                  </>
                )}

              </button>

            </div>

          </div>

        </form>

      </div>

    </div>
  );
};

export default AddProduct;

