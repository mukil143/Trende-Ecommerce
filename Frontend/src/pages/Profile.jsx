import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import MyOrdersPage from './MyOrdersPage.jsx'
import { useDispatch, useSelector } from 'react-redux'
import { generateNewGuestId, logoutUser } from '../slices/AuthSlice.js'
import { clearCart } from '../slices/CartSlice.js'

const Profile = () => {
  const {user, loading, error, guestId } = useSelector((state) => state.auth);
  console.log(user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    // Dispatch logout action here
    // For example: dispatch(logoutUser());
    try {
      dispatch(logoutUser());
      dispatch(clearCart());
      dispatch(generateNewGuestId());
      navigate("/login");

    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  return (
    <div className='min-h-screen flex flex-col'>
        <div className="container mx-auto grow">
            <div className="flex mt-16 flex-col  md:flex-row md:space-x-6 space-y-6 md:space-y-0">
                {/* Left Section */}
                <div className='p-6 w-full  break-words h-fit shadow-md rounded-lg md:w-1/3 lg:w-1/4'>
                <div className='flex  flex-col w-full gap-y-4'>
                    <h2 className="text-2xl md:text-3xl font-bold">{user.name} </h2>
                    <h2 className=' text-lg  text-gray-600'>{user.email}</h2>

                    <button disabled={loading} onClick={handleLogout}  className='bg-red-500 cursor-pointer text-white w-full text-center px-4 py-2 rounded-lg'>{loading?"Logging out...":"Logout"}</button>
                    {error && <p className='text-red-500'>{error}</p>}
                </div>
                </div>

                {/* Right section */}
                <div className="w-full md:w-2/3 lg:w-3/4">
                <MyOrdersPage/>

                </div>
            </div>
        </div>
    </div>
  )
}

export default Profile
