import express from "express"
import { isAuthenticated } from "../middleware/auth.middleware.js";
const router=express.Router();

import{
    getAllUser,
    getMessages,
    sendMessages
} from "../controllers/message.controller.js"
// import { isAuthenticated } from "../middleware/auth.middleware";


router.get("/users",isAuthenticated,getAllUser);
router.get("/id",isAuthenticated,getMessages);
router.post("/send/:id",isAuthenticated,sendMessages);




export default router