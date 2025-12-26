import mongoose from "mongoose";
import express from "express";
import protect from "../Middleware/authMiddleware.js";
import { admin } from "../Middleware/authMiddleware.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import Order from "../models/Order.js";
import Checkout from "../models/Checkout.js";

const router = express.Router();

// //@route POST /api/admin/
// //@desc create a new user
// //@access Private/Admin

// router.post("/",[protect,admin],async(req,res)=>{
//     try {

//     } catch (error) {

//     }
// })

//@route GET /api/admin/users
//@desc Get all users
//@access Private/Admin

router.get("/", [protect, admin], async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      return res.status(404).json({ message: "No users found" });
    }
    return res.status(200).json(users);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

//@route POST /api/admin
//@desc Create a user and add it to the database
//@access Private/Admin

router.post("/", [protect, admin], async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    const newUser = new User({
      name,
      email,
      password,
      role,
    });

    await newUser.save();
    return res.status(201).json({ message: "User created successfully",newUser });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});



//@route PUT /api/admin/:id
//@desc Update a user {only Admin} -Name,Email,Password,Role
//@access Private/Admin
router.put("/:id",[protect,admin],async(req,res)=>{
    const {name,email,role}=req.body;
    try {
        const userId= req.params.id;

        const user=await User.findById(userId);

        if(!user){
            return res.status(404).json({message:"User not found"});
        }

        if(user){
            user.name=name || user.name;
            user.email=email || user.email;
            user.role=role || user.role;
        }
        const updatedUser = await user.save();
        return res.status(200).json({message:"User updated successfully",user:updatedUser});
    } catch (error) {   
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})


//@route DELETE /api/admin/:id
//@desc Delete a user {only Admin}
//@access Private/Admin
router.delete("/:id", [protect, admin], async (req, res) => {
  const userId = req.params.id;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully",id:deletedUser._id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
