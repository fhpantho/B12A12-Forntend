import { Navigate } from "react-router";
import UseAuth from "../hooks/UseAuth";
import LoadingSpinner from "../components/LoadingSpinner";

const RoleRoute = ({ allowedRoles, children }) => {
  const { dbUser, loading } = UseAuth();

  if (loading) return <LoadingSpinner />;

  if (!dbUser) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(dbUser.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default RoleRoute;
