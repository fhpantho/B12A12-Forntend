import { Navigate } from "react-router";
import UseAuth from "../../hooks/UseAuth";

const DashboardRedirect = () => {
  const { dbUser, loading , dbLoading} = UseAuth();

  if (dbLoading && loading) {
    return <p>Loading dashboard...</p>;
  }

  if (!dbUser) {
    return <Navigate to="/login" replace />;
  }

  if (dbUser.role === "HR") {
    return <Navigate to="/dashboard/hr" replace />;
  }

  if (dbUser.role === "EMPLOYEE") {
    return <Navigate to="/dashboard/employee" replace />;
  }

  return <Navigate to="/" replace />;
};

export default DashboardRedirect;
