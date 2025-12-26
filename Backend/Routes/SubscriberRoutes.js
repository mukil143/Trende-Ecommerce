import mongoose from "mongoose";
import Subscriber from "../models/Subscriber.js";
import express from 'express'

const router = express.Router();

//@route POST /api/subscribers
//@desc subcribe to newsletter
//@access Public

router.post("/subscribe",async (req,res)=>{
    const {email} = req.body;
    try {
        const subscriber = await Subscriber.findOne({email});
        if(subscriber){
            return res.status(400).json({message:"You are already subscribed"});
        }

        const newSubscriber = new Subscriber({email});
        await newSubscriber.save();
        return res.status(200).json({message:"You are now subscribed"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})


export default router;