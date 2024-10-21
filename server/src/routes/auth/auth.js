import jwt from 'jsonwebtoken';
import {User} from "../../db/models.js";
import * as bcrypt from 'bcrypt';

const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        console.log(req.body);
        const userExists = await User.findAll({where: {email: email}});
        if(userExists[0] === undefined) {
            return res.status(400).send({
                "error": "User does not exist",
            });
        }

        const isMatch = await bcrypt.compare(password, userExists[0].password);
        console.log(isMatch)
        if (isMatch) {
            let token =  await jwt.sign(
                { id: userExists[0].id, email: userExists[0].email, userType: userExists[0].userType },
                process.env.JWT_SECRET,
                { expiresIn: '2h' }
                );
            console.log(token)
            return res.status(200).send({
                "status": "success",
                "token": token,
            })
        } else {
            return res.status(400).send({
                "error": "Incorrect password",
            });
        }

    }
    catch(e) {
        return res.status(500).send({
            "error": e,
        });
    }
};

const validate = async (req, res, next) => {
    try {
        const auth = req.headers.authorization;
        const token = auth && auth.split(' ')[1];

        if (token == null) return res.status(401).send({
            "error": "Unauthorized",
        });
        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) return res.status(401).send({
                "error": "Unauthorized",
            });
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

const validateOwner = async (req, res, next) => {
    try {
        const requester = parseInt(req.user.id);
        const request = parseInt(req.params.id);
        if(request === request) {
            next();
        }
        return res.status(401).send({
            "error": "Unauthorized",
        });
    }
    catch(e) {
        return res.status(500).send({
            "error": e,
        });
    }
}

const validateType = async (req, res, next) => {

}

export { login, validate, validateOwner };