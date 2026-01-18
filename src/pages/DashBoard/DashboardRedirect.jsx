import { Navigate } from "react-router";
import UseAuth from "../../hooks/UseAuth";
import LoaderSpinner from "../../components/LoaderSpinner";

const DashboardRedirect = () => {
  const { dbUser, loading , dbLoading} = UseAuth();

  if (dbLoading && loading) {
    return <LoaderSpinner></LoaderSpinner>
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
