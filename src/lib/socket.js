import { io } from "socket.io-client";


let socket=null;

const SOCKET_URL = import.meta.env.VITE_API_URL;

// const SOCKET_URL ="https://lets-connect-iru9.onrender.com";


// export const connectSocket=(userId)=>{
//     socket=io(import.meta.env.MODE === "development" ? "http://localhost:4200":"/",{
//         query:{userId},
//     });


//     return socket;
// };


export const connectSocket = (userId) => {
  if (!SOCKET_URL) {
    console.error("VITE_API_URL is not defined");
    return null;
  }

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

