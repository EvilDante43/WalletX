// backend/db.js

const mongoose = require("mongoose");



// CONNECT DATABASE
mongoose.connect(process.env.MONGO_URL)
    .then(() => {
        console.log("MongoDB connected");
    })
    .catch((err) => {
        console.log("MongoDB connection error:", err);
    });




// ================= USER SCHEMA =================

const userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        minlength: 3,
        maxlength: 30
    },

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    firstName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    },

    lastName: {
        type: String,
        required: true,
        trim: true,
        maxlength: 50
    }

}, {
    timestamps: true
});




// ================= ACCOUNT SCHEMA =================

const accountSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    },

    balance: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    }

}, {
    timestamps: true
});

// ================= TRANSACTION SCHEMA =================

const transactionSchema = new mongoose.Schema({

    from: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    to: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    amount: {
        type: Number,
        required: true
    }

}, {
    timestamps: true
});


// ================= MODELS =================

const User = mongoose.model("User", userSchema);

const Account = mongoose.model("Account", accountSchema);

const Transaction = mongoose.model("Transaction", transactionSchema
);


// ================= EXPORTS =================

module.exports = {
    User,
    Account,
    Transaction,
};