import { io } from "socket.io-client";


let socket=null;

export const connectSocket=(userId)=>{
    socket=io(import.meta.env.MODE === "development" ? "http://localhost:4200":"/",{
        query:{userId},
    });

    // socket.on("typing", ({ senderId }) => {
    //     // console.log("User is typing:", senderId);
    // });

    // socket.on("stopTyping", ({ senderId }) => {
    //     console.log("User stopped typing:", receiverId);
    // });


    return socket;
};




export const getSocket=()=>socket;

export const disconnectSocket=()=>{
    if(socket){
        socket.disconnect();
        socket=null;
    }
}

    export const emitTyping=(socket,senderId,receiverId)=>{
         socket.emit("typing",{senderId,receiverId});
    }

    export const emitStopTyping=(socket,senderId,receiverId)=>{
         socket.emit("stopTyping",{senderId,receiverId});
    }

