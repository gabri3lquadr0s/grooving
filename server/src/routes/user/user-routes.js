import express from "express";
import * as views from "./user.js";
import {validate, validateOwner} from '../auth/auth.js'
const router = express.Router();

router.get("/", views.getUsers)
router.get("/:id", views.getUserById)
router.get("/:name", views.getUsersByName)
router.post("/", views.createUser)
router.patch("/:id", validate, validateOwner, views.updateUser)
router.delete("/:id", validate, validateOwner, views.deleteUser)

export default router;
