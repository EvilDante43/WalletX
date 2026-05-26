require("dotenv").config();

const dns = require("dns");

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const express = require("express");
const cors = require("cors");

require("./db");

const rootRouter = require("./routes/index");

const app = express();



// ================= MIDDLEWARES =================

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true
}));

app.use(express.json());




// ================= ROUTES =================

app.use("/api/v1", rootRouter);




// ================= HEALTH CHECK =================

app.get("/", (req, res) => {
    res.send("Wallet API running successfully");
});




// ================= SERVER =================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});