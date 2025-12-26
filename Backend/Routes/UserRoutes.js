import express from "express";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import protect from "../Middleware/authMiddleware.js";


const router = express.Router();
router.use(express.json());


// @route POST /api/users/register
//@desc Register user
//@access Public

router.post("/register",async (req,res)=>{
    const {name, email, password} = req.body;

    try {
        const user = await User.findOne({email})
        if(user){
            return res.status(400).json({message:"User already exists"});
        }
        const newUser = new User({name,email,password});
        await newUser.save();

        // Create JWT payload

        const payload={
            user:{
                id:newUser._id,
                role:newUser.role,
            }
        }

        jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"10d"},(err,token)=>{
            if(err) throw err;
            res.status(201).json({
                user:{
                    id:newUser._id,
                    name:newUser.name,
                    email:newUser.email,
                    role:newUser.role
                },
                token,
            })
        })
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
})


// @route POST /api/users/login
//@desc Authentication user
//@access Public

router.post("/login",async(req,res)=>{
    const {email,password} = req.body;

    try {
        //Find user by email

        const user=await User.findOne({email});

        if(!user){
            return res.status(400).json({message:"User does not exist"});
        }

        //Check if password is correct

        const isMatch = await user.matchPassword(password);

        if(!isMatch){
            return res.status(400).json({message:"Invalid Credentials"});
        }


        const payload={
            user:{
                id:user._id,
                role:user.role,
            }
        }

        jwt.sign(payload,process.env.JWT_SECRET,{expiresIn:"1d"},(err,token)=>{
            if(err) throw err;
            res.status(200).json({
                user:{
                    id:user._id,
                    name:user.name,
                    email:user.email,
                    role:user.role
                },
                token,
            })
        })



    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server Error"});
    }
})



//@route GET /api/users/profile
//@desc Get logged-in user profile
//@access Private

router.get("/profile",protect,async(req,res)=>{
    console.log(req.user);
    res.json(req.user);
})




export default router;
