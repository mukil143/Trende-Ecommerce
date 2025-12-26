import React, { useEffect, useState } from 'react'
import { FaBars } from 'react-icons/fa';
import AdminSidebar from './AdminSidebar.jsx';
import { Outlet } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllProducts } from '../../slices/AdminProductSlice.js';
import { fetchAllOrders } from '../../slices/AdminOrderSlice.js';
const AdminLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const dispatch = useDispatch();
     const {orders,totalOrders,revenue,loading,error} = useSelector((state)=>state.adminOrders);
    useEffect(() => {
        dispatch(fetchAllOrders());
        dispatch(fetchAllProducts());
    }, [dispatch,orders.length]);
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
  return (
    <div className='h-screen flex flex-col md:flex-row '>
      {/* Mobile Header */}
      <div className="flex items-center md:hidden  p-4 bg-gray-900 text-white z-50">
        <button onClick={toggleSidebar} className="  focus:outline-none">
          <FaBars size={24}/>
        </button>
          <h1 className='ml-4 text-xl font-medium'  >Admin Dashboard</h1>
      </div>
      {/* Overlay */}
      {isSidebarOpen && (
         <div onClick={toggleSidebar} className="bg-black opacity-50 fixed inset-0 z-40 md:hidden">
      </div>
      )}
      {/* Sidebar */}
      <div className={`fixed top-0 left-0   min-h-screen  w-64    md:relative bg-gray-900 text-white z-60 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full '} transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:block md:z-20`}>
        <AdminSidebar/>
      </div>

      {/* Main Content     */}
      <div className="p-6 max-h-screen flex-grow overflow-x-auto overflow-y-auto scrollbar-hide ">
        {/* Your main content */}
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout
