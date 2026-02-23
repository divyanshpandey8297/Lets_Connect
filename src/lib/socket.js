import { io } from "socket.io-client";


let socket = null;

const RENDER_API = "https://lets-connect-iru9.onrender.com";
const SOCKET_URL = import.meta.env.DEV
  ? (import.meta.env.VITE_API_URL || "http://localhost:4200")
  : RENDER_API;

export const connectSocket = (userId) => {
  socket = io(SOCKET_URL, {
    query: { userId },
    withCredentials: true,
  });

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

