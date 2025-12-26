import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";





const API_URL = import.meta.env.VITE_BACKEND_URL;
const USER_TOKEN = localStorage.getItem("userToken");

//async thunk to fetch all products - admin only
export const fetchAllProducts = createAsyncThunk(
  "admin/fetchAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/products/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
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



//async thunk to delete product - admin only
export const deleteProduct = createAsyncThunk(
  "admin/deleteProduct",
  async(id,{ rejectWithValue }) => {
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/admin/products/${id}`,{
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${USER_TOKEN}`,
        }
      });
      console.log(response.data);
      return response.data.id;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.message);
    }
  }
)


//async thunk to create product - admin only
export const createProduct = createAsyncThunk(
  "admin/createProduct",
  async(productdata,{ rejectWithValue }) => {
    try {
      const response   =  await axios.post(`${API_URL}/api/admin/products/`,productdata,{
        headers:{
          "Content-Type":"application/json",
          Authorization:`Bearer ${localStorage.getItem("userToken")}`,
        }
      })
      console.log(response.data);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.message);
    }
  }
)



//async thunk  to update product - admin only
export const updateProductAdmin = createAsyncThunk(
  "admin/updateProductAdmin",
  async({ id, productdata },{ rejectWithValue }) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/admin/products/${id}`,productdata,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem("userToken")}`,
        }
      })
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.message);
    }
  }
)


export const clearAdminProductError = createAsyncThunk(
  "admin/clearAdminProductError",
  async (_, { dispatch }) => {
    dispatch(AdminProductSlice.actions.clearError());
  }
);


export const uploadAdminProductImage = createAsyncThunk(
  "admin/uploadAdminProductImage",
  async (imageFile, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        imageFile,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
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




//create the admin product slice
const AdminProductSlice = createSlice({
  name:"adminProducts",
  initialState:{
    products:[],
    totalProducts:0,
    loading:false,
    error:null,
  },
  reducers:{
    clearError:(state) => {
      state.error = null;
    }
  },
  extraReducers:(builder) => {
    builder
    //handle fetch all products
    .addCase(fetchAllProducts.pending,(state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(fetchAllProducts.fulfilled,(state,action) => {
      state.loading = false;
      state.products = action.payload;
      state.totalProducts = action.payload.length;
    })
    .addCase(fetchAllProducts.rejected,(state,action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to fetch products";
    })
    //handle delete product
    .addCase(deleteProduct.pending,(state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(deleteProduct.fulfilled,(state,action) => {
      state.loading = false;
      state.products = state.products.filter((product)=> product._id !== action.payload);
      state.totalProducts = state.products.length;
    })
    .addCase(deleteProduct.rejected,(state,action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to delete product";
    })
    //handle create product
    .addCase(createProduct.pending,(state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(createProduct.fulfilled,(state,action) => {
      state.loading = false;
      state.products.push(action.payload);
      state.totalProducts = state.products.length;
    })
    .addCase(createProduct.rejected,(state,action) => {
      state.loading = false;
      state.error = action.payload?.message || "Failed to create product";
    })
    //handle update product
    .addCase(updateProductAdmin.pending,(state) => {
      state.loading = true;
      state.error = null;
    })
    .addCase(updateProductAdmin.fulfilled,(state,action) => {
      state.loading = false;
      state.products = state.products.map((product) =>{
        if(product._id === action.payload._id){
          return action.payload;
        }
        return product;
      })
    })
    .addCase(updateProductAdmin.rejected,(state,action) =>{
      state.loading = false;
      state.error = action.payload?.message || "Failed to update product";
    })

  }
})




export default AdminProductSlice.reducer;

