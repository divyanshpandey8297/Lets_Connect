// const { default: mongoose } = require("mongoose");
import mongoose from "mongoose";




const userSchema=new mongoose.Schema({

    firstName:{
        type:String,
        trim:true,
        required:true
    },
    lastName:{
        type:String,
        required:true,
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
    


    //connection is needed to make sure the user is when online and when offline
    
    lastSeen:{
        type:Date,
        default:null
    },

  isOnline: {
    type: Boolean,
    default: false,
  },

    
},
{timestamps:true}
);

export const User=mongoose.model("User",userSchema);