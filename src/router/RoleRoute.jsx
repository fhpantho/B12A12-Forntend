import { Navigate } from "react-router";

import UseAuth from "../hooks/UseAuth";

const RoleRoute = ({ allowedRoles, children }) => {
  const { dbUser, loading } = UseAuth();

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-screen">
        <img
          src="https://i.gifer.com/ZZ5H.gif"
          alt="Loading..."
          className="w-16 h-16 mb-4"
        />
        <p className="text-gray-600 font-medium">Checking Authentication...</p>
      </div>
  );

  if (!dbUser) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(dbUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleRoute;
