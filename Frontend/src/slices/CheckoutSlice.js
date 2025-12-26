import { createSlice ,createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//helper function to load the checkout info from localStorage
const localCheckoutFromStorage = () => {
  const storedCheckout = localStorage.getItem("checkout");
  return storedCheckout
    ? JSON.parse(storedCheckout)
    : {
        checkoutItems: [],
        shippingAddress: {},
        paymentMethod: "",
        totalPrice: 0,
        isPaid: false,
        paymentStatus: "Pending",
        paymentDetails: {},
      };
};

//async thunk to create a checkout session
export const createCheckout = createAsyncThunk(
  "checkout/createCheckout",
  async ({checkoutItems, shippingAddress, paymentMethod, totalPrice}, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/checkout`,
        {
            checkoutItems,
            shippingAddress,
            paymentMethod,
            totalPrice,
        },
        {
            headers:{
                "Content-Type":"application/json",
                Authorization:`Bearer ${localStorage.getItem("userToken")}`
            },
        }
      );
        return response.data;
    } catch (error) {
        console.log(error);
        return rejectWithValue(error.response.data.message);
    }
  }
);




const initialState = {
    checkout: null,
    loading: false,
    error: null,
}

const CheckoutSlice = createSlice({
    name:"checkout",
    initialState,
    reducers:{
        setCheckout(state, action){
            state.checkout = action.payload;
            localStorage.setItem("checkout", JSON.stringify(state.checkout));
        },
        clearCheckout(state){
            state.checkout = null;
            localStorage.removeItem("checkout");
        }
    },
    extraReducers:(builder) => {
        builder
        .addCase(createCheckout.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createCheckout.fulfilled, (state, action) => {
            state.loading = false;
            state.checkout = action.payload;
            // localStorage.setItem("checkout", JSON.stringify(state.checkout));
        })
        .addCase(createCheckout.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload?.message || "Failed to create checkout";

        })
    }
})


export const {setCheckout, clearCheckout} = CheckoutSlice.actions;
export default CheckoutSlice.reducer;




