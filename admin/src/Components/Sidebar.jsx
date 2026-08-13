
import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  PlusSquare,
  ShoppingCart,
  Users,
  BarChart3,
  Tag,
  Settings,
  X,
  Store,
  ChevronRight,
} from "lucide-react";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const menuItems = [
    {
      title: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      title: "Products",
      path: "/products",
      icon: Package,
    },
    {
      title: "Add Product",
      path: "/add-product",
      icon: PlusSquare,
    },
    {
      title: "Orders",
      path: "/orders",
      icon: ShoppingCart,
    },
    {
      title: "Customers",
      path: "/customers",
      icon: Users,
    },
    {
      title: "Analytics",
      path: "/analytics",
      icon: BarChart3,
    },
    {
      title: "Coupons",
      path: "/coupons",
      icon: Tag,
    },
  ];

  const handleNavigation = () => {
    if (setSidebarOpen) {
      setSidebarOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 flex h-screen w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Section */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-slate-100 px-5">
          <NavLink
            to="/"
            onClick={handleNavigation}
            className="flex items-center gap-3"
          >
            {/* Logo Icon */}
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20">
              <Store size={23} strokeWidth={2.2} />
            </div>

            {/* Logo Text */}
            <div>
              <h1 className="text-lg font-bold tracking-tight text-slate-900">
                ShopAdmin
              </h1>

              <p className="text-xs font-medium text-slate-400">
                Ecommerce Dashboard
              </p>
            </div>
          </NavLink>

          {/* Mobile Close Button */}
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 lg:hidden"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto px-4 py-6">
          {/* Main Menu Label */}
          <div className="mb-3 px-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Main Menu
            </p>
          </div>

          {/* Menu Items */}
          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={handleNavigation}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      {/* Icon */}
                      <span
                        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition ${
                          isActive
                            ? "bg-white/15 text-white"
                            : "bg-slate-100 text-slate-500 group-hover:bg-white group-hover:text-indigo-600"
                        }`}
                      >
                        <Icon size={19} strokeWidth={2} />
                      </span>

                      {/* Title */}
                      <span className="flex-1">{item.title}</span>

                      {/* Active Arrow */}
                      {isActive && (
                        <ChevronRight
                          size={17}
                          className="text-white/80"
                        />
                      )}
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* Management Section */}
          <div className="mb-3 mt-8 px-3">
            <p className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
              Management
            </p>
          </div>

          <nav className="space-y-1.5">
            <NavLink
              to="/settings"
              onClick={handleNavigation}
              className={({ isActive }) =>
                `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/20"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      isActive
                        ? "bg-white/15 text-white"
                        : "bg-slate-100 text-slate-500 group-hover:text-indigo-600"
                    }`}
                  >
                    <Settings size={19} />
                  </span>

                  <span className="flex-1">Settings</span>

                  {isActive && <ChevronRight size={17} />}
                </>
              )}
            </NavLink>
          </nav>

          {/* Upgrade / Promo Card */}
          <div className="mt-8 overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-600 p-4 text-white shadow-lg shadow-indigo-500/20">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
              <BarChart3 size={20} />
            </div>

            <h3 className="text-sm font-bold">
              Grow Your Store
            </h3>

            <p className="mt-1 text-xs leading-5 text-indigo-100">
              Monitor your store performance and increase your sales.
            </p>

            <button
              type="button"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-3 py-2.5 text-xs font-bold text-indigo-600 transition hover:bg-indigo-50"
            >
              View Analytics
              <ChevronRight size={15} />
            </button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="shrink-0 border-t border-slate-100 p-4">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 text-sm font-bold text-white">
              A
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                Admin Panel
              </p>

              <p className="truncate text-xs text-slate-400">
                Manage your store
              </p>
            </div>

            <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-100" />
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;

