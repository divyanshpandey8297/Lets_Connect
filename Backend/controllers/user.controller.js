
import {User} from '../models/user.js'
import bcrypt from "bcryptjs"
import { v2 as cloudinary } from 'cloudinary';

import { catchAsyncError } from "../middleware/catchAsyncError.middleware.js";
import { generateJwtToken } from '../utils/jwtToken.js';
import { Otp } from '../models/Otp.model.js';
import { mailsender } from '../utils/mailsender.js';
import otpGenerator from 'otp-generator'




export const sendOtp=async (req,res)=>{
    try{
        const {email}=req.body;

        const checkUserPresent=await User.findOne({email});
        if(checkUserPresent){
            return res.status(403).json({
                success:false,
                message:"user is already found"
            })
        }
        var otp=otpGenerator.generate(6,{
        upperCaseAlphabets:false,
        lowerCaseAlphabets:false,
        specialChars:false,
    });
    // console.log("OTP generated :", otp);


     const otpPayload={email,otp};

     const otpBody=await Otp.create(otpPayload);

    //   console.log(otpBody);


      const emailResponse = await mailsender(
        email,
        "OTP for Let's connect",
        `<h1>Your OTP for let's Connect Registration</h1>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 5 minutes.</p>
        <p>If you didn't request this OTP, please ignore this email.</p>`
    );

    // console.log("Email sent successfully:", emailResponse);

    //return the response successful
    res.status(200).json({
        success:true,
        message:"OTP sent successfully",
        otp,
    });
        



    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,
        })
    }
}


export const signup=catchAsyncError(async (req, res, next ) => {
    const {firstName,lastName,email,password,confirmPassword,otp }=req.body

    if(!firstName ||!lastName || !email ||!password ||!confirmPassword ||!otp ){
        return res.status(400).json({
            success:false,
            message:"please fill all the field"
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

    // if(password.length < 8){
    //     return res.status(400).json({
    //         success:false,
    //         message:"Password Must be at least 8 character long",
    //     })
    // }

    const isEmailAlreadyUsed=await User.findOne({email});
    // console.log("isEmailAlreadyUsed",isEmailAlreadyUsed)

    if(isEmailAlreadyUsed){
        return res.status(400).json({
            success:false,
            message:"User is already found"
        })
    }
     const recentOtp=await Otp.find({email}).sort({createdAt:-1}).limit(1);
        console.log(recentOtp);
    

        if(recentOtp.length==0){
            return res.status(400).json({
                success:false,
                message:"Otp Not Found"
            })
        }
        else if(String(otp).trim() !== String(recentOtp[0].otp).trim()){
            console.log("OTP Mismatch - Received:", otp, "Expected:", recentOtp[0].otp);
            return res.status(400).json({
                success:false,
                message:"Invalid OTP"
            })
        }
        // const surname="pandey"


        const image=`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`

    const passwordHashed=await bcrypt.hash(password, 10)

    const user=await User.create({
        firstName,
        lastName,
        email,
        password:passwordHashed,
        avatar:{
            public_id:image,
            url:image,
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

    // if(password.length < 8){
    //     return res.status(400).json({
    //         success:false,
    //         message:"Password Must be at least 8 character long",
    //     })
    // }
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
    // res.status(200)
    //     .cookie("token","",{
    //         maxAge:0, //0-ms
    //         httpOnly:true,
    //         sameSite:"strict",
    //         secure:process.env.NODE_ENV !== "development" ? true:false,

    //     })
    //     .json({
    //         success:true,
    //         message:"User Logged Out Successfully",
    //     })
        
    res
    .status(200)
    .cookie("token", "", {
      maxAge: 0,
      httpOnly: true,
      sameSite: "none", // match login
      secure: true,     // match login (Render is HTTPS)
      path: "/",        // explicit, same as default
    })
    .json({
      success: true,
      message: "User Logged Out Successfully",
    });



});


export const getUser=catchAsyncError(async (req, res, next ) => {
// const {email,password}=req.user.id;

const user=await User.findById(req.user._id);
res.status(200).json({
    success:true,
    user,
})


});
export const updateProfile=catchAsyncError(async (req, res, next ) => {
    const {firstName,lastName,email}=req.body;

    if(firstName?.length ===0 || email?.length==0){
        return res.status(400).json({
            succes:false,
            message:"FirstName Or Email Can't Be empty"
        })
    }
    const avatar=req?.files?.avatar;
    let cloudinaryResponse={};
    const data={
        firstName:firstName?.trim(),
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