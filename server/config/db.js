const mysql = require("mysql2");
require("dotenv").config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

connection.connect((error) => {
    if(error) {
        console.log("Database connection failed: ", error);
    }else{
        console.log("Connected to MySQL database");
    }
});

module.exports = connection;