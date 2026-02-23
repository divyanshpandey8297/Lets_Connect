// import { useEffect, useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
// import { useDispatch, useSelector } from 'react-redux'
// import { getUser, setOnlineUser } from './store/slices/authSlice'
// import { connect } from 'socket.io-client'
// import { connectSocket, disconnectSocket } from './lib/socket'
// import { Loader } from 'lucide-react'
// import { Routes } from 'react-router-dom'
// import { Router } from 'react-router-dom'
// import Navbar from './components/Navbar'
// import { ToastContainer } from 'react-toastify'

// const App=() => {
//   const {authUser,isCheckingAuth}=useSelector((state)=> state.auth)

//   const dispatch=useDispatch();
  
//   useEffect(()=>{
//     dispatch(getUser());

//   },[getUser])

//   useEffect(()=>{
//     if(authUser){
//       const socket=connectSocket(authUser._id);

//       socket.on("getOnlineUser",(users)=>{
//         dispatch(setOnlineUser(users));
//       });

//       return () => disconnectSocket();

//     }

//   },[authUser]);

//   if(isCheckingAuth && !authUser){
//     return <div className='flex items-center justif-center h-screen'>
//       <Loader className='size-10 animate-spin'/> 

//     </div>
//   }

//   return (
//     <>
//     <Router>
//       <Navbar/>
//       <Routes path="/" element={authUser ? <Home/> :<Navigate to={"/login"}/>} ></Routes>
//       <Routes
//       path="/register"
//       element={authUser ? <Register/> : <Navigate to={"/login"}/>}
//       />
//       <Routes
//       path="/login"
//       element={authUser ? <Login/> : <Navigate to={"/login"}/>}
//       />
//       <Routes
//       path="/profile"
//       element={authUser ? <Profile/> : <Navigate to={"/login"}/>}
//       />

//       <ToastContainer/>
//     </Router>
      
//     </>
//   )
// };

// export default App





import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUser, setOnlineUser } from "./store/slices/authSlice";
import { connectSocket, disconnectSocket } from "./lib/socket";
import { Loader } from "lucide-react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import Navbar from "./components/Navbar";
import { ToastContainer } from "react-toastify";

// import your pages
import Home from "./pages/Home.jsx";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Profile from "./pages/Profile.jsx";
import Navbar from "./components/Navbar.jsx";
import VerifyEmail from "./pages/verifyOtp.jsx";

// import Home from "./pages/Home.jsx"

const App = () => {
  const { authUser, isCheckingAuth } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
    // console.log("fetched the USER details ")
  }, [getUser]);

  useEffect(() => {
    if (authUser) {
      const socket = connectSocket(authUser._id);

      socket.on("getOnlineUsers", (users) => {
        dispatch(setOnlineUser(users));
      });

      return () => disconnectSocket();
    }
  }, [authUser, dispatch]);

  if (isCheckingAuth && !authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={authUser ? <Home /> : <Navigate to="/login" />}
        />

        
          <Route
  path="/verify-email"
  element={!authUser ? <VerifyEmail /> : <Navigate to="/" />}
/>
        

        <Route
          path="/register"
          element={!authUser ? <Register /> : <Navigate to="/" />}
        />

        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />

        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to="/login" />}
        />
      </Routes>

      <ToastContainer />
    </BrowserRouter>
  );
};

export default App;