import mongoose from 'mongoose'
import { mailsender } from '../utils/mailsender.js';

const otpSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,

    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:5*60*2,
        
    }

})

async function sendVerificationEmail(email,otp){
    try{
        const mailResponse=await mailsender(email,
            "verification message from the let's connect ",`Your Otp is -> ${otp} `);
        console.log("Email sent successfully: ",mailResponse);

    }catch(error){
        console.error("ERROR WHILE SENDTING THE OTP ... ",error);
    }

}

// OTPSchema.pre("save",async function  (next) {
//     await sendVerificationEmail(this.email,this.otp);
//     next();
    
// })

otpSchema.pre("save",async function(){
    await sendVerificationEmail(this.email,this.otp);
    // next();
} )



export const Otp=mongoose.model("Otp",otpSchema);