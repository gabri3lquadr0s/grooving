import express from "express";
import * as views from "./song.js";
import {validate} from "../auth/auth.js";

const router = express.Router();

router.get("/", validate, views.getSongs);
router.get("/:id", validate, views.getSongById);
router.patch("/:id", validate, views.updateSongPlays);

export default router