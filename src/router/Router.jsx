import { createBrowserRouter } from "react-router";
import RootLayout from "../RootLayout/RootLayout";
import Home from "../pages/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    Component : RootLayout,
    children : 
    [
      {
        index : true, 
        Component : Home
      }
    ]
  },
]);