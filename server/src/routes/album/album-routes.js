import express from 'express';
import * as views from "./album.js";
import {validate} from '../auth/auth.js'
import multer from "multer";

const router = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/", views.getAlbums);
router.get("/:id", views.getAlbumById);
router.post("/", validate, upload.fields([{ name: 'songs', maxCount: 100 }]), views.createAlbum)
router.delete("/:id", validate, views.deleteAlbum);

export default router;