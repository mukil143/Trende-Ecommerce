import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//helper function to load the cart from localStorage
const localCartFromStorage = () => {
  const storedCart = localStorage.getItem("cart");

  if (!storedCart || storedCart === "undefined" || storedCart === "null") {
    return {
      products: [],
      totalPrice: 0,
      totalQuantity: 0,
    };
  }

  try {
    return JSON.parse(storedCart);
  } catch (error) {
    console.error("Invalid JSON in localStorage for 'cart':", error);
    // Reset localStorage if it's corrupted
    localStorage.removeItem("cart");
    return {
      products: [],
      totalPrice: 0,
      totalQuantity: 0,
    };
  }
};



//helper function to save cart to localCartFromStorage
const saveCartToStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

//fetch  cart from the user or guest cart
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async ({ userId, guestId }, { rejectWithValue }) => {
    try {
     const response = await axios.get(
  `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
  {
    params: {
      userId: userId || null,
      guestId: guestId || null,   // send only if available
      //  // fallback if user not logged in
    },
  }
);

return response.data;
 //return the cart object
    } catch (error) {
      console.log(error);
      rejectWithValue(error.response.data.message);
    }
  }
);

//async thunk to add item to cart for the user or guest cart
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (
    { userId, guestId, productId, quantity, size, color },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        { userId, guestId, productId, quantity, size, color }
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

//async thunk to remove item from cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId, size, color, userId ,guestId}, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,{
          headers:{
            "Content-Type":"application/json",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
          },
          data: {
            productId,
            size,
            color,
            userId,
            guestId
          },
        },

      );

      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

//async thunk to update item quantity in cart
export const updateCartItem = createAsyncThunk(
  "cart/updateCartItem",
  async (
    { productId, size, color, quantity, userId, guestId },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart`,
        { productId, size, color, quantity, userId, guestId }
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

//async thunk to merge guest cart with user cart upon login
export const mergeCarts = createAsyncThunk(
  "cart/mergeCarts",
  async ({ guestId }, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/cart/merge`,
        { guestId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`, //send the user token in the header
          },
        }
      );
      return response.data.cart;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

const initialState = {
  cart: localCartFromStorage(),
  loading: false,
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    clearCart: (state) => {
      state.cart = { products: [], totalPrice: 0, totalQuantity: 0,loading:false,error:null };
      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    builder
      //handle fetching cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(state.cart);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Could not fetch cart";
      })
      //handle adding to cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart= action.payload;
        saveCartToStorage(state.cart);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Could not add to cart";
      })

      //handle removing from cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(state.cart);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload?.message || "Could not remove item from cart";
      })
      //handle updating cart item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(state.cart);
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Could not update cart item";
      })
      //handle merging carts
      .addCase(mergeCarts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mergeCarts.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        localStorage.removeItem("guestId");
        saveCartToStorage(state.cart);
      })
      .addCase(mergeCarts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Could not merge carts";
      });
  },
});


export const {clearCart} = cartSlice.actions;
export default cartSlice.reducer;
