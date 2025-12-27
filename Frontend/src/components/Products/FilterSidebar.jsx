// import React, { useEffect, useState } from 'react'
// import { useDispatch } from 'react-redux';
// import { useNavigate, useSearchParams } from 'react-router'
// import { clearFilters, fetchProductsByFilters } from '../../slices/productSlice.js';


// const FilterSidebar = () => {
//    const navigate=useNavigate();
//    const dispatch=useDispatch();
//     const [searchParams,setSearchParams]=useSearchParams({});
//     const [price,setPrice]=useState(null);
//      const [filters,setFilters]=useState({
//         category:"",
//         gender:"",
//         Color:[],
//         size:[],
//         material:[],
//         brand:[],
//         minPrice:100,
//         maxPrice:1000,
//      });

//      const handleFilterChange=(e)=>{
//          //  console.log(e);
//         const {name,value,checked,type}=e.target;
//       //   console.log({name,value,checked,type});
//         let newfilters={...filters};
//       //   console.log("newfilters",newfilters);
//       //   console.log("newfilters",newfilters["size"]);
//         if(type==="checkbox"){
//          if(checked){
//             newfilters[name]=[...(newfilters[name] || []),value];
//             // console.log("checked",newfilters[name]);
//          }
//          else{
//             newfilters[name]=newfilters[name].filter((item)=>item!==value);
//             // console.log("unchecked",newfilters[name]);
//          }
//         }else{
//             newfilters[name]=value;
//             // console.log("newfilters[name]",newfilters[name]);
//         }
//         setFilters(newfilters);
//       //   console.log("newfilters after change",newfilters);

//       //   console.log(Object.keys(newfilters));
//       updateURLparams(newfilters);
//      }

//    //   Function to update URL parameters based on selected filters
//      // This function takes the new filters object, converts it to URL parameters, and updates the URL
//      const updateURLparams=(newfilters)=>{
//       const params= new URLSearchParams();// Create a new URLSearchParams object params={};
//       Object.keys(newfilters).forEach((key)=>{
//          if(Array.isArray(newfilters[key])&& newfilters[key].length>0){
//             params.append(key,newfilters[key].join(","));// Convert array to comma-separated string
//          }else if(newfilters[key]!=null && newfilters[key]!==""){
//             params.append(key,newfilters[key]);// Append key-value pair
//          }
//       })

//       setSearchParams(params);
//       navigate(`?${params.toString()}`); // Update the URL with new search params


//      }

//      const categories=["Top Wear","Bottom wear"];

//      const [priceRange,setPriceRange]=useState([0, 100])

//      const colors=[
//         "Red",
//         "Blue",
//         "Yellow",
//         "Green",
//         "Black",
//         "White",
//         "Orange",
//         "Purple",
//         "Pink",
//      ]

//      const sizes=[
//         "S",
//         "M",
//         "L",
//         "XL",
//         "XXL",
//      ]

//      const materials=[
//         "Cotton",
//         "Polyester",
//         "Denim",
//         "Leather",
//         "Synthetic",
//      ]

//      const brands=[
//         "Nike",
//         "Adidas",
//         "Puma",
//         "Under Armour",
//         "Reebok",
//      ]

//      const genders=["men","women","unisex"];

//      useEffect(()=>{
//          const params=Object.fromEntries([...searchParams]); //https://yourapp.com/collection?category=shoes&gender=men&Color=red,blue&size=M,L&brand=Nike&minPrice=150&maxPrice=700 =>> {category:"shoes",gender:"men",Color:"red,blue",size:"M,L",brand:"Nike",minPrice:"150",maxPrice:"700"}



//          setFilters({
//             ...params,
//             category:params.category || "" ,
//             gender:params.gender || "" ,
//             Color:params.Color? params.Color.split(",") : [] ,
//             size:params.size? params.size.split(",") : [] ,
//             material:params.material? params.material.split(",") : [] ,
//             brand:params.brand? params.brand.split(",") : [] ,
//             minPrice:params.minPrice || 10 ,
//             maxPrice:params.maxPrice || 100 ,
//          })
//          setPriceRange([params.minPrice || 10, params.maxPrice || 100])
//      },[searchParams])

//      const handleFilterClear=()=>{
//       dispatch(fetchProductsByFilters({}));
//       dispatch(clearFilters());
//       updateURLparams({});
//      }

//   return (
//    <div className=" fixed top-0 right-0  p-4  h-screen md:h-screen  md:scrollbar-hide bg-white overflow-y-scroll ">
//       <h3 className="text-xl flex justify-between items-center  font-bold text-gray-800 mb-4">Filter <button onClick={()=>handleFilterClear()} className='text-sm bg-gray-100 text-center rounded-lg px-2 py-1'>Clear All</button></h3>
//       <div className='mb-6'>
//          <label className='text-lg text-gray-800 font-medium' >Category</label>
//          { categories.map((category,idx)=>(
//             <div className='flex items-center' key={idx}>
//                <input type="radio" name="category" className='mr-2 h-4 w-4 text-blue-500 onfocus:ring-2 onfocus:ring-blue-500' checked={filters.category===category} onChange={(e)=>{
//                handleFilterChange(e);
//             }} value={category} id={category} />
//                <span className='text-lg text-gray-800 font-medium' >{category}</span>
//             </div>
//          ))}

//       </div>

//       {/* Gender */}

//       <div className='mb-6'>
//          <label className='text-lg text-gray-800 font-medium mb-4' >Gender</label>
//          { genders.map((gender,idx)=>(
//             <div className='flex items-center' key={idx}>
//                <input type="radio"  name="gender" className='mr-2 h-4 w-4 text-blue-500 onfocus:ring-2 onfocus:ring-blue-500' checked={filters.gender===gender} onChange={(e)=>{
//                handleFilterChange(e);
//             }} value={gender} id={gender} />
//                <span  className='text-lg text-gray-800 font-medium'>{gender.charAt(0).toUpperCase() + gender.slice(1)}</span>
//             </div>
//          ))}

//       </div>

//       {/* Colors */}

//       <div className='mb-6 text-left '>
//          <label className='text-lg text-gray-800 font-medium mb-4' >Color</label>
//          <div className='flex  flex-wrap  gap-2   '>
//            {colors.map((color,idx)=>(
//             <button key={idx} name="Color" value={color} id={color} onClick={(e)=>{handleFilterChange(e)}} type='button'  style={{backgroundColor:color.toLowerCase()}} className={`w-8 h-8 border border-gray-300 rounded-full cursor-pointer transition  hover:scale-105 ${filters.Color.includes(color) && "ring-2 ring-offset-2 ring-blue-500"}`} ></button>
//          ))}
//          </div>

//       </div>

//       {/* Size */}

//       <div className='mb-6 text-left '>
//          <label className='text-lg text-gray-800 font-medium ' >Size</label>
//          <div  className=''>
//             {sizes.map((size,idx)=>(
//             <div key={idx} className='flex  items-center space-x-2'>
//                <input type="checkbox"  value={size}  checked={filters.size.includes(size)} onChange={(e)=>{
//                handleFilterChange(e);}} className='mr-2 h-4 w-4 text-blue-500 onfocus:ring-2 onfocus:ring-blue-500'   name="size" id={size} />
//                <span className='text-lg text-gray-800 font-medium'>{size}</span>
//             </div>
//          ))}
//          </div>

//       </div>

//       {/* Materials */}

//        <div className='mb-6 text-left '>
//          <label className='text-lg text-gray-800 font-medium ' >Materials</label>
//          <div  className=''>
//             {materials.map((material,idx)=>(
//             <div key={idx} className='flex  items-center space-x-2'>
//                <input type="checkbox"  value={material} checked={filters.material.includes(material)} onChange={(e)=>{handleFilterChange(e);}} className='mr-2 h-4 w-4 text-blue-500 onfocus:ring-2 onfocus:ring-blue-500'   name="material" id={material} />
//                <span className='text-lg text-gray-800 font-medium'>{material}</span>
//             </div>
//          ))}
//          </div>

//       </div>


//       {/* Brands */}


//        <div className='mb-6 text-left '>
//          <label className='text-lg text-gray-800 font-medium '>Brands</label>
//          <div  className=''>
//             {brands.map((brand,idx)=>(
//             <div key={idx} className='flex  items-center space-x-2'>
//                <input type="checkbox" className='mr-2 h-4 w-4 text-blue-500 onfocus:ring-2 onfocus:ring-blue-500'   name="brand" value={brand} checked={filters.brand.includes(brand)} onChange={(e)=>{handleFilterChange(e);}} id={brand} />
//                <span className='text-lg text-gray-800 font-medium'>{brand}</span>
//             </div>
//          ))}
//          </div>

//       </div>

//       {/* Price range */}

//       <div className="mb-8">
//          <label  className='block text-gray-600 text-lg font-medium mb-2'>Price Range</label>
//          <div>
//             <input type="range" name='prizerange' min={10} max={100}  onChange={(e)=>{setPrice(e.target.value);handleFilterChange(e);}} className='w-full  h-2 appearance-none rounded-lg cursor-pointer bg-gray-200' />
//             <div className='flex justify-between text-gray-600'>
//                <span>${priceRange[0]}</span>
//                <span>${priceRange[1]}</span>
//             </div>
//          </div>
//          <div>
//             <span className='text-lg font-semibold' >${price}</span>
//          </div>
//       </div>

//    </div>
//   )
// }

// export default FilterSidebar


import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useSearchParams } from 'react-router'; // Ensure 'react-router' or 'react-router-dom'
import { clearFilters, fetchProductsByFilters } from '../../slices/productSlice.js';

const FilterSidebar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [searchParams, setSearchParams] = useSearchParams();

    // Initial state
    const [filters, setFilters] = useState({
        category: "",
        gender: "",
        Color: [],
        size: [],
        material: [],
        brand: [],
        minPrice: 0,
        maxPrice: 1000,
    });

    const [price, setPrice] = useState(1000); // Local state for slider display

    // 1. Generic Handler for Inputs (Checkbox, Radio, Range)
    const handleFilterChange = (e) => {
        const { name, value, checked, type } = e.target;
        let newFilters = { ...filters };

        if (type === "checkbox") {
            // Toggle logic for arrays (Size, Material, Brand)
            if (checked) {
                newFilters[name] = [...(newFilters[name] || []), value];
            } else {
                newFilters[name] = newFilters[name].filter((item) => item !== value);
            }
        } else if (type === "range") {
            // Handle Price Slider
            newFilters[name] = Number(value);
            setPrice(value);
        } else {
            // Handle Radio Buttons (Category, Gender)
            newFilters[name] = value;
        }

        setFilters(newFilters);
        updateURLparams(newFilters);
    };

    // 2. Specific Handler for Colors (since they are buttons, not inputs)
    const handleColorChange = (color) => {
        let newColors = [...filters.Color];
        if (newColors.includes(color)) {
            newColors = newColors.filter((c) => c !== color); // Remove
        } else {
            newColors.push(color); // Add
        }

        const newFilters = { ...filters, Color: newColors };
        setFilters(newFilters);
        updateURLparams(newFilters);
    };

    // 3. Update URL based on state
   //  const updateURLparams = (newFilters) => {
   //      const params = new URLSearchParams();

   //      Object.keys(newFilters).forEach((key) => {
   //          if (Array.isArray(newFilters[key]) && newFilters[key].length > 0) {
   //              params.append(key, newFilters[key].join(","));
   //          } else if (newFilters[key] !== null && newFilters[key] !== "" && newFilters[key] !== 0) {
   //              // We exclude 0 for minPrice to keep URL clean, or you can keep it
   //              params.append(key, newFilters[key]);
   //          }
   //      });

   //      setSearchParams(params);
   //      navigate(`?${params.toString()}`);
   //  };

   const updateURLparams = (newFilters) => {
    const params = new URLSearchParams();

    Object.keys(newFilters).forEach((key) => {
        const value = newFilters[key];

        if (Array.isArray(value)) {
            // ONLY append if the array has items
            if (value.length > 0) {
                params.append(key, value.join(","));
            }
            // If empty array, do nothing (don't let it fall to 'else')
        }
        // Handle Strings and Numbers
        else if (value !== null && value !== "" && value !== 0) {
            params.append(key, value);
        }
    });

    setSearchParams(params);
    navigate(`?${params.toString()}`);
};

    // 4. Sync URL -> State -> Redux
    // This runs on mount AND whenever the URL changes
    useEffect(() => {
        const params = Object.fromEntries([...searchParams]);

        // Parse URL params into correct data types
        const parsedFilters = {
            category: params.category || "",
            gender: params.gender || "",
            Color: params.Color ? params.Color.split(",") : [],
            size: params.size ? params.size.split(",") : [],
            material: params.material ? params.material.split(",") : [],
            brand: params.brand ? params.brand.split(",") : [],
            minPrice: Number(params.minPrice) || 0,
            maxPrice: Number(params.maxPrice) || 1000,
        };

        setFilters(parsedFilters);
        setPrice(parsedFilters.maxPrice);

        // TRIGGER THE API CALL
        // This is the missing piece that makes the filter actually work
        dispatch(fetchProductsByFilters(parsedFilters));

    }, [searchParams, dispatch]); // removed filters dependency to avoid loop

    const handleFilterClear = () => {
        const resetFilters = {
            category: "",
            gender: "",
            Color: [],
            size: [],
            material: [],
            brand: [],
            minPrice: 0,
            maxPrice: 1000,
        };
        setFilters(resetFilters);
        setPrice(1000);
        setSearchParams(new URLSearchParams()); // Clear URL
        dispatch(clearFilters()); // Clear Redux Store
    };

    // Data constants (unchanged)
    const categories = ["Top Wear", "Bottom wear"];
    const colors = ["Red", "Blue", "Yellow", "Green", "Black", "White", "Orange", "Purple", "Pink"];
    const sizes = ["S", "M", "L", "XL", "XXL"];
    const materials = ["Cotton", "Polyester", "Denim", "Leather", "Synthetic"];
    const brands = ["Nike", "Adidas", "Puma", "Under Armour", "Reebok"];
    const genders = ["men", "women", "unisex"];

    return (
        <div className="p-4  h-full md:h-full  scrollbar-hide bg-white overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">Filter</h3>
                <button
                    onClick={handleFilterClear}
                    className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg px-3 py-1 transition"
                >
                    Clear All
                </button>
            </div>

            {/* Category */}
            <div className="mb-6">
                <label className="text-lg text-gray-800 font-medium block mb-2">Category</label>
                {categories.map((category) => (
                    <div className="flex items-center mb-1" key={category}>
                        <input
                            type="radio"
                            name="category"
                            value={category}
                            checked={filters.category === category}
                            onChange={handleFilterChange}
                            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{category}</span>
                    </div>
                ))}
            </div>

            {/* Gender */}
            <div className="mb-6">
                <label className="text-lg text-gray-800 font-medium block mb-2">Gender</label>
                {genders.map((gender) => (
                    <div className="flex items-center mb-1" key={gender}>
                        <input
                            type="radio"
                            name="gender"
                            value={gender}
                            checked={filters.gender === gender}
                            onChange={handleFilterChange}
                            className="mr-2 h-4 w-4 text-blue-500 focus:ring-blue-500"
                        />
                        <span className="text-gray-700 capitalize">{gender}</span>
                    </div>
                ))}
            </div>

            {/* Colors */}
            <div className="mb-6">
                <label className="text-lg text-gray-800 font-medium block mb-2">Color</label>
                <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                        <button
                            key={color}
                            type="button"
                            onClick={() => handleColorChange(color)}
                            style={{ backgroundColor: color.toLowerCase() }}
                            className={`w-8 h-8 rounded-full border border-gray-300 transition hover:scale-110 ${
                                filters.Color.includes(color) ? "ring-2 ring-offset-2 ring-blue-500" : ""
                            }`}
                            title={color}
                        />
                    ))}
                </div>
            </div>

            {/* Size */}
            <div className="mb-6">
                <label className="text-lg text-gray-800 font-medium block mb-2">Size</label>
                {sizes.map((size) => (
                    <div className="flex items-center mb-1" key={size}>
                        <input
                            type="checkbox"
                            name="size"
                            value={size}
                            checked={filters.size.includes(size)}
                            onChange={handleFilterChange}
                            className="mr-2 h-4 w-4 text-blue-500 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{size}</span>
                    </div>
                ))}
            </div>

            {/* Materials */}
            <div className="mb-6">
                <label className="text-lg text-gray-800 font-medium block mb-2">Materials</label>
                {materials.map((material) => (
                    <div className="flex items-center mb-1" key={material}>
                        <input
                            type="checkbox"
                            name="material"
                            value={material}
                            checked={filters.material.includes(material)}
                            onChange={handleFilterChange}
                            className="mr-2 h-4 w-4 text-blue-500 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{material}</span>
                    </div>
                ))}
            </div>

            {/* Brands */}
            <div className="mb-6">
                <label className="text-lg text-gray-800 font-medium block mb-2">Brands</label>
                {brands.map((brand) => (
                    <div className="flex items-center mb-1" key={brand}>
                        <input
                            type="checkbox"
                            name="brand"
                            value={brand}
                            checked={filters.brand.includes(brand)}
                            onChange={handleFilterChange}
                            className="mr-2 h-4 w-4 text-blue-500 rounded focus:ring-blue-500"
                        />
                        <span className="text-gray-700">{brand}</span>
                    </div>
                ))}
            </div>

            {/* Price Range */}
            <div className="mb-8">
                <label className="block text-gray-800 text-lg font-medium mb-2">Max Price: ${price}</label>
                <input
                    type="range"
                    name="maxPrice" // Matches state key
                    min={0}
                    max={1000}
                    step={10}
                    value={price}
                    onChange={handleFilterChange}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                    <span>$0</span>
                    <span>$1000</span>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebar;
