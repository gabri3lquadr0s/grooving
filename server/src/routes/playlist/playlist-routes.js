import express from "express";
import * as views from "./playlist.js"
import {validate} from "../auth/auth.js";
import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", validate, views.getPlaylists);
router.get("/:id", validate, views.getPlaylistId);
router.post("/", validate, upload.fields([{ name: 'playlistImage', maxCount: 1 }]), views.createPlaylist);
router.post("/:id/songAction", validate, views.songAction);
router.post("/:id/share", validate, views.sharePlaylist);
router.post("/:id/confirmShare/:user", views.confirmShare);
router.post("/:id/removeShare", validate, views.removeSharePlaylist);
router.patch("/:id", validate, views.updatePlaylist);
router.delete("/:id", validate, views.deletePlaylist);

export default router;