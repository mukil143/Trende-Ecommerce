import express from "express";
import Product from "../models/Product.js";
import mongoose from "mongoose";
import protect from "../Middleware/authMiddleware.js";
import { admin } from "../Middleware/authMiddleware.js";

const router = express.Router();





// @route DELETE /api/products/:id
// @desc Delete a product
// @access Private/Admin

router.delete("/delete/:id", [protect, admin], async (req, res) => {
  try {
    // Get the product ID from the request parameters
    const productId = req.params.id;
    // Find and delete the product by ID
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//@route GET /api/products
//@desc Get all products with filtering,searching,pagination
//@access Public

router.get("/", async (req, res) => {
  try {
    const {
      collection,
      size,
      Color,
      gender,
      minPrice,
      maxPrice,
      search,
      page = 1,
      limit =10,
      sortBy,
      category,
      material,
      brand,
    } = req.query;

    const skip = (page - 1) * limit;

    let query = {};

    // Filtering
    if (collection && collection.toLocaleLowerCase() !== "all") {
      query.collections = collection;
    }

    if (category && category.toLocaleLowerCase() !== "all") {
      query.category = category;
    }//checked

    if (material) {
      query.material = { $in: material.split(",") };
    }

    if (brand) {
      query.brand = { $in: brand.split(",") };
    }

    if (size) {
      query.sizes = { $in: size.split(",") };
    }

    if (Color) {
      query.colors = { $in: [Color] };
    }

    if (gender) {
      query.gender = gender;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Searching

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { tags: { $regex: search, $options: "i" } },
      ];
    }

    //Sorting logic

    
    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc":
          sort.price = 1;
          break;
        case "priceDesc":
          sort.price = -1;
          break;
        case "popularity":
          sort.price = -1; // Assuming popularity is based on price for now
          break;
        default:
          sort.createdAt = -1; // Default sorting by newest
          break;
      }
    }

    //fetch products and apply filtering,searching

    const products = await Product.find(query).sort(sort).skip(skip).limit(Number(limit) || 0);

    const total = await Product.countDocuments(query);
    res.status(200).json({products,total,page:Number(page)||1,pages:Math.ceil(total/Number(limit)) || 1});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });   
  } 
});


//@route GET /api/products/best-sellers
//@desc Get best-selling products
//@access Public

router.get("/best-seller", async (req, res) => {
  try {
    const product = await Product.findOne().sort({rating: -1});
    if(!product){
      return res.status(404).json({message:"No products found"});
    }else{
      res.status(200).json(product)
    }

    // res.status(200).json({ message: "Fetching best sellers" });
    // console.log("Fetching best sellers");
    // const bestSellers = await Product.find({}).sort({ rating: -1 }).limit(1);
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error")
  }
});


//@route GET /api/products/new-arrivals
//@desc Get newly added products 8 created date
//@access Public
router.get("/new-arrivals", async (req, res) => {
  try {
    const newarrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
    if(newarrivals.length===0){
      return res.status(404).json({message:"No products found"});
    }
    res.status(200).json(newarrivals);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
})

//@route GET /api/products/:id
//@desc Get a product by ID
//@access Public

router.get("/:id", async (req, res) => {
  try {
    const productId=req.params.id;
    const product=await Product.findById(productId);
    if(!product){
      return res.status(404).json({message:"Product not found"});
    }
    console.log(product);
    res.status(200).json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
})


//@route GET /api/products/similar/:id
//@desc Get similar products based on gender and category
//@access Public

router.get("/similar/:id", async (req, res) => {
  try {
    const {id} = req.params;

    const product = await Product.findById(id);

    if(!product){
      res.status(404).json({message:"Product not found"});
    }

    const similarProducts = await Product.find(
      {
        _id:{$ne:id}, // Exclude the current product
        gender:product.gender,
        category:product.category,
      }
    ).limit(4);

    res.status(200).json(similarProducts);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
    
  }
})




export default router;
