// const express=require("express")
import express from "express"
import { signup,signin,signout,updateProfile,getUser } from "../controllers/user.controller.js"
import { isAuthenticated } from "../middleware/auth.middleware.js";

// const router=express.router()
const router=express.Router();
router.post("/signup",signup)
router.post("/sign-in",signin)
router.get("/sign-out",isAuthenticated,signout)
router.get("/getUser",isAuthenticated,getUser);
router.put("/update-profile",isAuthenticated,updateProfile)

export default router;

  


