import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router'
import { fetchOrderDetails } from '../slices/OrderSlice';

const OrderDetailsPage = () => {
    const {id}=useParams();
    const dispatch = useDispatch();
    const {orderDetails, loading, error} = useSelector((state) => state.orders);
    const tableheaders = ["Name", "Unit Price", "Quantity", "Total"];

    useEffect(()=>{
        if(!id)return;
        dispatch(fetchOrderDetails(id));
    }, [id, dispatch]);
  return (
    <div className='max-w-7xl container mx-auto my-10 px-4'>
        <h1 className='text-xl md:text-3xl font-bold'>Order Details</h1>

            {!orderDetails ? (
                <p>Loading order details...</p>
            ) : (
                <div className="p-4 border border-gray-300 rounded-lg mt-6">
                    {/* Order details */}
                    <div className="flex flex-col sm:flex-row gap-2 justify-between sm:items-center mb-8">
                        <div className="">
                            <h2 className="text-sm sm:text-xl font-semibold">Order ID: {orderDetails._id}</h2>
                            <p className="text-xs sm:text-sm text-gray-600">Placed on: {orderDetails.createdAt}</p>
                        </div>
                        <div className="text-left sm:text-right">
                            <div className='mb-1 sm:mb-2'>{orderDetails.isPaid?(<span className=' text-[10px] md:text-sm font-semibold bg-green-100 px-2 py-1 rounded-full text-green-600'>Approverd</span>):<span className='text-[10px] md:text-sm font-semibold bg-red-100 px-2 py-1 rounded-full text-red-600'>Pending</span>}</div>
                            <div>{orderDetails.isDelivered?<span className='text-[10px] md:text-sm font-semibold bg-green-100 px-2 py-1 rounded-full text-green-600'>
                                Delivered
                            </span>:<span className='text-[10px] md:text-sm font-semibold bg-yellow-100 px-2 py-1 rounded-full text-yellow-600'>Pending Delivery</span>}</div>
                        </div>
                    </div>
                    {/* payment and shipping address */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8 ">
                        <div className="">
                            <h2 className="text-sm sm:text-lg font-semibold mb-2">Payment Info</h2>
                            <div className="text-xs sm:text-sm  ">
                                <p className="text-gray-600">Method: {orderDetails.paymentMethod}</p>
                                <p className="text-gray-600">Status: {orderDetails.isPaid ? 'Paid' : 'Pending'}</p>
                            </div>
                        </div>
                        <div className="">
                            <h2 className="text-sm sm:text-lg font-semibold mb-2">Shipping Info</h2>
                            <div className="text-xs sm:text-sm  ">
                                <p className='text-gray-600'>Name: {orderDetails.shippingAddress.firstName} {orderDetails.shippingAddress.lastName}</p>
                                <p className="text-gray-600">Phone: {orderDetails.shippingAddress.phone}</p>

                                <p className="text-gray-600">Address: {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.country}</p>
                                <p className="text-gray-600">Postal Code: {orderDetails.shippingAddress.postalCode}</p>
                            </div>
                        </div>
                    </div>
                    {/* Order items */}
                    <div className="overflow-x-auto">
                        <h2 className="text-sm sm:text-lg mb-2 font-semibold">Products</h2>
                        <div className="overflow-x-auto">
                            <table className='min-w-full border border-gray-200 rounded-lg overflow-hidden'>
                                <thead>
                                    <tr className='border bg-gray-100 border-gray-100'>
                                        {tableheaders.map((header, index) => (
                                            <th
                                                key={index}
                                                className={`px-4 py-2 text-xs sm:text-sm font-semibold text-gray-700 ${index === 0 ? 'text-center w-1/3' : 'text-center'} `}
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {orderDetails.orderItems.map((item,idx) => (
                                        <tr className='border-b border-gray-200 ' key={idx}>
                                            <td className='px-4 py-2 flex items-center text-center flex-col sm:flex-row justify-start'>
                                                <img src={item.image} className='w-12 h-12 object-cover inline-block mr-2 rounded' alt={item.name} />
                                                <Link to={`/product/${item.productId}`} className=' text-left  hover:underline line-clamp-1 text-blue-700 text-xs sm:text-sm'>{item.name}</Link>
                                            </td>
                                            <td className='px-4 py-2 text-center text-xs sm:text-sm font-semibold'>₹{item.price}</td>
                                            <td className='px-4 py-2 text-center text-xs sm:text-sm font-semibold'>{item.quantity}</td>
                                            <td className='px-4 py-2 text-center text-xs sm:text-sm font-semibold'>₹{item.price * item.quantity}</td>
                                        </tr>

                                    ))}
                                    <tr className='border-b border-gray-200 '>
                                        <td colSpan={3} className='px-4 py-2 text-right font-bold text-sm'>Total:</td>
                                        <td className='px-4 py-2 text-center font-bold text-sm'>₹{orderDetails.totalPrice}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {/* back button */}
                    <div className="mt-6">
                        <Link to="/my-orders" className="px-4 py-2 bg-blue-600 text-white text-xs sm:text-sm rounded hover:bg-blue-700 transition" >
                            Back to Orders
                        </Link>
                    </div>

                </div>
            )}
    </div>
  )
}

export default OrderDetailsPage
