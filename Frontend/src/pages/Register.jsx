import React, { useEffect, useState } from "react";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../slices/AuthSlice.js";
import { useDispatch, useSelector } from "react-redux";
import OrderLoader from "../components/Common/OrderLoader.jsx";
import { mergeCarts } from "../slices/CartSlice.js";
const Register = () => {
  const {user, loading, error, guestId } = useSelector((state) => state.auth);
  const {cart} = useSelector((state)=>state.cart);

  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassWord] = useState("");

  const navigate = useNavigate();
  const [isHide, setishide] = useState(true);
  const redirect =  new URLSearchParams(window.location.search).get("redirect") || "/";
  const isCheckoutRedirect = redirect.includes("/checkout");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || !name) {
      return setErrorMessage("All fields are required");
    }
    if(password.length<6){
        return setErrorMessage("Password must be at least 6 characters");
    }
    dispatch(registerUser({ name, email, password }))
      .unwrap()
      .then(() => {
        if (cart.products.length > 0 && guestId) {
          dispatch(mergeCarts({ guestId }))
            .unwrap()
            .then(() => navigate(isCheckoutRedirect ? "/checkout" : "/"));
        } else {
          navigate(isCheckoutRedirect ? "/checkout" : "/");
        }
      })
      .catch((err) => {
        setErrorMessage(err);
      });


  };


  useEffect(() => {
    if (error) {
      setErrorMessage(error);
    }
  }, [error]);






  return (
    <section className="flex ">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12 ">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md mx-auto bg-white p-8 rounded-lg border border-gray-200 shadow"
        >
          <div className="flex flex-col  justify-center ">
            <h2 className="text-xl text-center font-medium mb-4">Trendé</h2>
            <h2 className="text-2xl font-bold text-center  mb-4">
              Hey there!👋
            </h2>
            <p className="text-center mb-6">
              Enter your username and password to Login.
            </p>
            <div className="">
              {errorMessage && (
                <p className="text-red-500 text-sm mb-2 text-center">
                  {errorMessage}
                </p>
              )}
            </div>

            <h2 className="text-md font-bold mb-1">Name</h2>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              placeholder="Enter Your Name"
              className="border focus-within:border-blue-600 border-gray-100 outline-none rounded py-2 px-2 mb-4  "
            />
            <h2 className="text-md font-bold mb-1">Email</h2>
            <input
              type="text"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              placeholder="Enter Your email address"
              className="border focus-within:border-blue-600 border-gray-100 outline-none rounded py-2 px-2 mb-4  "
            />
            <h2 className="text-md font-bold mb-1">Password</h2>

            <div className=" border focus-within:border-1 focus-within:border-blue-600  rounded py-2 px-2 mb-4 border-gray-200 flex items-center transform transition-transform duration-500 ">
              <input
                type={`${isHide ? "password" : "text"}`}
                value={password}
                onChange={(e) => {
                  setPassWord(e.target.value);
                }}
                placeholder="Enter your password"
                className=" w-full outline-none "
              />
              <span
                className="text-xl cursor-pointer "
                onClick={() => {
                  setishide(!isHide);
                }}
              >
                {isHide ? <IoEyeOutline /> : <IoEyeOffOutline />}
              </span>
            </div>

            <button
              type="submit"
              className="bg-black text-white w-full py-2 flex items-center justify-center font-semibold rounded-lg hover:bg-gray-900 transition-colors duration-150 cursor-pointer mb-6"
            >
              {loading ? (
                <OrderLoader color="white" loading={loading} />
              ) : (
                "Sign In"
              )}
            </button>

            <h2 className="text-center">
              I have an account already?{" "}
              <Link to={"/login"} className="text-sky-500">
                LogIn
              </Link>
            </h2>
          </div>
        </form>
      </div>

      <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="h-full flex flex-col justify-center items-center">
          <img
            className="h-[710px] w-full object-cover"
            src="https://res.cloudinary.com/deif4iuok/image/upload/v1752416971/register_vee0vf.webp"
            alt=""
          />
        </div>
      </div>
    </section>
  );
};

export default Register;
