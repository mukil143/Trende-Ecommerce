import mongoose from "mongoose";
import Product from "../models/Product.js";
import express from "express";
import protect from "../Middleware/authMiddleware.js";
import { admin } from "../Middleware/authMiddleware.js";

const router = express.Router();


//@route GET /api/admin/products
//@desc Get all products details {only admin}
//@access Private/Admin
router.get("/",[protect,admin],async(req,res)=>{
    try {
        const products = await Product.find({}).sort({createdAt:-1});
        if(!products){
            return res.status(404).json({message:"No products found"});
        }
        console.log(products);
        return res.status(200).json(products);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})


//@route PUT /api/admin/products/:id
//@desc Update a product {only admin} -Name,Description,Price,DiscountPrice,CountInStock,Category,Brand,Sizes,Colors,Collections,Material,Gender,Images,IsFeatured,IsPublished,Tags,Dimensions,Weight,SKU
//@access Private/Admin
// router.put("/:id",[protect,admin],async(req,res)=>{
//     const productId = req.params.id;
//     try {
//         const product = await Product.findById(productId);
//         if(!product){
//             return res.status(404).json({message:"Product not found"});
//         }
//         return res.status(200).json(product);
//     } catch (error) {

//     }
// })


//@route DELETE /api/admin/products/:id
//@desc Delete a product {only admin}
//@access Private/Admin
router.delete("/:id",[protect,admin],async(req,res)=>{
    const productId = req.params.id;
    try {
        const product = await Product.findById(productId);
        if(!product){
            return res.status(404).json({message:"Product not found"});
        }
        await Product.findByIdAndDelete(productId);
        return res.status(200).json({message:"Product deleted successfully",id:productId});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})


//@route POST /api/admin/products
//@desc Create a product
//@access Private/Admin
router.post("/", [protect, admin], async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;

    const product = new Product({
      _id: new mongoose.Types.ObjectId(),
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
      user: req.user.id, //reference to the admin user who created it
    });

    const createdProduct = await product.save();
    console.log(createdProduct);
    res.status(201).json(createdProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// @route PUT /api/products/update/:id
// @desc Update a product
// @access Private/Admin
router.put("/:id", [protect, admin], async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    } = req.body;
    console.log("PUT /api/products/:id - req.body:", req.body);

    // Find the product by ID
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const updates = {
      name,
      description,
      price,
      discountPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimensions,
      weight,
      sku,
    };

    for (const key in updates) {
      if (updates[key] !== undefined) {
        product[key] = updates[key];
      }
    }

    // // Update the product fields
    // product.name = name || product.name;
    // product.description = description || product.description;
    // product.price = price || product.price;
    // product.discountPrice = discountPrice || product.discountPrice;
    // product.countInStock = countInStock || product.countInStock;
    // product.category = category || product.category;
    // product.brand = brand || product.brand;
    // product.sizes = sizes || product.sizes;
    // product.colors = colors || product.colors;
    // product.collections = collections || product.collections;
    // product.material = material || product.material;
    // product.gender = gender || product.gender;
    // product.images = images || product.images;
    // product.isFeatured = isFeatured !== undefined ? isFeatured : product.isFeatured;
    // product.isPublished = isPublished !== undefined ? isPublished : product.isPublished;
    // product.tags = tags || product.tags;
    // product.dimensions = dimensions || product.dimensions;
    // product.weight = weight || product.weight;
    // product.sku = sku || product.sku;

    // Save the updated product

    const updatedProduct = await product.save();
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server message" });
  }
});


export default router;
