import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Store,
  Loader2,
  ShoppingBag,
} from "lucide-react";

import { useAuth } from "../Context/ShopContext";

const Login = () => {
  const navigate = useNavigate();

  // =====================================================
  // AUTH CONTEXT
  // =====================================================

  const { setToken } = useAuth();

  // =====================================================
  // STATES
  // =====================================================

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  // =====================================================
  // LOAD REGISTERED EMAIL
  // =====================================================

  useEffect(() => {
    const registeredEmail =
      sessionStorage.getItem("registeredEmail");

    if (registeredEmail) {
      setFormData((previous) => ({
        ...previous,
        email: registeredEmail,
      }));

      setMessage(
        "Account created successfully. Please login to continue."
      );

      // Remove after using it
      sessionStorage.removeItem("registeredEmail");
    }
  }, []);

  // =====================================================
  // HANDLE INPUT CHANGE
  // =====================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setMessage("");
  };

  // =====================================================
  // HANDLE LOGIN
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setMessage("");

    const email =
      formData.email.trim().toLowerCase();

    const password =
      formData.password;

    // =====================================================
    // VALIDATION
    // =====================================================

    if (!email) {
      setError(
        "Please enter your email address."
      );
      return;
    }

    if (!password) {
      setError(
        "Please enter your password."
      );
      return;
    }

    // =====================================================
    // BACKEND URL
    // =====================================================

    const backendUrl =
      import.meta.env.VITE_BACKEND_URL;

    if (!backendUrl) {
      setError(
        "Backend URL is not configured. Please check your environment variables."
      );
      return;
    }

    try {
      setLoading(true);

      console.log(
        "================================"
      );

      console.log(
        "CUSTOMER LOGIN"
      );

      console.log(
        "================================"
      );

      console.log(
        "Email:",
        email
      );

      console.log(
        "Backend:",
        backendUrl
      );

      // =====================================================
      // CUSTOMER LOGIN API
      // =====================================================

      const response = await axios.post(
        `${backendUrl}/api/user/login`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type":
              "application/json",
          },
        }
      );

      console.log(
        "Customer Login Response:",
        response.data
      );

      // =====================================================
      // LOGIN SUCCESS
      // =====================================================

      if (
        response.data?.success &&
        response.data?.token
      ) {
        const token =
          response.data.token;

        // =================================================
        // UPDATE SHOP CONTEXT
        // =================================================

        setToken(token);

        // =================================================
        // SAVE TOKEN
        // =================================================

        localStorage.setItem(
          "token",
          token
        );

        console.log(
          "Customer token saved:",
          localStorage.getItem(
            "token"
          )
        );

        console.log(
          "Customer login successful."
        );

        // =================================================
        // REDIRECT TO CUSTOMER HOME PAGE
        // =================================================

        navigate("/", {
          replace: true,
        });

        return;
      }

      // =====================================================
      // LOGIN FAILED
      // =====================================================

      setError(
        response.data?.message ||
          "Invalid email or password."
      );

    } catch (error) {

      console.error(
        "Customer Login Error:",
        error
      );

      // =====================================================
      // BACKEND RESPONSE ERROR
      // =====================================================

      if (error.response) {

        console.error(
          "Status:",
          error.response.status
        );

        console.error(
          "Response:",
          error.response.data
        );

        setError(
          error.response.data?.message ||
            "Invalid email or password."
        );

      }

      // =====================================================
      // SERVER NOT AVAILABLE
      // =====================================================

      else if (error.request) {

        setError(
          "Unable to connect to the server. Please make sure the backend is running."
        );

      }

      // =====================================================
      // OTHER ERROR
      // =====================================================

      else {

        setError(
          "Something went wrong. Please try again."
        );
      }

    } finally {

      setLoading(false);
    }
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8 sm:py-12">

      <div className="mx-auto grid w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl lg:grid-cols-2">

        {/* =================================================
            LEFT SIDE
        ================================================= */}

        <div className="relative hidden overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 p-10 text-white lg:flex lg:flex-col lg:justify-between">

          {/* Background decorations */}

          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />

          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-violet-400/20 blur-3xl" />

          <div className="relative z-10">

            {/* LOGO */}

            <div className="mb-12 flex items-center gap-3">

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">

                <Store size={25} />

              </div>

              <div>

                <h1 className="text-xl font-bold">
                  ShopAdmin
                </h1>

                <p className="text-sm text-indigo-200">
                  Ecommerce Store
                </p>

              </div>

            </div>

            {/* HEADING */}

            <h2 className="max-w-md text-4xl font-bold leading-tight">

              Welcome back to your shopping journey.

            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-indigo-100">

              Login to your account and continue
              shopping with a secure and seamless
              experience.

            </p>

            {/* FEATURES */}

            <div className="mt-10 space-y-5">

              <div className="flex items-center gap-4">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">

                  <ShoppingBag size={20} />

                </div>

                <div>

                  <p className="text-sm font-semibold">
                    Easy Shopping
                  </p>

                  <p className="text-xs text-indigo-200">
                    Browse and shop your favorite products
                  </p>

                </div>

              </div>


              <div className="flex items-center gap-4">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">

                  <Store size={20} />

                </div>

                <div>

                  <p className="text-sm font-semibold">
                    Secure Account
                  </p>

                  <p className="text-xs text-indigo-200">
                    Your account is protected
                  </p>

                </div>

              </div>

            </div>

          </div>

          {/* FOOTER */}

          <p className="relative z-10 text-sm text-indigo-200">

            © 2026 ShopAdmin. All rights reserved.

          </p>

        </div>


        {/* =================================================
            RIGHT SIDE
        ================================================= */}

        <div className="p-6 sm:p-10 lg:p-12">

          {/* HEADER */}

          <div className="mb-8">

            <h2 className="text-3xl font-bold text-slate-900">

              Welcome Back

            </h2>

            <p className="mt-2 text-sm text-slate-500">

              Login to your account to continue shopping.

            </p>

          </div>


          {/* SUCCESS MESSAGE */}

          {message && (

            <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">

              {message}

            </div>

          )}


          {/* ERROR MESSAGE */}

          {error && (

            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">

              {error}

            </div>

          )}


          {/* LOGIN FORM */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* =================================================
                EMAIL
            ================================================= */}

            <div>

              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email Address
              </label>

              <div className="relative">

                <Mail
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  autoComplete="email"
                  disabled={loading}
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                />

              </div>

            </div>


            {/* =================================================
                PASSWORD
            ================================================= */}

            <div>

              <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Password
              </label>

              <div className="relative">

                <LockKeyhole
                  size={19}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  id="password"
                  name="password"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  disabled={loading}
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (previous) =>
                        !previous
                    )
                  }
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >

                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}

                </button>

              </div>

            </div>


            {/* =================================================
                FORGOT PASSWORD
            ================================================= */}

            <div className="flex justify-end">

              <Link
                to="/forgot-password"
                className="text-sm font-semibold text-indigo-600 hover:text-indigo-700"
              >
                Forgot Password?
              </Link>

            </div>


            {/* =================================================
                LOGIN BUTTON
            ================================================= */}

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:bg-indigo-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
            >

              {loading ? (

                <>

                  <Loader2
                    size={18}
                    className="animate-spin"
                  />

                  Signing In...

                </>

              ) : (

                "Login to Shop"

              )}

            </button>

          </form>


          {/* =================================================
              REGISTER
          ================================================= */}

          <div className="mt-7 text-center">

            <p className="text-sm text-slate-500">

              Don't have an account?{" "}

              <Link
                to="/register"
                className="font-bold text-indigo-600 hover:text-indigo-700"
              >
                Create Account
              </Link>

            </p>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Login;