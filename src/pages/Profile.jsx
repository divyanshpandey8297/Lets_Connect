import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import{Camera,Loader2,Mail,User} from "lucide-react"
import { updateProfile } from '../store/slices/authSlice'
import { motion } from 'framer-motion'
// import formData form

const Profile = () => {
    const {isUpdatingProfile,authUser}=useSelector((state)=>state.auth)
    const [selectedImg,setSelectedImg]=useState(null)
    const [date,setDate]=useState("");

    const [formData,setFormData]=useState({
        firstName:authUser?.firstName,
        lastName:authUser?.lastName,
        email:authUser?.email,
        avatar:authUser?.avatar?.url,
    })
    const dispatch=useDispatch();

    const handleImageInput=(e)=>{
        const file=e.target.files[0];
        if(!file) return

        const reader=new FileReader();
        reader.readAsDataURL(file);

        reader.onload=()=>{
            const based64Image=reader.result;
            setSelectedImg(based64Image);
            setFormData({ ... formData,avatar:file})
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "Not available";
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) return "Invalid date";
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return "Error formatting date";
        }
    };


    useEffect(()=>{
        // const al=authUser?.createdAt;
        const val=formatDate(authUser?.createdAt);
        setDate(val);
        // console.log("al is ",val);

    },[authUser])
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


    const handleUpdateProfile=(e)=>{
        const data=new FormData();
        data.append("firstName",formData.firstName);
        data.append("lastName",formData.lastName);
        data.append("email",formData.email);
        data.append("avatar",formData.avatar);
        dispatch(updateProfile(data));
    };


  return (
    <div>
        <motion.div 
         initial={{
                y:50,
                opacity:0
            }}
            animate={{
                y:0,
                opacity:1
            }}
            transition={{
                duration:0.8,
                ease:"easeOut"
            }}
        className='min-h-screen pt-20 bg-gray-50'>
            <div className='max-w-2xl mx-auto p-4 py-8 '>
                <div className='bg-white rounded-xl shadow-md p-6 space-y-8'>
                    <div className='text-center'>
                        <h1 className='text-2xl font-semibold text-gray-800'>Profile</h1>
                        <p className='mt-2 text-gray-500'>Your profile Information</p>

                    </div>

                        {/* Avatar Upload */}
                    {/* <div className='flex flex-col items-center gap-4'>
                        <div className='relative'>
                            <img src={selectedImg || formData.avatar || "/avatar-holder.avif"} alt="avatar" className='w-32 h-32 rounded-full object-cover object-top border-4 border-x-gray-200' />

                                <label htmlFor={`avatar-upload' className='absolute bottom-0 right-0 bg-gray-800 hover:scale-105 rounded-full cursor-pointer transition-all duration-200 ${
                                    isUpdatingProfile ? "animate-pulse pointer-events-none":""
                                } `}>
                                    <Camera className='w-5 h-5 text-white'/>
                                    <input type='file' id='avatar-upload' className='hidden' accept='image/*' 
                                    onChange={handleImageInput} disabled={isUpdatingProfile}/>

                                </label>
                        </div>
                        <p className='text-sm text-gray-400'>

                            {
                                isUpdatingProfile ? "uploading ... ":"click the camera icon to upload your photo."
                            }
                        </p>



                    </div> */}


                        <div className='flex flex-col items-center gap-4'>
    <div className='relative'>
        <img 
            src={selectedImg || formData.avatar || "/avatar-holder.avif"} 
            alt="avatar" 
            className='w-32 h-32 rounded-full object-cover object-top border-4 border-gray-200' 
        />
        
        <label 
            htmlFor='avatar-upload' 
            className={`absolute bottom-2 right-2 bg-gray-800 hover:bg-gray-900 hover:scale-110 rounded-full cursor-pointer transition-all duration-200 p-2 shadow-lg ${
                isUpdatingProfile ? "animate-pulse pointer-events-none" : ""
            }`}
        >
            <Camera className='w-5 h-5 text-white' />
            <input 
                type='file' 
                id='avatar-upload' 
                className='hidden' 
                accept='image/*' 
                onChange={handleImageInput} 
                disabled={isUpdatingProfile} 
            />
        </label>
    </div>
    <p className='text-sm text-gray-400'>
        {isUpdatingProfile ? "Uploading..." : "Click the camera icon to upload your photo"}
    </p>
</div>


                    {/* User Info */}
                    <div className='space-y-6'>
                        <div className='space-y-1.5'>
                            <div className='text-sm text-gray-500 flex items-center gap-2'>
                                <User className='w-4 h-4'/>
                                first Name
                            </div>
                            <input type='text' value={formData.firstName} onChange={(e)=>setFormData({... formData,firstName:e.target.value})}
                            className='px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-300  text-gray-800 w-full focus:outline-none'
                            />

                        </div>


                        {/* lastName */}

                        <div className='space-y-1.5'>
                            <div className='text-sm text-gray-500 flex items-center gap-2'>
                                <User className='w-4 h-4'/>
                                last Name
                            </div>
                            <input type='text' value={formData.lastName} onChange={(e)=>setFormData({... formData,lastName:e.target.value})}
                            className='px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-300  text-gray-800 w-full focus:outline-none'
                            />

                        </div>
                        



                        {/* mail */}
                                                <div className='space-y-1.5'>
                            <div className='text-sm text-gray-500 flex items-center gap-2'>
                                <Mail className='w-4 h-4'/>
                                Email Address
                            </div>
                            <input type='text' value={formData.email} onChange={(e)=>setFormData({... formData,email:e.target.email})}
                            className='px-4 py-2.5 bg-gray-100 rounded-lg border border-gray-300  text-gray-800 w-full focus:outline-none'
                            />

                        </div>

                    </div>

                    {/* UPdate Profile Button */}

                    <button 
                    onClick={handleUpdateProfile}
                    disabled={isUpdatingProfile}
                    className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-md transition duration-200 flex justify-center items-center gap-2'
                    >
                        {
                            isUpdatingProfile ? (<div>
                                <Loader2 className='animate-spin w-5 h-5'/> Loading...

                            </div>):(
                                "Update Profile"
                            )
                        }
                    </button>

                    {/* Account Info */}
                    <div className='mt-6 bg-gray-50 border-gray-200 rounded-xl p-6'>
                        <h2>Account Information</h2>
                        <div className='space-y-3 text-sm text-gray-600'></div>
                        <div className='flex items-center justify-center py-2 border-b border-gray-200'>
                            {/* <span>{authUser?.createdAt?.split("!")[0]}</span> */}
                            <span>{date}</span>

                            {/* <span>{authUser?.formatDate(createdAt)}</span> */}
                        </div>
                        <div className='flex items-center justify-center py-2 '>
                            <span className='text-green-600 font-medium'>Active</span>

                        </div>
                    </div>


                </div>

            </div>

        </motion.div>
      
    </div>
  )
}

export default Profile
