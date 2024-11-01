import jwt from 'jsonwebtoken';
import {User} from "../../db/models.js";
import * as bcrypt from 'bcrypt';

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const userExists = await User.findOne({where: {email: email}});
        if(!userExists) {
            return res.status(400).send({
                "error": "Incorrect email or password",
            });
        }
        if(!userExists.active) {
            return res.status(400).send({
                "error": "User not active",
            });
        }

        const isMatch = await bcrypt.compare(password, userExists.password);
        if (isMatch) {
            let token =  await jwt.sign(
                { id: userExists.id, email: userExists.email, userType: userExists.userType },
                process.env.JWT_SECRET,
                { expiresIn: '2h' }
                );
            return res.status(200).send({
                "status": "success",
                "token": token
            })
        } else {
            return res.status(400).send({
                "error": "Incorrect email or password",
            });
        }

    }
    catch(e) {
        console.log(e)
        return res.status(500).send({
            "error": e,
        });
    }
};

const validate = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        const token = auth && auth.split(' ')[1];
        if (!token) return res.status(401).send({
            "error": "Unauthorized",
        });
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if(err) return res.status(401).send({
                "error": "Unauthorized",
            });
            let method = req.route.stack[1].method;
            if(method === "deleteUser" || method === "updateUser") {
                if(user.id !== parseInt(req.params.id)) return res.status(401).send({
                    "error": "Unauthorized",
                });
            }
            if(method === "createGenre" || method === "deleteGenre") {
                if(user.userType !== "admin") return res.status(401).send({
                    "error": "Unauthorized",
                });
            }
            if(method === "multerMiddleware") {
                method = req.route.stack[2].method;
                if(method === "createAlbum" || method === "deleteAlbum") {
                    if(user.userType === "user") return res.status(401).send({
                        "error": "Unauthorized",
                    });
                }
            }
            req.user = user;
            next();
        });
    }
    catch(e) {
        return res.status(500).send({
            "error": e,
        });
    }
}

export { login, validate };