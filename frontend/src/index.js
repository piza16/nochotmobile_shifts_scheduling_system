import React from "react";
import ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import store from "./store";
import "./Assets/styles/bootstrap.custom.css";
import "./Assets/styles/index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import PrivateRoute from "./Components/PrivateRoute";
import AdminRoute from "./Components/AdminRoute";
import HomeScreen from "./Screens/HomeScreen";
import LoginScreen from "./Screens/LoginScreen";
import RegisterScreen from "./Screens/RegisterScreen";
import ProfileScreen from "./Screens/ProfileScreen";
import UserListScreen from "./Screens/admin/UserListScreen";
import UserEditScreen from "./Screens/admin/UserEditScreen";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index={true} path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="" element={<PrivateRoute />}>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
      </Route>
      <Route path="" element={<AdminRoute />}>
        <Route path="/admin/userlist" element={<UserListScreen />} />
        <Route path="/admin/user/:id/edit" element={<UserEditScreen />} />
      </Route>
    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <PayPalScriptProvider deferLoading={true}>
          <RouterProvider router={router} />
        </PayPalScriptProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);

reportWebVitals();
