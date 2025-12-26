import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";
const API_URL = import.meta.env.VITE_BACKEND_URL;
const USER_TOKEN = localStorage.getItem("userToken");

//async thunk to fetch all orders - admin only
export const fetchAllOrders = createAsyncThunk(
  "admin/fetchAllOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/orders`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${USER_TOKEN}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

//async thunk to update order status - admin only
export const updateOrderStatus = createAsyncThunk(
  "admin/updateOrderStatus",
  async ({ id, newStatus, currentStatus }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/admin/orders/${id}`,
        { status: newStatus },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${USER_TOKEN}`,
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

//async thunk to delete an order - admin only
export const deleteOrder = createAsyncThunk(
  "admin/deleteOrder",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.delete(`${API_URL}/api/admin/orders/${id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${USER_TOKEN}`,
        },
      });
      return response.data.id;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

//admin order slice
const AdminOrderSlice = createSlice({
  name: "adminOrders",
  initialState: {
    orders: [],
    totalOrders: 0,
    revenue: 0,
    totalsales: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.totalOrders = action.payload.length;
        state.revenue = action.payload.reduce(
          (acc, order) => acc + order.totalPrice,
          0
        );
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch orders";
      })
      //update order status
      .addCase(updateOrderStatus.pending, (state, action) => {
        const { id, newStatus } = action.meta.arg;
        const order = state.orders.find((order) => order._id === id);
        if (order) {
          order.status = newStatus;
        }
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {

      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
          const { id, currentStatus } = action.meta.arg;
          const order = state.orders.find((order) => order._id === id);
          if (order) {
            order.status = currentStatus;
          }
      })
      //delete order
      .addCase(deleteOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders.filter(
          (order) => order._id !== action.payload
        );
        state.totalsales = action.payload.reduce(
          (acc, order) => acc + order.totalPrice,
          0
        );
        state.totalOrders = state.orders.length;
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete order";
      });
  },
});

export default AdminOrderSlice.reducer;
