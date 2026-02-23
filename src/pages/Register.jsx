import React, { useState } from 'react'

import { Eye,EyeOff,Loader2,Lock,Mail,MessageSquare,User} from "lucide-react"
import { useDispatch, useSelector } from 'react-redux';
// import { signup } from '../../Backend/controllers/user.controller';
import { MessagesSquare } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthImagePattern from '../components/AuthImagePattern';
// import { signup } from '../store/slices/authSlice'
import { Navigate } from 'react-router-dom';
import { sendOtp,setPendingSignupData } from '../store/slices/authSlice';

const Register = () => {

    const [showPassword,setShowPassword]=useState(false);
    const [showPassword1,setShowPassword1]=useState(false);
    const [formData,setFormData]=useState({
        firstName:"",
        lastName:"",
        email:"",
        password:"",
        confirmPassword:""
    });
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const {isSendingOtp}=useSelector((state)=>state.auth)

    const handleSubmit1=(e)=>{
        e.preventDefault();
        dispatch(signup(formData))
    }





const handleSubmit2 = async (e) => {
  e.preventDefault();

  try {
    await dispatch(sendOtp({ email: formData.email })).unwrap();

    // Store form data temporarily
    localStorage.setItem("signupData", JSON.stringify(formData));

    navigate("/verify-email");
  } catch (err) {
    console.log(err);
  }
};



const handleSubmit = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    return alert("Passwords do not match");
  }

  try {
    // 1️⃣ Save full form data in Redux
    dispatch(setPendingSignupData(formData));

    // 2️⃣ Send OTP
    await dispatch(sendOtp({ email: formData.email })).unwrap();

    // 3️⃣ Navigate to verify page
    navigate("/verify-email");

  } catch (err) {
    console.log(err);
  }
};


  return (
    <div className=''>
        <div
        
        className='min-h-screen  grid grid-cols-1 lg:grid-cols-2 bg-white'>

            <div className='flex flex-col justify-center items-center px-6'>
                 {/* Logo and heading */}
                    <div className='flex flex-col mx-auto items-center text-center w-full max-w-lg mb-10'>
                      
                         <div className="bg-blue-100 p-3 rounded-lg">
                            <MessagesSquare className='text-blue-600 w-6 h-6'/>   
                        </div>
                        <h1 className='text-2xl font-bold mt-4'>Create Account </h1>
                       
                        <p className='text-gray-500 text-sm mt-2'>Get Started with Your Free Account</p>
                    </div>

                    

                     {/* SignUp form */}
                                        <form onSubmit={handleSubmit}
                                        className='space-y-5'>


                                        {/* Full Name */}

                                        <div>
                                                <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                    Enter the first Name 
                                                </label>
                                                <div className='relative'>
                                                    <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
                                                    <User className='w-5 h-5'/>
                    
                                                    </span>
                                                    <input type='text' className='w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 focus:outline-none 
                                                    focus:ring-blue-500'
                                                    placeholder='abc'
                                                    value={formData.firstName}
                                                    onChange={(e)=>{
                                                        setFormData({...formData,firstName:e.target.value});
                                                    }}
                                                    />
                                                </div>
                                            </div>

                                            {/* lastName */}
                                            <div>
                                                <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                    Enter the last Name
                                                </label>
                                                <div className='relative'>
                                                    <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
                                                    <User className='w-5 h-5'/>
                    
                                                    </span>
                                                    <input type='text' className='w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 focus:outline-none 
                                                    focus:ring-blue-500'
                                                    placeholder='abc'
                                                    value={formData.lastName}
                                                    onChange={(e)=>{
                                                        setFormData({...formData,lastName:e.target.value});
                                                    }}
                                                    />
                                                </div>
                                            </div>



                                            {/* EMAIL */}
                                            <div>
                                                <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                    Eamil
                                                </label>
                                                <div className='relative'>
                                                    <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
                                                    <Mail className='w-5 h-5'/>
                    
                                                    </span>
                                                    <input type='email' className='w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 focus:outline-none 
                                                    focus:ring-blue-500'
                                                    placeholder='abc@gamil.com'
                                                    value={formData.email}
                                                    onChange={(e)=>{
                                                        setFormData({...formData,email:e.target.value});
                                                    }}
                                                    />
                                                </div>
                                            </div>


                                            {/* password and confirmPassWord field */}
                    
                                         <div className=''>

                                                     {/* Password */}
                    
                                                
                                            <div className='mb-3'>
                                                <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                    Password
                                                </label>
                                                <div className='relative'>
                                                    <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
                                                    <Lock className='w-5 h-5'/>
                    
                                                    </span>
                                                    <input type={showPassword ? "text":"password"} className='w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 focus:outline-none 
                                                    focus:ring-blue-500'
                                                    placeholder='Enter Your Pasword'
                                                    value={formData.password}
                                                    onChange={(e)=>{
                                                        setFormData({...formData,password:e.target.value});
                                                    }}
                                                    />
                                                    <button type='button' className='absolute right-3  -top-0 translate-y-1/2 text-gray-400'
                                                    onClick={()=> setShowPassword(!showPassword)}
                                                    >
                                                        {
                                                            showPassword ? (
                                                                <div>
                                                                    <EyeOff className='w-5 h-5 '/>
                                                                </div>
                                                            ):(<div>
                                                                <Eye className='w-5 h-5'/>
                                                            </div>)
                                                        }
                                                    
                                                     </button>
                                                </div>
                                            </div>


                                            {/* Confirm Password  */}


                                            <div className=''>
                                                <label className='block text-sm font-medium text-gray-700 mb-1'>
                                                   Confirm Password
                                                </label>
                                                <div className='relative'>
                                                    <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-400'>
                                                    <Lock className='w-5 h-5'/>
                    
                                                    </span>
                                                    <input type={showPassword1 ? "text":"password"} className='w-full border border-gray-300 rounded-md py-2 pl-10 pr-3 focus:outline-none 
                                                    focus:ring-blue-500'
                                                    placeholder='Enter Your Pasword'
                                                    value={formData.confirmPassword}
                                                    onChange={(e)=>{
                                                        setFormData({...formData,confirmPassword:e.target.value});
                                                    }}
                                                    />
                                                    <button type='button' className='absolute right-3 -top-0 translate-y-1/2 text-gray-400'
                                                    onClick={()=> setShowPassword1(!showPassword1)}
                                                    >
                                                        {
                                                            showPassword1 ? (
                                                                <div>
                                                                    <EyeOff className='w-5 h-5 '/>
                                                                </div>
                                                            ):(<div>
                                                                <Eye className='w-5 h-5'/>
                                                            </div>)
                                                        }
                                                    
                                                     </button>
                                                </div>
                                            </div>
                                                    

                                        </div>

                    
                                            {/* SubMit Button */}
                                            <div>
                                                <button className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-none
                                                transition duration-200 flex justify-center items-center gap-2 '
                                                disabled={isSendingOtp}
                                                >
                                                    {
                                                        isSendingOtp ? (
                                                            <div>
                                                                <Loader2 className='w-5 h-5 animate-spin'/>Loading ... 
                                                            </div>
                                                        ):(
                                                            "Sign In"
                                                        )}
                    
                                                </button>
                                            </div>
                                        </form>


                                    {/* Footer Link */}

                                    <div className='mt-5 text-center hover:bg-red-100'>
                        <p className='text-sm text-gray-500'> 
                            Already Have an Account ? {'-> '}
                            <Link to={'/login'} className='text-blue-600 hover:underline'>
                            Sign In</Link>
                        </p>

                                     </div>


                                     


                                        

            </div>
            {/* ANimation */}

                                     <div>
                <AuthImagePattern title={"Join the Community"} subtitle=
                {"Connect with the friend and family share your thpought and stay touch with your Friend and loved one's"}/>
            </div>

        </div>
      
    </div>
  )
}

export default Register
