import config from "config";
import { Response, NextFunction } from "express";
const jwt = require('jsonwebtoken');

import Payload from "../types/Payload";
import Request from "../types/Request";

export default function(req: Request, res: Response, next: NextFunction) {
    try {
        const token = req.header("x-auth-token");
        const decoded = jwt.verify(token,  config.get("jwtSecret"));
        req.userId = decoded.userId
        next();
    } catch (err) {
        return res.status(401).json({
            message: 'auth failed'
        });
    }
};