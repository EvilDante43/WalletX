// backend/middleware.js

const jwt = require("jsonwebtoken");

const { JWT_SECRET } = require("./config");



const authMiddleware = (req, res, next) => {

    try {

        const authHeader = req.headers.authorization;



        // CHECK TOKEN EXISTS
        if (!authHeader || !authHeader.startsWith("Bearer ")) {

            return res.status(401).json({
                message: "Authorization token missing"
            });
        }



        // EXTRACT TOKEN
        const token = authHeader.split(" ")[1];



        // VERIFY TOKEN
        const decoded = jwt.verify(token, JWT_SECRET);



        // STORE USER ID
        req.userId = decoded.userId;



        next();

    } catch (err) {

        console.log(err);

        return res.status(401).json({
            message: "Invalid or expired token"
        });
    }
};



module.exports = {
    authMiddleware
};