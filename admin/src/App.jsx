
import React from "react";
import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { useAuth } from "./Context/AuthContext.jsx";

// ==========================================
// LAYOUT COMPONENTS
// ==========================================

import Navbar from "./Components/Navbar.jsx";
import Sidebar from "./Components/Sidebar.jsx";

// ==========================================
// PAGES
// ==========================================

import Login from "./Pages/Login.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import Products from "./Pages/Products.jsx";
import AddProduct from "./Pages/AddProduct.jsx";
import Orders from "./Pages/Orders.jsx";
import Customers from "./Pages/Customer.jsx";
import Analytics from "./Pages/Analytics.jsx";
import Coupon from "./Pages/Coupon.jsx";
// ==========================================
// ADMIN LAYOUT
// ==========================================

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  const { logout } = useAuth();

  // ========================================
  // ADMIN USER
  // ========================================

  const adminUser = JSON.parse(
    localStorage.getItem("adminUser") || "{}"
  );

  const adminName = adminUser?.name || "Admin";

  const adminEmail =
    adminUser?.email || "admin@example.com";

  return (
    <div className="min-h-screen bg-slate-50">

      {/* ======================================
          SIDEBAR
      ====================================== */}

      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      {/* ======================================
          MAIN CONTENT AREA
      ====================================== */}

      <div className="lg:ml-64">

        {/* ====================================
            NAVBAR
        ==================================== */}

        <Navbar
          setSidebarOpen={setSidebarOpen}
          adminName={adminName}
          adminEmail={adminEmail}
          onLogout={logout}
        />

        {/* ====================================
            PAGE CONTENT
        ==================================== */}

        <main className="p-4 sm:p-6 lg:p-8">

          <Routes>

            {/* ==================================
                DASHBOARD
            ================================== */}

            <Route
              path="/dashboard"
              element={<Dashboard />}
            />

            {/* ==================================
                PRODUCTS
            ================================== */}

            <Route
              path="/products"
              element={<Products />}
            />

            {/* ==================================
                ADD PRODUCT
            ================================== */}

            <Route
              path="/add-product"
              element={<AddProduct />}
            />

            {/* ==================================
                ORDERS
            ================================== */}

            <Route
              path="/orders"
              element={<Orders />}
            />

            {/* ==================================
                CUSTOMERS
            ================================== */}

            <Route
              path="/customers"
              element={<Customers />}
            />

            {/* ==================================
                ANALYTICS
            ================================== */}

            <Route
              path="/analytics"
              element={<Analytics />}
            />
            <Route
  path="/coupons"
  element={<Coupon />}
/>

            {/* ==================================
                DEFAULT ADMIN ROUTE
            ================================== */}

            <Route
              path="/"
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />

            {/* ==================================
                UNKNOWN ADMIN ROUTE
            ================================== */}

            <Route
              path="*"
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />

          </Routes>

        </main>

      </div>
    </div>
  );
};

// ==========================================
// PROTECTED ROUTE
// ==========================================

const ProtectedRoute = () => {
  const {
    isAuthenticated,
    loading,
  } = useAuth();

  // ========================================
  // WAIT FOR AUTHENTICATION
  // ========================================

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">

        <div className="text-center">

          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

          <p className="mt-4 text-sm font-medium text-slate-600">
            Checking authentication...
          </p>

        </div>

      </div>
    );
  }

  // ========================================
  // NOT AUTHENTICATED
  // ========================================

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // ========================================
  // AUTHENTICATED
  // ========================================

  return <AdminLayout />;
};

// ==========================================
// APP
// ==========================================

const App = () => {
  return (
    <Routes>

      {/* ======================================
          ADMIN LOGIN

          No Navbar
          No Sidebar
      ====================================== */}

      <Route
        path="/login"
        element={<Login />}
      />

      {/* ======================================
          PROTECTED ADMIN PANEL

          Navbar + Sidebar
      ====================================== */}

      <Route
        path="/*"
        element={<ProtectedRoute />}
      />

    </Routes>
  );
};

export default App;

