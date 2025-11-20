const mysql = require("mysql2/promise");
require("dotenv").config();

const db = mysql.createPool({
    host: "localhost",
    user:"root",
    password: "",
    database: "saepsaude"
});

module.exports = db;