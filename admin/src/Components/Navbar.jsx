
import React, { useEffect, useRef, useState } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
  X,
  ShoppingBag,
  Package,
  CreditCard,
  AlertTriangle,
} from "lucide-react";

const Navbar = ({
  setSidebarOpen,
  adminName = "Admin",
  adminEmail = "admin@example.com",
  adminAvatar = "",
  onLogout,
}) => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const mobileSearchRef = useRef(null);

  const notifications = [
    {
      id: 1,
      type: "order",
      title: "New Order Received",
      message: "Order #ORD-1024 has been placed successfully.",
      time: "5 minutes ago",
    },
    {
      id: 2,
      type: "stock",
      title: "Low Stock Alert",
      message: "Running Shoes have only 3 items remaining.",
      time: "30 minutes ago",
    },
    {
      id: 3,
      type: "payment",
      title: "Payment Successful",
      message: "Payment for order #ORD-1020 has been received.",
      time: "1 hour ago",
    },
    {
      id: 4,
      type: "product",
      title: "Product Added",
      message: "A new product has been added to your store.",
      time: "2 hours ago",
    },
  ];

  const unreadCount = 3;

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }

      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(event.target)
      ) {
        setMobileSearchOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  // Close dropdowns with Escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
        setNotificationOpen(false);
        setMobileSearchOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  // Search
  const handleSearch = (event) => {
    event.preventDefault();

    const query = searchValue.trim();

    if (!query) {
      return;
    }

    console.log("Searching for:", query);
  };

  // Logout
  const handleLogout = () => {
    setProfileOpen(false);

    if (typeof onLogout === "function") {
      onLogout();
    } else {
      console.log("Logout clicked");
    }
  };

  // Notification icons
  const getNotificationIcon = (type) => {
    if (type === "order") {
      return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
          <ShoppingBag size={19} />
        </div>
      );
    }

    if (type === "stock") {
      return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-50 text-amber-600">
          <AlertTriangle size={19} />
        </div>
      );
    }

    if (type === "payment") {
      return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
          <CreditCard size={19} />
        </div>
      );
    }

    if (type === "product") {
      return (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
          <Package size={19} />
        </div>
      );
    }

    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-600">
        <Bell size={19} />
      </div>
    );
  };

  return (
    <>
      {/* ================= NAVBAR ================= */}
      <header className="sticky top-0 z-40 h-16 border-b border-slate-200 bg-white">
        <div className="relative flex h-full items-center justify-between px-4 sm:px-6 lg:px-8">

          {/* ================= LEFT SECTION ================= */}
          <div className="flex items-center gap-3">

            {/* Mobile Sidebar Button */}
            <button
              type="button"
              onClick={() => {
                if (typeof setSidebarOpen === "function") {
                  setSidebarOpen(true);
                }
              }}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>

            {/* Desktop Brand */}
            <div className="hidden lg:block">
              <p className="text-sm font-semibold text-slate-800">
                Admin Dashboard
              </p>

              <p className="text-xs text-slate-400">
                Manage your store
              </p>
            </div>
          </div>

          {/* ================= CENTER SEARCH BAR ================= */}
          <form
            onSubmit={handleSearch}
            className="absolute left-1/2 hidden w-[360px] -translate-x-1/2 md:block lg:w-[420px] xl:w-[500px]"
          >
            <div className="relative">
              <Search
                size={19}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={searchValue}
                onChange={(event) =>
                  setSearchValue(event.target.value)
                }
                placeholder="Search products, orders, customers..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-11 pr-12 text-sm text-slate-700 outline-none transition-all duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              />

              {/* Search Shortcut */}
              <span className="absolute right-3 top-1/2 hidden -translate-y-1/2 rounded-md border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-400 lg:block">
                /
              </span>
            </div>
          </form>

          {/* ================= RIGHT SECTION ================= */}
          <div className="ml-auto flex items-center gap-2 sm:gap-3">

            {/* Mobile Search */}
            <button
              type="button"
              onClick={() => {
                setMobileSearchOpen(true);
                setProfileOpen(false);
                setNotificationOpen(false);
              }}
              className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 md:hidden"
              aria-label="Open search"
            >
              <Search size={21} />
            </button>

            {/* View Store */}
            <button
              type="button"
              className="hidden rounded-xl px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900 xl:block"
            >
              View Store
            </button>

            {/* Divider */}
            <div className="hidden h-8 w-px bg-slate-200 xl:block" />

            {/* ================= NOTIFICATIONS ================= */}
            <div
              ref={notificationRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() => {
                  setNotificationOpen(
                    (value) => !value
                  );
                  setProfileOpen(false);
                }}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
                aria-label="Open notifications"
              >
                <Bell size={21} />

                {unreadCount > 0 && (
                  <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[9px] font-bold text-white">
                    {unreadCount > 9
                      ? "9+"
                      : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {notificationOpen && (
                <div className="absolute right-0 mt-3 w-[calc(100vw-2rem)] max-w-sm overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">

                  <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        Notifications
                      </h3>

                      <p className="mt-1 text-xs text-slate-500">
                        You have {unreadCount} unread notifications
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setNotificationOpen(false)
                      }
                      className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100"
                    >
                      <X size={17} />
                    </button>
                  </div>

                  <div className="max-h-[360px] overflow-y-auto">
                    {notifications.map(
                      (notification) => (
                        <button
                          type="button"
                          key={notification.id}
                          className="flex w-full gap-3 border-b border-slate-100 p-4 text-left transition hover:bg-slate-50"
                        >
                          {getNotificationIcon(
                            notification.type
                          )}

                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-slate-800">
                              {notification.title}
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              {notification.message}
                            </p>

                            <p className="mt-1 text-[11px] text-slate-400">
                              {notification.time}
                            </p>
                          </div>
                        </button>
                      )
                    )}
                  </div>

                  <button
                    type="button"
                    className="w-full border-t border-slate-100 py-3 text-sm font-semibold text-indigo-600 transition hover:bg-indigo-50"
                  >
                    View all notifications
                  </button>
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-slate-200" />

            {/* ================= PROFILE ================= */}
            <div
              ref={profileRef}
              className="relative"
            >
              <button
                type="button"
                onClick={() => {
                  setProfileOpen(
                    (value) => !value
                  );
                  setNotificationOpen(false);
                }}
                className="flex items-center gap-2 rounded-xl p-1 transition hover:bg-slate-100 sm:gap-3"
                aria-label="Open profile menu"
              >
                {adminAvatar ? (
                  <img
                    src={adminAvatar}
                    alt={adminName}
                    className="h-9 w-9 rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">
                    {adminName
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}

                <div className="hidden text-left lg:block">
                  <div className="flex items-center gap-2">
                    <p className="max-w-24 truncate text-sm font-semibold text-slate-800">
                      {adminName}
                    </p>

                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  </div>

                  <p className="text-xs text-slate-500">
                    Administrator
                  </p>
                </div>

                <ChevronDown
                  size={17}
                  className={`hidden text-slate-400 transition-transform lg:block ${
                    profileOpen
                      ? "rotate-180"
                      : ""
                  }`}
                />
              </button>

              {/* Profile Dropdown */}
              {profileOpen && (
                <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">

                  <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-5">
                    <div className="flex items-center gap-3">

                      {adminAvatar ? (
                        <img
                          src={adminAvatar}
                          alt={adminName}
                          className="h-12 w-12 rounded-full border-2 border-white/20 object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/20 text-lg font-bold text-white">
                          {adminName
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate font-bold text-white">
                          {adminName}
                        </p>

                        <p className="mt-1 truncate text-xs text-indigo-100">
                          {adminEmail}
                        </p>

                        <div className="mt-2 flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-emerald-300" />

                          <span className="text-xs text-indigo-100">
                            Online
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">

                    <button
                      type="button"
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-600 transition hover:bg-slate-100"
                    >
                      <User size={18} />
                      <span>My Profile</span>
                    </button>

                    <button
                      type="button"
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-600 transition hover:bg-slate-100"
                    >
                      <Settings size={18} />
                      <span>Settings</span>
                    </button>

                    <div className="my-2 border-t border-slate-100" />

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                    >
                      <LogOut size={18} />
                      <span>Logout</span>
                    </button>

                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ================= MOBILE SEARCH ================= */}
      {mobileSearchOpen && (
        <div
          ref={mobileSearchRef}
          className="fixed inset-x-0 top-0 z-50 border-b border-slate-200 bg-white p-4 shadow-xl md:hidden"
        >
          <form
            onSubmit={handleSearch}
            className="flex items-center gap-2"
          >
            <div className="relative flex-1">
              <Search
                size={19}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                autoFocus
                value={searchValue}
                onChange={(event) =>
                  setSearchValue(event.target.value)
                }
                placeholder="Search products, orders, customers..."
                className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm outline-none focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>

            <button
              type="button"
              onClick={() =>
                setMobileSearchOpen(false)
              }
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
            >
              <X size={20} />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Navbar;

