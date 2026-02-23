import React, { useState } from 'react'
import { Eye,EyeOff,Loader2,Lock,Mail,MessagesSquare } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { login } from '../store/slices/authSlice';
import AuthImagePattern from '../components/AuthImagePattern';

const Login = () => {
    const [showPassword,setShowPassword]=useState(false);
    const [formData,setFormData]=useState({
        email:"",
        password:"",
    });

    const {isLoggingIn}=useSelector((state)=>state.auth)
    const dispatch=useDispatch();

    const handleSubmit=(e)=>{
        e.preventDefault();
        dispatch(login(formData))
    }

  return (
    <div>
        <div className='min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-white'>
            
            
            {/* Left SIde */}
            <div className='flex flex-cols justify-center items-center px-6'>
                <div className='w-full max-w-md'>

                    {/* Logo and heading */}
                    <div className='flex flex-col items-center text-center mb-10'>
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <MessagesSquare className='text-blue-600 w-6 h-6'/>   
                        </div>
                        <h1 className='text-2xl font-bold mt-4'>Welcome Back</h1>
                        <p className='text-gray-500 text-sm mt-2'>Sign in Your Account</p>
                    </div>
                   

                    {/* Login form */}
                    <form onSubmit={handleSubmit}
                    className='space-y-6'>
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

                        {/* Password */}

                            
                                 <div>
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
                                <button type='button' className='absolute right-3 -top-0 hover:scale-105 translate-y-1/2 text-gray-400'
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

                        {/* SubMit Button */}
                        <div>
                            <button className='w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-none
                            transition duration-200 flex justify-center items-center gap-2 '>
                                {
                                    isLoggingIn ? (
                                        <div>
                                            <Loader2 className='w-5 h-5 animate-spin'/>Loading ... 
                                        </div>
                                    ):(
                                        "Sign In"
                                    )}

                            </button>
                        </div>
                    </form>


                    {/* Footer */}
                    <div className='mt-5 text-center hover:bg-red-100'>
                        <p className='text-sm text-gray-500'> 
                            Don&apos;t Have an Account ? {'-> '}
                            <Link to={'/register'} className='text-blue-600 hover:underline'>
                            Create An Account</Link>
                        </p>

                    </div>
                     <div className='pt-32'>
                        <h1 className='text-xs'>for testing used email1.   1234@gmail.com.     password is - 1212</h1>
                        <h1 className='text-xs'>for testing used email2.   456@gmail.com.     password is - 1212</h1>
                    </div>

                </div>

            </div>
            <div>
                <AuthImagePattern title={"Welcome back!"} subtitle={"sign in to continue and catch up with your message"}/>
            </div>

        </div>
      
    </div>
  )
}

export default Login
