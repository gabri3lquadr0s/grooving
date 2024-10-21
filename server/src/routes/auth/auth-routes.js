import express from 'express';
import * as views from "./auth.js"
const router = express.Router();

router.post("/", views.login)

export default router;