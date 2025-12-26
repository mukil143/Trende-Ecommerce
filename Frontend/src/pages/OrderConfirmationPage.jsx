// OrderConfirmationPage.jsx
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../slices/CartSlice";
import { clearCheckout } from "../slices/CheckoutSlice";

const CalculateEstimatedDeliveryDate = (createdAt) => {
  const date = new Date(createdAt);
  date.setDate(date.getDate() + 7); // Example: 7 days delivery
  return date.toLocaleDateString("en-GB");
};

const OrderConfirmationPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fast path: order passed via navigate state
  const stateOrder = location.state?.order || null;
  // Fallback id (in case you passed only id)
  const stateOrderId = location.state?.order?._id || location.state?.orderId || location.state?.checkoutId || null;

  const [order, setOrder] = useState(stateOrder);
  const [loading, setLoading] = useState(!stateOrder && !!stateOrderId);
  const [error, setError] = useState(null);

  // If we received order through navigation, persist it and clear cart/checkout
  useEffect(() => {
    if (!stateOrder) return;
    try {
      localStorage.setItem("lastOrder", JSON.stringify(stateOrder));
    } catch (err) {
      console.warn("Could not persist lastOrder:", err);
    }
    // clear client cart/checkout now that we have order to show
    dispatch(clearCart());
    dispatch(clearCheckout());
    setOrder(stateOrder);
    setLoading(false);
  }, [stateOrder, dispatch]);

  // On mount: if no order object, try localStorage; otherwise redirect
  useEffect(() => {
    if (order) return;

    // Try localStorage fallback (survives refresh)
    try {
      const stored = localStorage.getItem("lastOrder");
      if (stored) {
        const parsed = JSON.parse(stored);
        // If an id was provided and matches, use it; otherwise accept parsed order
        if (!stateOrderId || String(parsed._id) === String(stateOrderId)) {
          setOrder(parsed);
          dispatch(clearCart());
          dispatch(clearCheckout());
          setLoading(false);
          return;
        }
      }
    } catch (err) {
      console.warn("lastOrder parse error", err);
    }

    // No order available → redirect user to my-orders (give a short moment)
    const t = setTimeout(() => navigate("/my-orders", { replace: true }), 700);
    return () => clearTimeout(t);
  }, [order, stateOrderId, navigate, dispatch]);

  // Scroll to top on mount
  useEffect(() => {
    const el = document.getElementById("app-scroll");
    (el || window).scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (loading) return <div className="p-8 text-center">Loading order...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!order) return <div className="p-8 text-center">No order found.</div>;

  return (
    <div className="container min-h-screen mx-auto max-w-4xl bg-white p-6">
      <h1 className="text-4xl font-bold text-center text-emerald-700 mb-8">
        Thank you for your order!
      </h1>

      <div className="border rounded-lg border-gray-200 p-4 md:p-6">
        <div className="flex flex-col sm:flex-row items-start justify-between mb-4">
          <div>
            <h2 className="text-sm md:text-lg font-semibold mb-2">Order ID: {order._id}</h2>
            <p className="text-sm md:text-lg text-gray-600 mb-2">
              Order Date: {new Date(order.createdAt).toLocaleDateString("en-GB")}
            </p>
          </div>

          <div className="text-xs md:text-sm text-emerald-500">
            <h2>Estimated Delivery Date: {CalculateEstimatedDeliveryDate(order.createdAt)}</h2>
          </div>
        </div>

        <div className="py-7">
          {order.orderItems?.map((product, idx) => (
            <div key={idx} className="flex items-start justify-between mb-4">
              <div className="flex items-start">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-md mr-4"
                />
                <div>
                  <h2 className="text-sm md:text-lg font-semibold">{product.name}</h2>
                  <p className="text-xs md:text-sm text-gray-600">
                    Size: {product.size} | Color: {product.color}
                  </p>
                </div>
              </div>

              <div className="text-right ml-auto">
                <p className="text-sm md:text-lg font-semibold">₹{product.price}</p>
                <p className="text-xs md:text-sm">
                  <span>Qty:</span>{" "}
                  <span>{product.quantity?.toLocaleString?.() ?? product.quantity}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-4 grid-cols-1">
          <div>
            <h2 className="text-sm md:text-lg font-semibold mb-2">Payment</h2>
            <p className="text-xs md:text-sm text-gray-600">{order.paymentMethod}</p>
          </div>

          <div>
            <h2 className="text-sm md:text-lg font-semibold mb-2">Delivery</h2>
            <div className="text-xs md:text-sm text-gray-600">
              <span>
                {order.shippingAddress.firstName} {order.shippingAddress.lastName},
              </span>
              <br />
              <span>{order.shippingAddress.address},</span>
              <br />
              <span>
                {order.shippingAddress.city}, {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}, {order.shippingAddress.phone}
              </span>
            </div>
          </div>
        </div>
      <div className="mt-6">
                        <Link to="/" className="px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm rounded hover:bg-blue-700 transition" >
                           {"<--"} Back to Shopping
                        </Link>
                    </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
