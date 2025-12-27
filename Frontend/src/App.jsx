import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import UserLayout from "./components/Layout/UserLayout.jsx";
import Home from "./pages/Home.jsx";
import { Toaster } from "sonner";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import CollectionPage from "./pages/CollectionPage.jsx";
import ProductDetails from "./components/Products/ProductDetails.jsx";
import Checkout from "./components/Cart/Checkout.jsx";
import OrderConfirmationPage from "./pages/OrderConfirmationPage.jsx";
import OrderDetailsPage from "./pages/OrderDetailsPage.jsx";
// import MyOrderPage from './pages/MyOrderPage'
import MyOrdersPage from "./pages/MyOrdersPage.jsx";
import AdminLayout from "./components/Admin/AdminLayout.jsx";
import AdminHomePage from "./components/Admin/AdminHomePage.jsx";
import UserManagement from "./components/Admin/UserManagement.jsx";
import ProductManagement from "./components/Admin/ProductManagement.jsx";
import EditProductPage from "./components/Admin/EditProductPage.jsx";
import OrdersInfopage from "./components/Admin/OrdersInfopage.jsx";
import { useDispatch } from "react-redux";
import ScrollToTop from "./components/Common/ScrollToTop.jsx";
import { generateNewGuestId } from "./slices/AuthSlice.js";
import ProtectedRoute from "./components/routes/ProtectedRoute.jsx";
import AdminProtectedRoute from "./components/routes/AdminProtectedRoute.jsx";
import AddProductPage from "./components/Admin/AddProductPage.jsx";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const guestId = localStorage.getItem("guestId");
    if (!guestId) {
      dispatch(generateNewGuestId());
    }
  }, [dispatch]);
  return (

    <BrowserRouter>

      <ScrollToTop />
      <Toaster position="top-right" reverseOrder={false} />

      <Toaster position="top-right" reverseOrder={false} />

      <Routes>
        {/* User Routes */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route
            path="profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="collections/:collection" element={<CollectionPage />} />
          <Route path="product/:id" element={<ProductDetails />} />
          <Route path="checkout" element={<Checkout />} />
          <Route
            path="order-confirmation"
            element={<OrderConfirmationPage />}
          />
          <Route path="orders/:id" element={<OrderDetailsPage />} />
          <Route path="my-orders" element={<MyOrdersPage />} />
        </Route>
        {/* Admin Routes */}
        <Route path="/admin" element={
            <AdminProtectedRoute>
          <AdminLayout />
            </AdminProtectedRoute>
          }>
          <Route
            index
            element={
                <AdminHomePage />

            }
          />
          <Route path="users" element={<UserManagement />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="products/:id/edit" element={<EditProductPage />} />
          <Route path="orders" element={<OrdersInfopage />} />
          <Route path="products/new" element={<AddProductPage/>} />
        </Route>
      </Routes>
      </BrowserRouter>
  );
}

export default App;
