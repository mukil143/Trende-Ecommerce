import React from "react";
import { useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { useDispatch } from "react-redux";
import { fetchAllProducts } from "../../slices/AdminProductSlice";
const AddProductPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [colorInput, setColorInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    sizes: [],
    colors: [],
    category: "",
    images: [],
    material: "",
    collections: "",
    brand: "",
    gender: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]:
        name === "price"
          ? Number(value) || 0
          : name === "countInStock"
          ? parseInt(value || "0", 10)
          : value,
    }));
  };

  const handleSizeInputChange = (val) => {
    setSizeInput(val);
    setProductData((prev) => ({
      ...prev,
      sizes: val
        .toUpperCase()
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    }));
  };

  const handleColorInputChange = (val) => {
    setColorInput(val);
    setProductData((prev) => ({
      ...prev,
      colors: val
        .toUpperCase()
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
    }));
  };

  // const handleImageUpload = async (e) => {
  //   const file = e.target.files?.[0];
  //   if (!file) return;

  //   try {
  //     setIsSubmitting(true);
  //     // build form data with the exact field name expected by multer: "image"
  //     const formData = new FormData();
  //     formData.append("image", file);

  //     // Optional: show a temporary preview immediately (local URL)
  //     const previewUrl = URL.createObjectURL(file);
  //     setProductData((prev) => ({
  //       ...prev,
  //       // keep existing images and show preview while upload in progress
  //       images: [
  //         ...(prev.images || []),
  //         { url: previewUrl, alt: file.name, uploading: true },
  //       ],
  //     }));

  //     // POST the formData — DO NOT set Content-Type, axios/browser will handle it
  //     const response = await axios.post(
  //       `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
  //       formData,
  //       {
  //         headers: {
  //           // only send authorization if your route requires it
  //           Authorization: `Bearer ${localStorage.getItem("userToken") || ""}`,
  //         },
  //       }
  //     );

  //     // response.data.imageUrl contains the cloudinary URL
  //     const imageUrl = response.data?.imageUrl;
  //     if (!imageUrl) throw new Error("Upload failed: no imageUrl returned");

  //     // replace the preview item (uploading: true) with actual uploaded url
  //     setProductData((prev) => {
  //       const imgs = prev.images ? [...prev.images] : [];
  //       // find first uploading preview we added (by file.name or uploading flag)
  //       const idx = imgs.findIndex((img) => img.uploading);
  //       if (idx > -1) {
  //         if (imgs[idx].url) URL.revokeObjectURL(imgs[idx].url);
  //         imgs[idx] = { url: imageUrl, alt: file.name, uploading: false };
  //       } else {
  //         imgs.push({ url: imageUrl, alt: file.name, uploading: false });
  //       }

  //       return { ...prev, images: imgs };
  //     });

  //     // cleanup preview object url
  //     URL.revokeObjectURL(previewUrl);

  //     console.log("Uploaded image URL:", imageUrl);
  //     return imageUrl;
  //   } catch (err) {
  //     console.error("Image upload failed:", err);
  //     // optional: remove preview placeholder if upload fails
  //     setProductData((prev) => ({
  //       ...prev,
  //       images: (prev.images || []).filter((img) => !img.uploading),
  //     }));
  //     alert("Image upload failed. Try again.");
  //     return null;
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 1. Create a unique ID for this specific upload attempt
    const tempId = Date.now() + Math.random();
    const previewUrl = URL.createObjectURL(file);

    try {
      setIsSubmitting(true); // Optional: Only if you want to block the whole form

      // 2. Add Preview immediately with the tempId
      setProductData((prev) => ({
        ...prev,
        images: [
          ...(prev.images || []),
          {
            url: previewUrl,
            alt: file.name,
            uploading: true,
            tempId: tempId, // 👈 Critical for tracking
          },
        ],
      }));

      // 3. Prepare FormData
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken") || ""}`,
          },
        }
      );

      const imageUrl = response.data?.imageUrl;
      if (!imageUrl) throw new Error("Upload failed");

      // 4. Update ONLY the specific image using tempId
      setProductData((prev) => ({
        ...prev,
        images: prev.images.map((img) => {
          // Find the specific image by ID
          if (img.tempId === tempId) {
            return {
              url: imageUrl,
              alt: file.name,
              uploading: false,
              // We drop tempId here as it's no longer needed
            };
          }
          return img;
        }),
      }));


      // Cleanup memory
      URL.revokeObjectURL(previewUrl);
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Image upload failed.");

      // 5. Cleanup: Remove the failed preview by ID
      setProductData((prev) => ({
        ...prev,
        images: (prev.images || []).filter((img) => img.tempId !== tempId),
      }));
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleSubmit  = async (e)=>{
    e.preventDefault();
    if (!productData.name?.trim()) {
      return alert("Product name is required.");
    }
    if (!productData.images || productData.images.length === 0) {
      return  alert("At least one product image is required.");
    }
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/admin/products`,
        productData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("userToken") || ""}`,
          },
        }
      );
      alert("Product added successfully!");
      await dispatch(fetchAllProducts());
      navigate("/admin/products");

    } catch (error) {
      console.error("Add product failed:", error);
      alert("Add product failed. Try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-4 shadow-md rounded-lg">
      <button
        onClick={() => {
          window.history.back();
        }}
        className="bg-blue-500 text-white px-2 rounded py-1 mb-2"
      >
        {"<-"}Back
      </button>
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Add Product</h1>
      <form onSubmit={handleSubmit}>
        {/* Name */}
        <label className="flex flex-col mb-4">
          <span className="font-semibold mb-2">Product Name</span>
          <input
            name="name"
            value={productData.name ?? ""}
            onChange={handleChange}
            className="border-2 border-gray-200 w-full p-2 rounded"
          />
        </label>
        {/* Name */}
        <label className="flex flex-col mb-4">
          <span className="font-semibold mb-2">Brand Name</span>
          <input
            name="brand"
            value={productData.brand ?? ""}
            onChange={handleChange}
            className="border-2 border-gray-200 w-full p-2 rounded"
          />
        </label>

        {/* Description */}
        <label className="flex flex-col mb-4">
          <span className="font-semibold mb-2">Description</span>
          <textarea
            name="description"
            value={productData.description ?? ""}
            onChange={handleChange}
            className="resize-none h-32 border-2 border-gray-200 w-full p-2 rounded"
          />
        </label>

        {/* Price */}
        <label className="flex flex-col mb-4">
          <span className="font-semibold mb-2">Price</span>
          <input
            name="price"
            value={productData.price ?? ""}
            onChange={handleChange}
            type="number"
            step="10"
            className="border-2 border-gray-200 w-full p-2 rounded"
          />
        </label>

        {/* Count in stock */}
        <label className="flex flex-col mb-4">
          <span className="font-semibold mb-2">Count in Stock</span>
          <input
            name="countInStock"
            value={productData.countInStock ?? ""}
            onChange={handleChange}
            type="number"
            className="border-2 border-gray-200 w-full p-2 rounded"
          />
        </label>

        {/* SKU */}
        <label className="flex flex-col mb-4">
          <span className="font-semibold mb-2">SKU</span>
          <input
            name="sku"
            value={productData.sku}
            onChange={handleChange}
            type="text"
            className="border-2 border-gray-200 w-full p-2 rounded"
          />
        </label>

        {/* Sizes */}
        <label className="flex flex-col mb-4">
          <span className="font-semibold mb-2">Size (comma separated)</span>
          <input
            value={sizeInput ?? ""}
            onChange={(e) => handleSizeInputChange(e.target.value)}
            className="border-2 border-gray-200 w-full p-2 rounded"
            placeholder="S, M, L"
          />
        </label>

        {/* Colors */}
        <label className="flex flex-col mb-4">
          <span className="font-semibold mb-2">Colors (comma separated)</span>
          <input
            value={colorInput ?? ""}
            onChange={(e) => handleColorInputChange(e.target.value)}
            className="border-2 border-gray-200 w-full p-2 rounded"
            placeholder="RED, BLUE"
          />
        </label>
        {/* Gender */}
        <label className="flex flex-col mb-4">
          <span className="font-semibold mb-2">Gender</span>
          <select
            name="gender"
            value={productData.gender ?? ""}
            onChange={handleChange}
            className="border-2 border-gray-200 w-full p-2 rounded"
          >
            <option value="" disabled>Select Gender</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="unisex">Unisex</option>
          </select>
        </label>
        {/* Category */}
        <label className="flex flex-col mb-4">
          <span className="font-semibold mb-2">Category</span>
          <input
            name="category"
            value={productData.category ?? ""}
            onChange={handleChange}
            className="border-2 border-gray-200 w-full p-2 rounded"
          />
        </label>
        {/* Materials */}
        <label className="flex flex-col mb-4">
          <span className="font-semibold mb-2">Material</span>
          <input
            name="material"
            value={productData.material ?? ""}
            onChange={handleChange}
            className="border-2 border-gray-200 w-full p-2 rounded"
          />
        </label>
        {/* Collections */}
        <label className="flex flex-col mb-4">
          <span className="font-semibold mb-2">Collections</span>
          <input
            name="collections"
            value={productData.collections ?? ""}
            onChange={handleChange}
            className="border-2 border-gray-200 w-full p-2 rounded"
          />
        </label>

        {/* Image upload (unique id) */}
        <label className="flex flex-col mb-4">
          <span className="font-semibold mb-2">Upload image</span>
          <input
            id="productImageUpload"
            type="file"
            accept="image/*"

            onChange={handleImageUpload}
          />

          <div className="flex space-x-2 mb-4 mt-2">
            {productData.images?.map((image, index) => (
              <div key={index} className="relative w-20 h-20 group">
                <img
                  src={image.url}
                  alt={image.alt || "Product Image"}
                  className={`w-full h-full object-cover rounded-md shadow ${
                    image.uploading ? "opacity-50" : ""
                  }`}
                />

                {/* 2. Loading Overlay (Only shows if image.uploading is true) */}
                {image.uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-md transition-all z-10">
                    {/* Simple CSS Spinner */}
                    <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!confirm("Remove this image?")){
                      return;
                    }
                    setProductData((prev) => ({
                      ...prev,
                      images: prev.images.filter((_, i) => i !== index),
                    }));
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-md hover:bg-red-600 transition-colors z-20"
                >
                  {" "}
                  X
                </button>
              </div>
            ))}
          </div>
        </label>

        <button
          type="submit"
          className="bg-green-500 w-full text-white py-2 px-4 rounded hover:bg-green-600"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProductPage;
