import React, { useEffect } from "react";
import { Link } from "react-router";
import OrderLoader from "../Common/OrderLoader.jsx";

const ProductGrid = ({ products, loading, error,pages,page,handlePagination,total }) => {
  if (loading) {
    return (
      <div className="max-w-full min-h-screen flex justify-center ">
        <OrderLoader />
      </div>
    );
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
 useEffect(() => {
  const el = document.getElementById("app-scroll");
  (el || window).scrollTo({ top: 0, behavior: "smooth" });
}, [page]);

  return (
    <section className="">
       <div className="py-2 bg-transparent">
      {pages>1 && (
        <div className="flex justify-center items-center">
          <button  disabled={page<=1} onClick={()=>{handlePagination(page-1)} } className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l">
            Previous
          </button>
          <span className="text-gray-800 font-bold py-2 px-4">{page}/{pages} pages</span>
          <button disabled={page>=pages}  onClick={()=>{
            handlePagination(page+1);
          }} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r">
            Next
          </button>
        </div>
      )}
    </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-center items-center lg:grid-cols-4 gap-4 ">
        {products.map((item, idx) => (
          <Link
            key={idx}
            to={`/product/${item._id}`}
            className=" w-full justify-start overflow-hidden flex flex-col"
          >
            <div className="bg-white flex flex-col p-4 rounded-lg">
              <div className="w-full overflow-hidden h-96 mb-4">
                {item.images.length > 0 && (
                  <img
                    className="w-full h-full object-cover rounded-lg"
                    src={item.images[0].url}
                    alt={item.images[0].alt}
                  />
                )}
              </div>
              <div className="mt-2">
                <h3
                  className="text-lg font-semibold text-gray-900 mb-1 line-clamp-2 h-[3.5rem]"
                  title={item.name}
                >
                  {item.name}
                </h3>
                <p className="text-gray-600  text-smtracking-tighter">
                  ₹{item.price}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <div className="py-2 bg-transparent">
      {pages>1 && (
        <div className="flex justify-center items-center">
          <button  disabled={page<=1} onClick={()=>{handlePagination(page-1)} } className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-l">
            Previous
          </button>
          <span className="text-gray-800 font-bold py-2 px-4">{page}/{pages} pages</span>
          <button disabled={page>=pages}  onClick={()=>{
            handlePagination(page+1);
          }} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded-r">
            Next
          </button>
        </div>
      )}
    </div>
    </section>
);
};

export default ProductGrid;
