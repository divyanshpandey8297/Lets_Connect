import jwt from "jsonwebtoken"
import { catchAsyncError } from "./catchAsyncError.middleware.js"
import { User } from "../models/user.js"


export const isAuthenticated=catchAsyncError(async(req,res,next)=>{

    const {token}=req.cookies;
    if(!token){
        return res.status(401).json({
            success:false,
            message:"USer is Not Logged In"
        })
    }
    const decoded =jwt.verify(token,process.env.JWT_SECRET_KEY);
    if(!decoded){
        return res.status(403).json({
            success:false,
            message:"Token Verificatin is failed"
        })
    }
    const user=await User.findById(decoded.id);
    req.user=user;
    next();


})