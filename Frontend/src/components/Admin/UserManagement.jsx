import React, { use, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { createUser, deleteUser, fetchAllUsers, updateUser } from '../../slices/AdminSlice';
const UserManagement = () => {
    // const [users, setUsers] = useState([]);
const dispatch = useDispatch();
const [Allusers,setAllusers]=useState([]);
    const {users} = useSelector((state)=>state.admin);
    const [user,setuser]=useState({
        name:"",
        email:"",
        password:"",
        role:""
    });


    const handleSubmit=(e)=>{
        e.preventDefault();
        console.log(user);
        if(!user.name || !user.email || !user.password || !user.role){
            return alert("All fields are required");
        }
        // setUsers([...users,user]);
        dispatch(createUser(user));
        setuser({
            name:"",
            email:"",
            password:"",
            role:""
        });
        fetchUser();
    }

    const handleChange=(e)=>{
        setuser({
            ...user,
            [e.target.name]:e.target.value
        })
    }


    const handleRoleChange=async(userId,role)=>{
        await dispatch(updateUser({id:userId,role}));
        fetchUser();
        // dispatch(updateUser(updatedUsers))
        // setUsers(updatedUsers);
    }


    const handleDelete=async(userId)=>{
        if(window.confirm("Are you sure you want to delete this user?")){
            await dispatch(deleteUser(userId));
            fetchUser();
        }
        else{
            console.log("user not deleted");
        }
    }

    const fetchUser = async()=>{
        const res =  dispatch(fetchAllUsers());
        if(res?.payload){
           return setAllusers(res.payload.users);
        }
        else{
            return setAllusers([]);
        }
    }
    useEffect(()=>{
        fetchUser();

    },[dispatch])

  return (
    <div className='max-w-7xl mx-auto p-4 sm:p-6 overflow-y-auto'>
        <h1 className="text-xl sm:text-2xl font-bold text-black mb-6">User Management</h1>
        <div className="px-2 sm:px-4 min-h-full mb-6">
            <h2 className="text-lg sm:text-xl font-bold text-black mb-4">Add New User</h2>
            <form onSubmit={handleSubmit} className='' >
                <label htmlFor="name" className='block mb-4'>
                Name
                <br />
                <input value={user.name} onChange={handleChange}  id='name' name='name' type="text" className='border-2 w-full sm:w-2/3 lg:w-1/3 outline-none focus:border-gray-300 text-lg p-2 rounded border-gray-200' />
                </label>

                <label htmlFor="email" className='block mb-4'>
                Email
                 <br />
                <input value={user.email}  id='email' name='email' onChange={handleChange} type="email" className='border-2 w-full sm:w-2/3 lg:w-1/3 outline-none focus:border-gray-300 text-lg p-2 rounded border-gray-200' />
                </label>

                <label htmlFor="password" className='block mb-4'>
                Password
                <br />
                <input  name='password' value={user.password} id='password' onChange={handleChange} type="text" className='border-2 w-full sm:w-2/3 lg:w-1/3 outline-none focus:border-gray-300 text-lg p-2 rounded border-gray-200' />
                </label>

                <label htmlFor="role" className='block mb-4'>
                Role
                <br />
                <select  required value={user.role} onChange={handleChange}  className='border w-full sm:w-2/3 lg:w-1/3 outline-none focus:border-gray-300 text-lg p-2 rounded border-gray-200' name="role" id="role">
                    <option value="none" defaultChecked  required > Select Role</option>
                    <option value="admin">Admin</option>
                    <option value="customer">customer</option>
                </select>
                </label>
                <button  type='submit' className='border px-3 py-2 cursor-pointer bg-green-500 text-white rounded'>Add User</button>
            </form>
        </div>
        <div className=' overflow-x-auto shadow-md sm:rounded-lg scrollbar-none '>
            <table className='border-collapse min-w-full border-spacing-0 text-left'>
                <thead className=''>
                    <tr className='bg-gray-200 text-xs  uppercase sm:text-sm py-1 '>
                        <th className='px-4 py-2 rounded-tl-xl '>Name</th>
                        <th className='px-4 py-2 w-1/3'>Email</th>
                        <th className='px-4 py-2'>Password</th>
                        <th className='px-4 py-2'>Role</th>
                        <th className='px-4 py-2 rounded-tr-xl'>Action</th>
                    </tr>
                </thead>
                <tbody>

                    { users.length > 0 ? users.map((user,idx)=>(
                        <tr key={idx} className=''>
                            <td className='p-4 whitespace-nowrap'>{user.name}</td>
                            <td className='p-4'>{user.email}</td>
                            <td className='p-4 '><input type="text" readOnly className='border p-1'  value={user.password} /></td>
                            <td className='p-4'>
                                <select  value={user.role}  selected={user.role}  onChange={(e)=>{handleRoleChange(user._id,e.target.value)}} id={user._id} className='border-2 outline-none cursor-pointer p-1 px-2 rounded border-gray-200' >
                                    <option id='admin' value="admin">Admin</option>
                                    <option id='customer' value="customer">customer</option>
                                </select>
                            </td>
                            <td className='p-4'>
                            <button onClick={()=>{handleDelete(user._id)}} className='border px-3 py-1 cursor-pointer bg-red-500 text-white rounded'>Delete</button></td>
                        </tr>
                    )):<tr>
                            <td colSpan={5}  className='p-4 whitespace-nowrap text-center text-lg'>No Users</td>
                        </tr>}
                </tbody>

            </table>

        </div>
    </div>
  )
}

export default UserManagement
