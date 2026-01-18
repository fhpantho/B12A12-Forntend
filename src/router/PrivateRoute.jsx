import { Navigate, Outlet, useLocation } from "react-router-dom";
import UseAuth from "../hooks/UseAuth";
import LoaderSpinner from "../components/LoaderSpinner";

const PrivateRoute = ({ children }) => {
  const { user, loading } = UseAuth();
  const location = useLocation();

  if (loading) {
    return <LoaderSpinner></LoaderSpinner>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default PrivateRoute;
