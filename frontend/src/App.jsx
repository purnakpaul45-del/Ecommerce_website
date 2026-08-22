
import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

// Pages
import Home from "./Pages/Home";
import Collection from "./Pages/Collection";
import About from "./Pages/About";
import Product from "./Pages/Product";
import Contact from "./Pages/Contact";
import Cart from "./Pages/Cart";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import PlaceOrder from "./Pages/PlaceOrder";
import Orders from "./Pages/Orders";
import TrackOrder from "./Pages/TrackOrder";

// Components
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import SearchBar from "./Components/SearchBar";

// Toast
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AIChatbot from "./Components/AIChatbot";


const App = () => {
  const location = useLocation();

  // Hide Navbar, SearchBar and Footer
  // on authentication pages
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      
      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        theme="light"
      />

      {/* Hide ecommerce navigation on Login/Register */}
      {!isAuthPage && <Navbar />}

      {!isAuthPage && <SearchBar />}

      {/* ================================
          APPLICATION ROUTES
      ================================= */}
      <Routes>
        
        {/* Home */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* Product Collection */}
        <Route
          path="/collection"
          element={<Collection />}
        />

        {/* About */}
        <Route
          path="/about"
          element={<About />}
        />

        {/* Product Details */}
        <Route
          path="/product/:productId"
          element={<Product />}
        />

        {/* Contact */}
        <Route
          path="/contact"
          element={<Contact />}
        />

        {/* Cart */}
        <Route
          path="/cart"
          element={<Cart />}
        />

        {/* ================================
            CUSTOMER AUTHENTICATION
        ================================= */}

        {/* Login */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Register */}
        <Route
          path="/register"
          element={<Register />}
        />

        {/* ================================
            ORDER FLOW
        ================================= */}

        {/* Place Order */}
        <Route
          path="/place-order"
          element={<PlaceOrder />}
        />

        {/* Orders */}
        <Route
          path="/orders"
          element={<Orders />}
        />
        <Route
  path="/track-order/:orderId"
  element={<TrackOrder />}
/>

        {/* 404 Page */}
        <Route
          path="*"
          element={
            <div className="flex min-h-[60vh] items-center justify-center">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-800">
                  404
                </h1>

                <p className="mt-4 text-gray-500">
                  Page not found
                </p>

                <a
                  href="/"
                  className="mt-6 inline-block rounded-lg bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-gray-800"
                >
                  Go Home
                </a>
              </div>
            </div>
          }
        />
      </Routes>
      <AIChatbot/>

      {/* Hide Footer on Login/Register */}
      {!isAuthPage && <Footer />}
    </div>
  );
};

export default App;

