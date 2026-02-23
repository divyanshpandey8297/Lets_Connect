// const { default: mongoose } = require("mongoose");
import mongoose from "mongoose";



const messageSchema=new mongoose.Schema({

    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    receiverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    //media is steinf the url is send to the claudinary

    text:String,
    media:String,
    
    isSeen:{
        type:Boolean,
        default:false,

    },

   

    
},
{timestamps:true}
);

export const Message=mongoose.model("Message",messageSchema);