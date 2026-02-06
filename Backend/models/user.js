// const { default: mongoose } = require("mongoose");
import mongoose from "mongoose";



const userSchema=new mongoose.Schema({

    fullName:{
        type:String,
        trim:true,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    avatar:{
        public_id: String,
        url:String
        // required:true
    },

    
},
{timestamps:true}
);

export const User=mongoose.model("User",userSchema);