const express = require("express");
const cors = require("cors");
const sequelize = require("./config/connection");

const authRoutes = require("./routes/authRoutes");
require("dotenv").config();

const app = express();
app.use(cors({
    origin: "https://user-auth-client.onrender.com",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Backend API Running!");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

sequelize.authenticate()
    .then(async () => {
        console.log("Database connected using Sequelize");
        await sequelize.sync({});
        console.log("Tables Synced");
    })
    .catch((error) => {
        console.error("Unable to connect to database: ", error);
    });