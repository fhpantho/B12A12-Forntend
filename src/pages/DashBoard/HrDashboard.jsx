import React from 'react';
import { NavLink, Outlet } from 'react-router'; 
import UseAuth from '../../hooks/UseAuth';

import {
  HomeIcon,
  PlusCircleIcon,
  DocumentTextIcon,
  UsersIcon,
  ArrowPathIcon,
  UserCircleIcon,
  Bars3Icon, // Hamburger icon for mobile
} from '@heroicons/react/24/outline';

const HrDashboard = () => {
  const { dbUser } = UseAuth();

  const menuItems = [
    { to: '/dashboard/hr', label: 'Asset List (Home)', icon: HomeIcon },
    { to: '/dashboard/hr/addAsset', label: 'Add Asset', icon: PlusCircleIcon },
    { to: '/dashboard/hr/all-requests', label: 'All Requests', icon: DocumentTextIcon },
    { to: '/dashboard/hr/my-employees', label: 'My Employee List', icon: UsersIcon },
    { to: '/dashboard/hr/upgrade', label: 'Upgrade Package', icon: ArrowPathIcon },
    { to: '/dashboard/hr/profile', label: 'Profile', icon: UserCircleIcon },
  ];

  return (
    <div className="drawer lg:drawer-open min-h-screen" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
      <input id="hr-drawer" type="checkbox" className="drawer-toggle" />

      {/* Main Content Area */}
      <div className="drawer-content flex flex-col" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
        {/* Mobile Navbar */}
        <div className="navbar shadow-md lg:hidden" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
          <div className="flex-none">
            <label
              htmlFor="hr-drawer"
              aria-label="open sidebar"
              className="btn btn-square btn-ghost drawer-button"
            >
              <Bars3Icon className="w-6 h-6" />
            </label>
          </div>
          <div className="flex-1 px-2 mx-2">
            <h1 className="text-lg font-bold">{dbUser?.companyName || 'HR Dashboard'}</h1>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6 lg:p-10" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
          <Outlet />
        </div>
      </div>

      {/* Sidebar Drawer */}
      <div className="drawer-side">
        <label
          htmlFor="hr-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>

        <div className="menu p-4 w-80 min-h-full shadow-xl" style={{ background: 'var(--background)', color: 'var(--foreground)' }}>
          {/* Company Header */}
          <div className="flex items-center gap-4 mb-8 px-4">
            <div className="avatar">
              <div className="w-12 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                <img
                  src={dbUser?.companyLogo || '/default-logo.png'}
                  alt="Company Logo"
                  className="object-cover"
                />
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold">{dbUser?.companyName || 'HR Dashboard'}</h2>
              <p className="text-sm text-base-content/70">HR Panel</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/dashboard/hr'} // Exact match for home
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary text-white shadow-md'
                        : 'hover:bg-base-300 hover:translate-x-1'
                    }`
                  }
                  onClick={() => {
                    // Close drawer on mobile after clicking a link
                    document.getElementById('hr-drawer').checked = false;
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

export default HrDashboard;