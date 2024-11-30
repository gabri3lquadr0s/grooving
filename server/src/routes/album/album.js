import {parseStream} from "music-metadata";
import {uploadAudio, uploadImage} from "../../cloudinary/cloudinary.js";
import {Album, Song, Song_Genre, User} from "../../db/models.js";
import {Readable} from "node:stream";
import {Op, where} from "sequelize";

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
            console.log(song)
            //TO FIX --- CouldNotDetermineFileTypeError: Failed to determine audio format para alguns mp3 
            const metadata = await parseStream(bufferToStream(song.buffer), null, {duration: true});
            console.log(metadata);
            const durationsInSecs = Math.floor(metadata.format.duration);
            totalTimeInSec = totalTimeInSec + durationsInSecs;
            const upload = await uploadAudio(song);
            if(upload === "err") return res.status(500).send({
                "error": "There was an error in uploading the songs",
            });
            const createSong = await Song.create({
                name: song.originalname.split(".")[0],
                totalTimeSec: totalTimeInSec,
                link: upload,
                AlbumId: createAlbum.dataValues.id,
                GenreId: data.genre
            });
            const createRelationWithGenre = await Song_Genre.create({
                SongId: createSong.dataValues.id,
                GenreId: data.genre,
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
        console.log(e)
        return res.status(500).send({
            "error": `${e}`,
        });
    }
}

const getAlbums = async (req, res) => {
    try {
        let albums;
        let { page, size, type, name, trending, includeSongs, artist } = req.query;
        if(!type) type = "lp";
        if(!page) page = 0;
        if(!size || size === "0") size = 10;
        if(!name || name === "") name = "";
        if(!includeSongs) includeSongs = false;
        if(!artist) artist = null;

        page = parseInt(page);
        size = parseInt(size);

        const whereConditions = {};
        if(type !== "all") {
            whereConditions.type = type;
        }
        const includeConditions = [{model: User, attributes: ["username"]}]
        if(name) {
            whereConditions.name = {
                [Op.iLike]: `%${name}%`
            }
        }
        if(includeSongs) {
            includeConditions.push({model: Song});
        }
        if(artist) {
            whereConditions.UserId = artist;
        }
        if(page === 0) {
            albums = await Album.findAll({
                where: whereConditions,
                include: includeConditions
            });
        }
        if(page === 1) {
            albums = await Album.findAll({
                limit: size,
                where: whereConditions,
                include: includeConditions
            });
        }
        if(page > 1) {
            albums = await Album.findAll({
                limit: size,
                offset: (page - 1) * size,
                where: whereConditions,
                include: includeConditions
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
            include: [{model: Song},{model: User, attributes: ["username"]}],
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