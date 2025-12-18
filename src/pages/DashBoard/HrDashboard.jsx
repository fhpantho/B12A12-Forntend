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
    <div className="drawer lg:drawer-open min-h-screen bg-base-200">
      <input id="hr-drawer" type="checkbox" className="drawer-toggle" />
      
      <div className="drawer-content flex flex-col">
        {/* Main content area */}
        <div className="flex-1 p-6 lg:p-10">
          <Outlet />
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="hr-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        
        <div className="menu p-4 w-80 min-h-full bg-base-100 text-base-content shadow-xl">
          {/* Company Header */}
          <div className="flex items-center gap-4 mb-8 px-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
              <img src={dbUser?.companyLogo} alt="Company Logo" className="w-full h-full object-cover" />
            </div>
            <h2 className="text-xl font-bold">{dbUser?.companyName || 'HR Dashboard'}</h2>
          </div>

          {/* Navigation Menu */}
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === '/dashboard/hr'}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                      isActive ? 'bg-primary text-white' : 'hover:bg-base-300'
                    } `
                  }
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