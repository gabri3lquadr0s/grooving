import {PlaysList, PlayList_User, Song_PlayList, Song, User} from "../../db/models.js";
import {Op} from "sequelize";
import {uploadImage} from "../../cloudinary/cloudinary.js";

const createPlaylist = async (req, res) => {
    try {
        const name = req.body.name;
        const user = req.user.id;
        let playlistImage = "";
        try {
            playlistImage = req.files["playlistImage"][0];
        }
        catch {}

        const checkIfExistsWithSameName = await PlaysList.findOne({
            where: {
                name: name,
            }
        });
        const checkIfExistsInUser = await PlayList_User.findOne({
            where: {
                PlayListId: checkIfExistsWithSameName.id,
                UserId: user,
            },
        });
        if(checkIfExistsInUser && checkIfExistsInUser) {
            return res.status(400).send({
                "error": "PlayList name already exists",
            });
        }

        if(playlistImage) {
            const upload = await uploadImage(playlistImage);
            if(upload !== "err") playlistImage = upload;
        }

        const createPlaylist = await PlaysList.create({
            name: name,
            playlistImage: playlistImage,
        });
        const associatePlaylistWithUser = await PlayList_User.create({
            PlaysListId: createPlaylist.id,
            UserId: user,
            isOwner: true,
        });

        return res.status(201).send({
            "status": "success",
            "data": createPlaylist,
        });
    }
    catch(e) {
        return res.status(500).send({
            "error": `${e}`,
        });
    }
}

const getPlaylists = async (req, res) => {
    try {
        let playlists;
        let { page, size, name } = req.query;
        if(!page) page = 0;
        if(!size || size === "0") size = 20;
        if(!name || name === "") name = "";

        const whereConditions = {};
        if(name) {
            whereConditions.name = {
                [Op.like]: `%${name}%`
            }
        }

        if(page === 0) {
            playlists = await PlaysList.findAll({
                where: whereConditions,
            });
        }
        if(page === 1) {
            playlists = await PlaysList.findAll({
                where: whereConditions,
                limit: size,
            });
        }
        if(page > 1) {
            playlists = await PlaysList.findAll({
                where: whereConditions,
                limit: size,
                offset: (page - 1) * size,
            });
        }

        return res.status(200).send({
            "status": "success",
            "data": playlists,
        });
    }
    catch(e) {
        return res.status(500).send({
            "error": `${e}`,
        });
    }
}

const getPlaylistId = async (req, res) => {
    try {
        const id = req.params.id;

        const playlist = await PlaysList.findOne({
            where: {
                id: id,
            },
            include: Song
        });
        if(!playlist) {
            return res.status(404).send({
                "error": "Playlist does not exist",
            });
        }

        return res.status(200).send({
            "status": "success",
            "data": playlist,
        });
    }
    catch(e) {
        return res.status(500).send({
            "error": `${e}`,
        });
    }
}

const songAction = async (req, res) => {
    try {
        const data = req.body.songs;
        const action = req.body.action;
        const playlist = req.params.id;
        const user = req.user.id;

        const playlistExists = await PlayList_User.findOne({
            where: {
                PlayListId: playlist,
                UserId: user,
            },
        });
        if(!playlistExists) {
            return res.status(404).send({
                "error": "Playlist not found"
            });
        }

        if(data.constructor === Array || data[0] === undefined) {
            return res.status(400).send({
                "error": "No songs in body",
            });
        }

        let err = 0;
        if(action === "add") {
            for(let song of data) {
                const checkIfSongExists = await Song.findOne({
                    where: {
                        id: song,
                    }
                });
                if(!checkIfSongExists) {
                    err++;
                    continue;
                }
                const associateSongWithPlaylist = await Song_PlayList.create({
                    PlayListId: playlist,
                    SongId: song,
                });
            }
        }
        else if(action === "remove") {
            for(let song of data) {
                const checkIfSongExists = await Song.findOne({
                    where: {
                        id: song,
                    }
                });
                if(!checkIfSongExists) {
                    err++;
                    continue;
                }
                const associateSongWithPlaylist = await Song_PlayList.destroy({
                    PlayListId: playlist,
                    SongId: song,
                });
            }
        }
        else {
            return res.status(400).send({
                "error": "Invalid action",
            });
        }


        if(err !== 0) {
            return res.status(200).send({
                "status": "success, but some songs failed"
            });
        }

        return res.status(200).send({
            "status": "success"
        });
    }
    catch(e) {
        return res.status(500).send({
            "error": `${e}`,
        });
    }
}

const sharePlaylist = async (req, res) => {
    try {
        const userToShare = req.body.userToShare;
        const user = req.user.id;
        const playlist = req.params.id;

        const checkIfPlaylistExists = await PlayList_User.findOne({
            where: {
                UserId: user,
                PlayListId: playlist,
            }
        });
        if(!checkIfPlaylistExists) {
            return res.status(404).send({
                "error": "Playlist does not exist"
            });
        }
        if(!checkIfPlaylistExists.isOwner) {
            return res.status(401).send({
                "error": "Unauthorized",
            });
        }

        const checkIfUserExists = await User.findOne({
            where: {
                email: userToShare,
            }
        });
        if(!checkIfUserExists) {
            return res.status(404).send({
                "error": "User does not exist"
            });
        }

        const checkIfItsNotAlreadyShared = await PlayList_User.findOne({
            where: {
                UserId: userToShare,
                PlayListId: playlist,
            }
        });
        if(checkIfItsNotAlreadyShared) {
            return res.status(404).send({
                "error": "Playlist already shared with user"
            });
        }

        return res.status(200).send({
            "status": "success",
            "shareLink": `http://10.0.0.2:8000/v1/playlist/${playlist}/confirmShare/${userToShare}`
        });
    }
    catch(e) {
        return res.status(500).send({
            "error": `${e}`,
        });
    }
}

const confirmShare = async (req, res) => {
    try {
        const playlist = req.params.id;
        const user = req.params.user;

        const createRelation = await PlayList_User.create({
            UserId: user,
            PlaysListId: playlist
        });

        return res.status(200).send({
            "status": "success"
        });
    }
    catch(e) {
        return res.status(500).send({
            "error": `${e}`,
        });
    }
}

const removeSharePlaylist = async (req, res) => {
    try {
        const userShared = req.body.userShared;
        const playlist = req.params.id;

        const checkIfUserExists = await User.findOne({
            where: {
                email: userShared,
            }
        });
        if(!checkIfUserExists) {
            return res.status(404).send({
                "error": "User does not exist"
            });
        }

        const checkIfItsNotAlreadyShared = await PlayList_User.findOne({
            where: {
                UserId: userShared,
                PlayListId: playlist,
            }
        });
        if(!checkIfItsNotAlreadyShared) {
            return res.status(404).send({
                "error": "User does not have access to playlist"
            });
        }

        const delRelation = await PlayList_User.destroy({
            where: {
                UserId: userShared,
                PlayListId: playlist
            }
        });

        return res.status(200).send({
            "status": "success"
        });
    }
    catch(e) {
        return res.status(500).send({
            "error": `${e}`,
        });
    }
}

//TODO Include update of picture
const updatePlaylist = async (req, res) => {
    try {
        const playlist = parseInt(req.params.id);
        const newName = req.body.name;
        const user = req.user.id;

        const checkIfPlaylistExists = await PlayList_User.findOne({
            where: {
                UserId: user,
                PlayListId: playlist
            },
        });
        if(!checkIfPlaylistExists) {
            return res.status(404).send({
                "error": "Playlist does not exist",
            });
        }

        const updateStuff = await PlaysList.update({
            where: {
                id: playlist,
            },
            name: newName,
        });

        return res.status(200).send({
            "status": "success"
        });
    }
    catch(e) {
        return res.status(500).send({
            "error": `${e}`,
        });
    }
}

const deletePlaylist = async (req, res) => {
    try {
        const playlist = parseInt(req.params.id);
        const user = req.user.id;

        const playlistExists = await PlayList_User.findOne({
            where: {
                UserId: user,
                PlayListId: playlist
            },
        });
        if(!playlistExists) {
            return res.status(404).send({
                "error": "Playlist does not exist",
            });
        }

        const deleteStuff = await PlaysList.destroy({
            where: {
                id: playlist,
            },
        });

        return res.status(200).send({
            "status": "success"
        });
    }
    catch(e) {
        return res.status(500).send({
            "error": `${e}`,
        });
    }
}

export { createPlaylist, getPlaylists, getPlaylistId, updatePlaylist, deletePlaylist, sharePlaylist, removeSharePlaylist, confirmShare, songAction }