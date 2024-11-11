import express from "express";
import * as views from "./user.js";
import {validate} from '../auth/auth.js'
import multer from 'multer'

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", views.getUsers)
router.get("/:id", views.getUserById)
router.post("/", upload.fields([{ name: 'profilePic', maxCount: 1 }]), views.createUser)
router.patch("/:id", validate, upload.fields([{ name: 'profilePic', maxCount: 1 }]), views.updateUser)
router.delete("/:id", validate, views.deleteUser)

export default router;
