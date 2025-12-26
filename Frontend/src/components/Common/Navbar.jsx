import React, { useState } from "react";
import { CiUser } from "react-icons/ci";
import { IoBagOutline, IoSearchOutline } from "react-icons/io5";
import { HiMiniBars3BottomRight } from "react-icons/hi2";
import SearchBar from "./SearchBar.jsx";
import CartDrawer from "../Layout/CartDrawer.jsx";
import NavDrawer from "../Layout/NavDrawer.jsx";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";


const Navbar = () => {

  const [isOpen,setisOpen]=useState(false)
  const [cartopen,setcartopen]=useState(false)
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const{cart} = useSelector((state) => state.cart);
  const {user} = useSelector((state)=>state.auth);
  const cartCount = cart?.products?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  }

  const handlecartToggle=()=>{
    setcartopen(!cartopen)
  }

  const items = [
    {
      name: "MEN",
      href: "collections/all?gender=men",
    },
    {
      name: "WOMEN",
      href: "collections/all?gender=women",
    },
    {
      name: "TOPWEAR",
      href: "collections/all?category=Top Wear",
    },
    {
      name: "BOTTOMWEAR",
      href: "collections/all?category=Bottom Wear",
    },
  ];

  const options = [
    {
      icon: <CiUser />,
      href: "#",
    },
    {
      icon: <IoBagOutline />,
      href: "#",
    },
    {
      icon: <IoSearchOutline />,
      href: "#",
    },
  ];

  return (
    <div className="sticky top-0 z-50 bg-white shadow-sm">


            <div className=" container mx-auto  flex justify-between py-2 px-4 md:py-4 md:px-6   items-center">
            <div className="text-black font-bold ">
              <Link to="/" className="text-2xl md:text-3xl">Trendé</Link>
            </div>
            <div>
              <div className=" hidden md:flex space-x-3 ">
                {items.map((item, idx) => (
                  <span className="font-semibold text-gray-700  hover:text-black" key={idx}>
                    <Link to={item.href} >
                      {item.name}
                    </Link>
                  </span>
                ))}
              </div>
            </div>
            {/* Right Section */}
            <div className="flex   justify-center items-center *:text-xl *:md:text-2xl  ">
              {user?.role === 'admin' &&  (
                 <Link to='/admin' className="flex items-center mr-2 " >
              <span className="text-[10px] my-auto sm:text-sm bg-black text-white rounded px-1 py-0.5">Admin</span>
              </Link>
              )}

              <span  className="bg-white p-2 hover:bg-gray-100 rounded-full mr-2 cursor-pointer">
                <Link className="" to='/profile'>
                  <CiUser />
                </Link>
              </span>

              <button onClick={handlecartToggle} className=  "bg-white p-2 mr-2 relative hover:bg-gray-100 rounded-full cursor-pointer">
                <IoBagOutline/>
                {cartCount >0 && (
                <span className="absolute px-1 top-2 ring right-1 bg-red-500 text-white  text-xs rounded-full">{cartCount}</span>
                )}
              </button>
              {/* <span className="bg-white p-2 hover:bg-gray-100 rounded-full cursor-pointer">
                <IoSearchOutline />
              </span> */}
              <div className="overflow-hidden mr-2 md:mr-0">
                {isOpen ? (
                    <SearchBar isOpen={isOpen} setisOpen={setisOpen} />
                       ) : (
                    <button
                      onClick={() => setisOpen(true)}
                       className="bg-white p-2 hover:bg-gray-100 rounded-full cursor-pointer">
                          <IoSearchOutline />
                     </button>
                 )}
              </div>

              <button onClick={toggleNavDrawer} className="md:hidden" >
                <HiMiniBars3BottomRight/>
              </button>
            </div>
          </div>
          <CartDrawer drawerisOpen={cartopen} handlecartToggle={handlecartToggle} />
          <NavDrawer drawerisOpen={navDrawerOpen} toggleNavDrawer={toggleNavDrawer} />
    </div>
  );
};

export default Navbar;
