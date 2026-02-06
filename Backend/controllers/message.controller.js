// import { Message } from "../models/message.js";
import { User } from "../models/user.js";

import { catchAsyncError } from "../middleware/catchAsyncError.middleware.js";
import { Message } from "../models/message.js";
import {v2 as cloudinary} from "cloudinary"
import { sanitizeFilter } from "mongoose";
import { getRecieverSocketId } from "../utils/socket.js";

export const getAllUser=catchAsyncError(async(req,res,next)=>{
    const user=req.user;

    //not included that user 
    const filterUser= await User.find({_id:{$ne:user}}).select("-password");

    return res.status(200).json({
        success:true,
        users:filterUser
    })

})
export const getMessages=catchAsyncError(async(req,res,next)=>{
    const recieverId=req.param.id;
    const myId=req.user.id;
    const reciever=await User.findById(recieverId);
    if(!reciever){
        return res.status(401).json({
            success:false,
            message:"Reciever is Not Found"
        })
    }

    const message=await Message.Find({
        $or:[
            {senderId:myId,recieverId:recieverId},
            {senderId:recieverId,recieverId:myId},
        ]
    }).sirt({cretaed:1})

    res.status(200).json({
        success:false,
        // message:"Message is sucessFully Fecthed"
        message
    })
})
export const sendMessages=catchAsyncError(async(req,res,next)=>{
    const {text}=req.body;
    const media=req?.files?.media;

    const {id: recieverId}=req.param;
    const senderId=req.user._id;

    const reciever=await User.findById(recieverId);
    if(!reciever){
        return res.status(401).json({
            success:false,
            message:"Reciever is Not Found"
        })
    }

    const senitizedText=text?.trim() || "";

    if(!senitizedText && !media){
        return res.status(400).json({
            success:false,
            message:"Cannot send the empty message"
        });
        }
        let mediaUrl="";
        if(media){
            try{
                const uploadResponse=await cloudinary.upload.upload(
                media.tempFilePath,{
                    resourse_type:"auto",//auto detect the img
                    folder:"Lets_Connect",
                    transformation:[
                        {width:1080,
                            height:1080,
                            crop:"limit"
                        },
                        {quality:"auto"},
                        {fetch_format:"auto"},
                    ],
                }
            );
            mediaUrl=uploadResponse?.secure_url;

            }catch(error){
                return res.status(500).json({
                    success:false,
                    message:"File Upload Failed"
                })

            }

        }


        const newMessage=await Message.create({
            senderId,
            recieverId,
            text:senitizedText,
            media:mediaUrl,

        });

        //reciever socket id go to he (that is the key value )

        const receiverSockerId=getRecieverSocketId(recieverId);


        //if the socket id is presentand trigger the event
        
        if(receiverSockerId){
             io.to(receiverSockerId).emits
        }
        res.status(200).json({
            success:true,
            message:"message is successfully send",
            newMessage
        })
       

})