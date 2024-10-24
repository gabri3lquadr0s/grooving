import {Song, Genre, User_History} from "../../db/models.js";
import {Op} from "sequelize";

const getSongs = async (req, res) => {
    try {
        let songs;
        let { page, size, genre, name } = req.query;
        if(!page) page = 0;
        if(!genre) genre = "";
        if(!size || size === "0") size = 20;
        if(!name || name === "") name = "";

        page = parseInt(page);
        size = parseInt(size);

        const whereConditions = {};
        const include = {model: Genre};
        if(genre) {
            include.where = {name: genre};
        }
        if(name) {
            whereConditions.name = {
                [Op.like]: `%${name}%`
            }
        }

        if(page === 0) {
            songs = await Song.findAll({
                where: whereConditions,
                include: include
            });
        }
        if(page === 1) {
            songs = await Song.findAll({
                limit: size,
                where: whereConditions,
                include: include
            });
        }
        if(page > 1) {
            songs = await Song.findAll({
                limit: size,
                offset: (page - 1) * size,
                where: whereConditions,
                include: include
            });
        }
        return res.status(200).send({
            "status": "success",
            "data": songs,
        });
    }
    catch(e) {
        return res.status(500).send({
            "error": `${e}`,
        });
    }
}

const getSongById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const song = await Song.findOne({
            where: {
                id: id
            },
            include: {
                model: Genre
            }
        });
        if(!song){
            return res.status(400).send({
                "error": "Song does not exist",
            });
        }

        return res.status(200).send({
            "status": "success",
            "data": song
        });
    }
    catch(e) {
        return res.status(500).send({
            "error": `${e}`,
        });
    }
}

const updateSongPlays = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const checkSong = await Song.findOne({
            where: {
                id: id,
            }
        });
        if(!checkSong) {
            return res.status(400).send({
                "error": "Song does not exist",
            });
        }

        const update = await Song.update({
            totalPlays: checkSong.totalPlays + 1,
            where: {
                id: id,
            }
        });

        return res.status(200).send({
            "status": "success",
        });
    }
    catch(e) {
        return res.status(500).send({
            "error": `${e}`,
        });
    }
}



export { getSongs, getSongById, updateSongPlays };