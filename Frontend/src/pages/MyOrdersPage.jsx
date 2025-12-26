// MyOrdersPage.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // fixed import
import OrderLoader from "../components/Common/OrderLoader.jsx";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserOrders } from "../slices/OrderSlice.js";

const MyOrdersPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const titles = ["IMAGE", "ORDER ID", "CREATED", "SHIPPING ADDRESS", "ITEMS", "PRICE", "STATUS"];
  const { user } = useSelector((state) => state.auth);
  const { orders, totalOrders, loading, error } = useSelector((state) => state.orders);
  console.log(user)

  // Fetch orders once when user becomes available
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchUserOrders());
    }
  }, [user?.id, dispatch]);

  const handleRowClick = (order_id) => {
    navigate(`/orders/${order_id}`);
  };

  return (
    <section className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-xl font-bold sm:text-2xl mb-6">My Orders</h2>

      <div className="relative shadow-md sm:rounded-lg overflow-x-auto">
        <table className="min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-sm uppercase text-gray-700">
            <tr>
              {titles.map((title, idx) => (
                <th key={idx} className="py-2 px-4 sm:py-3">
                  {title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="py-8 px-4 text-center">
                  <OrderLoader />
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={7} className="py-6 px-4 text-center text-red-500">
                  {error}
                </td>
              </tr>
            ) : orders && orders.length > 0 ? (
              orders.map((item) => (
                <tr
                  key={item._id}
                  onClick={() => handleRowClick(item._id)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === "Enter") handleRowClick(item._id); }}
                  className="cursor-pointer text-left border-b-2 border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-2 sm:p-4">
                    <img
                      src={item.orderItems?.[0]?.image}
                      alt={item.orderItems?.[0]?.name || "order item"}
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"
                    />
                  </td>

                  <td className="p-2 sm:p-4 font-bold text-gray-800 tracking-tighter">#{item._id}</td>

                  <td className="p-2 sm:p-4 text-gray-400">
                    {new Date(item.createdAt).toLocaleDateString()}{" "}
                    {new Date(item.createdAt).toLocaleTimeString()}
                  </td>

                  <td className="p-2 sm:p-4 text-gray-600">
                    {item.shippingAddress ? `${item.shippingAddress.city}, ${item.shippingAddress.country}` : "N/A"}
                  </td>

                  <td className="p-2 sm:p-4 text-gray-600">{item.orderItems?.length ?? 0}</td>

                  <td className="p-2 sm:p-4 text-gray-600">₹{Number(item.totalPrice).toLocaleString()}</td>

                  <td className="p-2 sm:p-4 text-gray-600">
                    <span
                      className={`px-2 py-1 text-xs sm:text-sm font-medium rounded-full ${
                        item.isPaid ? "bg-green-200 text-green-700" : "bg-red-200 text-red-700"
                      }`}
                    >
                      {item.isPaid ? "Paid" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="py-6 px-4 text-center text-gray-500">
                  You have no orders
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default MyOrdersPage;
