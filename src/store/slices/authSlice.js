import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { axiosInstance } from "../../lib/axios";
import { disconnectSocket, connectSocket } from "../../lib/socket";
import { toast } from "react-toastify";
import { data } from "react-router-dom";
// import { response } from "express";

export const getUser = createAsyncThunk("users/me", async (_, thunkAPI) => {
  try {
    const res = await axiosInstance.get("/user/me");

    // connect socket with userId
    // console.log("GetUser API RESPONCSE ... ",res);
    connectSocket(res.data.user._id);

    return res.data.user;
  } catch (err) {
    // console.log("ERROR FETCHING GETUSER API...", err);
    return thunkAPI.rejectWithValue(
      err.response?.data || "failed to fetch user"
    );
  }
});

export const logout = createAsyncThunk("/user/sign-out", async (_, thunkAPI) => {
  try {
    await axiosInstance.get("/user/sign-out");

    disconnectSocket();
    return null;
  } catch (error) {
    toast.error(error.response?.data.message);
    return thunkAPI.rejectWithValue(error.response?.data.message);
  }
});

export const login = createAsyncThunk("user/sign-in", async (data, thunkAPI) => {
  try {
    const res = await axiosInstance.post("/user/sign-in", data);

    // connect socket with userId
    // console.log("RESponse Of the Login Api RESPONSE ...",res)
    connectSocket(res.data.user._id);
    

    toast.success("Logged in successfully");
    localStorage.setItem("token", res.data.token);
    return res.data.user;
  } catch (error) {
    
    toast.error(error.response?.data.message);
    return thunkAPI.rejectWithValue(error.response?.data.message);
  }
});

export const signup=createAsyncThunk("user/sign-up",async(data,thunkAPI)=>{
    try{
        const res=await axiosInstance.post("/user/sign-up",data);
        // console.log("SIGN-UP AUTH IS RES IS ... ",res)
        connectSocket(res.data.user._id);
        toast.success("Account Created SuccessFully");
        return res.data.user


    }
    catch(error){
        console.error(error);
        toast.error(error.response.data.message);
        return thunkAPI.rejectWithValue(error.response.data.message);
    }
});


export const updateProfile=createAsyncThunk("user/update-profile",async(data,thunkAPI)=>{
try{
    const res=await axiosInstance.put("/user/update-profile",data);
    // console.log("RESULT OF THE UPDATE-PROFILE API ... ",res);
    return res.data

}catch(error){
    toast.error(error.response.data.message);
    return thunkAPI.rejectWithValue(error.response.data.message);

}
})


export const sendOtp=createAsyncThunk("user/sendotp",async(data,thunkAPI)=>{
  try{
    const res=await axiosInstance.post("/user/sendotp",data);
    // console.log("THE RESPONSE OF THE SENDOTP IS ..." ,res);
    toast.success("otp is send successfully");
    return res.data

  }catch(error){
    toast.error("error while sending the otp")
    console.error(error.response.message.error);
    return thunkAPI.rejectWithValue(error.response.message.error)
  }
})



const authSlice = createSlice({
  name: "auth",
  initialState: {
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile: false,
    isCheckingAuth: true,
    isSendingOtp: false,
    onlineUsers: [],
    pendingSignupData: null,
  },

  reducers: {
    setOnlineUser(state, action) {
      state.onlineUsers = action.payload;
    },


 setPendingSignupData: (state, action) => {
      state.pendingSignupData = action.payload;
    },
    clearPendingSignupData: (state) => {
      state.pendingSignupData = null;
    },
 

    
    
  },
  

  extraReducers: (builder) => {
    builder
      .addCase(getUser.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isCheckingAuth = false;
      })
      .addCase(getUser.rejected, (state) => {
        state.authUser = null;
        state.isCheckingAuth = false;
      })

      .addCase(logout.fulfilled, (state) => {
        state.authUser = null;
      })

      .addCase(login.pending, (state) => {
        state.isLoggingIn = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.authUser = action.payload;
        state.isLoggingIn = false;
      })
      .addCase(login.rejected, (state) => {
        state.isLoggingIn = false;
      })
      .addCase(signup.pending,(state)=>{
        state.isSigningUp=true;
      })
      .addCase(signup.fulfilled,(state,action)=>{
        state.authUser=action.payload;
        state.isSigningUp=false
      })
      .addCase(signup.rejected,(state)=>{
      
        state.isSigningUp=false
      })
      .addCase(updateProfile.pending,(state)=>{
        state.isUpdatingProfile=true;
      })
      .addCase(updateProfile.fulfilled,(state,action)=>{
        state.authUser=action.payload;
        state.isUpdatingProfile=false
      })
      .addCase(updateProfile.rejected,(state)=>{
      
        state.isUpdatingProfile=false
      })
      .addCase(sendOtp.pending,(state)=>{
        state.isSendingOtp=true
      })
      .addCase(sendOtp.fulfilled,(state)=>{
        
        state.isSendingOtp=false
      })
      .addCase(sendOtp.rejected,(state)=>{
        state.isSendingOtp=false
      })
      
  },
});

export const { setOnlineUser ,clearPendingSignupData,setPendingSignupData} = authSlice.actions;
export default authSlice.reducer;