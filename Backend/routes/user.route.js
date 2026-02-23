// const express=require("express")
import express from "express"
import { signup,signin,signout,updateProfile,getUser, sendOtp } from "../controllers/user.controller.js"
import { isAuthenticated } from "../middleware/auth.middleware.js";

// const router=express.router()
const router=express.Router();

router.post("/sign-up",signup)
router.post("/sign-in",signin)
router.post('/sendotp', sendOtp);

router.get("/sign-out",isAuthenticated,signout)
router.get("/me",isAuthenticated,getUser);
router.put("/update-profile",isAuthenticated,updateProfile)

export default router;

  


