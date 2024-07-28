const sql = require('mssql');
const Leaderboard = require('../models/Leaderboard');

// Get leaderboard
const getLeaderboard = (req, res) => {
    const query = 'SELECT * FROM leaderboard ORDER BY score DESC';
    const request = new sql.Request();
    request.query(query, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.send(result.recordset);
    });
};

// Add a score to the leaderboard
const addScore = (req, res) => {
    const leaderboardEntry = Leaderboard.fromRequestBody(req.body);
    const query = `
        INSERT INTO leaderboard (username, score)
        VALUES (@username, @score);
    `;
    const request = new sql.Request();
    request.input('username', sql.NVarChar, leaderboardEntry.username)
        .input('score', sql.Int, leaderboardEntry.score)
        .query(query, (err, result) => {
            if (err) return res.status(500).send(err);
            res.send('Score added successfully');
        });
};

module.exports = {
    getLeaderboard,
    addScore
};
