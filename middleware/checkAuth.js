import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";

export default async function checkAuth(req, res, next) {
    
    if (!req.headers.authorization) {
        return res.status(403).send({ msg: "Token no proporcionado" });
    }

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            let token
            token  = req.headers.authorization.split(" ")[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            req.usuario = await Usuario.findById(decoded.id).select("-password -confirmado -token -createdAt -updatedAt -__v")
            return next()
        } catch (error) {
            return res.status(403).send({ msg: "Token invalido" });
        }
    }

    next()

};

