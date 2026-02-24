// import { JsonWebTokenError } from "jsonwebtoken";
// import jwt from "jsonwebtoken"
// import { Message } from "../models/message"
// require("dotenv").config();
// const bcrypt=require("bcrypt");
// const jwt=require("jsonwebtoken");
import bcrypt from "bcryptjs";
// import { JsonWebTokenError } from "jsonwebtoken";
import dotenv from "dotenv"
import jwt from "jsonwebtoken";

dotenv.config({path:"../config/.env"})

export const generateJwtToken=async(user,message,statusCode,res)=>{
    const token=jwt.sign({id:user._id},process.env.JWT_SECRET_KEY,{
        expiresIn:process.env.JWT_EXPIRE || "24h",

    })

    // console.log("enter into the jwtToken",token);

      user.password = undefined;

    return res.status(statusCode).cookie("token",token,
        {
            //also help thhe xss attack
            httpOnly:true,
          maxAge:Number(process.env.COOKIE_EXPIRE),//they are generea;;y in the milliseconds

          //help to prevent xss

          sameSite: "none", 
          secure: true,        
        
        
        }
    ).json({
        success:true,
        message,
        token,
        user

        
    })
};



//chhange the code iof the sameSite:"strict",for the other side of visit 
//also chnage the secure:process.env.NODE_ENV !== "development"? true:false