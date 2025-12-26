import mongoose from "mongoose";
import Order from "../models/Order.js";
import express from "express";
import protect from "../Middleware/authMiddleware.js";

const router = express.Router();

//@route GET /api/orders/my-orders
//@desc Get logged in user orders
//@access Private

router.get("/my-orders",[protect],async(req,res)=>{
    try {
        const userId=req.user._id;

        //find the order by user id
        const orders=await Order.find({user:userId}).sort({createdAt:-1});

        if(!orders){
            return res.status(404).json({message:"No orders found"});
        }
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})


//@route GET /api/orders/:id
//@desc Get order by id
//@access Private

router.get("/:id",[protect],async(req,res)=>{
    try {
        const orderId = req.params.id;//get the order id from the url
        const order = await Order.findById(orderId).populate("user","name email");//find the order by id
        if(!order){
            return res.status(404).json({message:"Order not found"});
        }
        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})


export default router;