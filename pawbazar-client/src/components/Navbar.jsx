import { useState } from "react";

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
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
              <a>Home</a>
            </li>
            <li>
              <a>Pets & Supplies</a>
            </li>
            {!isLoggedIn ? (
              <>
                <li>
                  <a>Login</a>
                </li>
                <li>
                  <a>Register</a>
                </li>
              </>
            ) : (
              <>
                <li>
                  <a>Add Listing</a>
                </li>
                <li>
                  <a>My Listings</a>
                </li>
                <li>
                  <a>My Orders</a>
                </li>
              </>
            )}
          </ul>
        </div>
        <a className="btn btn-ghost text-xl">
          🐾 <span className="font-bold text-primary">PawBazar</span>
        </a>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a className="hover:text-primary">Home</a>
          </li>
          <li>
            <a className="hover:text-primary">Pets & Supplies</a>
          </li>
          {isLoggedIn && (
            <>
              <li>
                <a className="hover:text-primary">Add Listing</a>
              </li>
              <li>
                <a className="hover:text-primary">My Listings</a>
              </li>
              <li>
                <a className="hover:text-primary">My Orders</a>
              </li>
            </>
          )}
        </ul>
      </div>

      <div className="navbar-end">
        {!isLoggedIn ? (
          <div className="hidden lg:flex gap-2">
            <a className="btn btn-ghost">Login</a>
            <a className="btn btn-primary">Register</a>
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
                  src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              <li>
                <a>Profile</a>
              </li>
              <li>
                <a>Settings</a>
              </li>
              <li>
                <a onClick={() => setIsLoggedIn(false)}>Logout</a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
