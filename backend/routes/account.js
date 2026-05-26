// backend/routes/account.js

const express = require("express");
const mongoose = require("mongoose");

const { authMiddleware } = require("../middleware");
const { Account, Transaction } = require("../db");

const router = express.Router();



// ================= GET BALANCE =================

router.get("/balance", authMiddleware, async (req, res) => {

    try {

        const account = await Account.findOne({
            userId: req.userId
        });

        if (!account) {
            return res.status(404).json({
                message: "Account not found"
            });
        }

        res.status(200).json({
            balance: account.balance
        });

    } catch (e) {

        console.log(e);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});




// ================= TRANSFER MONEY =================

router.post("/transfer", authMiddleware, async (req, res) => {

    const session = await mongoose.startSession();

    try {

        session.startTransaction();



        // EXTRACT DATA
        const amount = Number(req.body.amount);
        const to = req.body.to;



        // VALIDATE USER ID
        if (!mongoose.Types.ObjectId.isValid(to)) {

            await session.abortTransaction();
            session.endSession();

            return res.status(400).json({
                message: "Invalid user id"
            });
        }



        // VALIDATE AMOUNT
        if (!amount || amount <= 0) {

            await session.abortTransaction();
            session.endSession();

            return res.status(400).json({
                message: "Invalid amount"
            });
        }



        // PREVENT SELF TRANSFER
        if (to === req.userId) {

            await session.abortTransaction();
            session.endSession();

            return res.status(400).json({
                message: "Cannot transfer to yourself"
            });
        }



        // FIND SENDER ACCOUNT
        const account = await Account.findOne({
            userId: req.userId
        }).session(session);

        if (!account) {

            await session.abortTransaction();
            session.endSession();

            return res.status(404).json({
                message: "Sender account not found"
            });
        }



        // CHECK BALANCE
        if (account.balance < amount) {

            await session.abortTransaction();
            session.endSession();

            return res.status(400).json({
                message: "Insufficient balance"
            });
        }



        // FIND RECEIVER ACCOUNT
        const toAccount = await Account.findOne({
            userId: to
        }).session(session);

        if (!toAccount) {

            await session.abortTransaction();
            session.endSession();

            return res.status(404).json({
                message: "Receiver account not found"
            });
        }



        // DEDUCT MONEY FROM SENDER
        await Account.updateOne(
            {
                userId: req.userId
            },
            {
                $inc: {
                    balance: -amount
                }
            },
            {
                session
            }
        );



        // ADD MONEY TO RECEIVER
        await Account.updateOne(
            {
                userId: to
            },
            {
                $inc: {
                    balance: amount
                }
            },
            {
                session
            }
        );

        // SAVE TRANSACTION HISTORY
        await Transaction.create([{
            from: req.userId,
            to,
            amount
        }], { session });


        // COMMIT TRANSACTION
        await session.commitTransaction();

        session.endSession();



        res.status(200).json({
            message: "Transfer successful"
        });

    } catch (e) {

        if (session.inTransaction()) {
            await session.abortTransaction();
        }

        session.endSession();

        console.log(e);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});




// ================= TRANSACTION HISTORY =================

router.get("/history", authMiddleware, async (req, res) => {

    try {

        const transactions = await Transaction.find({
            $or: [
                { from: req.userId },
                { to: req.userId }
            ]
        })
        .sort({ createdAt: -1 })
        .populate("from", "firstName lastName")
        .populate("to", "firstName lastName");



        res.status(200).json({
            transactions
        });

    } catch (e) {

        console.log(e);

        res.status(500).json({
            message: "Internal server error"
        });
    }
});


module.exports = router;