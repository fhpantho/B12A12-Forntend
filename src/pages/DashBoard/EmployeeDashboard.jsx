import React from 'react';
import { NavLink, Outlet } from 'react-router'; 
import UseAuth from '../../hooks/UseAuth';
import {
  BriefcaseIcon,
  PlusCircleIcon,
  UsersIcon,
  UserCircleIcon,
  Bars3Icon, // Hamburger icon
} from '@heroicons/react/24/outline';

const EmployeeDashboard = () => {
  const { dbUser } = UseAuth();

  const menuItems = [
    { to: '/dashboard/employee', label: 'My Assets', icon: BriefcaseIcon },
    { to: '/dashboard/employee/request-asset', label: 'Request an Asset', icon: PlusCircleIcon },
    { to: '/dashboard/employee/my-team', label: 'My Team', icon: UsersIcon },
    { to: '/dashboard/employee/profile', label: 'Profile', icon: UserCircleIcon },
  ];

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-base-200">
      <input id="employee-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main Content Area */}
      <div className="drawer-content flex flex-col">
        {/* Mobile Top Navbar */}
        <div className="navbar bg-base-100 shadow-md lg:hidden">
          <div className="flex-none">
            <label
              htmlFor="employee-drawer"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost drawer-button"
            >
              <Bars3Icon className="w-6 h-6" />
            </label>
          </div>
          <div className="flex-1 px-2 mx-2">
            <h1 className="text-lg font-bold">{dbUser?.name || 'Employee Dashboard'}</h1>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6 lg:p-10">
          <Outlet />
        </div>
      </div>

      {/* Sidebar Drawer */}
      <div className="drawer-side">
        <label
          htmlFor="employee-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <div className="menu p-4 w-80 min-h-full bg-base-100 text-base-content shadow-xl">
          {/* Employee Header */}
          <div className="flex items-center gap-4 mb-8 px-4">
            <div className="avatar">
              <div className="w-14 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={dbUser?.photo || 'https://via.placeholder.com/150'}
                  alt="Employee Avatar"
                  className="object-cover"
                />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold">{dbUser?.name || 'Employee'}</h2>
              <p className="text-sm text-base-content/70">Employee Panel</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end // Exact match for root route
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-white shadow-md'
                        : 'hover:bg-base-300 hover:translate-x-1'
                    }`
                  }
                  onClick={() => {
                    // Close drawer on mobile after navigation
                    document.getElementById('employee-drawer').checked = false;
                  }}
                >
                  <item.icon className="w-6 h-6" />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;