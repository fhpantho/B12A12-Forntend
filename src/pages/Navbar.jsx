import React from "react";
import { Link, NavLink, useNavigate } from "react-router";
import UseAuth from "../hooks/UseAuth";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, dbUser, logOut } = UseAuth();

  // Determine dashboard base path based on role
  const dashboardBase = dbUser?.role === "HR" ? "/dashboard/hr" : "/dashboard/employee";

  const employeeLinks = (
    <>
      <li>
        <Link to={`${dashboardBase}`}>My Assets</Link>
      </li>
      <li>
        <Link to={`${dashboardBase}/request-asset`}>Request Asset</Link>
      </li>
      <li>
        <Link to={`${dashboardBase}/my-team`}>My Team</Link>
      </li>
      <li>
        <Link to={`${dashboardBase}/profile`}>Profile</Link>
      </li>
      <li>
        <a
          onClick={() => {
            logOut().then(() => navigate("/"));
          }}
          className="text-error"
        >
          Logout
        </a>
      </li>
    </>
  );

  const hrLinks = (
    <>
      <li>
        <Link to={`${dashboardBase}`}>Asset List</Link>
      </li>
      <li>
        <Link to={`${dashboardBase}/addAsset`}>Add Asset</Link>
      </li>
      <li>
        <Link to={`${dashboardBase}/all-requests`}>All Requests</Link>
      </li>
      <li>
        <Link to={`${dashboardBase}/my-employees`}>Employee List</Link>
      </li>
      <li>
        <Link to={`${dashboardBase}/profile`}>Profile</Link>
      </li>
      <li>
        <a
          onClick={() => {
            logOut().then(() => navigate("/"));
          }}
          className="text-error"
        >
          Logout
        </a>
      </li>
    </>
  );

  const publicLinks = (
    <>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      {!user ? (
        <>
          <li>
            <NavLink to="/emregistration">Join as Employee</NavLink>
          </li>
          <li>
            <NavLink to="/hrregistration">Join as HR Manager</NavLink>
          </li>
        </>
      ) : (
        <li>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </li>
      )}
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-md px-4">
      {/* Left: Logo */}
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-10 mt-3 w-52 p-2 shadow"
          >
            {publicLinks}
          </ul>
        </div>

        {/* Logo with beautiful ring */}
        <Link to="/" className="flex items-center gap-3">
          <span className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            AssetVerse
          </span>
        </Link>
      </div>

      {/* Center: Navigation Links (Desktop) */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">{publicLinks}</ul>
      </div>

      {/* Right: User Menu */}
      <div className="navbar-end">
        {user ? (
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="avatar online cursor-pointer"
            >
              <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={user.photoURL || "https://i.ibb.co.com/4pDndTF/avatar.png"}
                  alt="User"
                  className="object-cover"
                />
              </div>
            </div>

            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-10 w-64 p-4 shadow-lg border border-base-300"
            >
              <div className="px-4 py-3 border-b border-base-300 mb-3">
                <p className="font-semibold text-lg">{user.displayName || dbUser?.name}</p>
                <p className="text-sm text-base-content/70">{user.email}</p>
                <p className="text-xs badge badge-primary mt-2">
                  {dbUser?.role === "HR" ? "HR Manager" : "Employee"}
                </p>
              </div>

              {dbUser?.role === "HR" ? hrLinks : employeeLinks}
            </ul>
          </div>
        ) : (
          <Link to="/login" className="btn btn-primary">
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;