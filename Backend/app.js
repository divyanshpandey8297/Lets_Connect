import cookieParser from "cookie-parser";
import express from "express"
import cors from "cors"
import { config } from "dotenv";
import fileUpload from "express-fileupload";
// import { connect } from "mongoose";
// 
import { DBconnection } from "./config/database.js";
// const cookieParser = require("cookie-parser");
// const express = require("express");
// const cors = require("cors");
// const fileUpload = require("express-fileupload");
// // const dotenv = require("dotenv");
import dotenv from "dotenv"
import userRoutes from "./routes/user.route.js";
import messageRoutes from "./routes/message.route.js";




//server is attach the the app





const app=express();

// const dotenv=require("dotenv")
// dotenv.path({path:"./config/.env"})
dotenv.config({ path: "./config/.env" });
// dotenv.config();
// const PORT=process.env.PORT || 5000


// const database=require("./config/database")
// database.connect();



app.use(
    cors(
        {
    origin:[process.env.FRONTEND_URL,"http://localhost:5174","https://lets-connect-iru9.onrender.com"],
    credentials:true,
    methods:["GET","POST","PUT","DELETE"]
}
)
)


app.use(cookieParser());


//used to stringfy


app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(
    fileUpload({
        useTempFiles:true,
        tempFileDir:"./temp/"
    })
);

// const userRouter=require("../Backend/routes/user.route")
// const userRoutes=require("./routes/user.route")
app.use("/api/v1/user",userRoutes);
app.use("/api/v1/message",messageRoutes);

// const {cloudinaryConnect}=require("./config/cloudinary");
// cloudinaryConnect();
DBconnection();

// app.listen(PORT,()=>{
//     console.log(`SERVER IS RUNNING IN THE ${PORT}`)
// })

export default app;