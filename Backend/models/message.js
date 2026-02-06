const { default: mongoose } = require("mongoose");



const messageSchema=new mongoose.Schema({

    senderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    recieverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    //media is steinf the url is send to the claudinary

    text:String,
    media:String,

   

    
},
{timestamps:true}
);

export const Message=mongoose.model("Message",messageSchema);