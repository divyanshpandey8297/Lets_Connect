// import { Message } from "../models/message.js";
import { User } from "../models/user.js";

import { catchAsyncError } from "../middleware/catchAsyncError.middleware.js";
import { Message } from "../models/message.js";
import { v2 as cloudinary } from "cloudinary"
import { sanitizeFilter } from "mongoose";
import { getRecieverSocketId } from "../utils/socket.js";
import { io } from "../utils/socket.js";
// import cache from "../utils/cache.js";
import cache from "../utils/cache.js"

export const getAllUser = catchAsyncError(async (req, res, next) => {
    const user = req.user;

    //not included that user 
    const filterUser = await User.find({ _id: { $ne: user } }).select("-password");

    return res.status(200).json({
        success: true,
        users: filterUser
    })

})
export const getMessages = catchAsyncError(async (req, res, next) => {
    const receiverId = req.params.id;
    const myId = req.user._id;
    const reciever = await User.findById(receiverId);
    if (!reciever) {
        return res.status(401).json({
            success: false,
            message: "Reciever is Not Found"
        })
    }
    // const sortedIds = [myId, receiverId].sort();
    // const cacheKey = `chat:${sortedIds[0]}:${sortedIds[1]}`;

    // const cachedMessages = await cache.get(cacheKey);

    // if(cachedMessages){
    //     return res.status(200).json({
    //         success:true,
    //         message:"get message from the redis",
    //          messages: JSON.parse(cachedMessages)

    //     })
    // }



    const messages = await Message.find({
        $or: [
            { senderId: myId, receiverId: receiverId },
            { senderId: receiverId, receiverId: myId },
        ]
    }).sort({ createdAt: 1 })


    //      await cache.setEx(
    //     cacheKey,
    //     60, // seconds
    //     JSON.stringify(messages)
    // );

    res.status(200).json({
        success: true,
        // message:"Message is sucessFully Fecthed"
        messages
    })
})
export const sendMessages = catchAsyncError(async (req, res, next) => {
    const { text } = req.body;
    const media = req?.files?.media;

    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    const reciever = await User.findById(receiverId);
    if (!reciever) {
        return res.status(401).json({
            success: false,
            message: "Reciever is Not Found"
        })
    }

    const senitizedText = text?.trim() || "";


    if (!senitizedText && !media) {
        return res.status(400).json({
            success: false,
            message: "Cannot send the empty message"
        });
    }
    let mediaUrl = "";
    if (media) {
        try {
            const uploadResponse = await cloudinary.uploader.upload(
                media.tempFilePath, {
                resource_type: "auto",//auto detect the img
                folder: "Lets_Connect",
                transformation: [
                    {
                        width: 1080,
                        height: 1080,
                        crop: "limit"
                    },
                    { quality: "auto" },
                    { fetch_format: "auto" },
                ],
            }
            );
            mediaUrl = uploadResponse?.secure_url;

        } catch (error) {
            return res.status(500).json({
                success: false,
                message: "File Upload Failed"
            })

        }

    }


    const newMessage = await Message.create({
        senderId,
        receiverId,
        text: senitizedText,
        media: mediaUrl,
        isSeen: false,


    });

    //reciever socket id go to he (that is the key value )

    // const receiverSockerId=getRecieverSocketId(receiverId);


    // //if the socket id is presentand trigger the event

    // if(receiverSockerId){
    //      io.to(receiverSockerId).emit("newMessage", newMessage)
    // }


    const receiverSocketIds = getRecieverSocketId(receiverId)
    const senderSocketIds = getRecieverSocketId(senderId)

        ;[...receiverSocketIds, ...senderSocketIds].forEach(socketId => {
            io.to(socketId).emit("newMessage", newMessage)
        })


    receiverSocketIds.forEach(socketId => {
        io.to(socketId).emit("messageNotification", {
            // senderId,
            // text: senitizedText,
            message: newMessage
        });
    });


    res.status(200).json({
        success: true,
        message: "message is successfully send",
        newMessage
    })


})

export const markAsSeen = async (req, res) => {
    try {
        const { senderId } = req.body;
        const userId = req.user._id;

        await Message.updateMany({
            senderId,
            receiverId: userId,
            isSeen: false,
        }, { isSeen: true }

        );

        const senderSocketIds = getRecieverSocketId(senderId);

        senderSocketIds.forEach(socketId => {
            io.to(socketId).emit("messagesSeen", {
                seenBy: userId
            });
        });

        res.json({
            success: true,
        })

    } catch (error) {
        console.error("server error", error)
        return res.status(500).json({
            success: false,
            message: error
        })
    }

}



export const getUnseenPerUser = async (req, res) => {
    try {
        const userId = req.user._id;

        const unseen = await Message.aggregate([
            {
                $match: {
                    receiverId: userId,
                    isSeen: false,
                },
            },
            {
                $group: {
                    _id: "$senderId",
                    count: { $sum: 1 },
                },
            },
        ]);

        // console.log("the unseen in the  getUserPerUser is ", unseen);

        return res.status(200).json(

            unseen);

    } catch (error) {
        console.error("Get unseen error:", error);

        return res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
};




export const getChatsForSidebar1 = catchAsyncError(async (req, res, next) => {




    const userId = req.user._id;
    const chats = await Message.aggregate([
        {
            $match: {
                $or: [
                    { senderId: userId },
                    { receiverId: userId },
                ],

            },
        },

        { $sort: { createdAt: -1 } },
        {
            $group: {
                _id: {
                    $cond: [
                        { $eq: ["$senderId", userId] },
                        "$receiverId",
                        "$senderId"

                    ]
                },
                lastMessage: { $first: "$$ROOT" },
                unseenCount: {
                    $sum: {
                        $cond: [
                            { $and: [{ $eq: ["$receiverId", userId] }, { $eq: ["$isSeen", false] }] },
                            1,
                            0
                        ]
                    }
                }
            }
        },


        { $sort: { unseenCount: -1, "lastMessage.createdAt": -1 } }

    ]);
    res.status(200).json({
        success: true,
        chats
    })




});







export const getChatsForSidebar = catchAsyncError(async (req, res, next) => {

    const userId = req.user._id;
    const chats = await Message.aggregate([
        {
            $match: {
                $or: [
                    { senderId: userId },
                    { receiverId: userId },
                ],
            },
        },
        { $sort: { createdAt: -1 } },
        {
            $group: {
                _id: {
                    $cond: [
                        { $eq: ["$senderId", userId] },
                        "$receiverId",
                        "$senderId"
                    ]
                },
                lastMessage: { $first: "$$ROOT" },
                unseenCount: {
                    $sum: {
                        $cond: [
                            {
                                $and: [
                                    { $eq: ["$receiverId", userId] },
                                    { $eq: ["$isSeen", false] }
                                ]
                            },
                            1,
                            0
                        ]
                    }
                }
            }
        },
        {
            $addFields: {
                hasUnseen: { $gt: ["$unseenCount", 0] }
            }
        },
        {
            $sort: {
                hasUnseen: -1,  // Chats with unseen messages first
                "lastMessage.createdAt": -1  // Then sort by most recent
            }
        }
    ]);

    res.status(200).json({
        success: true,
        chats
    });
});

