import express from "express";
import * as views from "./genre.js"
import {validate} from "../auth/auth.js";

const router = express.Router();

router.get("/", views.getGenres);
router.get("/:id", views.getGenreById);
router.post("/", validate, views.createGenre);
router.delete("/:id", validate, views.deleteGenre);

export default  router;