// const { default: mongoose } = require("mongoose")

import mongoose from "mongoose"

export const DBconnection=()=>{
    mongoose.connect(
        process.env.MONGODB_URL,{

        }
    )
    .then(()=>{
        console.log("DB CONNECTED SUCCESSFULLY")
    })
    .catch((err)=>{
        console.log("DB CONNECTED IS FAILED")
        console.error(err);
        process.exit(1)

    })

}