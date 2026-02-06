// import { catchAsyncError } from "../middleware/catchAsyncError.middleware";
// import { generateJwtToken } from "../utils/jwtToken";
// const bcrypt=require("bcryptjs")
// const User=require("../models/user")
// const generateJwtToken=require("../utils/jwtToken")
// const catchAsyncError=require("../middleware/catchAsyncError.middleware")
import {User} from '../models/user.js'
import bcrypt from "bcryptjs"
import { v2 as cloudinary } from 'cloudinary';

import { catchAsyncError } from "../middleware/catchAsyncError.middleware.js";
import { generateJwtToken } from '../utils/jwtToken.js';


export const signup=catchAsyncError(async (req, res, next ) => {
    const {fullName,email,password,confirmPassword}=req.body

    if(!fullName ||!email ||!password ||!confirmPassword   ){
        return res.status(400).json({
            success:false,
            message:"please Provide all the field"
        })
    }

    if(password !== confirmPassword ){
        return res.status(403).json({
            success:false,
            message:"Password Does not match"
        })
    }

    const emailRegex=/^\S+@\S+\.\S+$/;
    // const recentOtp=await OTP.find({email}).sort({createdAt:-1}).limit(1);


    if(!emailRegex.test(email)){
        return res.status(400).json({
            success:false,
            message:"INVALID EMAIL FORMAT",
        })
    }

    if(password.length < 8){
        return res.status(400).json({
            success:false,
            message:"Password Must be at least 8 character long",
        })
    }

    const isEmailAlreadyUsed=await User.findOne({email});
    console.log("isEmailAlreadyUsed",isEmailAlreadyUsed)

    if(isEmailAlreadyUsed){
        return res.status(400).json({
            success:false,
            message:"User is already found"
        })
    }




    const passwordHashed=await bcrypt.hash(password, 10)

    const user=await User.create({
        fullName,
        email,
        password:passwordHashed,
        avatar:{
            public_id:"",
            url:"",
        }
    })
    console.log("enter into the token information code");

generateJwtToken(user,"user Register Successsfully",200,res)


});







export const signin=catchAsyncError(async (req, res, next ) => {

    const {email,password}=req.body;

    if(!email ||!password){
        return res.status(400).json({
            succes:false,
            message:"Email and password is missing"
        })
    }

     const emailRegex=/^\S+@\S+\.\S+$/;
    // const recentOtp=await OTP.find({email}).sort({createdAt:-1}).limit(1);


    if(!emailRegex.test(email)){
        return res.status(400).json({
            success:false,
            message:"INVALID EMAIL FORMAT",
        })
    }

    if(password.length < 8){
        return res.status(400).json({
            success:false,
            message:"Password Must be at least 8 character long",
        })
    }
    console.log("before the userController")

    const userExit=await User.findOne({email});
    console.log("userExits is ",userExit);

    if(!userExit){
        return res.status(400).json({
            succes:false,
            message:"user is Not Found"
        })
    }
    const hashPassword=userExit?.password

    if(await bcrypt.compare(password,hashPassword)){

       generateJwtToken(userExit,"User is sucessFully logged In ",200,res)

    }
    else{
        return res.status(403).json({
            success:false,
            message:"Password Does Not Match"
        })
    }




});





export const signout=catchAsyncError(async (req, res, next ) => {
    // const {token}=req.user.id;
    res.status(200)
        .cookie("token","",{
            maxAge:0, //0-ms
            httpOnly:true,
            sameSite:"strict",
            secure:process.env.NODE_ENV !== "development" ? true:false,

        })
        .json({
            suceess:true,
            message:"User Logged Out Successfully",
        })
        



});


export const getUser=catchAsyncError(async (req, res, next ) => {
// const {email,password}=req.user.id;

const user=await User.findById(req.user._id);
res.status(200).json({
    suceess:true,
    user,
})


});
export const updateProfile=catchAsyncError(async (req, res, next ) => {
    const {fullName,email}=req.body;

    if(fullName?.length ===0 || email?.length==0){
        return res.status(400).json({
            succes:false,
            message:"fullName Or Email Can't Be empty"
        })
    }
    const avatar=req?.files?.avatar;
    let cloudinaryResponse={};
    const data={
        fullName:fullName?.trim(),
        email:email?.trim(),
        

    }

    if(avatar){
        try{
            const oldAvatarPublicId=req.user?.avatar?.public_id;
            if(oldAvatarPublicId && oldAvatarPublicId.length >0 ){
                await cloudinary.uploader.destroy(oldAvatarPublicId);
            }
            cloudinaryResponse=await cloudinary.uploader.upload(
                avatar.tempFilePath,
                {
                    folder:"Lets_Connect",
                    transformation:[
                        {width : 300 ,height:300 ,crop:"limit"},
                        {quality: "auto"},
                        {fetch_format:"auto"},
                    ],
                }

            )

        }
        catch(err){
            console.error(err)
            return res.status(500).json({
                success:false,
                message:"Failed to upload image in the cloudinary"
            })

        }
    }

    if(avatar && cloudinaryResponse?.public_id &&cloudinaryResponse?.secure_url){
        data.avatar={
            public_id: cloudinaryResponse.public_id,
            url:cloudinaryResponse.secure_url,
        };
    }

    let user =await User.findByIdAndUpdate(req.user?._id,data,{
        new:true,

        //the validate when running
        runValidators:true,
    })
    res.status(200).json({
        success:true,
        message:"Update Profile Successfully",
        user,
    })



    

});