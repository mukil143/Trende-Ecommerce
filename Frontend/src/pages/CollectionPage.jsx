import React, { useEffect, useRef } from "react";
import { useState } from "react";
import { FaFilter } from "react-icons/fa";
import FilterSidebar from "../components/Products/FilterSidebar.jsx";
import SortOptions from "../components/Products/SortOptions.jsx";
import ProductGrid from "../components/Products/ProductGrid.jsx";
import { useParams, useSearchParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsByFilters } from "../slices/productSlice.js";
import { memo } from "react";


const CollectionPage = () => {
  const dispatch = useDispatch();
  const {collection} = useParams();
  const [searchParams] = useSearchParams();

  // const [products, setProducts] = useState([]);
  const {products,loading,error,pages,page,total} = useSelector((state) => state.products);
  const queryParams = Object.fromEntries([...searchParams]);//convert searchParams to object



  const sidebarRef=useRef(null)
  const buttonRef=useRef(null)

  const [isSidebarOpen,setisSidebarOpen]=useState(false);

  const toggleSidebar=()=>{
    setisSidebarOpen((prev)=> !prev);
  }

  const handleclickOutside=(e)=>{

    if(sidebarRef.current && !sidebarRef.current.contains(e.target)&&buttonRef.current&&!buttonRef.current.contains(e.target)){
        setisSidebarOpen(false);
    }
  }

  useEffect(()=>{
    dispatch(fetchProductsByFilters({...queryParams}))
    window.scrollTo(0,0);
  },[dispatch,collection,searchParams])

  useEffect(()=>{
    document.addEventListener("mousedown",handleclickOutside);


    return ()=>{
        document.removeEventListener("mousedown",handleclickOutside);
    }

  },[])

  const handlePagination=(pag)=>{
    if(pag>0 && pag<=pages){
      dispatch(fetchProductsByFilters({...queryParams,page:pag}))
    }
  }

  return(
  <div>
  <div className="flex flex-col relative lg:flex-row ">
    {/* Mobile filter button */}
    <button  ref={buttonRef} onClick={toggleSidebar} className=" lg:hidden  border p-2 flex space-x-2 justify-center items-center">
        <FaFilter className="mr-2"/>
        <span className="text-lg">Filter</span>
    </button>
    {/* Filter Sidebar */}
    <div  ref={sidebarRef} className={`${isSidebarOpen?"translate-x-0":"-translate-x-full"} z-50 lg:z-0   fixed inset-y-0 bg-white min-w-63  left-0  transition-transform duration-300 lg:translate-x-0 lg:static   `}>
        <FilterSidebar  />
    </div>
    <div className="grow p-4 overflow-y-auto ">
        <h2 className="text-xl  uppercase mb-4">All Collection</h2>
        <p>{total} Products</p>
        {/* sort */}
        <SortOptions/>
        {/* Product Grid */}
        <ProductGrid pages={pages} page={page} handlePagination={handlePagination} total={total} products={products} loading={loading} error={error}/>
    </div>
    </div>
    {/* Pagination */}

  </div>
  );
};

export default memo(  CollectionPage);
