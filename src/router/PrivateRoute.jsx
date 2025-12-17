
import { Navigate, Outlet, useLocation } from "react-router";
import UseAuth from "../hooks/UseAuth";


const PrivateRoute = ({children}) => {
  const { user, loading } = UseAuth();
  const location = useLocation();

 
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <img
          src="https://i.gifer.com/ZZ5H.gif"
          alt="Loading..."
          className="w-16 h-16 mb-4"
        />
        <p className="text-gray-600 font-medium">Checking Authentication...</p>
      </div>
    );
  }


   if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default PrivateRoute;
