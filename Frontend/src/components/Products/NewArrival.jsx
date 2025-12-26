import axios from 'axios';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { useRef } from 'react';
import { FaChevronRight,FaChevronLeft } from "react-icons/fa";
import { Link } from 'react-router';


const NewArrival = () => {
  const scrollref=useRef(null);

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(false);
  const [scrollWidth, setScrollWidth] = useState(0);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  

  const [newArrivals, setNewArrivals] = useState([]);

  useEffect(() => {
    // Simulate fetching data from an API
    const fetchnewArrivals = async () => {
      try {
        const response  =  await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/new-arrivals`);
        // console.log(response.data);
        setNewArrivals(response.data);
      } catch (error) {
        console.error("Error fetching new arrivals:", error);
        // Fallback to static data in case of an error
        // setNewArrivals(newArrivalsdata);
      }
    }

    fetchnewArrivals();
  },[]);

  const scroll=(direction)=>{
    const scrollAmount = direction === 'left' ? -400 : 400;
    scrollref.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth'
    });
  }

  const   updateTheScrollButtons = () => {
    const container = scrollref.current;
    if(container){
      const leftscroll = container.scrollLeft;
      const rightscroll = container.scrollWidth > leftscroll+ container.clientWidth;
      setCanScrollLeft(leftscroll>0);  
      setCanScrollRight(rightscroll);
    }
  }

  useEffect(()=>{
    const container= scrollref.current;
    if (container) {
      container.addEventListener('scroll', updateTheScrollButtons);
      updateTheScrollButtons();
      return () => {
        container.removeEventListener('scroll', updateTheScrollButtons);
      }
    }
  },[])
  return (
    <section className='px-4 md:px-6 lg:px-8 scroll-smooth '>
      <div className="container mx-auto text-center mb-10 relative">
        <h2 className='text-2xl font-bold mb-4 text-black'>Explore New Arrivals</h2>
        <p className='mb-8 text-black'>Discover the latest styles straight off the runway, freshly added to keep your wardrobe on the cutting edge of fashion.</p>
      
       {/* Scroll buttons */}
      <div className='absolute bottom-[-30px]  right-0 flex space-x-2'>
          <button onClick={()=>{scroll("left")}}  disabled={!canScrollLeft} className={`border border-gray-200 p-2 rounded-full shadow-lg cursor-pointer bg-white ${canScrollLeft?"bg-white text-black":"text-gray-400 bg-gray-200 cursor-not-allowed"}`} >
          <FaChevronLeft/>
        </button>
        <button onClick={()=>{scroll("right")}}  disabled={!canScrollRight} className={`border border-gray-200 p-2 rounded-full shadow-lg cursor-pointer bg-white ${canScrollRight?"bg-white text-black":"text-gray-400 bg-gray-200 cursor-not-allowed"}`}>
          <FaChevronRight/>
        </button>
      </div>

      {/* New Arrivals Section */}
      
      </div>
      <div ref={scrollref} className='   container mx-auto flex overflow-x-auto no-scrollbar scrollbar-thin scrollbar-thumb-gray-500 scrollbar-track-gray-200 scroll-smooth   space-x-6 relative '>
        {newArrivals.map((item,idx)=>(
          <div key={idx} className='min-w-[100%]  sm:min-w-[50%] lg:min-w-[30%] relative' >
            <img  className='w-full h-[500px] object-cover' src={item.images[0].url} alt={item.images[0].alt} />
            <div className='absolute bottom-0 left-0 right-0  text-white  p-4  bg-opacity-50 backdrop-blur-md rounded-b-lg'>
              <Link to={`/product/${item._id}`} className='block'>
              <h4 className='font-medium'>{item.name}</h4>
              <p className='mt-1'>₹{item.price}</p>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default NewArrival