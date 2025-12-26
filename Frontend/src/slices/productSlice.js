import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//async thunk to fetch the products by collection and optional Filters

export const fetchProductsByFilters = createAsyncThunk(
  "products/fetchByFilters",
  async ({
    collection,
    size,
    color,
    gender,
    minPrice,
    maxPrice,
    sortBy,
    search,
    category,
    material,
    brand,
    limit,
    page,
  }, { rejectWithValue }) => {

    try {
       const query = new URLSearchParams(); // Create a new URLSearchParams object {}
    if (collection) query.append("collection", collection); // Append key-value pair
    if (size) query.append("size", size); // Append key-value pair
    if (color) query.append("color", color); // Append key-value pair
    if (gender) query.append("gender", gender); // Append key-value pair
    if (minPrice) query.append("minPrice", minPrice); // Append key-value pair
    if (maxPrice) query.append("maxPrice", maxPrice); // Append key-value pair
    if (sortBy) query.append("sortBy", sortBy); // Append key-value pair
    if (search) query.append("search", search); // Append key-value pair
    if (category) query.append("category", category); // Append key-value pair
    if (material) query.append("material", material); // Append key-value pair
    if (brand) query.append("brand", brand); // Append key-value pair
    if (limit) query.append("limit", limit); // Append key-value pair
    if (page) query.append("page", page); // Append key-value pair

    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/products/?${query.toString()}`
    ); // Make the API request
    // console.log(response.data); 
    console.log(response.data);
    return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.message);
    }
   
  }
);

//fetch the single product by id
export const fetchProductById = createAsyncThunk(
  "products/fetchproductdetails",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/${id}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

//async thunk to update products

export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productdata }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/update/${id}`,
        productdata,
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

//async thunk to fetch similar products
export const fetchSimilarProducts = createAsyncThunk(
  "products/fetchSimilarProducts",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/products/similar/${id}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data.message);
    }
  }
);

//Create a slice
const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    selectedProduct: null,
    similarProducts: [],
    loading: false,
    error: null,
    total: 0,
    pages: 1,
    page: 1,
    filters: {
      collection: "",
      gender: "",
      size: "",
      color: "",
      minPrice: "",
      maxPrice: "",
      sortBy: "",
      search: "",
      category: "",
      material: "",
      brand: "",
      limit: "",
      page: "",
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state, action) => {
      state.filters = {
        collection: "",
        gender: "",
        size: "",
        color: "",
        minPrice: "",
        maxPrice: "",
        sortBy: "",
        search: "",
        category: "",
        material: "",
        brand: "",
        limit: "",
        page: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      //handle fetching products with filter
      .addCase(fetchProductsByFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductsByFilters.fulfilled, (state, action) => {
        state.loading = false;
        console.log(action.payload);
        state.products = Array.isArray(action.payload.products) ? action.payload.products : [];
        state.total = action.payload.total;
        state.pages = action.payload.pages;
        state.page = action.payload.page;
      })
      .addCase(fetchProductsByFilters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })
      //handle fetching single product details
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      //handle fetching similar products
      .addCase(fetchSimilarProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.similarProducts = action.payload;
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      })

      //handle updating products
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProduct = action.payload;
        const index = state.products.findIndex(
          (p) => p._id === updatedProduct._id
        );
        if (index !== -1) {
          state.products[index] = updatedProduct;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || action.error.message;
      });

  },
});


export const { setFilters, clearFilters } = productSlice.actions;

export default productSlice.reducer;
