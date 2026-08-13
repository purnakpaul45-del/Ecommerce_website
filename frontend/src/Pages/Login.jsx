
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
} from "lucide-react";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ==========================================
  // GET REGISTERED EMAIL
  // ==========================================

  useEffect(() => {
    const registeredEmail =
      sessionStorage.getItem("registeredEmail");

    if (registeredEmail) {
      setFormData((prev) => ({
        ...prev,
        email: registeredEmail,
      }));

      setMessage(
        "Your email has been filled in. Please enter your password to continue."
      );

      sessionStorage.removeItem("registeredEmail");
    }
  }, []);

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setError("");
    setMessage("");
  };

  // ==========================================
  // LOGIN
  // ==========================================

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

    if (!email) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      console.log("Attempting login...");
      console.log("Email:", email);

      const response = await axios.post(
        "http://localhost:8005/api/user/login",
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

      console.log(
        "========== LOGIN RESPONSE =========="
      );

      console.log(
        "Status:",
        response.status
      );

      console.log(
        "Data:",
        response.data
      );

      // ==========================================
      // CHECK SUCCESS
      // ==========================================

      if (!response.data?.success) {
        setError(
          response.data?.message ||
            "Invalid email or password."
        );

        return;
      }

      // ==========================================
      // GET TOKEN
      // ==========================================

      const token =
        response.data?.token;

      if (!token) {
        console.error(
          "Login succeeded but no token was returned."
        );

        console.error(
          "Backend response:",
          response.data
        );

        setError(
          "Login succeeded, but the server did not return an authentication token."
        );

        return;
      }

      // ==========================================
      // SAVE TOKEN
      // ==========================================

      localStorage.setItem(
        "token",
        token
      );

      // ==========================================
      // SAVE USER
      // ==========================================

      const userData =
        response.data?.user ||
        response.data?.userData;

      if (userData) {
        localStorage.setItem(
          "user",
          JSON.stringify(userData)
        );
      }

      console.log(
        "Token saved successfully."
      );

      console.log(
        "Token exists:",
        !!localStorage.getItem("token")
      );

      // ==========================================
      // SUCCESS
      // ==========================================

      setMessage(
        response.data?.message ||
          "Login successful!"
      );

      // Small delay so user sees success message
      setTimeout(() => {
        navigate("/");
      }, 700);

    } catch (error) {
      console.error(
        "========== LOGIN ERROR =========="
      );

      console.error(error);

      if (error.response) {
        console.error(
          "Status:",
          error.response.status
        );

        console.error(
          "Server response:",
          error.response.data
        );

        setError(
          error.response.data?.message ||
            `Login failed (${error.response.status}).`
        );

      } else if (error.request) {
        console.error(
          "No response received from server."
        );

        setError(
          "Unable to connect to server. Please make sure your backend is running on port 8005."
        );

      } else {
        setError(
          error.message ||
            "Something went wrong. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        {/* LOGO */}

        <div className="mb-8 text-center">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg">
            <Store size={28} />
          </div>

          <h1 className="mt-5 text-2xl font-bold text-slate-900">
            ShopAdmin
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Sign in to continue shopping
          </p>

        </div>

        {/* LOGIN CARD */}

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">

          <div className="mb-6">

            <h2 className="text-xl font-bold text-slate-900">
              Welcome Back
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Enter your credentials to continue.
            </p>

          </div>

          {/* MESSAGE */}

          {message && (
            <div className="mb-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
              {message}
            </div>
          )}

          {/* ERROR */}

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* EMAIL */}

            <div>

              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Email Address
              </label>

              <div className="relative">

                <Mail
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                  placeholder="Enter your email"
                  disabled={loading}
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />

              </div>

            </div>

            {/* PASSWORD */}

            <div>

              <div className="mb-2 flex items-center justify-between">

                <label className="block text-sm font-semibold text-slate-700">
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  Forgot Password?
                </Link>

              </div>

              <div className="relative">

                <LockKeyhole
                  size={19}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  disabled={loading}
                  required
                  className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-12 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (prev) => !prev
                    )
                  }
                  disabled={loading}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>

              </div>

            </div>

            {/* REMEMBER ME */}

            <label className="flex cursor-pointer items-center gap-2">

              <input
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-indigo-600"
              />

              <span className="text-sm text-slate-500">
                Remember me
              </span>

            </label>

            {/* LOGIN */}

            <button
              type="submit"
              disabled={loading}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-lg transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
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
                "Sign In"
              )}

            </button>

          </form>

          {/* REGISTER */}

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

        <p className="mt-6 text-center text-xs text-slate-400">
          © 2026 ShopAdmin. All rights reserved.
        </p>

      </div>
    </div>
  );
};

export default Login;

