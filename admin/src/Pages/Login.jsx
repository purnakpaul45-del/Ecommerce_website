import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Store,
  Loader2,
} from "lucide-react";

import { useAuth } from "../Context/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const { login } = useAuth();

  // ==========================================
  // STATES
  // ==========================================

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==========================================
  // HANDLE INPUT CHANGE
  // ==========================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  // ==========================================
  // HANDLE LOGIN
  // ==========================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!email) {
      setError("Please enter your admin email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    // ==========================================
    // BACKEND URL
    // ==========================================

    const backendUrl = import.meta.env.VITE_BACKEND_URL;

    if (!backendUrl) {
      setError(
        "Backend URL is not configured. Please check your environment variables."
      );
      return;
    }

    try {
      setLoading(true);

      console.log("================================");
      console.log("ADMIN LOGIN");
      console.log("================================");
      console.log("Email:", email);
      console.log("Backend:", backendUrl);

      // ==========================================
      // ADMIN LOGIN API
      // ==========================================

      const response = await axios.post(
        `${backendUrl}/api/admin/login`,
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Admin Login Response:", response.data);

      // ==========================================
      // LOGIN SUCCESS
      // ==========================================

      if (
        response.data?.success &&
        response.data?.token
      ) {
        const token = response.data.token;
        const admin = response.data.admin;

        // ========================================
        // SAVE JWT TOKEN
        // ========================================

        localStorage.setItem("token", token);

        // ========================================
        // SAVE ADMIN INFORMATION
        // ========================================

        if (admin) {
          localStorage.setItem(
            "admin",
            JSON.stringify(admin)
          );
        }

        // ========================================
        // VERIFY TOKEN WAS SAVED
        // ========================================

        console.log(
          "Admin token saved:",
          localStorage.getItem("token")
        );

        console.log(
          "Admin data saved:",
          localStorage.getItem("admin")
        );

        // ========================================
        // UPDATE AUTH CONTEXT
        // ========================================

        login(admin, token);

        console.log(
          "Admin authentication successful."
        );

        // ========================================
        // REDIRECT TO DASHBOARD
        // ========================================

        navigate("/dashboard", {
          replace: true,
        });

        return;
      }

      // ==========================================
      // LOGIN FAILED
      // ==========================================

      setError(
        response.data?.message ||
          "Invalid admin email or password."
      );
    } catch (error) {
      console.error("Admin Login Error:", error);

      // ==========================================
      // BACKEND RESPONSE ERROR
      // ==========================================

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
            "Invalid admin email or password."
        );
      }

      // ==========================================
      // SERVER NOT AVAILABLE
      // ==========================================

      else if (error.request) {
        setError(
          "Unable to connect to the backend. Please check your internet connection or try again later."
        );
      }

      // ==========================================
      // OTHER ERROR
      // ==========================================

      else {
        setError(
          "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">

        {/* ======================================
            LOGO
        ====================================== */}

        <div className="mb-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-xl shadow-indigo-500/20">
            <Store size={30} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            ShopAdmin
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Administrator Portal
          </p>
        </div>

        {/* ======================================
            LOGIN CARD
        ====================================== */}

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/5 sm:p-8">

          <div className="mb-7">
            <h2 className="text-2xl font-bold text-slate-900">
              Admin Login
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Sign in to access your admin dashboard.
            </p>
          </div>

          {/* ====================================
              ERROR
          ==================================== */}

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          {/* ====================================
              LOGIN FORM
          ==================================== */}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* EMAIL */}

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Admin Email
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
                  placeholder="admin@example.com"
                  autoComplete="email"
                  disabled={loading}
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-4 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>

            {/* PASSWORD */}

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
                      (previous) => !previous
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

            {/* LOGIN BUTTON */}

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
                "Sign In to Dashboard"
              )}
            </button>

          </form>
        </div>

        {/* ======================================
            FOOTER
        ====================================== */}

        <p className="mt-6 text-center text-xs text-slate-400">
          © 2026 ShopAdmin. Admin access only.
        </p>

      </div>
    </div>
  );
};

export default Login;