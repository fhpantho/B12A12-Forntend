
import { Navigate, Outlet, useLocation } from "react-router";
import UseAuth from "../hooks/UseAuth";



const PrivateRoute = ({children}) => {
  const { user } = UseAuth();
  const location = useLocation();

 



   if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default PrivateRoute;
