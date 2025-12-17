import { createBrowserRouter } from "react-router";
import RootLayout from "../RootLayout/RootLayout";
import Home from "../pages/Home";
import EmRegistration from "../authentication/registrations/EmRegistration";
import HrRegistration from "../authentication/registrations/HrRegistration";
import Login from "../authentication/login/Login";
import Error404 from "../pages/errorpage/Error404";
import PrivateRoute from './PrivateRoute';
import DashboardRedirect from "../pages/DashBoard/DashboardRedirect";
import HrDashboard from "../pages/DashBoard/HrDashboard";
import EmployeeDashboard from "../pages/DashBoard/EmployeeDashboard";
import DashBoardLayout from "../pages/DashBoard/DashBoardLayout";
import UserChecking from "./UserChecking";

export const router = createBrowserRouter([
  {
    path: "/",
    Component : RootLayout,
    errorElement: <Error404></Error404>,
    children : 
    [
      {
        index : true, 
        Component : Home
      },
      {
        path : "emregistration",
        Component : EmRegistration
      },
      {
        path : "hrregistration",
        Component : HrRegistration
      },
      {
        path : "login",
        element : 
        <UserChecking>
            <Login></Login>
        </UserChecking>
      },
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <DashBoardLayout />
          </PrivateRoute>
        ),
        children: [
          {
            index: true,
            Component: DashboardRedirect,
          },
          {
            path: "hr",
            Component: HrDashboard,
          },
          {
            path: "employee",
            Component: EmployeeDashboard,
          },
        ],
      },

    ]
  },
]);