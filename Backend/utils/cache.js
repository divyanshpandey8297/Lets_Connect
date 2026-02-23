import {redisClient ,getIsConnected} from './redisClient.js'

const cache={
    get:async(key)=>{
        if(!redisClient || !getIsConnected()){
            return null;
        };
        try{
            return await redisClient.get(key)

        }catch(err){
            console.warn(`Cache GET failed for key "${key}":`, err.message)
            return null;

        }

    },
    setEx:async(key,second,value)=>{
        if(!redisClient || !getIsConnected()){
            return ;
        };
        try{
            await redisClient.setEx(key,second,value)

        }catch(error){
              console.warn(`Cache setEx failed for key "${key}":`, err.message)
            return ;

        }

    },
     del: async (key) => {
    if (!redisClient || !getIsConnected()) {
      return;
    }
    try {
      await redisClient.del(key);
    } catch (err) {
      console.warn(`Cache DEL failed for key "${key}":`, err.message);
    }
  },
}

export default cache;
