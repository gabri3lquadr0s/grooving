import {User} from "../../db/models.js";
import * as bcrypt from 'bcrypt';

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

        if(data.profileImage){
            //make logic for profile pic
        }

        //make logic for 2fa

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
        let { page, size } = req.query;
        if(page === undefined) page = 0;
        if(size === undefined || size === 0) size = 20;
        page = parseInt(page);
        size = parseInt(size);

        if(page === 0) {
            users = await User.findAll({
                attributes: {
                    exclude: ['password']
                },
            });
        }
        if(page === 1) {
            users = await User.findAll({
                limit: size,
                attributes: {
                    exclude: ['password']
                },
            });
        }
        if(page > 1) {
            users = await User.findAll({
                limit: size,
                offset: (page - 1) * size,
                attributes: {
                    exclude: ['password']
                },
            });
        }
        return res.status(200).send({
            "status": "success",
            "data": users,
        });
    }
    catch(e) {
        return res.status(500).send({
            "error": e,
        });
    }
}


const getUserById = async (req, res) => {
    try {
        let { id } = req.query;
        id = parseInt(id);

        const user = await User.findAll({
            where: {
                id: id,
            },
            attributes: {
                exclude: ['password']
            },
        });
        if(user[0] === undefined){
            return res.status(400).send({
                "error": "User does not exist",
            });
        }

        return res.status(200).send({
            "status": "success",
            "data": user[0]
        });
    }
    catch(e) {
        return res.status(500).send({
            "error": e,
        });
    }
}

const getUsersByName = async (req, res) => {
    try {
        let users;
        let { page, size, userName } = req.query;
        if(page === undefined) page = 0;
        if(size === undefined || size === 0) size = 20;
        page = parseInt(page);
        size = parseInt(size);

        if(page === 0) {
            users = await User.findAll({
                where: {
                  username: userName,
                },
                attributes: {
                    exclude: ['password']
                },
            });
        }
        if(page === 1) {
            users = await User.findAll({
                where: {
                    username: userName,
                },
                attributes: {
                    exclude: ['password']
                },
                limit: size,
            });
        }
        if(page > 1) {
            users = await User.findAll({
                where: {
                    username: userName,
                },
                attributes: {
                    exclude: ['password']
                },
                limit: size,
                offset: (page - 1) * size,
            });
        }

        return res.status(200).send({
            "status": "success",
            "data": users,
        });

    }
    catch(e) {
        return res.status(500).send({
            "error": e,
        });
    }
}

const updateUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const data = req.body;

        const userExists = await User.findAll({where: {id: id}});
        if(userExists[0] === undefined){
            return res.status(400).send({
                "error": "User does not exist",
            });
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
        return res.status(500).send({
            "error": e,
        });
    }
}

const deleteUser = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        const userExists = await User.findAll({where: {id: id}});
        if(userExists[0] === undefined){
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
            "error": e,
        });
    }
}

export { createUser, getUsersByName, getUsers, getUserById, updateUser, deleteUser }