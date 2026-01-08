import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import ThemeToggle from "./ThemeToggle";
import AdvancedSearch from "./AdvancedSearch";
import NotificationCenter from "./NotificationCenter";
import toast from "react-hot-toast";

const Navbar = () => {
  const { user, logout, isAuthenticated, isDemoMode } = useAuth();
  const navigate = useNavigate();
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

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

  return (
    <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="absolute top-full left-0 right-0 bg-warning text-warning-content text-center py-1 text-sm z-40">
          🚧 Demo Mode: Firebase not configured. Authentication is simulated for
          testing.
        </div>
      )}

      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
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
                d="M4 6h16M4 12h8m-8 6h16"
              ></path>
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/pets-supplies">Pets & Supplies</Link>
            </li>
            {!isAuthenticated ? (
              <>
                <li>
                  <Link to="/login">Login</Link>
                </li>
                <li>
                  <Link to="/register">Register</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/add-listing">Add Listing</Link>
                </li>
                <li>
                  <Link to="/my-listings">My Listings</Link>
                </li>
                <li>
                  <Link to="/my-orders">My Orders</Link>
                </li>
                <li>
                  <Link to="/favorites">Favorites</Link>
                </li>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
              </>
            )}
          </ul>
        </div>
        <Link to="/" className="btn btn-ghost text-xl">
          🐾 <span className="font-bold text-primary">PawBazar</span>
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
          </li>
          <li>
            <Link to="/pets-supplies" className="hover:text-primary">
              Pets & Supplies
            </Link>
          </li>
          {isAuthenticated && (
            <>
              <li>
                <Link to="/add-listing" className="hover:text-primary">
                  Add Listing
                </Link>
              </li>
              <li>
                <Link to="/my-listings" className="hover:text-primary">
                  My Listings
                </Link>
              </li>
              <li>
                <Link to="/my-orders" className="hover:text-primary">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="hover:text-primary">
                  Favorites
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-primary">
                  Dashboard
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>

      <div className="navbar-end">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAdvancedSearch(true)}
            className="btn btn-ghost btn-sm"
            title="Advanced Search"
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
          </button>

          {isAuthenticated && (
            <button
              onClick={() => setShowNotifications(true)}
              className="btn btn-ghost btn-circle relative"
              title="Notifications"
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
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 bg-error text-error-content text-xs rounded-full w-5 h-5 flex items-center justify-center">
                2
              </span>
            </button>
          )}

          <ThemeToggle />

          {!isAuthenticated ? (
            <div className="hidden lg:flex gap-2">
              <Link to="/login" className="btn btn-ghost">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary">
                Register
              </Link>
            </div>
          ) : (
            <div className="dropdown dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-10 rounded-full">
                  <img
                    alt="Profile"
                    src={
                      user?.photoURL ||
                      "https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                    }
                  />
                </div>
              </div>
              <ul
                tabIndex={0}
                className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
              >
                <li className="menu-title">
                  <span>{user?.displayName || user?.email}</span>
                </li>
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <Link to="/favorites">Favorites</Link>
                </li>
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link to="/settings">Settings</Link>
                </li>
                <li>
                  <button onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>

      <AdvancedSearch
        isOpen={showAdvancedSearch}
        onClose={() => setShowAdvancedSearch(false)}
      />

      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
};

export default Navbar;
