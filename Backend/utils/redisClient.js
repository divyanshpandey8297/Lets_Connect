import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config({ path: "./config/.env" });

let redisClient=null;
let isConnected=false;
// console.log("USE_REDIS:", process.env.USE_REDIS);

const useRedis=process.env.USE_REDIS === 'true';

if(useRedis){
   try{
    redisClient=createClient({
        url: "redis://localhost:6379",
    });
    redisClient.on("error",(err)=>{
        console.error("redis error",err);
        isConnected=false;
    })

    (async()=>{
       try{
        await redisClient.connect();
       isConnected=true;
    //    console.log("Redis is Successfully connected")

       }
       catch(error){
        console.warn("redis client is failed ",error.message);
        redisClient=null;
        isConnected=false;
       }
    })();

   }catch(error){
    console.warn("redis is failed to connect ",error.message)
    redisClient=null;
    isConnected=false;

   }
   

}
else{
    console.log("redis is not connected")
}

// module.exports= {redisClient,getIsConnected: ()=> isConnected}
export { redisClient };
export const getIsConnected = () => isConnected;