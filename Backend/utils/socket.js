import { Server} from "socket.io"


//when the used is login we provvide the unique socket id


//example. ->

// {
//     userId123:"socketId001"
//     userId456:"socketId002"
//     userId789:"socketId003"
// }




const userSocketMap={};

let io;


//initialize the socekrt


export function initSocket(server){

    //give the server corns

    io=new Server(server,{
        cors:{
            origin:[process.env.FRONTEND_URL],
        },
    });

    
io.on("connection",(socket)=>{
    console.log("A USER IS CONNECTED TO THE SERVER .. ",socket.id)

    const userId=socket.handshake.query.userId

    if(userId) userSocketMap[userId]=socket.id;

    io.emit("getOnlineUsers",Object.keys(userSocketMap));

    socket.io("disconnect", ()=>{

        console.log('A USER IS DISCONNECTED ',socket.io);
        delete userSocketMap[userId];
        io.emit("getOnLineUsers",Object.keys(userSocketMap));
    })
})

}
export function getRecieverSocketId(userId){

    //get the value the userId is send as the key
    return userSocketMap[userId];
}
export {io};