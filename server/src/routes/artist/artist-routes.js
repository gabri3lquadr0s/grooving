import express from 'express';
import * as views from "./artist.js"
const router = express.Router();

router.get("/", views.test)

export default router;