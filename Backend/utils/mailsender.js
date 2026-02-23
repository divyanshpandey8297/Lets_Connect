// const nodemailer=require("nodemailer")
// require("dotenv").config();
import nodemailer from "nodemailer"
import dotenv from "dotenv";
dotenv.config();

export const  mailsender=async(email ,title,body)=>{
    try{

        const transporter=nodemailer.createTransport({
            host:process.env.MAIL_HOST,
            port: 587, // or 465
            secure: false, // true for 465, false for 587
            auth:{
                user:process.env.MAIL_USER,
                pass:process.env.MAIL_PASS,
            }

        })

        let info =await transporter.sendMail({
            from:`letConnect || lectConnect by- Divyansh`,
            to:`${email}`,
            subject:`${title}`,
            html:`${body}`
        })
        // console.log(info);
        return info



    }catch(err){
        console.error("Failed to send the message",err)
        }
    }
    
// module.exports=mailsender;