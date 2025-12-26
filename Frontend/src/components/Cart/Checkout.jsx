import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import razorpay from "../../assets/razorpay-icon.svg";
import { SiRazorpay } from "react-icons/si";
import Razorpaybutton from "./Razorpaybutton.jsx";
import SuperLoader from "../Common/Loading.jsx";
import { useDispatch, useSelector } from "react-redux";
import { clearCheckout, createCheckout } from "../../slices/CheckoutSlice.js";
import axios from "axios";
import { clearCart, fetchCart } from "../../slices/CartSlice.js";

// const cart={
//     products:[
//         {
//             name: "Stylish jacket",
//             size: "M",
//             color: "Black",
//             price:120,
//             image:"https://picsum.photos/200?random=1",
//         }
//         ,
//         {
//             name: "Casual sneakers",
//             size: "10",
//             color: "White",
//             price:80,
//             image:"https://picsum.photos/200?random=2",
//         },

//     ],
//     totalprice: 200,
// }

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  // console.log("Checkout cart:",cart);
  const { user, guestId } = useSelector((state) => state.auth);
  // const [loading, setLoading] = useState(false);
  const [checkoutid, setcheckoutid] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    email: user?.email || "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });
  console.log(shippingAddress);

  useEffect(() => {
    console.log("Checkout useEffect cart:", cart);
    if (!cart || !cart.products.length === 0) {
      return navigate("/cart");
    }
  }, [cart, navigate]);
  const handleCreatecheckout = async (e) => {
    e.preventDefault();
    try {
      if (cart && cart.products.length > 0) {
        const res = await dispatch(
          createCheckout({
            checkoutItems: cart.products,
            totalPrice: cart.totalPrice,
            shippingAddress: shippingAddress,
            paymentMethod: "Razorpay",
          })
        );
        console.log("Checkout response:", res.payload);
        if (res.payload && res.payload?._id) {
          console.log("Checkout created with ID:", res.payload._id);
          setcheckoutid(res.payload._id);
        }
      }
    } catch (error) {
      return console.error("Error creating checkout:", error);
    }
    // if (!shippingAddress.firstName || !shippingAddress.lastName || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country || !shippingAddress.phone) {
    //     alert("Please fill all the fields");
    //     return;
    // }

    // Generate a random checkout ID
  };

  const handlePaymentSuccess = async (paymentDetails) => {
    // Navigate to payment success page with checkout ID and payment details
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout/${checkoutid}/pay`,
        {
          paymentStatus: "paid",
          paymentDetails,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      console.log("Payment success response:", response);
      if (response.status === 200) {
        await handleFinalizeCheckout();
      } else {
        alert("Payment failed");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleFinalizeCheckout = async () => {
    try {
      const response = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/checkout/${checkoutid}/finalize`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
        }
      );
      console.log("Finalize response:", response);
      if (response.status === 200) {
        // alert("Checkout finalized");
        navigate("/order-confirmation", {
          state: { order:{...response.data},checkoutId: checkoutid, orderId: response.data._id },
        });
        return setcheckoutid(null);
      } else {
        console.error("Checkout finalization failed");
        alert("Checkout failed");
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return <SuperLoader />;
  }

  if (error) {
    return <p className="text-red-500 text-center mt-4">Error: {error}</p>;
  }
  if (!cart || cart.products.length === 0) {
    return <p className="text-center mt-4">Your cart is empty.</p>;
  }
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-4 lg:py-10 lg:px-6 tracking-tight">
        {/* Left Section */}

        <div className="bg-white rounded-lg p-6">
          <h2 className="text-2xl uppercase mb-6">Checkout</h2>
          <form className="" onSubmit={handleCreatecheckout} action="">
            <h2 className="text-lg mb-4 font-semibold">Contact details</h2>
            <div className="mb-4">
              <label className="text-gray-700" htmlFor="usermail">
                Email
              </label>
              <input
                type="text"
                id="usermail"
                value={user.email}
                className="outline-none border w-full p-2  rounded border-gray-100 text-gray-700 "
                disabled
              />
            </div>
            <h2 className="text-lg mb-4 font-semibold ">Delivery</h2>

            <div className="text-lg w-full  mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4  items-center ">
              <label className="text-gray-700 text-sm" htmlFor="firstName">
                First Name{" "}
                <input
                  type="text"
                  defaultValue={shippingAddress.firstName}
                  onChange={(e) => {
                    setShippingAddress((prev) => ({
                      ...prev,
                      firstName: e.target.value,
                    }));
                  }}
                  autoComplete="on"
                  id="firstName"
                  className=" w-full outline-none border p-2  rounded border-gray-200 "
                />
              </label>

              <label className="text-gray-700 text-sm" htmlFor="lastName">
                Last Name{" "}
                <input
                  type="text"
                  value={shippingAddress.lastName}
                  autoComplete="on"
                  onChange={(e) => {
                    setShippingAddress((prev) => ({
                      ...prev,
                      lastName: e.target.value,
                    }));
                  }}
                  id="lastName"
                  className=" w-full outline-none border p-2  rounded border-gray-200 "
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="text-gray-700" htmlFor="address">
                Address{" "}
                <input
                  type="text"
                  id="address"
                  value={shippingAddress.address}
                  autoComplete="on"
                  onChange={(e) => {
                    setShippingAddress((prev) => ({
                      ...prev,
                      address: e.target.value,
                    }));
                  }}
                  placeholder="Landmark, Area, City, State, Country"
                  className="   outline-none border w-full p-2  rounded border-gray-100 "
                />
              </label>
            </div>
            <div className="text-lg w-full  mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4  items-center ">
              <label className="text-gray-700 text-sm" htmlFor="city">
                City
                <input
                  autoComplete="on"
                  value={shippingAddress.city}
                  onChange={(e) => {
                    setShippingAddress((prev) => ({
                      ...prev,
                      city: e.target.value,
                    }));
                  }}
                  type="text"
                  id="city"
                  className=" w-full outline-none border p-2  rounded border-gray-200 "
                />
              </label>

              <label className="text-gray-700 text-sm" htmlFor="postalCode">
                Postal Code{" "}
                <input
                  autoComplete="on"
                  value={shippingAddress.postalCode}
                  onChange={(e) => {
                    setShippingAddress((prev) => ({
                      ...prev,
                      postalCode: e.target.value,
                    }));
                  }}
                  type="text"
                  id="postalCode"
                  className=" w-full outline-none border p-2  rounded border-gray-200 "
                />
              </label>
            </div>
            <div className="mb-4">
              <label className="text-gray-700" htmlFor="country">
                country
              </label>
              {/* <input type="text" id='country'  value={shippingAddress.country} placeholder=''  className='   outline-none border w-full p-2  rounded border-gray-100 '  /> */}
              <select
                id="country"
                value={shippingAddress.country}
                onChange={(e) => {
                  setShippingAddress((prev) => ({
                    ...prev,
                    country: e.target.value,
                  }));
                }}
                className=" w-full outline-none border p-2  rounded border-gray-200 "
              >
                <option value="" disabled defaultValue={""}>
                  Select your country
                </option>
                <option value="india">🇮🇳 India</option>
                <option value="usa">🇺🇸 USA</option>
                <option value="canada">🇨🇦 Canada</option>
                <option value="uk">🇬🇧 UK</option>
                <option value="australia">🇦🇺 Australia</option>
                <option value="germany">🇩🇪 Germany</option>
                <option value="france">🇫🇷 France</option>
                <option value="japan">🇯🇵 Japan</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="text-gray-700" htmlFor="phone">
                Phone
              </label>
              <input
                type="text"
                id="phone"
                onChange={(e) => {
                  setShippingAddress((prev) => ({
                    ...prev,
                    phone: e.target.value,
                  }));
                }}
                value={shippingAddress.phone}
                autoComplete="on"
                placeholder="Enter your phone number"
                className="   outline-none border w-full p-2  rounded border-gray-100 "
              />
            </div>

            <div className="mb-4">
              {!checkoutid ? (
                <button
                  type="submit"
                  className="bg-black  w-full text-white py-2 rounded-lg font-semibold hover:bg-gray-950 cursor-pointer"
                >
                  Continue to Payment
                </button>
              ) : (
                // (<button type='button' onClick={()=>{navigate("/payment")}} className='bg-black w-full  text-white py-2 rounded-lg font-semibold hover:bg-gray-950 cursor-pointer'>Continue to Payment</button>)

                <div>
                  <Razorpaybutton
                    checkoutId={checkoutid}
                    handlePaymentSuccess={handlePaymentSuccess}
                    handleFinalizeCheckout={handleFinalizeCheckout}
                    amount={cart.totalPrice}
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Your checkout ID is:{" "}
                    <span className="font-semibold">{checkoutid}</span>
                  </p>
                </div>
              )}
            </div>
          </form>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-lg mb-4 font-semibold ">Order Summary</h2>
          <div className=" py-4 border-t">
            {cart.products.map((product, index) => (
              <div
                key={index}
                className="flex items-start justify-between mb-4"
              >
                <div className="flex items-start">
                  <img
                    src={product.image}
                    alt={product.name}
                    className=" w-16 md:w-20 md:h-24 rounded mr-4"
                  />
                  <div>
                    <h3 className=" text-sm md:text-lg font-semibold">
                      {product.name}
                    </h3>
                    <p className="text-xs md:text-sm text-gray-500 font-semibold">
                      Size: {product.size}
                    </p>
                    <p className="text-xs md:text-sm text-gray-500 font-semibold">
                      Color: {product.color}
                    </p>
                  </div>
                </div>
                <span className="text-sm md:text-lg font-semibold">
                  ₹{product.price}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t py-4 ">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm md:text-lg font-semibold">Subtotal</h2>
              <span className="text-sm md:text-lg font-semibold">
                ₹{cart.totalPrice?.toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center ">
              <h2 className="text-sm md:text-lg font-semibold">Shipping</h2>
              <span className="text-sm md:text-lg font-semibold">FREE</span>
            </div>
          </div>
          <div className="border-t py-4">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-sm md:text-lg font-semibold">Total</h2>
              <span className="text-sm md:text-lg font-semibold">
                ₹{cart.totalPrice?.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Checkout;
