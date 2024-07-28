CREATE TABLE questions (
    id INT IDENTITY(1,1) PRIMARY KEY,
    question NVARCHAR(255) NOT NULL,
    option_a NVARCHAR(255) NOT NULL,
    option_b NVARCHAR(255) NOT NULL,
    option_c NVARCHAR(255) NOT NULL,
    option_d NVARCHAR(255) NOT NULL,
    correct_option NVARCHAR(1) NOT NULL
);

CREATE TABLE leaderboard (
    id INT IDENTITY(1,1) PRIMARY KEY,
    username NVARCHAR(100) NOT NULL,
    score INT NOT NULL
);

SELECT * FROM questions

SELECT * FROM leaderboard
