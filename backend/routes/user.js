// backend/routes/user.js

const express = require("express");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const { User, Account } = require("../db");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../middleware");

const router = express.Router();



// ================= SIGNUP =================

const signupBody = zod.object({
    username: zod.string().email(),
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string().min(6)
});

router.post("/signup", async (req, res) => {

    try {

        const { success } = signupBody.safeParse(req.body);

        if (!success) {
            return res.status(400).json({
                message: "Incorrect inputs"
            });
        }

        const existingUser = await User.findOne({
            username: req.body.username
        });

        if (existingUser) {
            return res.status(409).json({
                message: "Email already taken"
            });
        }



        // HASH PASSWORD
        const hashedPassword = await bcrypt.hash(
            req.body.password,
            10
        );



        const user = await User.create({
            username: req.body.username,
            password: hashedPassword,
            firstName: req.body.firstName,
            lastName: req.body.lastName
        });

        const userId = user._id;

        await Account.create({
            userId,
            balance: Math.floor(1 + Math.random() * 10000)
        });

        const token = jwt.sign(
            {
                userId
            },
            JWT_SECRET
        );

        res.status(201).json({
            message: "User created successfully",
            token
        });

    } catch (e) {

        console.log(e);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});




// ================= SIGNIN =================

const signinBody = zod.object({
    username: zod.string().email(),
    password: zod.string()
});

router.post("/signin", async (req, res) => {

    try {

        const { success } = signinBody.safeParse(req.body);

        if (!success) {
            return res.status(400).json({
                message: "Incorrect inputs"
            });
        }

        const user = await User.findOne({
            username: req.body.username
        });

        if (!user) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }



        // COMPARE PASSWORD
        const passwordMatch = await bcrypt.compare(
            req.body.password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                message: "Invalid credentials"
            });
        }



        const token = jwt.sign(
            {
                userId: user._id
            },
            JWT_SECRET
        );

        res.status(200).json({
            token
        });

    } catch (e) {

        console.log(e);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});




// ================= UPDATE USER =================

const updateBody = zod.object({
    password: zod.string().optional(),
    firstName: zod.string().optional(),
    lastName: zod.string().optional()
});

router.put("/", authMiddleware, async (req, res) => {

    try {

        const { success } = updateBody.safeParse(req.body);

        if (!success) {
            return res.status(400).json({
                message: "Invalid inputs"
            });
        }



        // HASH NEW PASSWORD IF PROVIDED
        if (req.body.password) {
            req.body.password = await bcrypt.hash(
                req.body.password,
                10
            );
        }



        await User.updateOne(
            {
                _id: req.userId
            },
            req.body
        );

        res.status(200).json({
            message: "Updated successfully"
        });

    } catch (e) {

        console.log(e);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});




// ================= SEARCH USERS =================

router.get("/bulk", authMiddleware, async (req, res) => {

    try {

        const filter = req.query.filter || "";

        const users = await User.find({
            _id: { $ne: req.userId }, // current user ko exclude karega

            $or: [
                {
                    firstName: {
                        $regex: filter,
                        $options: "i"
                    }
                },
                {
                    lastName: {
                        $regex: filter,
                        $options: "i"
                    }
                }
            ]
        });

        res.status(200).json({
            users: users.map(user => ({
                username: user.username,
                firstName: user.firstName,
                lastName: user.lastName,
                _id: user._id
            }))
        });

    } catch (e) {

        console.log(e);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});



module.exports = router;