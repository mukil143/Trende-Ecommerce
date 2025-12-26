import jwt from "jsonwebtoken"
import User from "../models/User.js"

//Middlewares to protect Routes
const protect = async (req,res,next)=>{
    let token;

    if(req.headers.authorization && req.headers.authorization.startsWith("Bearer")){
        try {
            token = req.headers.authorization.split(" ")[1]; //Bearer token is separated by space

            const decoded = await jwt.verify(token,process.env.JWT_SECRET);
            // console.log(decoded);

            req.user = await User.findById(decoded.user.id).select("-password");
           return next();
        } catch (error) {
            console.log(error);
           return res.status(401).send({message:"Not authorized, token failed"});
        }
    }else{
       return res.status(401).send({message:"Not authorized, no token"});
    }

}


// Middleware to Check the User

export const admin=(req,res,next)=>{
    if(req.user && req.user.role === "admin"){
        next();
    }else{
       return res.status(401).send({message:"Not authorized as an admin"});
    }
}


export default protect;
