import React, { use, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useOutletContext } from 'react-router';
import { updateOrderStatus } from '../../slices/AdminOrderSlice';
import { toast, Toaster } from "sonner";
import { FaSearch } from 'react-icons/fa';

const OrdersInfopage = () => {
  const dispatch = useDispatch();
  const [query,setQuery] = useState("");
  const{orders, totalOrders, loading, error} = useSelector((state) => state.adminOrders);
  if(error){
    return <div className='max-w-7xl mx-auto p-2   sm:p-4'>Error: {error}</div>;
  }
  // const [orders,setorders]=useState([]);
  // useEffect(()=>{

  //   const ordersdata=[
  //     {
  //       _id:12345,
  //       customer:'Admin user',
  //       total:500,
  //       status:'Processing'
  //     },
  //     {
  //       _id:23456,
  //       customer:'Admin user',
  //       total:500,
  //       status:'Shipped'
  //     },
  //     {
  //       _id:34567,
  //       customer:'Admin user',
  //       total:500,
  //       status:'Delivered'
  //     },
  //   ]
  //   setorders(ordersdata);
  // },[])

  const handleStatusChange=(id,newStatus,currentStatus)=>{
   const order = orders.find((order) => order._id === id);
   if(currentStatus === 'Shipped' && newStatus === 'Processing'){
    alert("Order already shipped, cannot revert to Processing status");
    return;
   }

   if(currentStatus === 'Delivered'){
    alert("Order already delivered, status cannot be changed");
    return;
   }


    dispatch(updateOrderStatus({id,newStatus,currentStatus})).unwrap().then(()=>{
      toast.success("Order status updated successfully",{duration:3000});
    }).catch((err)=>{
      toast.error("Order status update failed",{duration:3000});
    });
  }



  const handleSearch = (e) =>{
      const query = e.target.value.toLowerCase();
      setQuery(query);

    }

    const filteredOrders = orders.filter((order) =>
        order.user.name.toLowerCase().includes(query) ||
        order._id.toLowerCase().includes(query)
      );
  return (
    <div className='max-w-7xl mx-auto p-2   sm:p-4'>
      <h2 className='text-xl sm:text-2xl font-bold mb-6'>Order Management</h2>
      <h2 className='text-lg sm:text-xl font-bold mb-2'>Total Orders: {totalOrders}</h2>
      {error && <div className='mb-4 p-2 bg-red-100 text-red-700 border border-red-400 rounded'>{error}</div>}

      {/* Search bar */}
              <div className='w-full border flex items-center justify-start gap-2 border-gray-300 rounded  mb-3 px-2 py-2 sm:w-96'>
              <span><FaSearch/></span>
              <input type="text" name='search' onChange={(e)=>{handleSearch(e)}} placeholder='Search Order by customer name or order id' className='  w-full outline-none rounded '/>
              </div>


      <div className="max-w-full overflow-x-auto">
         <table className='border-collapse min-w-full border-spacing-0 text-left'>
                <thead className=''>
                    <tr className='bg-gray-200 text-xs  uppercase sm:text-sm py-1 '>
                        <th className='px-4 py-2 w-1/3 rounded-tl-xl '>Order ID</th>
                        <th className='px-4 py-2 '>Costumer</th>
                        <th className='px-4 py-2'>Total price</th>
                        <th className='px-4 py-2'>Status</th>
                        <th className='px-4 py-2 rounded-tr-xl'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? <tr><td colSpan={5} className='p-4 text-center'>Loading...</td></tr>: filteredOrders.length > 0 ? filteredOrders.map((order,idx)=>(
                        <tr key={idx} className=''>
                            <td className='p-4 whitespace-nowrap'>{order._id}</td>
                            <td className='p-4'>{order.user.name}</td>
                            <td className='p-4'>₹{order.totalPrice}</td>
                            <td className='p-4'>
                                <select  value={order.status} onChange={(e)=>{handleStatusChange(order._id,e.target.value,order.status)}}  selected={order.status}  id={order._id} className=' focus:ring focus:ring-blue-500 focus:border-blue-500 border-2 outline-none cursor-pointer p-1 px-2 rounded border-gray-200' >
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                </select>
                            </td>
                            <td className='p-4'>

                            <button  onClick={()=>{handleStatusChange(order._id,"Delivered",order.status)}}
                            disabled={order.isDelivered}
                            className={`border px-3 py-1 cursor-pointer
                            ${order.isDelivered ? "bg-gray-500 cursor-not-allowed hover:bg-gray-600" : "bg-green-500 hover:bg-green-600"}
                             text-white rounded text-xs sm:text-lg`}>{order.isDelivered ? "Delivered" : "Mark as Delivered"}</button></td>
                        </tr>
                    )):<tr>
                            <td colSpan={5}  className='p-4 whitespace-nowrap text-center '>No Users</td>
                        </tr>}
                </tbody>

            </table>
      </div>
    </div>
  )
}

export default OrdersInfopage
