import express from "express";
import * as views from "./stripe-func.js";
import {validate} from '../auth/auth.js';

const router = express.Router();

export default router;