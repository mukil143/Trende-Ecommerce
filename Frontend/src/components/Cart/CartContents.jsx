import React, { useEffect } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { removeFromCart, updateCartItem } from "../../slices/CartSlice.js";

const CartContents = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();
  const cartProducts = cart.products;
  //handle add to cart
  const handleAddToCart = (productId, delta, quantity, size, color) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      dispatch(
        updateCartItem({
          productId,
          size,
          color,
          quantity: newQuantity,
          userId,
          guestId,
        })
      );
    }
  };


//handle remove from cart
  const handleRemoveFromCart = (productId, size, color, userId, guestId) => {
    dispatch(
      removeFromCart({ productId, size, color, userId, guestId })
    );
  };

  return (
    <>
      <div className="overflow-y-scroll h-full scrollbar-hide   ">
        {cartProducts.map((product, idx) => (
          <div
            key={idx}
            className="flex justify-start space-x-1 border-b-1 py-4"
          >
            <div className="flex items-start">
              <img
                src={product.image}
                className="w-20 object-cover mr-4 rounded"
                alt={product.name}
              />
            </div>
            <div>
              <h3>{product.name}</h3>
              <p className="text-sm text-gray-500">
                Size: {product.size} | Color: {product.color}
              </p>
              <div className="flex justify-center rounded items-center w-fit border mt-2">
                 <button
                 onClick={()=>{handleAddToCart(product.productId,-1,product.quantity,product.size,product.color)}} 
                  className="border-r px-2  py-1 text-xl"
                >
                  -
                </button>
                <span className=" px-2 rounded py-1  text-xl font-semibold">
                  {product.quantity}
                </span>
               
                <button
                  onClick={() => {
                    handleAddToCart(
                      product.productId,
                      1,
                      product.quantity,
                      product.size,
                      product.color
                    );
                  }}
                  className="border-l px-2 py-1  text-xl"
                >
                  +
                </button>
              </div>
            </div>
            <div className="ml-auto flex flex-col items-end">
              <span className="text-lg font-semibold">₹{product.price}</span>
              <button onClick={()=>{handleRemoveFromCart(product.productId,product.size,product.color,userId,guestId)}} className="text-red-500 hover:text-red-700 mt-2">
                <FaRegTrashAlt />
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CartContents;
