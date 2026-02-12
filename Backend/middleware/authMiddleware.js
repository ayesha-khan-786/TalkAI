import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authMiddleware = async (req, res, next) => 
     {

        console.log("Headers received", req.headers);
        // 1. Get token from header
        const authHeader = req.headers.authorization;

        if(!authHeader) {
            return res.status(401).json({ message: "No token, authorization denied" });
        }

        const token = authHeader.split(" ")[1];

       // console.log("JWT Secret in MIddleware:", process.env.JWT_SECRET);

        if(!token) {
            return res.status(401).json({ message: "Token missing" });
        }

        try {
        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Attach user to request
        req.user = decoded;

        next();     // continue to route
    } catch(err) {
        res.status(401).json({ message: "token is not valid" });
    }
};

export default authMiddleware;