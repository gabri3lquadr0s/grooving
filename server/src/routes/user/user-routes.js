import express from "express";
import * as views from "./user.js";
const router = express.Router();

//GET ROUTES
router.get("/", views.getUsers)
router.get("/:id", views.getUserById)
router.get("/:name", views.getUsersByName)

//POST ROUTES
router.post("/", views.createUser)

//PATCH ROUTES
router.patch("/:name", views.updateUser)

//DELETE ROUTES
router.patch("/:name", views.deleteUser)

export default router