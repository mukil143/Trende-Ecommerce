import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//Retrive the user Info and token from the localstorage if available
const userFormStorage = localStorage.getItem("userInfo")
  ? JSON.parse(localStorage.getItem("userInfo"))
  : null;

//check for an existing guest ID in the localstorage or generate a new one
let initialGuestId = localStorage.getItem("guestId");

if (!initialGuestId) {
  initialGuestId = `guest_${Date.now()}`;
  localStorage.setItem("guestId", initialGuestId);
}


//initialState
const initialState = {
  user: userFormStorage,
  guestId: initialGuestId,
  loading: false,
  error: null,
};

//async thunk for user login'

//it return 3 state
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userdata, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/login`,
        userdata
      );
      await localStorage.setItem(
        "userInfo",
        JSON.stringify(response.data.user)
      );
      await localStorage.setItem("userToken", response.data.token);
      return response.data.user; //return the user object
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

//async thunk for user Registeration
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userdata, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/users/register`,
        userdata
      );
      localStorage.setItem("userInfo", JSON.stringify(response.data.user));
      localStorage.setItem("userToken", response.data.token);
      return response.data.user; //return the user object
    } catch (error) {
      return rejectWithValue(error.response.data.message);
    }
  }
);

//Create a slice

const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    logoutUser: (state) => {
      localStorage.removeItem("userInfo");
      localStorage.removeItem("userToken");
      localStorage.removeItem("cart");
      // localStorage.removeItem("checkout");
      localStorage.removeItem("order");
      state.user = null;
      state.guestId = `guest_${new Date().getTime()}`; //reset the guest id on logout
      localStorage.setItem("guestId", state.guestId); //set guestId to localstorage
    },
    generateNewGuestId: (state) => {
      state.guestId = `guest_${new Date().getTime()}`;
      localStorage.setItem("guestId", state.guestId);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });
  },
});

export const { logoutUser, generateNewGuestId } = authSlice.actions;

export default authSlice.reducer;
