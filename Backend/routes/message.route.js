import express from "express"
import { isAuthenticated } from "../middleware/auth.middleware.js";
const router=express.Router();

import{
    getAllUser,
    getChatsForSidebar,
    getMessages,
    getUnseenPerUser,
    markAsSeen,
    sendMessages
} from "../controllers/message.controller.js"
// import { isAuthenticated } from "../middleware/auth.middleware";


router.get("/users",isAuthenticated,getAllUser);
router.get("/unseen",isAuthenticated,getUnseenPerUser)
router.get("/sidebar-chats",isAuthenticated,getChatsForSidebar)

router.get("/:id",isAuthenticated,getMessages);
router.post("/send/:id",isAuthenticated,sendMessages);
router.post("/mark-seen",isAuthenticated,markAsSeen);





export default router