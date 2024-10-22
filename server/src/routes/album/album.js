import {parseStream} from "music-metadata";
import {uploadAudio, uploadImage} from "../../cloudinary/cloudinary.js";
import {Album, Song} from "../../db/models.js";
import {Readable} from "node:stream";

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

    }
    catch(e) {

    }
}

const getAlbumById = async (req, res) => {
    try {

    }
    catch(e) {

    }
}

const deleteAlbum = async (req, res) => {
    try {

    }
    catch(e) {

    }
}

export {createAlbum, deleteAlbum, getAlbumById, getAlbums}