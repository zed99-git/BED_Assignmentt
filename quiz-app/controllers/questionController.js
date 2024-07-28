const sql = require('mssql');
const Question = require('../models/Question');

// Get all questions
const getQuestions = (req, res) => {
    const query = 'SELECT * FROM questions';
    const request = new sql.Request();
    request.query(query, (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.send(result.recordset);
    });
};

// Create a new question
const createQuestion = (req, res) => {
    const question = Question.fromRequestBody(req.body);
    const query = `
        INSERT INTO questions (question, option_a, option_b, option_c, option_d, correct_option)
        VALUES (@question, @option_a, @option_b, @option_c, @option_d, @correct_option);
    `;
    const request = new sql.Request();
    request.input('question', sql.NVarChar, question.question)
        .input('option_a', sql.NVarChar, question.option_a)
        .input('option_b', sql.NVarChar, question.option_b)
        .input('option_c', sql.NVarChar, question.option_c)
        .input('option_d', sql.NVarChar, question.option_d)
        .input('correct_option', sql.NVarChar, question.correct_option)
        .query(query, (err, result) => {
            if (err) return res.status(500).send(err);
            res.send('Question added successfully');
        });
};

module.exports = {
    getQuestions,
    createQuestion
};
