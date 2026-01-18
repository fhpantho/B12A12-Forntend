import LoaderSpinner from "../components/LoaderSpinner";
import UseAuth from "../hooks/UseAuth";
import { Navigate } from "react-router-dom";

const UserChecking = ({ children }) => {
  const { user, loading } = UseAuth();

  if (loading) {
    return <LoaderSpinner></LoaderSpinner>;
  }

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default UserChecking;
