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
import AssetList from "../pages/DashBoard/HrDashboradComponent/AssetList";
import AddAsset from "../pages/DashBoard/HrDashboradComponent/AddAsset";
import RequestAsset from "../pages/DashBoard/EmDashboardComponent/RequestAsset";
import AllRequests from "../pages/DashBoard/HrDashboradComponent/AllRequests";
import MyAssets from "../pages/DashBoard/EmDashboardComponent/Myassets";
import Profile from "../pages/DashBoard/Shared/Profile";

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
            children : [
              {
                index : true,
                Component : AssetList,
              },
              {
                path : 'addAsset',
                Component : AddAsset
              },
              {
                path : "all-requests",
                Component : AllRequests
              },
              {
                path : "profile",
                Component : Profile
              }
            ]
          },
          {
            path: "employee",
            Component: EmployeeDashboard,
            children : [
              {
                index : true,
                Component : MyAssets

              },
              {
                path : "request-asset",
                Component : RequestAsset
              },
              {
                path : "profile",
                Component : Profile
              }
              
            ]
          },
        ],
      },

    ]
  },
]);