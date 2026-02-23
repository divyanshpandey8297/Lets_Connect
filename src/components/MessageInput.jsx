import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Image, Send, X } from "lucide-react";
import { toast } from "react-toastify";
import { sendMessage } from "../store/slices/chatSlice";

import { emitTyping, getSocket ,emitStopTyping} from "../lib/socket";
import { axiosInstance } from "../lib/axios";
import { getMessages } from "../store/slices/chatSlice";
import { pushNewMessage } from "../store/slices/chatSlice";
// import QuickEmojiPicker from "./QuickEmojiPicker";
// import { sendMessage } from "../store/slices/chatSlice";

// import {clearUnseenCount} from "../store/slices/chatSlice"

const MessageInput = () => {
  const [text, setText] = useState("");
  const [typingTimeout,setTypingTimeout]=useState(null);
  const [mediaPreview, setMediaPreview] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [media, setMedia] = useState(null);
  const [mediaType, setMediaType] = useState("");

  const fileInputRef = useRef(null);
  const dispatch = useDispatch();

  const { selectedUser } = useSelector((state) => state.chat);
  const {authUser}=useSelector((state)=>state.auth)


  //  const inputRef = useRef(null); 


  //  const handleEmojiSelect = (emoji) => {
  //   setText((prevText) => prevText + emoji);
  //   // Focus input after adding emoji
  //   inputRef.current?.focus();
  // };


// useEffect(() => {
//   if (selectedUser?._id) {
//     dispatch(getMessages(selectedUser._id));
//   }
// }, [selectedUser, dispatch]);


  const handleChangeMedia = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const type = file.type || "";

    if (!type.startsWith("image/") && !type.startsWith("video/")) {
      toast.error("Please select an image or video file");
      return;
    }

    setMedia(file);

    if (type.startsWith("image/")) {
      setMediaType("image");

      const reader = new FileReader();
      reader.onload = () => setMediaPreview(reader.result);
      reader.readAsDataURL(file);
    }

    if (type.startsWith("video/")) {
      setMediaType("video");

      const videoUrl = URL.createObjectURL(file);
      setMediaPreview(videoUrl);
    }
  };


  const removeMedia = () => {
    setMedia(null);
    setMediaPreview(null);
    setMediaType("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

//   const handleSendMessage = (e) => {

//     e.preventDefault();


//     if (!text.trim() && !media) return;

//     const data = new FormData();

//     data.append("text", text.trim());

//     if (media) data.append("media", media);

//     // dispatch(sendMessage(data));
//     const socket = getSocket();

// socket.emit("sendMessage", {
//   senderId: authUser._id,
//   receiverId: selectedUser._id,
//   text: text.trim(),
// });


// // dispatch({
// //   type: "chat/pushNewMessage",
// //   payload: tempMessage,
// // });

// // socket.emit("sendMessage", tempMessage);


//     setText("");
//     removeMedia();
//   };

// useEffect(() => {
//   const socket = getSocket();
//   if (!socket) return;

//   socket.on("newMessage", (msg) => {
//     dispatch(pushNewMessage(msg));
//   });

//   return () => socket.off("newMessage");
// }, [dispatch]);




const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!text.trim() && !media){
      toast.error("Can't send the empty message")
      return
    }

    // Create optimistic (temporary) message
    // const tempMessage = {
    //     _id: Date.now().toString(), // Temporary ID
    //     senderId: authUser._id,
    //     receiverId: selectedUser._id,
    //     text: text.trim(),
    //     media: media ? URL.createObjectURL(media) : null,
    //     mediaType: mediaType || null,
    //     createdAt: new Date().toISOString(),
    //     isTemp: true, // Mark as temporary
    //     status: 'sending'
    // };

    // // 1. IMMEDIATELY add to UI (optimistic update)
    // dispatch(pushNewMessage(tempMessage));

    // 2. Prepare FormData for REST API
    const data = new FormData();
    data.append("text", text.trim());
    if (media) {
        data.append("media", media);
    }
    setText("");
      removeMedia();

    try {
        // 3. Send via REST API only (NO socket.emit here!)
        const response = await dispatch(sendMessage(data)).unwrap();
        
        // Clear inputs
        
        
        // Note: The socket event from backend will update the temp message
        // OR you can dispatch another action to replace temp with actual message
        
    } catch (error) {
        // 4. Handle error - mark message as failed
        dispatch({
            type: "chat/markMessageFailed",
            payload: tempMessage._id
        });
        toast.error("Failed to send message");
    }
};



// const handleSendMessage = (e) => {
//   e.preventDefault();

//   if (!text.trim() && !media) return;

//   // Create a temporary message with local timestamp
//   const tempMessage = {
//     _id: Date.now(), // Temporary ID
//     senderId: authUser._id,
//     receiverId: selectedUser._id,
//     text: text.trim(),
//     media: media ? URL.createObjectURL(media) : null,
//     mediaType: mediaType || null,
//     createdAt: new Date().toISOString(),
//     isTemp: true, // Mark as temporary
//   };

//   // Immediately add to local state (optimistic update)
//   dispatch({
//     type: "chat/pushNewMessage",
//     payload: tempMessage,
//   });

//   // Prepare FormData for backend
//   const data = new FormData();
//   data.append("text", text.trim());
//   data.append("receiverId", selectedUser._id);
//   if (media) data.append("media", media);

//   // Send to backend
//   dispatch(sendMessage(data))
//     .unwrap()
//     .then((response) => {
//       // Replace temp message with actual one from backend
//       dispatch({
//         type: "chat/updateTempMessage",
//         payload: {
//           tempId: tempMessage._id,
//           actualMessage: response.message,
//         },
//       });
//     })
//     .catch((error) => {
//       // Mark message as failed
//       dispatch({
//         type: "chat/markMessageFailed",
//         payload: tempMessage._id,
//       });
//       toast.error("Failed to send message");
//     });

//   // Also emit via socket for real-time
//   const socket = getSocket();
//   socket.emit("sendMessage", {
//     senderId: authUser._id,
//     receiverId: selectedUser._id,
//     text: text.trim(),
//     media: media ? "uploaded" : null, // Or send thumbnail
//   });

//   // Clear inputs
//   setText("");
//   removeMedia();
// };


  useEffect(() => {
    if (!selectedUser?._id) return;

    const socket = getSocket();
    if (!socket) return;


    //using the toString() becaue the db can be string as well as object

    const handleNewMessage = (newMessage) => {

      
      if (
        newMessage.senderId.toString() === selectedUser._id.toString() ||
        newMessage.receiverId.toString() === selectedUser._id.toString() 
        // newMessage.senderId.toString() === authUser._id.toString()
        )
        {
        dispatch({
          type: "chat/pushNewMessage",
          payload: newMessage,
        });
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => socket.off("newMessage", handleNewMessage);
  }, [dispatch, selectedUser,authUser]);


  const handleChange=(e)=>{
    setText(e.target.value);
    console.log(e);
            const socket=getSocket();
            if(!socket || !selectedUser._id) return 
            const senderId=authUser._id;
            // console.log("Value of the selectedUser._id",selectedUser._id) 
            emitTyping(socket,senderId,selectedUser._id);

            //clear old timeout

            if(typingTimeout) clearTimeout(typingTimeout);
          

        // we have to make sure that the userif the user is not active then we have to 
        // time out that
        const timeout=setTimeout(()=>{
          emitStopTyping(socket, senderId,selectedUser._id);

        },1000)
        setTypingTimeout(timeout);
                        
    
  }

//   useEffect(() => {
//   const socket = getSocket();
//   if (!socket) return;

//   socket.on("typing", ({ senderId }) => {
//     if (senderId === selectedUser._id) {
//       setIsTyping(true);
//     }
//   });

//   socket.on("stopTyping", ({ senderId }) => {
//     if (senderId === selectedUser._id) {
//       setIsTyping(false);
//     }
//   });

//   return () => {
//     socket.off("typing");
//     socket.off("stopTyping");
//   };
// }, [selectedUser?._id]);




useEffect(() => {
  if (!selectedUser?._id) return;

  const socket = getSocket();
  if (!socket) return;

  const handleNewMessage = (newMessage) => {
    // If message is from selected user and we're in their chat
    if (newMessage.senderId === selectedUser._id) {
      
      // Mark as seen immediately
      axiosInstance.post('/message/mark-seen', {
        senderId: selectedUser._id
      }).catch(console.error);
      
      // Also clear any unseen badge
      dispatch(clearUnseenCount({
        senderId: selectedUser._id
      }));
    }
  };

  socket.on('newMessage', handleNewMessage);
  return () => socket.off('newMessage', handleNewMessage);
}, [selectedUser?._id, dispatch]);


  return (
    <div className="w-full border-t border-gray-200 bg-white sticky bottom-0 z-20">

      {/* Media Preview */}
      {mediaPreview && (
        <div className="relative p-3 max-h-32 overflow-hidden">

          {mediaType === "image" ? (
            <img
              src={mediaPreview}
              alt="Preview"
              className="w-24 h-24 object-cover rounded-lg border"
            />
          ) : (
            <video
              src={mediaPreview}
              controls
              className="w-32 h-24 object-cover rounded-lg border"
            />
          )}

          {/* Remove Button */}
          <button
            onClick={removeMedia}
            type="button"
            className="
              absolute top-1 right-1
              w-6 h-6
              bg-black/70
              text-white
              rounded-full
              flex items-center justify-center
              hover:bg-black
              transition
            "
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* Input Area */}
      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-3 px-4 py-3"
      >

        {/* Text Input */}
        <input
          type="text"
          placeholder="Type a message..."
          className="
            flex-1 w-full
            px-4 py-3
            rounded-full
            border border-gray-300
            bg-gray-50

            text-gray-800
            placeholder-gray-400
            text-sm sm:text-base

            focus:outline-none
            focus:ring-2
            focus:ring-blue-500
            focus:border-transparent

            transition
          "
          value={text} 
          onChange={handleChange}
        />


         

        {/* Text Input - ADD ref={inputRef} */}
        {/* <input
          ref={inputRef} // ✅ ADD THIS REF
          type="text"
          placeholder="Type a message..."
          className="flex-1 w-full px-4 py-2 rounded-full border border-gray-300 bg-gray-50 text-gray-800 placeholder-gray-400 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
          value={text}
          onChange={handleChange}
        /> */}


        {/* File Input */}
        <input
          type="file"
          accept="image/*,video/*"
          ref={fileInputRef}
          className="hidden"
          onChange={handleChangeMedia}
        />

        {/* Upload Button */}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className={`
            flex
            items-center justify-center
            w-10 h-10
            rounded-full
            border border-gray-300
            transition

            ${
              mediaPreview
                ? "text-emerald-500 border-emerald-400"
                : "text-gray-400 hover:text-gray-600"
            }
          `}
        >
          <Image size={20} />
        </button>

        {/* Send Button */}
        <button
          type="submit"
          disabled={!text.trim() && !media}
          className="
            w-10 h-10
            flex items-center justify-center
            rounded-full
            bg-blue-600
            text-white

            hover:bg-blue-700
            disabled:opacity-50
            disabled:cursor-not-allowed

            transition
          "
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};

export default MessageInput;
