import {configureStore} from '@reduxjs/toolkit'
import authReducer from '../slices/AuthSlice.js'
import productReducer from '../slices/productSlice.js'
import cartReducer from '../slices/CartSlice.js'
import checkoutReducer from '../slices/CheckoutSlice.js'
import orderReducer from '../slices/OrderSlice.js'
import adminReducer from '../slices/AdminSlice.js'
import adminProductReducer from '../slices/AdminProductSlice.js'
import adminOrderReducer from '../slices/AdminOrderSlice.js'

 const store = configureStore({
    reducer:{
        auth:authReducer,
        products:productReducer,
        cart:cartReducer,
        checkout:checkoutReducer,
        orders:orderReducer,
        admin:adminReducer,
        adminProducts:adminProductReducer,
        adminOrders:adminOrderReducer,
    }
})


export default store;