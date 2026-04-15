const express = require("express");
const cors = require("cors");
const sequelize = require("./config/connection");
const protect = require("./middleware/authMiddleware");

const authRoutes = require("./routes/authRoutes");

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);

app.get("/", (req,res) => {
    res.send("Backend API Running!");
});

const PORT = process.env.PORT || 4000;


sequelize.authenticate()
    .then(async () => {
        console.log("Database connected using Sequelize");

        await sequelize.sync({});
        console.log("Tables Synced");

        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`)
        });
    })
    .catch((error) => {
        console.error("Unable to connect to database: ", error);
    });