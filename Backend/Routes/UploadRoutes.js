import express from "express"
import multer from "multer"
import { v2 as cloudinary } from 'cloudinary'
import dotenv from "dotenv";
import streamifier from "streamifier"

dotenv.config();

const router = express.Router();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_SECRET_KEY
})

//Multer setup using memory storage
const storage = multer.memoryStorage();

const upload=multer({storage})

///api/upload
router.post("/",upload.single("image"),async(req,res)=>{
    console.log(req.file.buffer);
    try {
        if(!req.file){
            return res.status(400).json({message:"No file uploaded"});
        }

        //Function to handle the stream upload to cloudinary
        const streamUpload=(fileBuffer)=>{
            return new Promise((resolve,reject)=>{
                const stream = cloudinary.uploader.upload_stream({
                    folder:"trende_products",
                    resource_type:"image"
                 },(err,result)=>{
                    if(result){
                        resolve(result)
                    }else{
                        reject(err)
                    }
                })
                //use streamifier to convert  file buffer to stream
                streamifier.createReadStream(fileBuffer).pipe(stream)
            })

        }

        //Call the stream upload function
        const result = await streamUpload(req.file.buffer)
        console.log(result);
        //Return the result
        if(result){
            return res.status(200).json({
                imageUrl:result.secure_url
            })
        }
        else{
            return res.status(400).json({message:"File upload failed"})
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})


export default router;
