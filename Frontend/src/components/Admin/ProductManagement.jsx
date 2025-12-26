import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useOutletContext } from 'react-router'
import { deleteProduct } from '../../slices/AdminProductSlice.js';
import { useState } from 'react';
import { FaSearch } from 'react-icons/fa';


const ProductManagement = () => {
    const dispatch = useDispatch();
    const {products, loading, error} = useSelector((state) => state.adminProducts);
    const [query,setQuery] = useState("");


    const handleDelete=async(id)=>{
        if(window.confirm("Are you sure you want to delete this product?")){
            console.log("product deleted",id);
           await  dispatch(deleteProduct(id));
        }
        else{
            console.log("product not deleted");
        }
    }


    const handleSearch = (e) =>{
      const query = e.target.value.toLowerCase();
      setQuery(query);
      console.log("search query:",query);

    }

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query)
      );




  return (
    <div className='max-w-7xl mx-auto    sm:px-6 lg:px-14 lg:py-6 '>
      <h1 className='text-2xl sm:text-3xl mb-2  font-bold sm:mb-6  '>Product Management</h1>
        {error && <div className='mb-4 p-2 bg-red-100 text-red-700 border border-red-400 rounded'>{error}</div>}
        <h2 className='text-xl sm:text-2xl  font-bold mb-2' >Total Products: {products.length}</h2>
        <Link className='flex w-fit rounded text-lg px-2 py-1 bg-green-500 text-white mb-2' to={'/admin/products/new'}>Add New Product</Link>

        {/* Search bar */}
        <div className='w-full border flex items-center justify-start gap-2 border-gray-300 rounded  mb-2 px-2 py-2 sm:w-96'>
        <span><FaSearch/></span>
        <input type="text" name='search' onChange={(e)=>{handleSearch(e)}} placeholder={'Search by name or sku'} className='  w-full outline-none rounded '/>
        </div>

      <div className="max-w-full overflow-x-auto shadow-md sm:rounded-lg">

            <table className='border-collapse min-w-full border-spacing-0   text-left '>
                <thead className=''>
                    <tr className='bg-gray-200 text-xs  uppercase sm:text-sm py-1  '>
                        <th className='px-4 py-2 w-1/2 rounded-tl-xl '>Name</th>
                        <th className='px-4 py-2 '>price</th>
                        <th className='px-4 py-2'>Sku</th>
                        <th className='px-4 py-2  rounded-tr-xl'>Action</th>
                    </tr>
                </thead>
                <tbody className='border-2 border-gray-200'>
                  {loading ? <tr><td className='p-4 text-sm sm:text-lg sm:text-center text-left ' colSpan={4}>Loading products...</td></tr> :
                    filteredProducts.length>0?filteredProducts.map((item,idx)=>(
                        <tr  key={idx} className='border-b-2 border-gray-200 hover:bg-gray-100 cursor-pointer '>
                            <td className='p-4 font-semibold text-sm sm:text-lg whitespace-nowrap'>{item.name.charAt(0).toUpperCase()+item.name.slice(1)}</td>
                            <td className='p-4 text-sm sm:text-lg'>₹{item.price}</td>
                            <td className='p-4 text-sm sm:text-lg'>{item.sku}</td>
                            <td className='p-4  '>
                            <div className='flex space-x-2 text-sm sm:text-lg '>
                            <Link to={`/admin/products/${item._id}/edit`} className='border px-3 py-0.5 cursor-pointer bg-yellow-500 text-white rounded'>Edit</Link>
                            <button onClick={()=>{handleDelete(item._id)}} className='border px-3 py-0.5 cursor-pointer bg-red-500 text-white rounded'>Delete</button>
                            </div>
                            </td>
                        </tr>)):<tr><td className='p-4 text-sm sm:text-lg sm:text-center text-left ' colSpan={4}>No products found</td></tr>}
                </tbody>

            </table>

      </div>
    </div>
  )
}

export default ProductManagement
