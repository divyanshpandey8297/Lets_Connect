import React from 'react'
import { X } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux'
import { setSelectedUser } from '../store/slices/chatSlice';
import { getSocket } from '../lib/socket';
import { useState,useEffect } from 'react';

const ChatHeader = () => {

    const {selectedUser}=useSelector((state)=>state.chat);
    const {onlineUsers}=useSelector((state)=>state.auth);
    const [isTyping, setIsTyping] = useState(false);
    const {authUser}=useSelector((state)=>state.auth)

    // useEffect(()=>{
    //     console.log("authUSer is chatHeader ",authUser)
    // },[])

    const dispatch=useDispatch();
    useEffect(()=>{
        // console.log("selectedUser is ",selectedUser._id)
    },[selectedUser._id]);


//     useEffect(() => {
//     if (!selectedUser?._id) return;

//     const socket = getSocket();
//     if (!socket) return;

//     const handleTyping = (typingUserId) => {
//         if (typingUserId === selectedUser._id) {
//             setIsTyping(true);

//             // Remove typing after 2 seconds
//             setTimeout(() => setIsTyping(false), 2000);
//         }
//     };

//     socket.on("typing", handleTyping);

//     return () => socket.off("typing", handleTyping);
// }, [selectedUser]);


useEffect(() => {
  if (!selectedUser?._id) return;
  const socket = getSocket();
  if (!socket) return;

  const handleTyping = ({ senderId }) => {
    if (senderId === selectedUser._id) {
      setIsTyping(true);
    //   Clear typing after 2 seconds
      setTimeout(() => setIsTyping(false), 2000);
    }
  };

  const handleStopTyping = ({ senderId }) => {
    if (senderId === selectedUser._id) {
      setIsTyping(false);
    }
  };

  socket.on("typing", handleTyping);
  socket.on("stopTyping", handleStopTyping);

  return () => {
    socket.off("typing", handleTyping);
    socket.off("stopTyping", handleStopTyping);
  };
}, [selectedUser?._id]);


    

  return (
    <div>
        <div className='p-[1px]  lg:p-[18px] border-b bg-gray-200 ring-1 ring-gray-300'> 
            <div className='flex items-center justify-between'>

                {/* USER INFO */}
                <div className='flex items-center gap-3'>

                    {/* AVATAR */}
                    <div className='relative w-10 h-10'>

                        <img src={selectedUser?.avatar?.url || "/avatar-holder.avif"}
                        alt= "/avatar-holder.avif"
                        className='w-full h-full object-cover rounded-full'
                        />
                        {
                            onlineUsers.includes(selectedUser._id) &&
                            (
                                <span className='absolute bg-green-500 bottom-0 right-0 w-3 h-3 border-white border-2 rounded-full'></span>
                            )
                        }

                    </div>

                    {/* NAME AND STATUS */}
                    <div>
                        <h1 className='font-medium text-base text-black'>
                            {selectedUser?.firstName}{" "}{selectedUser?.lastName}
                        </h1>
                        <p className='text-sm text-black'>

                            {/* {console.log("Selected User details is ",selectedUser)} */}
                            {
                                onlineUsers.includes(selectedUser?._id) ? "online":
                                
                                selectedUser?.lastSeen
    ? `Last seen ${new Date(selectedUser.lastSeen).toLocaleString()}`
    : "offline"
                            }
                        </p>
                        <p className="text-sm text-gray-500">
    {isTyping ? `${selectedUser?.firstName}${" "}"is Typing ... "`: ""
    }
</p>
                        
                    </div>

                </div>

                {/* Close Button */}
                <button onClick={()=>dispatch(setSelectedUser(null))} className='text-gray-800 hover:text-black transition '>
                    <X className='w-5 h-5'/>
                </button>

            </div>
        </div>
      
    </div>
  )
}

export default ChatHeader
