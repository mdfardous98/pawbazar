import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "./ThemeToggle";
import AdvancedSearch from "./AdvancedSearch";
import NotificationCenter from "./NotificationCenter";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout, isAuthenticated, isDemoMode } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const navItems = [
    { name: "Home", path: "/", icon: "🏠" },
    { name: "Pets & Supplies", path: "/pets-supplies", icon: "🐾" },
  ];

  const authenticatedNavItems = [
    { name: "Add Listing", path: "/add-listing", icon: "➕" },
    { name: "My Listings", path: "/my-listings", icon: "📝" },
    { name: "My Orders", path: "/my-orders", icon: "📦" },
    { name: "Favorites", path: "/favorites", icon: "❤️" },
    { name: "Messages", path: "/messages", icon: "💬" },
    { name: "Dashboard", path: "/dashboard", icon: "📊" },
  ];

  const isActivePath = (path) => location.pathname === path;

  return (
    <>
      {/* Demo Mode Banner */}
      <AnimatePresence>
        {isDemoMode && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-gradient-to-r from-warning to-orange-400 text-warning-content text-center py-2 text-sm z-50 relative"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="animate-pulse">🚧</span>
              <span>
                Demo Mode: Firebase not configured. Authentication is simulated
                for testing.
              </span>
              <span className="animate-pulse">🚧</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.nav
        className={`navbar sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? "bg-base-100/95 backdrop-blur-md shadow-lg border-b border-base-300"
            : "bg-base-100 shadow-sm"
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="navbar-start">
          {/* Mobile Menu Button */}
          <motion.button
            className="btn btn-ghost lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={
                    isMobileMenuOpen
                      ? "M6 18L18 6M6 6l12 12"
                      : "M4 6h16M4 12h8m-8 6h16"
                  }
                />
              </svg>
            </motion.div>
          </motion.button>

          {/* Logo */}
          <Link to="/" className="btn btn-ghost text-xl group">
            <motion.span
              className="text-2xl"
              whileHover={{ scale: 1.2, rotate: 10 }}
              transition={{ duration: 0.2 }}
            >
              🐾
            </motion.span>
            <motion.span
              className="font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              whileHover={{ scale: 1.05 }}
            >
              PawBazar
            </motion.span>
          </Link>
        </div>

        {/* Desktop Navigation - Optimized for 1200px */}
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 gap-0">
            {navItems.map((item) => (
              <motion.li key={item.path}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    to={item.path}
                    className={`relative px-3 py-2 rounded-lg transition-all duration-300 text-sm ${
                      isActivePath(item.path)
                        ? "text-primary bg-primary/10"
                        : "hover:text-primary hover:bg-primary/5"
                    }`}
                  >
                    <span className="mr-1">{item.icon}</span>
                    <span className="hidden xl:inline">{item.name}</span>
                    <span className="xl:hidden">{item.name.split(" ")[0]}</span>
                    {isActivePath(item.path) && (
                      <motion.div
                        className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                        layoutId="activeTab"
                        initial={false}
                      />
                    )}
                  </Link>
                </motion.div>
              </motion.li>
            ))}

            {isAuthenticated &&
              authenticatedNavItems.map((item) => (
                <motion.li key={item.path}>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to={item.path}
                      className={`relative px-3 py-2 rounded-lg transition-all duration-300 text-sm ${
                        isActivePath(item.path)
                          ? "text-primary bg-primary/10"
                          : "hover:text-primary hover:bg-primary/5"
                      }`}
                    >
                      <span className="mr-1">{item.icon}</span>
                      <span className="hidden xl:inline">{item.name}</span>
                      <span className="xl:hidden">
                        {item.name.split(" ")[0]}
                      </span>
                      {isActivePath(item.path) && (
                        <motion.div
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                          layoutId="activeTab"
                          initial={false}
                        />
                      )}
                    </Link>
                  </motion.div>
                </motion.li>
              ))}
          </ul>
        </div>

        {/* Right Side Actions */}
        <div className="navbar-end">
          <div className="flex items-center gap-1">
            {/* Search Button - Compact */}
            <motion.button
              onClick={() => setShowAdvancedSearch(true)}
              className="btn btn-ghost btn-sm btn-circle"
              title="Advanced Search"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </motion.button>

            {/* Notifications - Compact */}
            {isAuthenticated && (
              <motion.button
                onClick={() => setShowNotifications(true)}
                className="btn btn-ghost btn-sm btn-circle relative"
                title="Notifications"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-5 5v-5zM10.97 4.97a.235.235 0 0 0-.02 0L9 5l1.95-.03c.043-.01.086-.01.13-.01.046 0 .092 0 .138.01L13 5l-1.95-.03a.235.235 0 0 0-.02 0zm1.03 1.03c2.76 0 5 2.24 5 5 0 1.95-1.12 3.64-2.75 4.47V17c0 .55-.45 1-1 1H9c-.55 0-1-.45-1-1v-1.53C6.37 14.64 5.25 12.95 5.25 11c0-2.76 2.24-5 5-5z"
                  />
                </svg>
                <motion.span
                  className="absolute -top-1 -right-1 bg-error text-error-content text-xs rounded-full w-5 h-5 flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  2
                </motion.span>
              </motion.button>
            )}

            {/* Login Status & Theme Section - Compact for 1200px screens */}
            <div className="flex items-center gap-1 px-2 py-1 bg-warning/20 rounded border border-warning/50">
              {/* Login Status Indicator */}
              <div className="flex items-center gap-1">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isAuthenticated
                      ? "bg-green-500 animate-pulse shadow-sm shadow-green-500/50"
                      : "bg-red-500 shadow-sm shadow-red-500/50"
                  }`}
                  title={isAuthenticated ? "Logged In" : "Not Logged In"}
                />
                <span className="text-xs font-bold hidden xl:inline">
                  {isAuthenticated ? "ON" : "OFF"}
                </span>
              </div>

              {/* Theme Toggle */}
              <ThemeToggle />
            </div>

            {/* Auth Buttons / User Menu - Compact */}
            {!isAuthenticated ? (
              <div className="flex gap-1">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="hidden xl:block"
                >
                  <Link to="/login" className="btn btn-ghost btn-xs">
                    Login
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link to="/register" className="btn btn-primary btn-xs">
                    Register
                  </Link>
                </motion.div>
              </div>
            ) : (
              <div className="dropdown dropdown-end">
                <motion.div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-sm btn-circle avatar"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <div className="w-8 rounded-full ring-2 ring-success/30 hover:ring-success/50 transition-all">
                    <img
                      alt="Profile"
                      src={
                        user?.photoURL ||
                        "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                      }
                    />
                  </div>
                </motion.div>
                <motion.ul
                  tabIndex={0}
                  className="mt-3 z-[1] p-2 shadow-lg menu menu-sm dropdown-content bg-base-100 rounded-box w-52 border border-base-300"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <li className="menu-title">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                      <span className="text-primary font-semibold">
                        {user?.displayName || user?.email}
                      </span>
                    </div>
                  </li>
                  <li>
                    <Link to="/profile" className="hover:bg-primary/10">
                      👤 Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/favorites" className="hover:bg-primary/10">
                      ❤️ Favorites
                    </Link>
                  </li>
                  <li>
                    <Link to="/messages" className="hover:bg-primary/10">
                      💬 Messages
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard" className="hover:bg-primary/10">
                      📊 Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/settings" className="hover:bg-primary/10">
                      ⚙️ Settings
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="hover:bg-error/10 text-error"
                    >
                      🚪 Logout
                    </button>
                  </li>
                </motion.ul>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="absolute top-full left-0 right-0 bg-base-100 shadow-lg border-b border-base-300 lg:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-4">
                {/* Mobile Login Status & Theme */}
                <div className="flex items-center justify-between mb-4 p-3 bg-primary/10 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        isAuthenticated
                          ? "bg-green-500 animate-pulse shadow-lg shadow-green-500/50"
                          : "bg-red-500 shadow-lg shadow-red-500/50"
                      }`}
                    />
                    <span className="text-sm font-semibold">
                      {isAuthenticated ? "Logged In" : "Not Logged In"}
                    </span>
                  </div>
                  <ThemeToggle />
                </div>

                <ul className="menu space-y-2">
                  {navItems.map((item, index) => (
                    <motion.li
                      key={item.path}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        to={item.path}
                        className={`flex items-center gap-3 p-3 rounded-lg ${
                          isActivePath(item.path)
                            ? "bg-primary/10 text-primary"
                            : ""
                        }`}
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <span>{item.icon}</span>
                        {item.name}
                      </Link>
                    </motion.li>
                  ))}

                  {!isAuthenticated ? (
                    <>
                      <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Link
                          to="/login"
                          className="flex items-center gap-3 p-3 rounded-lg"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          🔑 Login
                        </Link>
                      </motion.li>
                      <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <Link
                          to="/register"
                          className="flex items-center gap-3 p-3 rounded-lg bg-primary text-primary-content"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          📝 Register
                        </Link>
                      </motion.li>
                    </>
                  ) : (
                    authenticatedNavItems.map((item, index) => (
                      <motion.li
                        key={item.path}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: (index + 2) * 0.1 }}
                      >
                        <Link
                          to={item.path}
                          className={`flex items-center gap-3 p-3 rounded-lg ${
                            isActivePath(item.path)
                              ? "bg-primary/10 text-primary"
                              : ""
                          }`}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <span>{item.icon}</span>
                          {item.name}
                        </Link>
                      </motion.li>
                    ))
                  )}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <AdvancedSearch
        isOpen={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
      />

      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  );
};

export default Navbar;
