import {parseStream} from "music-metadata";
import {uploadAudio, uploadImage} from "../../cloudinary/cloudinary.js";
import {Album, Song} from "../../db/models.js";
import {Readable} from "node:stream";
import {Op} from "sequelize";

const createAlbum = async (req, res) => {
    try {
        const data = req.body;
        const user = req.user;
        const songs = req.files["songs"];
        let albumImage = "";
        try {
            albumImage = req.files["albumImage"][0];
        }
        catch {}

        let totalTimeInSec = 0;

        if(albumImage) {
            const upload = await uploadImage(albumImage);
            if(upload !== "err") albumImage = upload;
        }

        const createAlbum = await Album.create({
            name: data.name,
            type: data.type,
            albumImage: albumImage,
            UserId: user.id
        });

        const bufferToStream = (buffer) => {
            const readable = new Readable();
            readable._read = () => {};
            readable.push(buffer);
            readable.push(null);
            return readable;
        }

        for(let song of songs){
            const metadata = await parseStream(bufferToStream(song.buffer), null, {duration: true});
            const durationsInSecs = Math.floor(metadata.format.duration);
            totalTimeInSec += durationsInSecs;
            const upload = await uploadAudio(song);
            if(upload === "err") return res.status(500).send({
                "error": "There was an error in uploading the songs",
            });
            const createSong = await Song.create({
                name: song.originalname.split(".")[0],
                totalTimeSec: totalTimeInSec,
                link: upload,
                AlbumId: createAlbum.dataValues.id
            });
        }

        const updateAlbumWithTotalTIme = await Album.update(
            { totalTimeSec: totalTimeInSec },
            {where: { id: createAlbum.dataValues.id }},
        );

        return res.status(201).send({
            "status": "success",
            "data": {createAlbum},
        });
   }
    catch(e) {
        return res.status(500).send({
            "error": `${e}`,
        });
    }
}

const getAlbums = async (req, res) => {
    try {
        let albums;
        let { page, size, type, name } = req.query;
        if(!type) type = "lp";
        if(!page) page = 0;
        if(!size || size === "0") size = 20;
        if(!name || name === "") name = "";

        page = parseInt(page);
        size = parseInt(size);

        const whereConditions = {
            type: type
        };
        if(name) {
            whereConditions.name = {
                [Op.like]: `%${name}%`
            }
        }

        if(page === 0) {
            albums = await Album.findAll({
                where: whereConditions,
                include: {
                    model: Song,
                },
            });
        }
        if(page === 1) {
            albums = await Album.findAll({
                limit: size,
                where: whereConditions,
                include: {
                    model: Song,
                },
            });
        }
        if(page > 1) {
            albums = await Album.findAll({
                limit: size,
                offset: (page - 1) * size,
                where: whereConditions,
                include: {
                    model: Song,
                },
            });
        }
        return res.status(200).send({
            "status": "success",
            "data": albums,
        });
    }
    catch(e) {
        return res.status(500).send({
            "error": `${e}`,
        });
    }
}

const getAlbumById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const album = await Album.findOne({
            where: {
                id: id
            },
            include: {
                model: Song,
            },
        });
        if(!album){
            return res.status(400).send({
                "error": "Album does not exist",
            });
        }

        return res.status(200).send({
            "status": "success",
            "data": album
        });
    }
    catch(e) {
        return res.status(500).send({
            "error": `${e}`,
        });
    }
}

const deleteAlbum = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const user = req.user.id;

        const albumExists = await Album.findOne({where: {id: id, UserId: user}});
        if(!albumExists){
            return res.status(400).send({
                "error": "User does not exist",
            });
        }

        const delAlbum = await Album.destroy({
            where: {
                id: id,
            },
        });

        return res.status(200).json({ "status": "success" });
    }
    catch(e) {
        return res.status(500).send({
            "error": `${e}`,
        });
    }
}

export {createAlbum, deleteAlbum, getAlbumById, getAlbums}