import {User} from "../../db/models.js";
import * as bcrypt from 'bcrypt';
import {uploadImage} from "../../cloudinary/cloudinary.js";
import {Op} from "sequelize";

const createUser = async (req, res) => {
    try {
        const data = req.body;

        const checkForEmail = await User.findAll({
            where: {
                email: data.email,
            },
        });
        if(checkForEmail[0] !== undefined){
            return res.status(400).send({
                "error": "Email already exists",
            });
        }

        const checkForUsername = await User.findAll({
            where: {
                username: data.username,
            },
        });
        if(checkForUsername[0] !== undefined){
            return res.status(400).send({
                "error": "Username already exists",
            });
        }

        if(req.files) {
            const imageFile = req.files['profilePic'][0];
            const upload = await uploadImage(imageFile);
            if(upload !== "err") data.profileImage = upload;
        }

        const salt = await bcrypt.genSalt();
        data.password = await bcrypt.hash(data.password, salt);

        const createUser = await User.create(data);
        return res.status(201).send({
            "status": "success",
            "data": createUser,
        });
    }
    catch(e) {
        console.log(e)
        return res.status(500).send({
            "error": e,
        });
    }
}

const getUsers = async (req, res) => {
    try {
        let users;
        let { page, size, userType, username } = req.query;
        if(!userType) userType = "artist";
        if(!page) page = 0;
        if(!size || size === "0") size = 20;
        if(!username || username === "") username = "";

        page = parseInt(page);
        size = parseInt(size);

        const whereConditions = {
            userType: userType
        };
        if(username) {
            whereConditions.username = {
                [Op.like]: `%${username}%`
            }
        }

        if(page === 0) {
            users = await User.findAll({
                attributes: {
                    exclude: ['password']
                },
                where: whereConditions,
            });
        }
        if(page === 1) {
            users = await User.findAll({
                limit: size,
                attributes: {
                    exclude: ['password']
                },
                where: whereConditions,
            });
        }
        if(page > 1) {
            users = await User.findAll({
                limit: size,
                offset: (page - 1) * size,
                attributes: {
                    exclude: ['password']
                },
                where: whereConditions,
            });
        }
        return res.status(200).send({
            "status": "success",
            "data": users,
        });
    }
    catch(e) {
        return res.status(500).send({
            "error": `${e}`,
        });
    }
}

const getUserById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const user = await User.findOne({
            where: {
                id: id
            },
            attributes: {
                exclude: ['password']
            },
        });
        if(!user){
            return res.status(400).send({
                "error": "User does not exist",
            });
        }

        return res.status(200).send({
            "status": "success",
            "data": user
        });
    }
    catch(e) {
        return res.status(500).send({
            "error": `${e}`,
        });
    }
}

const updateUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;

        const userExists = await User.findOne({where: {id: id}});
        if(!userExists){
            return res.status(400).send({
                "error": "User does not exist",
            });
        }

        if(req.files) {
            const imageFile = req.files['profilePic'][0];
            const upload = await uploadImage(imageFile);
            if(upload !== "err") data.profileImage = upload;
        }

        if(data.password) {
            const salt = await bcrypt.genSalt();
            data.password = await bcrypt.hash(data.password, salt);
        }

        const updateUser = await User.update(
            data,
            {
                where: {
                    id: id,
                }
            },
        );
        return res.status(200).json({ "status": "success" });
    }
    catch(e) {
        console.log(e)
        return res.status(500).send({
            "error": `${e}`,
        });
    }
}

const deleteUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const userExists = await User.findOne({where: {id: id}});
        if(!userExists){
            return res.status(400).send({
                "error": "User does not exist",
            });
        }

        const delUser = await User.destroy({
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

export { createUser, getUsers, getUserById, updateUser, deleteUser }