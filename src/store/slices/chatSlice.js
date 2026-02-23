import React from 'react'

import { createSlice ,createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios';
import { axiosInstance } from '../../lib/axios';
import { toast } from 'react-toastify';




export const getUsers=createAsyncThunk("chats/getUsers",async(_,thunkAPI)=>{
    try{

        const res=await axiosInstance.get("/message/users");
        console.log("RESPONSE OF THE GETUSERS API IS .... ",res);
        return res.data.users;


    }catch(error){
        toast.error(error.response?.data?.message);
        return thunkAPI.rejectWithValue(error.response?.data?.message)

    }
})


export const getMessages=createAsyncThunk("chats/getMessages",async(userId,thunkAPI)=>{
    try{

        const res=await axiosInstance.get(`/message/${userId}`);
        console.log("API RESPONSE OF THE GET-MESSAGES ... ",res);
        return res.data

    }
    catch(error){
        toast.error(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response.data.message);

    }
})


export const sendMessage=createAsyncThunk("chat/sendMessage",async(messageData,thunkAPI)=>{
    try{
        const {chat}=thunkAPI.getState();
        const res=await axiosInstance.post(`/message/send/${chat.selectedUser._id}`,messageData);
        console.log("RESPONSE OF THE SEND MESSAGE API IS ... " ,res);
        return res.data;

    }catch(error){
        toast.error(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response.data.message);

    }
})

export const getUnseenPerUser=createAsyncThunk("chat/unseen",async(_,thunkAPI)=>{
    try{
        const res=await axiosInstance.get("/message/unseen");
        console.log("HERE IS THE RESPONSE OF THE UNSEEN API ... ",res);
        return res.data;

    }catch(error){
        toast.error(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response.data.message)
    }
    // toast.error(error.response.message)
    
})

export const markMessagesSeen=createAsyncThunk("chat/markAsSeen",async(senderId,thunkAPI)=>{
    try{
        const res=await axiosInstance.post("/message/mark-seen",{
            senderId,
        });
        console.log("HERE IS THE RESPONSE OF THE MARK AS SEEN API ... ",res);
        return senderId;


    }catch(error){
        toast.error(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
})

export const getChatsForSidebar=createAsyncThunk("chats/getChatsForSidebar",async(_,thunkAPI)=>{
    try{
        const res=await axiosInstance.get("/message/sidebar-chats");
        // console.log("RESPONSE OF THE GETCHATS FOR SIDEBARS ... ",res);
        return res.data.chats;

    }catch(error){
        toast.error(error.response?.message?.error);
        return thunkAPI.rejectWithValue(error.response?.message?.error)
    }
})





const chatSlice=createSlice({
    name:"chat",
    initialState:{
        messages:[],
        users:[],
        unseenByUser: {}, 
        selectedUser:null,
        isUserLoading:false,
        isMessageLoading:false,
        sidebarChats: [],
    },
    reducers:{
        setSelectedUser:(state,action)=>{
            state.selectedUser=action.payload;
        },
        pushNewMessage:(state,action)=>{
            state.messages.push(action.payload);
        },



            setUnseenByUser: (state, action) => {
      // Transform array [{_id: userId, count: n}] to object { userId: n }
      const unseenArray = action.payload;
      state.unseenByUser = unseenArray.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {});
    },
    
    // Increment unseen count for a specific user (from socket notification)
    incrementUnseenCount: (state, action) => {
      const { senderId, count = 1 } = action.payload;
      state.unseenByUser[senderId] = (state.unseenByUser[senderId] || 0) + count;
    },
    
    // Clear unseen count when opening chat
    clearUnseenCount: (state, action) => {
      const { senderId } = action.payload;
      delete state.unseenByUser[senderId];
      // Or set to 0
      // state.unseenByUser[senderId] = 0;
    },




// addMessageToSidebar: (state, action) => {
//   const { message, authUserId } = action.payload;

//   // 👇 find the other user
//   const otherUserId =
//     message.senderId === authUserId
//       ? message.receiverId
//       : message.senderId;

//   const existingChatIndex = state.sidebarChats.findIndex(
//     chat => chat._id === otherUserId
//   );

//   if (existingChatIndex !== -1) {
//     const updatedChat = {
//       ...state.sidebarChats[existingChatIndex],
//       lastMessage: message,
//       unseenCount:
//         message.senderId === authUserId
//           ? 0 // if YOU sent message → no unseen
//           : (state.unseenByUser[otherUserId] || 0) + 1,
//     };

//     state.sidebarChats = [
//       updatedChat,
//       ...state.sidebarChats.slice(0, existingChatIndex),
//       ...state.sidebarChats.slice(existingChatIndex + 1),
//     ];
//   } else {
//     state.sidebarChats.unshift({
//       _id: otherUserId,
//       lastMessage: message,
//       unseenCount: 0,
//     });
//   }

//   // Update unseen map
//   if (message.senderId !== authUserId) {
//     state.unseenByUser[otherUserId] =
//       (state.unseenByUser[otherUserId] || 0) + 1;
//   }
// }


addMessageToSidebar: (state, action) => {
  const { message, authUserId } = action.payload;

  const otherUserId =
    message.senderId === authUserId
      ? message.receiverId
      : message.senderId;

  const isChatOpen =
    state.selectedUser && state.selectedUser._id === otherUserId;

  const existingChatIndex = state.sidebarChats.findIndex(
    chat => chat._id === otherUserId
  );

  // 🔥 Decide unseen increment
  const shouldIncreaseUnseen =
    message.senderId !== authUserId && !isChatOpen;

  if (existingChatIndex !== -1) {
    const updatedChat = {
      ...state.sidebarChats[existingChatIndex],
      lastMessage: message,
      unseenCount: shouldIncreaseUnseen
        ? (state.unseenByUser[otherUserId] || 0) + 1
        : 0,
    };

    state.sidebarChats = [
      updatedChat,
      ...state.sidebarChats.slice(0, existingChatIndex),
      ...state.sidebarChats.slice(existingChatIndex + 1),
    ];
  } else {
    state.sidebarChats.unshift({
      _id: otherUserId,
      lastMessage: message,
      unseenCount: shouldIncreaseUnseen ? 1 : 0,
    });
  }

  // 🔥 Update unseen map only if needed
  if (shouldIncreaseUnseen) {
    state.unseenByUser[otherUserId] =
      (state.unseenByUser[otherUserId] || 0) + 1;
  }
},

markMessagesAsSeenInState: (state, action) => {
  const senderId = action.payload;

  state.messages.forEach(msg => {
    if (msg.receiverId === senderId) {
      msg.isSeen = true;
    }
  });

  // Also update sidebar last message if needed
  state.sidebarChats.forEach(chat => {
    if (chat._id === senderId && chat.lastMessage) {
      chat.lastMessage.isSeen = true;
    }
  });
}



        
    },
    
    extraReducers:(builder)=>{
        builder.addCase(getUsers.pending,(state)=>{
            state.isUserLoading=true
        })
        .addCase(getUsers.fulfilled,(state,action)=>{
            state.users=action.payload;
            state.isUserLoading=false
        })
        .addCase(getUsers.rejected,(state)=>{
            state.isUserLoading=false
        })
        .addCase(getMessages.pending,(state)=>{
            state.isMessageLoading=true
        })
        .addCase(getMessages.fulfilled,(state,action)=>{
            state.messages=action.payload.messages;
            state.isMessageLoading=false
        })
        .addCase(getMessages.rejected,(state,action)=>{
            // state.messages=action.payload.messages,
            state.isMessageLoading=false
        })

        //this save the message to the sendMessage
        // .addCase(sendMessage.fulfilled,(state,action)=>{
        //     state.messages.push(action.payload);
        // })

        //it reduce the extra render test
        .addCase(sendMessage.fulfilled, (state, action) => {
                // ✅ FIXED: Use newMessage from response
                const newMsg = action.payload.newMessage
                
                // Check for duplicate
                const exists = state.messages.some(msg => msg._id === newMsg._id)
                if (!exists) {
                    state.messages.push(newMsg)
                }
                //     chatSlice.caseReducers.addMessageToSidebar(state, {
                // payload: {
                //  message: newMsg,
                // authUserId: action.meta.arg.senderId // or from state.auth
                //     }
                // });

                chatSlice.caseReducers.addMessageToSidebar(state, {
    payload: {
      message: newMsg,
      authUserId: newMsg.senderId
    }
  });
                
            })

            .addCase(getUnseenPerUser.fulfilled, (state, action) => {
            const map = {};

            action.payload.forEach((item) => {
            map[item._id] = item.count;
                });

                state.unseenByUser = map;
                })



               .addCase(markMessagesSeen.fulfilled, (state, action) => {
                const senderId = action.payload;

                delete state.unseenByUser[senderId];
                })
                .addCase(getChatsForSidebar.fulfilled,(state,action)=>{
                    state.sidebarChats=action.payload
                    const map = {};
                    action.payload.forEach(chat => {
                    map[chat._id] = chat.unseenCount;
                    });
                    state.unseenByUser = map;
                })

        }
});

export const {setSelectedUser,pushNewMessage,setUnseenByUser,incrementUnseenCount,markMessagesAsSeenInState,clearUnseenCount,addMessageToSidebar}=chatSlice.actions;
export default chatSlice.reducer;