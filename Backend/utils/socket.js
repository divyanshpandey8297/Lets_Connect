import { Server} from "socket.io"
import { User } from "../models/user.js";
import {Message} from "../models/message.js"


//when the used is login we provvide the unique socket id




const userSocketMap=new Map();

let io;



//initialize the soceket



export function initSocket(server){

    //give the server corns

    io=new Server(server,{
        cors:{
            origin:[process.env.FRONTEND_URL,"http://localhost:5174"],
            methods: ["GET", "POST"],
      credentials: true,
        },
    });

    
io.on("connection",async(socket)=>{
    // console.log("A USER IS CONNECTED TO THE SERVER .. ",socket.id)

    const userId=socket.handshake.query.userId
    if(!userId) return
    //  console.log("User connected:", userId);


     



     //unseen messaging ensure that the message notification is sending to the 
     //not offline user

     const unseen = await Message.aggregate(
        [{
         $match: {
        receiverId: userId,
        isSeen: false,
        },
    },
        {
        // $group: {
        // _id: "$senderId",
        // count: { $sum: 1 },
        // },


           $group: { _id: "$senderId", count: { $sum: 1 }, lastMessage: { $last: "$$ROOT" } } ,

        },
        ]);

socket.emit("unseenPerUser", unseen);


     if(!userSocketMap.has(userId)){
      userSocketMap.set(userId, new Set());
    }
    userSocketMap.get(userId).add(socket.id);

    //initiallize the typing here

    socket.on("typing",({senderId,receiverId})=>{
        const receiverSockets=getRecieverSocketId(receiverId);
        receiverSockets.forEach(socketId =>{
            io.to(socketId).emit("typing",{senderId});

        }) 
    })

    socket.on("stopTyping", ({ senderId, receiverId }) => {
    const receiverSockets = getRecieverSocketId(receiverId);
    receiverSockets.forEach(socketId => {
        io.to(socketId).emit("stopTyping", { senderId });
    });
    })

   

    //add the data first to the saved message then used it
//     socket.on("sendMessage",async (messageData)=>{
//         try{
//             const savedMessage = await Message.create({
//     senderId: messageData.senderId,
//     receiverId: messageData.receiverId,
//     text: messageData?.text,
//     media: messageData?.media,
//   });
//   const receiverSockets = getRecieverSocketId(messageData.receiverId);
//   const senderSockets = getRecieverSocketId(messageData.senderId);

//     [...receiverSockets, ...senderSockets].forEach(id => {
//     io.to(id).emit("newMessage", savedMessage);
//   });
//         }catch(error){
//             console.error("SendMessage Error:", error);
//         }


//     })



    // if(userId) userSocketMap[userId]=socket.id;


    if(userSocketMap.get(userId).size === 1){
     try{
        await User.findByIdAndUpdate(userId, {
      isOnline: true,
      lastSeen: null,
    });

     }catch(err){
        console.log("Socket error while connecting ",err)

     }
}



    // io.emit("getOnlineUsers",Object.keys(userSocketMap));
    io.emit("getOnlineUsers", [...userSocketMap.keys()]);







    socket.on("disconnect",async ()=>{

        // console.log("Socket disconnect Id is ",socket.id)


        const sockets=userSocketMap.get(userId);

        if(!sockets)return;

         sockets.delete(socket.id);

        if (sockets.size === 0) {
        userSocketMap.delete(userId);

        try{
            await User.findByIdAndUpdate(userId, {
        isOnline: false,
        lastSeen: new Date(),
        });

        }catch(err){
            console.log("Socket Error",err)

        }
        }


        // console.log('A USER IS DISCONNECTED ',socket.id);
        // delete userSocketMap[userId];

        

        // io.emit("getOnlineUsers",Object.keys(userSocketMap));
        io.emit("getOnlineUsers", [...userSocketMap.keys()]);

    })
})

}
export function getRecieverSocketId(userId){

    //get the value the userId is send as the key
    // return userSocketMap[userId];
      return [...(userSocketMap.get(userId) || [])];

}
export {io};