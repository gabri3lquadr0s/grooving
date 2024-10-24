import {Genre} from "../../db/models.js";
import {Op} from "sequelize";

const createGenre = async (req, res) => {
    try {
        const name = req.body.name;
        const checkIfExists = await Genre.findOne({
            where: {
                name: name.toUpperCase(),
            },
        });
        if(checkIfExists) {
            return res.status(400).send({
                "error": "Genre already exists",
            });
        }

        const createGenre = await Genre.create({
            name: name.toUpperCase(),
        });
        return res.status(200).send({
            "status": "success",
            "data": createGenre,
        });
    }
    catch(e) {
        return res.status(500).send({
            "error": `${e}`,
        });
    }
}

const getGenres = async (req, res) => {
    try {
        let genres;
        let { page, size, name } = req.query;
        if(!size || size === "0") size = 20;
        if(!page) page = 0;
        if(!name || name === "") name = "";

        page = parseInt(page);
        size = parseInt(size);

        const whereConditions = {};
        if(name) {
            whereConditions.name = {
                [Op.like]: `%${name}%`
            }
        }

        if(page === 0) {
            genres = await Genre.findAll({
                where: whereConditions,
            });
        }
        if(page === 1) {
            genres = await Genre.findAll({
                limit: size,
                where: whereConditions,
            });
        }
        if(page > 1) {
            genres = await Genre.findAll({
                limit: size,
                offset: (page - 1) * size,
                where: whereConditions,
            });
        }
        return res.status(200).send({
            "status": "success",
            "data": genres,
        });
    }
    catch(e) {
        return res.status(500).send({
            "error": `${e}`,
        });
    }
}

const getGenreById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const genre = await Genre.findOne({
            where: {
                id: id
            },
        });
        if(!genre){
            return res.status(400).send({
                "error": "Genre does not exist",
            });
        }

        return res.status(200).send({
            "status": "success",
            "data": genre
        });
    }
    catch(e) {
        return res.status(500).send({
            "error": `${e}`,
        });
    }
}

const deleteGenre = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const genreExists = await Genre.findOne({
            where: {
                id: id,
            },
        });
        if(!genreExists) {
            return res.status(400).send({
                "error": "Genre does not exist",
            });
        }

        const delGenre = await Genre.destroy({
            where: {
                id: id,
            },
        });

        return res.status(200).send({
            "status": "success",
        })
    }
    catch(e) {
        return res.status(500).send({
            "error": `${e}`,
        });
    }
}

export {createGenre, getGenreById, getGenres, deleteGenre}

