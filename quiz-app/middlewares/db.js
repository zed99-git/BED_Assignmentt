const sql = require('mssql');
const dbConfig = require('../dbConfig'); // Adjust the path as per your project structure

const dbMiddleware = async (req, res, next) => {
    try {
        await sql.connect(dbConfig);
        console.log("Database connection established successfully");
        next();
    } catch (err) {
        console.error("Database connection error:", err);
        next(err); // Pass the error to the error handler
    }
};

module.exports = dbMiddleware;
