import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getMessages } from '../store/slices/chatSlice'
// import { getMessages } from '../../Backend/controllers/message.controller'
import { getSocket } from '../lib/socket'
import MessageSkeleton from './skeletons/messageSkeleton'
import MessageInput from './MessageInput'
import ChatHeader from './ChatHeader'
import { useRef } from 'react'
import { markMessagesSeen } from '../store/slices/chatSlice'

const ChatContainer = () => {

    const {messages,isMessageLoading,selectedUser}=useSelector((state)=>state.chat)

    const {authUser}=useSelector((state)=>state.auth)

    const dispatch=useDispatch();
    const messageEndRef=useRef(null);

    useEffect(()=>{
        dispatch(getMessages(selectedUser._id))
    },[selectedUser._id])

    useEffect(()=>{
        if(messageEndRef.current && messages){
            messageEndRef.current.scrollIntoView({behavior:"smooth"})
        }
    },[messages]);



useEffect(() => {
  if (selectedUser?._id) {
    dispatch(markMessagesSeen(selectedUser._id));
  }
}, [selectedUser]);




// useEffect(() => {
//   if (!selectedUser?._id) return;

//   const socket = getSocket();
//   if (!socket) return;

//   const handleNewMessage = (newMessage) => {
   
//     if (newMessage.senderId === selectedUser._id) {
      
//       //  Clear badge immediately
//       dispatch({
//         type: "chat/clearUnseenCount",
//         payload: { senderId: selectedUser._id }
//       });
      
//       // ✅ Mark as seen in database
//       axiosInstance.post('/message/mark-seen', {
//         senderId: selectedUser._id
//       }).catch(console.error);
//     }
//   };

//   socket.on("newMessage", handleNewMessage);
//   return () => socket.off("newMessage", handleNewMessage);
// }, [selectedUser?._id, dispatch]);



    function formatMessageTime(data){

        if (!data) {
    return new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12:true,
    });
  }

        return new Date(data).toLocaleString("en-US",{
            hour:"2-digit",
            minute:"2-digit",
            hour12:true,
        });
    }
    useEffect(()=>{
        if(!selectedUser?._id) return ;
        dispatch(getMessages(selectedUser._id));
        const socket=getSocket();

        if(!socket) return ;

    },[selectedUser?._id]);

    if(isMessageLoading){
        return(
            <div className='flex-1 flex flex-col overflow-auto'>
                <ChatHeader/>
                <MessageSkeleton/>
                <MessageInput/>


            </div>
        )
    }


  return (
    <div className='flex-1 flex'>
        <div className='flex flex-1 flex-col bg-white'>
            <ChatHeader/>


            {/* Messages */}
            <div className='flex-1 overflow-y-auto p-4 space-y-6 scroll-smooth ' >
                
                {/* starting condition if the no message is send to This */}
                {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center px-6">
    
    <div className="bg-gray-100 rounded-full p-6 shadow-md mb-4">
      <svg
        className="w-10 h-10 text-gray-400"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 01-4-.8L3 20l1.8-3.6A7.94 7.94 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
        />
      </svg>
    </div>

    <h2 className="text-lg font-semibold text-gray-700">
      No Messages Yet
    </h2>

    <p className="text-sm text-gray-500 mt-2">
      Start the conversation by sending a message.
    </p>

  </div>
)}

                {
                    messages.length > 0 && messages.map((message,index)=>{
                        const isSender=message.senderId === authUser._id;
                        return(
                            <div key={message._id} className={`flex items-end ${isSender ? "justify-end":"justify-start"

                            }`}
                            ref={index===messages.length -1 ? messageEndRef : null }
                            >

                            {/* Avatar */}
                            <div className={`w-7 h-7 rounded-full overflow-hidden border shrink-0  ${isSender ? "ovder-2 ml-3":"order-1 mr-3"

                            }`}>
                                <img src={isSender ? authUser?.avatar?.url || "/avatar-holder.avif" : selectedUser?.avatar?.url || "/avatar-holder.avif"} className='w-full h-full object-cover'/>

                            </div>

                            {/* Bubble */}
                            <div className={`max-w-xs sm:max-w-sm md:max-w-md px-4 bg-gray-200 py-2 rounded-xl text-sm ${
                                isSender ? "bg-blue-400/20 text-black order-1" :"bg-200 text-black order-2"

                            }`}>
                                {
                                    message.media && (
                                        <div>
                                            {
                                                message.media.includes(".mp4") ||
                                                message.media.includes(".webm") ||
                                                message.media.includes(".mov") ?
                                                (
                                                    <div>
                                                        <video src={message.media} controls className='w-full rounded-md mb-2'/>
                                                    </div>
                                                ):(
                                                    <div>
                                                        <img src={message.media}
                                                        alt='Attachment'
                                                        className='w-full rounded-md mb-2'
                                                        />
                                                    </div>
                                                )
                                            }
                                        </div>
                                    )
                                }
                                
                                    {message.text && 
                                    
                                    <p className=''>{message.text}</p>
                                    
                                    }
                                    <span className='block text-[10px] mt-1 text-right text-gray-400'>
                                        {formatMessageTime(message.createdAt)}
                                    </span>
                                     {console.log("message is ",message)}
                                   
                                

                            </div>

                            </div>

                        )
                    })
                }

            </div>


                <div className='shrink-0 border-t bg-white shadow-inner sticky bottom-0 z-20'>
                    <MessageInput/>
                </div>
        </div>
      
    </div>
  )
}

export default ChatContainer
