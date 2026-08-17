import React, { useContext, useState } from "react";
import Title from "../Components/Title";
import CartTotal from "../Components/CartTotal";
import { assets } from "../assets/assets";
import { ShopContext } from "../Context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const PlaceOrder = () => {
  // ======================================================
  // BACKEND
  // ======================================================

  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  // ======================================================
  // STATE
  // ======================================================

  const [method, setMethod] = useState("cod");
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
    phone: "",
  });

  // ======================================================
  // SHOP CONTEXT
  // ======================================================

  const {
    navigate,
    cartItems,
    products,
    getCartAmount,
    delivery_fee,
    clearCart,
  } = useContext(ShopContext);

  // ======================================================
  // INPUT CHANGE
  // ======================================================

  const onChangeHandler = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ======================================================
  // LOAD RAZORPAY SCRIPT
  // ======================================================

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const existingScript = document.querySelector(
        'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
      );

      if (existingScript) {
        existingScript.onload = () => resolve(true);
        existingScript.onerror = () => resolve(false);
        return;
      }

      const script = document.createElement("script");

      script.src =
        "https://checkout.razorpay.com/v1/checkout.js";

      script.async = true;

      script.onload = () => {
        console.log("Razorpay SDK loaded.");
        resolve(true);
      };

      script.onerror = () => {
        console.error(
          "Failed to load Razorpay SDK."
        );
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  // ======================================================
  // RAZORPAY PAYMENT
  // ======================================================

  const handleRazorpayPayment = async (
    orderResponse,
    orderData,
    token
  ) => {
    try {
      console.log(
        "========== RAZORPAY PAYMENT =========="
      );

      // --------------------------------------------------
      // LOAD SDK
      // --------------------------------------------------

      const scriptLoaded =
        await loadRazorpayScript();

      if (!scriptLoaded) {
        toast.error(
          "Unable to load Razorpay. Please try again."
        );

        setLoading(false);

        return;
      }

      // --------------------------------------------------
      // CHECK BACKEND RESPONSE
      // --------------------------------------------------

      if (
        !orderResponse ||
        !orderResponse.success
      ) {
        toast.error(
          orderResponse?.message ||
            "Unable to create Razorpay order."
        );

        setLoading(false);

        return;
      }

      console.log(
        "Razorpay Backend Response:",
        orderResponse
      );

      // IMPORTANT:
      // Your backend returns:
      //
      // key: process.env.RAZORPAY_KEY_ID
      //
      // NOT:
      //
      // key_id

      const razorpayKeyId =
        orderResponse.key;

      const razorpayOrderId =
        orderResponse.razorpayOrderId;

      const razorpayAmount =
        orderResponse.amount;

      const razorpayCurrency =
        orderResponse.currency || "INR";

      // --------------------------------------------------
      // VALIDATE RAZORPAY DATA
      // --------------------------------------------------

      if (!razorpayKeyId) {
        console.error(
          "Razorpay Key ID missing:",
          orderResponse
        );

        toast.error(
          "Razorpay key is missing from server."
        );

        setLoading(false);

        return;
      }

      if (!razorpayOrderId) {
        console.error(
          "Razorpay Order ID missing:",
          orderResponse
        );

        toast.error(
          "Razorpay order ID is missing."
        );

        setLoading(false);

        return;
      }

      if (
        !razorpayAmount ||
        Number(razorpayAmount) <= 0
      ) {
        console.error(
          "Invalid Razorpay amount:",
          orderResponse
        );

        toast.error(
          "Invalid Razorpay amount received."
        );

        setLoading(false);

        return;
      }

      console.log(
        "Razorpay Key:",
        razorpayKeyId
      );

      console.log(
        "Razorpay Order ID:",
        razorpayOrderId
      );

      console.log(
        "Razorpay Amount:",
        razorpayAmount
      );

      // --------------------------------------------------
      // RAZORPAY OPTIONS
      // --------------------------------------------------

      const options = {
        key: razorpayKeyId,

        amount: Number(
          razorpayAmount
        ),

        currency:
          razorpayCurrency,

        name: "Your Ecommerce Store",

        description:
          "Ecommerce Order Payment",

        order_id:
          razorpayOrderId,

        prefill: {
          name: `${orderData.address.firstName} ${orderData.address.lastName}`,

          email:
            orderData.address.email,

          contact:
            orderData.address.phone,
        },

        notes: {
          address:
            orderData.address.street,

          city:
            orderData.address.city,

          state:
            orderData.address.state,

          pincode:
            orderData.address.pincode,

          country:
            orderData.address.country,
        },

        theme: {
          color: "#000000",
        },

        // ------------------------------------------------
        // PAYMENT SUCCESS
        // ------------------------------------------------

        handler: async (response) => {
          console.log(
            "========== RAZORPAY PAYMENT SUCCESS =========="
          );

          console.log(
            "Payment ID:",
            response.razorpay_payment_id
          );

          console.log(
            "Order ID:",
            response.razorpay_order_id
          );

          console.log(
            "Signature:",
            response.razorpay_signature
          );

          try {
            setLoading(true);

            // --------------------------------------------
            // VERIFY PAYMENT WITH BACKEND
            // --------------------------------------------

            const verifyResponse =
              await axios.post(
                `${backendUrl}/api/order/razorpay/verify`,
                {
                  razorpay_payment_id:
                    response.razorpay_payment_id,

                  razorpay_order_id:
                    response.razorpay_order_id,

                  razorpay_signature:
                    response.razorpay_signature,
                },
                {
                  headers: {
                    Authorization:
                      `Bearer ${token}`,

                    "Content-Type":
                      "application/json",
                  },
                }
              );

            console.log(
              "Razorpay Verification Response:",
              verifyResponse.data
            );

            // --------------------------------------------
            // PAYMENT VERIFIED
            // --------------------------------------------

            if (
              verifyResponse.data.success
            ) {
              toast.success(
                "Payment successful! Order placed."
              );

              // Backend already clears the cart.
              // Clear frontend cart too.

              if (
                typeof clearCart ===
                "function"
              ) {
                clearCart();
              }

              navigate("/orders");
            } else {
              toast.error(
                verifyResponse.data.message ||
                  "Payment verification failed."
              );

              setLoading(false);
            }
          } catch (verifyError) {
            console.error(
              "Razorpay Verification Error:",
              verifyError
            );

            console.error(
              "Verification Response:",
              verifyError.response?.data
            );

            toast.error(
              verifyError.response?.data
                ?.message ||
                "Payment verification failed."
            );

            setLoading(false);
          }
        },

        // ------------------------------------------------
        // MODAL CLOSED
        // ------------------------------------------------

        modal: {
          ondismiss: () => {
            console.log(
              "Razorpay checkout closed."
            );

            setLoading(false);
          },
        },
      };

      // --------------------------------------------------
      // CREATE RAZORPAY INSTANCE
      // --------------------------------------------------

      const razorpay =
        new window.Razorpay(options);

      // --------------------------------------------------
      // PAYMENT FAILED
      // --------------------------------------------------

      razorpay.on(
        "payment.failed",
        (response) => {
          console.error(
            "========== RAZORPAY PAYMENT FAILED =========="
          );

          console.error(
            response.error
          );

          toast.error(
            response.error?.description ||
              "Razorpay payment failed."
          );

          setLoading(false);
        }
      );

      // --------------------------------------------------
      // OPEN CHECKOUT
      // --------------------------------------------------

      razorpay.open();
    } catch (error) {
      console.error(
        "Razorpay Payment Error:",
        error
      );

      toast.error(
        "Unable to open Razorpay payment."
      );

      setLoading(false);
    }
  };

  // ======================================================
  // PLACE ORDER
  // ======================================================

  const placeOrder = async (event) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    try {
      setLoading(true);

      // ==================================================
      // CHECK LOGIN
      // ==================================================

      const token =
        localStorage.getItem("token");

      if (!token) {
        toast.error(
          "Please login before placing your order."
        );

        navigate("/login");

        return;
      }

      // ==================================================
      // CREATE ORDER ITEMS
      // ==================================================

      const orderItems = [];

      for (const itemId in cartItems) {
        for (const size in cartItems[itemId]) {
          const quantity = Number(
            cartItems[itemId][size]
          );

          if (quantity <= 0) {
            continue;
          }

          const itemInfo =
            products.find(
              (product) =>
                product._id === itemId ||
                product.id === itemId
            );

          if (!itemInfo) {
            console.warn(
              "Product not found:",
              itemId
            );

            continue;
          }

          orderItems.push({
            _id:
              itemInfo._id ||
              itemInfo.id,

            name:
              itemInfo.name,

            image:
              itemInfo.image,

            price:
              Number(itemInfo.price),

            quantity,

            size,
          });
        }
      }

      // ==================================================
      // CHECK CART
      // ==================================================

      if (
        orderItems.length === 0
      ) {
        toast.error(
          "Your cart is empty."
        );

        return;
      }

      // ==================================================
      // CALCULATE TOTAL
      // ==================================================

      const subtotal =
        Number(getCartAmount()) || 0;

      const deliveryCharge =
        Number(delivery_fee) || 0;

      const totalAmount =
        subtotal + deliveryCharge;

      if (
        !Number.isFinite(
          totalAmount
        ) ||
        totalAmount <= 0
      ) {
        toast.error(
          "Invalid order amount."
        );

        return;
      }

      console.log(
        "Subtotal:",
        subtotal
      );

      console.log(
        "Delivery Fee:",
        deliveryCharge
      );

      console.log(
        "Total:",
        totalAmount
      );

      // ==================================================
      // VALIDATE ADDRESS
      // ==================================================

      const requiredFields = [
        "firstName",
        "lastName",
        "email",
        "street",
        "city",
        "state",
        "pincode",
        "country",
        "phone",
      ];

      for (const field of requiredFields) {
        if (
          !formData[field] ||
          !formData[field].trim()
        ) {
          toast.error(
            `Please enter your ${field}.`
          );

          return;
        }
      }

      // ==================================================
      // ORDER DATA
      // ==================================================

      const orderData = {
        items: orderItems,

        amount:
          totalAmount,

        address: {
          firstName:
            formData.firstName.trim(),

          lastName:
            formData.lastName.trim(),

          email:
            formData.email
              .trim()
              .toLowerCase(),

          street:
            formData.street.trim(),

          city:
            formData.city.trim(),

          state:
            formData.state.trim(),

          pincode:
            formData.pincode.trim(),

          country:
            formData.country.trim(),

          phone:
            formData.phone.trim(),
        },
      };

      console.log(
        "========== ORDER DATA =========="
      );

      console.log(
        orderData
      );

      // ==================================================
      // COD
      // ==================================================

      if (method === "cod") {
        console.log(
          "Creating COD order..."
        );

        const response =
          await axios.post(
            `${backendUrl}/api/order/place`,
            orderData,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "application/json",
              },
            }
          );

        console.log(
          "COD Response:",
          response.data
        );

        if (
          response.data.success
        ) {
          toast.success(
            "Order placed successfully!"
          );

          if (
            typeof clearCart ===
            "function"
          ) {
            clearCart();
          }

          navigate("/orders");
        } else {
          toast.error(
            response.data.message ||
              "Unable to place order."
          );
        }

        return;
      }

      // ==================================================
      // STRIPE
      // ==================================================

      if (
        method === "stripe"
      ) {
        console.log(
          "Creating Stripe checkout session..."
        );

        const response =
          await axios.post(
            `${backendUrl}/api/order/stripe`,
            orderData,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "application/json",
              },
            }
          );

        console.log(
          "Stripe Response:",
          response.data
        );

        if (
          response.data.success &&
          response.data.url
        ) {
          /*
           * IMPORTANT:
           *
           * Do NOT clear the cart here.
           *
           * Stripe webhook clears the cart
           * after successful payment.
           */

          window.location.href =
            response.data.url;
        } else {
          toast.error(
            response.data.message ||
              "Unable to create Stripe payment."
          );

          setLoading(false);
        }

        return;
      }

      // ==================================================
      // RAZORPAY
      // ==================================================

      if (
        method === "razorpay"
      ) {
        console.log(
          "Creating Razorpay order..."
        );

        const response =
          await axios.post(
            `${backendUrl}/api/order/razorpay`,
            orderData,
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,

                "Content-Type":
                  "application/json",
              },
            }
          );

        console.log(
          "Razorpay Response:",
          response.data
        );

        if (
          !response.data.success
        ) {
          toast.error(
            response.data.message ||
              "Unable to create Razorpay order."
          );

          setLoading(false);

          return;
        }

        // Open Razorpay checkout

        await handleRazorpayPayment(
          response.data,
          orderData,
          token
        );

        return;
      }
    } catch (error) {
      console.error(
        "PLACE ORDER ERROR:",
        error
      );

      console.error(
        "SERVER RESPONSE:",
        error.response?.data
      );

      if (
        error.response?.status ===
        401
      ) {
        localStorage.removeItem(
          "token"
        );

        toast.error(
          "Your login session has expired. Please login again."
        );

        navigate("/login");

        return;
      }

      toast.error(
        error.response?.data
          ?.message ||
          "Unable to place order. Please try again."
      );
    } finally {
      /*
       * Don't force loading=false after a successful
       * Stripe redirect or while Razorpay is open.
       *
       * For normal errors/returns this is safe.
       */
      if (method !== "stripe") {
        setLoading(false);
      }
    }
  };

  // ======================================================
  // UI
  // ======================================================

  return (
    <form
      onSubmit={placeOrder}
      className="flex flex-col gap-12 lg:flex-row lg:justify-between"
    >
      {/* ==================================================
          LEFT SIDE
      ================================================== */}

      <div className="w-full lg:max-w-[500px]">
        <div className="mb-6 text-2xl">
          <Title
            text1="DELIVERY"
            text2="INFORMATION"
          />
        </div>

        {/* First + Last Name */}

        <div className="flex flex-col gap-4 sm:flex-row">
          <input
            name="firstName"
            onChange={onChangeHandler}
            value={formData.firstName}
            type="text"
            placeholder="First Name"
            autoComplete="given-name"
            required
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black disabled:bg-gray-100"
          />

          <input
            name="lastName"
            onChange={onChangeHandler}
            value={formData.lastName}
            type="text"
            placeholder="Last Name"
            autoComplete="family-name"
            required
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black disabled:bg-gray-100"
          />
        </div>

        {/* Email */}

        <input
          name="email"
          onChange={onChangeHandler}
          value={formData.email}
          type="email"
          placeholder="Email Address"
          autoComplete="email"
          required
          disabled={loading}
          className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black disabled:bg-gray-100"
        />

        {/* Street */}

        <input
          name="street"
          onChange={onChangeHandler}
          value={formData.street}
          type="text"
          placeholder="Street Address"
          autoComplete="street-address"
          required
          disabled={loading}
          className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black disabled:bg-gray-100"
        />

        {/* City + State */}

        <div className="mt-4 flex flex-col gap-4 sm:flex-row">
          <input
            name="city"
            onChange={onChangeHandler}
            value={formData.city}
            type="text"
            placeholder="City"
            autoComplete="address-level2"
            required
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black disabled:bg-gray-100"
          />

          <input
            name="state"
            onChange={onChangeHandler}
            value={formData.state}
            type="text"
            placeholder="State"
            autoComplete="address-level1"
            required
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black disabled:bg-gray-100"
          />
        </div>

        {/* Pincode + Country */}

        <div className="mt-4 flex flex-col gap-4 sm:flex-row">
          <input
            name="pincode"
            onChange={onChangeHandler}
            value={formData.pincode}
            type="text"
            placeholder="Pincode"
            autoComplete="postal-code"
            required
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black disabled:bg-gray-100"
          />

          <input
            name="country"
            onChange={onChangeHandler}
            value={formData.country}
            type="text"
            placeholder="Country"
            autoComplete="country-name"
            required
            disabled={loading}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black disabled:bg-gray-100"
          />
        </div>

        {/* Phone */}

        <input
          name="phone"
          onChange={onChangeHandler}
          value={formData.phone}
          type="tel"
          placeholder="Phone Number"
          autoComplete="tel"
          required
          disabled={loading}
          className="mt-4 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none transition focus:border-black disabled:bg-gray-100"
        />
      </div>

      {/* ==================================================
          RIGHT SIDE
      ================================================== */}

      <div className="w-full lg:max-w-[500px]">
        <CartTotal />

        {/* Payment */}

        <div className="mt-10">
          <Title
            text1="PAYMENT"
            text2="METHOD"
          />

          <p className="mt-2 text-sm text-gray-500">
            Choose your preferred payment option
          </p>

          <div className="mt-6 space-y-4">
            {/* STRIPE */}

            <div
              onClick={() => {
                if (!loading) {
                  setMethod("stripe");
                }
              }}
              className={`cursor-pointer rounded-xl border p-5 transition ${
                method === "stripe"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-gray-400"
              } ${
                loading
                  ? "pointer-events-none opacity-60"
                  : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    method === "stripe"
                      ? "border-green-500"
                      : "border-gray-400"
                  }`}
                >
                  {method === "stripe" && (
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  )}
                </div>

                <div>
                  <img
                    src={assets.stripe_logo}
                    className="h-7"
                    alt="Stripe"
                  />

                  <p className="mt-1 text-sm text-gray-500">
                    Credit / Debit Cards
                  </p>
                </div>
              </div>
            </div>

            {/* RAZORPAY */}

            <div
              onClick={() => {
                if (!loading) {
                  setMethod("razorpay");
                }
              }}
              className={`cursor-pointer rounded-xl border p-5 transition ${
                method === "razorpay"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-gray-400"
              } ${
                loading
                  ? "pointer-events-none opacity-60"
                  : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    method === "razorpay"
                      ? "border-green-500"
                      : "border-gray-400"
                  }`}
                >
                  {method === "razorpay" && (
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  )}
                </div>

                <div>
                  <img
                    src={assets.razorpay_logo}
                    className="h-7"
                    alt="Razorpay"
                  />

                  <p className="mt-1 text-sm text-gray-500">
                    UPI • Cards • Wallet • Net Banking
                  </p>
                </div>
              </div>
            </div>

            {/* COD */}

            <div
              onClick={() => {
                if (!loading) {
                  setMethod("cod");
                }
              }}
              className={`cursor-pointer rounded-xl border p-5 transition ${
                method === "cod"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-200 hover:border-gray-400"
              } ${
                loading
                  ? "pointer-events-none opacity-60"
                  : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    method === "cod"
                      ? "border-green-500"
                      : "border-gray-400"
                  }`}
                >
                  {method === "cod" && (
                    <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                  )}
                </div>

                <div>
                  <h3 className="font-semibold text-gray-800">
                    Cash on Delivery
                  </h3>

                  <p className="mt-1 text-sm text-gray-500">
                    Pay after your order is delivered
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SECURITY */}

          <div className="mt-6 rounded-xl border bg-gray-50 p-4">
            <p className="text-sm text-gray-700">
              🔒{" "}
              <span className="font-semibold">
                100% Secure Payments
              </span>
            </p>

            <p className="mt-2 text-xs text-gray-500">
              Payments are processed securely
              through the selected payment provider.
            </p>
          </div>

          {/* PLACE ORDER BUTTON */}

          <button
            type="submit"
            disabled={loading}
            className="mt-8 flex w-full items-center justify-center rounded-xl bg-black py-4 font-semibold text-white transition hover:bg-gray-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading
              ? method === "stripe"
                ? "REDIRECTING TO STRIPE..."
                : method === "razorpay"
                ? "OPENING RAZORPAY..."
                : "PLACING ORDER..."
              : method === "stripe"
              ? "PAY WITH STRIPE"
              : method === "razorpay"
              ? "PAY WITH RAZORPAY"
              : "PLACE ORDER"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default PlaceOrder;