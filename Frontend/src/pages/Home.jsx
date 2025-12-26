import React from "react";
import Hero from "../components/Layout/Hero.jsx";
import GenderCollectionSection from "../components/Products/GenderCollectionSection.jsx";
import NewArrival from "../components/Products/NewArrival.jsx";
import ProductDetails from "../components/Products/ProductDetails.jsx";
import ProductGrid from "../components/Products/ProductGrid.jsx";
import FeaturedCollection from "../components/Products/FeaturedCollection.jsx";
import FeaturedSection from "../components/Products/FeaturedSection.jsx";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { fetchProductsByFilters } from "../slices/productSlice.js";
import axios from "axios";
import { useState } from "react";
import OrderLoader from "../components/Common/OrderLoader.jsx";


// const placeholderProducts = [
//   {
//       _id:1,
//       name:"Stylish Jacket",
//       price: 320,
//       images:
//         {
//           url:"https://picsum.photos/500/600?random=1",
//           alt:"Stylish Jacket Image"
//         }

//     },
//     {
//       _id:2,
//       name:"Casual Sneakers",
//       price: 150,
//       images:
//         {
//           url:"https://picsum.photos/500/600?random=2",
//           alt:"Casual Sneakers Image"
//         }

//     },
//     {
//       _id:3,
//       name:"Elegant Watch",
//       price: 250,
//       images:
//         {
//           url:"https://picsum.photos/500/600?random=3",
//           alt:"Elegant Watch Image"
//         }

//     },
//     {
//       _id:4,
//       name:"Trendy Sunglasses",
//       price: 80,
//       images:
//         {
//           url:"https://picsum.photos/500/600?random=4",
//           alt:"Trendy Sunglasses Image"
//         }

//     },
//     {
//       _id:5,
//       name:"Slim-Fit Easy-Iron Shirt",
//       price: 45,
//       images:
//         {
//           url:"https://picsum.photos/500/600?random=5",
//           alt:"Slim-Fit Easy-Iron Shirt Image"
//         }

//     },
//     {
//       _id:6,
//       name:"Classic Leather Belt",
//       price: 25,
//       images:
//         {
//           url:"https://picsum.photos/500/600?random=6",
//           alt:"Classic Leather Belt Image"
//         }

//     },
//     {
//       _id:7,
//       name:"Casual Chinos",
//       price: 60,
//       images:
//         {
//           url:"https://picsum.photos/500/600?random=7",
//           alt:"Casual Chinos Image"
//         }

//     },
//     {
//       _id:8,
//       name:"Sporty Backpack",
//       price: 70,
//       images:
//         {
//           url:"https://picsum.photos/500/600?random=8",
//           alt:"Sporty Backpack Image"
//         }

//     },
// ]

const Home = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector((state) => state.products);
  // console.log(products); //useSelector((state)=>state.productsList);
  const [bestSellerProduct, setBestSellerProduct] = useState(null);



  useEffect(() => {

    //fetch products for specific collection
    dispatch(fetchProductsByFilters({
      gender:"men",
      limit:8,
    }),[]);



    //fetch best seller products
    const fetchBestSellerProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/products/best-seller`);
        // console.log(response.data);
        setBestSellerProduct(response.data);
      } catch (error) {
        console.error("Error fetching best seller products:", error);
      }
    }
    fetchBestSellerProducts();
  }, [dispatch]);

  return (
    <>
      <div className="" >
        <Hero />
        <GenderCollectionSection />
        <NewArrival />
        <h2 className="text-3xl text-center font-bold mb-4 mt-12 ">
          Best Seller
        </h2>
        {bestSellerProduct ? <ProductDetails productId={bestSellerProduct._id} /> : <OrderLoader/> }

        <div className="container mx-auto px-4">
          <h2 className=" text-2xl  md:text-3xl font-bold text-center mb-4">
            Top Wears For Women
          </h2>
          <ProductGrid products={products} loading={loading} error={error} />
        </div>
        <FeaturedCollection />
        <FeaturedSection />
      </div>
    </>
  );
};

export default Home;
