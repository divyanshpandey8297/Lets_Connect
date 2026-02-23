import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import SidebarSkeleton from './skeletons/SidebarSkeleton'
import { getChatsForSidebar, getUsers, setSelectedUser } from '../store/slices/chatSlice'
import { getUnseenPerUser } from '../store/slices/chatSlice'
// import { updateUnseenCount } from '../store/slices/chatSlice'; // You'll need to create this action
// import { getSocket } from 'socket.io-client'
import { getSocket } from '../lib/socket';
import { notificationSound } from '../lib/sound'
// import {sidebarChats} from "../store/slices/chatSlice"
import { addMessageToSidebar } from '../store/slices/chatSlice'
import { markMessagesAsSeenInState } from '../store/slices/chatSlice'



import { User } from 'lucide-react'


const Sidebar = () => {
    const [showOnlineOnly,setShowOnlineOnly]=useState(false)
    const {users,selectedUser,isUserLoading,unseenByUser,sidebarChats}=useSelector((state)=>state.chat)
    const {onlineUsers,authUser}=useSelector((state)=>state.auth)


    

    const dispatch=useDispatch();

    useEffect(() => {
        dispatch(getUsers());
  dispatch(getUnseenPerUser());
  dispatch(getChatsForSidebar());
}, [dispatch]);




          useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        const handleMessageNotification = (data) => {
        console.log("Notification received:", data);


        if (selectedUser?._id === data.senderId) {
        console.log(" Ignoring notification - already in this chat");
        return
   
        
     
         }
        if (selectedUser?._id !== data.senderId) {

            //update here
            dispatch({
        type: "chat/addMessage",
      payload: data.message
    });
    //notificaton play as you not in the chat


         notificationSound.play();
    //   console.log("🔴 Ignoring notification - already in this chat");
    //   return;
        }

      
      // Update unseen count for this sender
      

      //it ensure that we need to refresh the sidebar after each time
    //    dispatch(getChatsForSidebar());
    dispatch(addMessageToSidebar({
  message: data.message,
  authUserId: authUser._id
}));
    //    dispatch(addMessageToSidebar(data.message));


      
       
    };

    socket.on("messageNotification", handleMessageNotification);

    return () => {
      socket.off("messageNotification", handleMessageNotification);
    };
  }, [dispatch, selectedUser?._id,authUser._id]);


useEffect(() => {
  const socket = getSocket();
  if (!socket) return;

  const handleMessagesSeen = ({ seenBy }) => {
    dispatch(markMessagesAsSeenInState(seenBy));
  };

  socket.on("messagesSeen", handleMessagesSeen);

  return () => {
    socket.off("messagesSeen", handleMessagesSeen);
  };
}, [dispatch]);




 const formatTime = (date) => {
        if (!date) return '';
        const messageDate = new Date(date);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (messageDate.toDateString() === today.toDateString()) {
            return messageDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        } else if (messageDate.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return messageDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };





    // useEffect(()=>{
    //     dispatch(getUsers());
    //     console.log("getUser is get");
    // },[dispatch]);



    const getCombinedUserList=()=>{

        //give the id of the unseen and recent messagce
        const chattedUserId=sidebarChats.map((chat)=>chat._id);

        // get the id's of the all the user except the chattedUser.id

        const nonChattedUsers=users.filter((user)=> !chattedUserId.includes(user._id));

        const chattedUserWithInfo=sidebarChats.map(chat=> {
            const user=users.find(u=> u._id===chat._id)
            if(!user) return null;
            return {
                ...user,
                hasChat:true,
                lastMessage:chat.lastMessage,
                unseenCount: chat.unseenCount || 0,

            }
            
        }).filter(Boolean);

        const nonChattedUserWithInfo=nonChattedUsers.map(user=>({
            ...user,
            hasChat: false,
            lastMessage: null,
            unseenCount: 0,


        }))
        return [...chattedUserWithInfo,  ...nonChattedUserWithInfo]


    }
    const combinedUsers = getCombinedUserList();



    //filter chat info here it is 
     const filteredChat = showOnlineOnly
    ? combinedUsers.filter(chat => onlineUsers.includes(chat._id))
    : combinedUsers


    // console.log("filteredChat is given by ",filteredChat);

    // console.log("sidebarChats",sidebarChats);
    // console.log("filteredChats is ",filteredChat);


    if(isUserLoading) return <SidebarSkeleton/>


  return (
   
      <aside className='h-full w-20 lg:w-72 border-r border-gray-200 flex flex-col transition-all duration-200 bg-white'>

        {/* HEader */}
        <div className='border-b border-gray-200 w-full p-3 '>
            <div className='flex items-center gap-2'>
                <User className='w-6 h-6 text-gray-700'/>
                <span className='font-medium hidden lg:block text-gray-800'>
                    Contacts
                </span>

            </div>

            {/* Online Only filter */}
            <div className='mt-3 hidden lg:flex items-center gap-2 text-sm text-gray-700  '>
                <label>
                    <input type='checkbox' checked={showOnlineOnly} onChange={(e)=> setShowOnlineOnly(e.target.checked)}
                className='w-4 h-4  border-gray-700 text-blue-600 focus:ring-blue-500'
                />

                  {" "}Show Online Only
                </label>

                {/* have to solve themem */}
                <span>
                    ({onlineUsers.length -1}{" "} online)
                </span>

            </div>

        </div>

        {/* User List */}



        
        <div className='overflow-y-auto w-full py-3'>
            {
                filteredChat.length > 0 && filteredChat.map(user=>(
                    // <button key={user._id} onClick={()=>dispatch(setSelectedUser(user))} 
                    // className={`w-full p-3 flex items-center gap-3 transition-colors rounded-md 
                    //     ${selectedUser?._id === user._id ? "bg-gray-200 ring-gray-200" : "hover:bg-gray-200"}`}
                    // >
                    //     {/* avatar */}
                    //     <div className='relative mx-auto lg:mx-0'>
                    //         <img src={user?.avatar?.url || "/avatar-holder.avif"} alt='/avatar-holder.avif'
                    //         className='w-12 h-12 object-cover rounded-full '
                    //         />
                    //         {
                    //             onlineUsers.includes(user._id) && (
                    //              <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white'>
                    //             </span>
                    //         )}

                    //         <div>
                    //             {/* User Info */}
                    //             <div className='hidden lg:block text-left min-w-0'>
                    //                 <div className='font-medium text-gray-800 truncate'>
                    //                     {user?.firstName}
                    //                 </div>
                    //                 <div className='text-sm text-gray-500 '>
                    //                     {onlineUsers.includes(user?._id) ? "online" : "offline"}

                    //                 </div>

                    //             </div>
                    //         </div>

                    //     </div>

                    // </button>



                    <button 
    key={user._id} 
    onClick={() => dispatch(setSelectedUser(user))} 
    className={`w-full p-3 flex items-center gap-3 transition-colors rounded-md 
        ${selectedUser?._id === user._id ? "bg-gray-200 ring-gray-200" : "hover:bg-gray-200"}`}
>
    {/* Avatar with online indicator */}
    <div className='relative mx-auto lg:mx-0'>
        <img 
            src={user?.avatar?.url || "/avatar-holder.avif"} 
            alt={user.firstName}
            className='w-12 h-12 object-cover rounded-full'
        />
        {unseenByUser[user._id] > 0 && (
    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold min-w-[20px] h-5 flex items-center justify-center px-1.5 rounded-full border-2 ">
      {unseenByUser[user._id]}
    </span>
  )}
        {onlineUsers.includes(user._id) && (
            <span className='absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white'></span>
        )}
    </div>

    {/* User Info - This should be separate, not nested inside the avatar div */}
    <div className='hidden lg:block text-left min-w-0 flex-1 relative'>
        <div className='font-medium text-gray-800 truncate'>
            {user?.firstName}
        </div>
         <div className='text-sm text-gray-500'>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-1 truncate max-w-[150px]">
                                        {/* ✅ Show who sent the message */}
                                        {user.lastMessage ? (
                                            <>
                                                <span className="text-xs text-gray-400 mr-1">
                                                    {user.lastMessage.senderId === authUser?._id ? 'You:' : ''}
                                                </span>
                                                <p className="truncate">
                                                    {user.lastMessage?.text || "📎 Media"}
                                                </p>
                                            </>
                                        ) : (
                                            <p className="text-gray-400">No messages yet</p>
                                        )}
                                    </div>

                                    {/* Time and status */}
                                    <div className="flex items-center gap-2 ml-2">
                                        {user.lastMessage && (
                                            <span className="text-xs text-gray-400">
                                                {formatTime(user.lastMessage.createdAt)}
                                            </span>
                                        )}
                                        
                                        {/* ✅ Message status indicator (Sent/Seen) */}
                                        {user.lastMessage?.senderId === authUser?._id && (
                                            <span className="text-xs text-gray-400">
                                                {user.lastMessage.isSeen ? '✓✓' : '✓'}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

        <div className='text-sm text-gray-500 flex items-center justify-between'>

             {/* <p className="truncate">
                 {user.lastMessage?.text || "No messages yet"}
                 </p> */}

                 {user.lastMessage?.senderId === authUser?._id && (
                <span className="text-xs ml-36">
                    {user.lastMessage.isSeen ? "Seen" : "Sent"}
                    </span>
                     )}
                     {user.unseenCount > 0 && (
                <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full ml-2">
      {user.unreadCount}
    </span>
  )}
            
        </div>





        {/* old code of the user online offline */}

        {/* <div className='text-sm text-gray-500 relative'>
            {onlineUsers.includes(user?._id) ? "Online" : "Offline"}
        </div> */}







        {/* {unseenByUser[user._id] > 0 && (
    <span className="ml-2 absolute w-2 h-2 right-[100px]  bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
      {unseenByUser[user._id]}
    </span>
  )} */}
    </div>


    {/* old code start from there */}
     {/* {unseenByUser[user._id] > 0 && (
    <span className="ml-2 absolute w-2 h-2  bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-full">
      {unseenByUser[user._id]}
    </span>
  )} */}
</button>
                    ))
            }
            {
                filteredChat.length ===0 && (
                    <div className='text-center text-gray-500 py-4'>
                        No Online User

                    </div>
                )
            }

        </div>


      </aside>

  )
}

export default Sidebar
