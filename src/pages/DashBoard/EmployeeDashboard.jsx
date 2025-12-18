import React from 'react';
import { NavLink, Outlet } from 'react-router';
import UseAuth from '../../hooks/UseAuth';
import {
  BriefcaseIcon,
  PlusCircleIcon,
  UsersIcon,
  UserCircleIcon,
} from '@heroicons/react/24/outline';

const EmployeeDashboard = () => {
  const { dbUser } = UseAuth();

  const menuItems = [
    { to: '/employee-dashboard', label: 'My Assets', icon: BriefcaseIcon },
    { to: '/employee-dashboard/request-asset', label: 'Request an Asset', icon: PlusCircleIcon },
    { to: '/employee-dashboard/my-team', label: 'My Team', icon: UsersIcon },
    { to: '/employee-dashboard/profile', label: 'Profile', icon: UserCircleIcon },
  ];

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-base-200">
      <input id="employee-drawer" type="checkbox" className="drawer-toggle" />
      
      <div className="drawer-content flex flex-col">
        {/* Main content area */}
        <div className="flex-1 p-6 lg:p-10">
          <Outlet />
        </div>
      </div>

      {/* Sidebar */}
      <div className="drawer-side">
        <label htmlFor="employee-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        
        <div className="menu p-4 w-80 min-h-full bg-base-100 text-base-content shadow-xl">
          {/* Employee Header */}
          <div className="flex items-center gap-4 mb-8 px-4">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
              <img 
                src={dbUser?.photo || 'https://via.placeholder.com/150'} 
                alt="Employee Avatar" 
                className="w-full h-full object-cover" 
              />
            </div>
            <div>
              <h2 className="text-xl font-bold">{dbUser?.name || 'Employee'}</h2>
              
            </div>
          </div>

          {/* Navigation Menu */}
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end // Ensures exact match for the home route
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-3 rounded-lg transition-colors ${
                      isActive ? 'bg-primary text-white' : 'hover:bg-base-300'
                    }`
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

export default EmployeeDashboard;