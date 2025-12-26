// EditProductPage.jsx (fixed)
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom"; // fixed import
import { fetchProductById } from "../../slices/productSlice";
import {
  updateProductAdmin,
  uploadAdminProductImage,
} from "../../slices/AdminProductSlice";
import axios from "axios";

const EditProductPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [colorInput, setColorInput] = useState("");
  const [sizeInput, setSizeInput] = useState("");

  // safe default values for product form (prevents undefined values)
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
    materials: [],
    collections: "",
    brand: "",
    gender: "",
  });

  useEffect(() => {
    if (!id) return;

    const fetchProductDetails = async () => {
      try {
        const res = await dispatch(fetchProductById(id)).unwrap();
        // merge to avoid dropping missing fields
        setProductData((prev) => ({ ...prev, ...res }));
        // console.log("Fetched product details:", res);
        // guard arrays before join
        setColorInput((res.colors || []).join(","));
        setSizeInput((res.sizes || []).join(","));
      } catch (err) {
        console.error("Failed to load product:", err);
      }
    };

    fetchProductDetails();
  }, [id, dispatch]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsSubmitting(true);
      // build form data with the exact field name expected by multer: "image"
      const formData = new FormData();
      formData.append("image", file);

      // Optional: show a temporary preview immediately (local URL)
      const previewUrl = URL.createObjectURL(file);
      setProductData((prev) => ({
        ...prev,
        // keep existing images and show preview while upload in progress
        images: [
          ...(prev.images || []),
          { url: previewUrl, alt: file.name, uploading: true },
        ],
      }));

      // POST the formData — DO NOT set Content-Type, axios/browser will handle it
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        {
          headers: {
            // only send authorization if your route requires it
            Authorization: `Bearer ${localStorage.getItem("userToken") || ""}`,
          },
        }
      );

      // response.data.imageUrl contains the cloudinary URL
      const imageUrl = response.data?.imageUrl;
      if (!imageUrl) throw new Error("Upload failed: no imageUrl returned");

      // replace the preview item (uploading: true) with actual uploaded url
      setProductData((prev) => {
        const imgs = prev.images ? [...prev.images] : [];
        // find first uploading preview we added (by file.name or uploading flag)
        const idx = imgs.findIndex((img) => img.uploading);
        if (idx > -1) {
          if (imgs[idx].url) URL.revokeObjectURL(imgs[idx].url);
          imgs[idx] = { url: imageUrl, alt: file.name };
        } else {
          imgs.push({ url: imageUrl, alt: file.name });
        }

        return { ...prev, images: imgs };
      });

      // cleanup preview object url
      URL.revokeObjectURL(previewUrl);

      console.log("Uploaded image URL:", imageUrl);
      return imageUrl;
    } catch (err) {
      console.error("Image upload failed:", err);
      // optional: remove preview placeholder if upload fails
      setProductData((prev) => ({
        ...prev,
        images: (prev.images || []).filter((img) => !img.uploading),
      }));
      alert("Image upload failed. Try again.");
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  // unified change handler; ensure numeric fields are numbers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({
      ...prev,
      [name]: name === "price"
          ? Number(value) || 0
          : name === "countInStock"
          ? parseInt(value || "0", 10)
          : value,
    }));
  };

  // sizes/color inputs update both the text field and the parsed array in productData
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    // basic client-side validation (optional)
    if (!productData.name?.trim()) {
      return alert("Product name is required.");
    }
    if (!productData.images || productData.images.length === 0) {
      if (!confirm("No images uploaded. Continue anyway?") === false) return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        ...productData,
        sizes: productData.sizes || [],
        colors: productData.colors || [],
      };

      console.log("Submitting payload:", payload);

      // dispatch and unwrap — unwrap throws if the thunk was rejected
      const updated = await dispatch(
        updateProductAdmin({ id, productdata: payload })
      ).unwrap();

      // `updated` is the resolved payload returned by the thunk
      console.log("Update success:", updated);
      alert("Product updated successfully!");

      // optional: navigate to product page or refresh list
      // navigate(`/admin/products/${id}`);
    } catch (err) {
      // unwrap() throws the rejected value (or an Error)
      const message =
        (err && (err.message || err)) ||
        "Failed to update product. Please try again.";
      console.error("Update failed:", err);
      alert(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    return () => {
      productData.images?.forEach(
        (img) => img.uploading && img.url && URL.revokeObjectURL(img.url)
      );
    };
  }, []);

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
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Edit Product</h1>
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
            step="0.01"
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
              <div key={index} className="relative">
                <img
                  src={image.url}
                  alt={image.alt || "Product Image"}
                  className="w-20 h-20 object-cover rounded-md shadow"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    if (!confirm("Remove this image?")) return;
                    setProductData((prev) => ({
                      ...prev,
                      images: prev.images.filter((_, i) => i !== index),
                    }));
                  }}
                  className="absolute top-0 right-0 bg-red-500 text-white px-1 rounded-full"
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
          {isSubmitting ? "Updating..." : "Update Product"}
        </button>
      </form>
    </div>
  );
};

export default EditProductPage;
