import { createBrowserRouter } from "react-router";
import RootLayout from "../RootLayout/RootLayout";
import Home from "../pages/Home";
import EmRegistration from "../authentication/registrations/EmRegistration";
import HrRegistration from "../authentication/registrations/HrRegistration";
import Login from "../authentication/login/Login";

export const router = createBrowserRouter([
  {
    path: "/",
    Component : RootLayout,
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
        Component : Login
      }
    ]
  },
]);