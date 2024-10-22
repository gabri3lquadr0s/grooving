const createAlbum = async (req, res) => {
    try {
        const data = req.body;
        const user = req.user;
        console.log(user);
        return res.status(201).send({
            "status": "success",
            "data": {},
        });
    }
    catch(e) {

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