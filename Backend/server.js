import app from "./app.js"
// import { v2 } from "cloudinary"
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import http from "http";
import { initSocket } from "./utils/socket.js";


cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})

//make the connection with the app server 

const server =http.createServer(app);

//event the server 
initSocket(server);


const PORT=process.env.PORT || 5173

//first we listen the app
// app.listen(PORT,()=>{
//     console.log(`SERVER IS RUNNING IN THE ${PORT}`)
// })

//when we maeke the connection with the serve r

 server.listen(PORT,()=>{
     console.log(`SERVER IS RUNNING IN THE ${PORT}`)
 })





        