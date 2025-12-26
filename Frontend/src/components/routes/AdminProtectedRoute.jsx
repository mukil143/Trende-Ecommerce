import React from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router';

const AdminProtectedRoute = ({children}) => {
    const { user } = useSelector((state) => state.auth);
    if(!user?.role || user.role !== 'admin'){
        return <div className='min-h-screen flex items-center justify-center'>
            <h2 className='text-2xl font-semibold text-red-500'>Access Denied. Admins Only.</h2>
            <Link to='/' className='ml-4 text-blue-500 underline'>Go to Home</Link>
        </div>
    }

    return children;
}

export default AdminProtectedRoute
