const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const dbConfig = require('./dbConfig'); // Adjust the path as per your project structure
const questionController = require('./controllers/questionController');
const leaderboardController = require('./controllers/leaderboardController');
const sql = require('mssql');
const cors = require('cors');


// Load environment variables
dotenv.config();

const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(cors());



// Routes
// Quiz Routes
app.get('/questions', questionController.getQuestions);
app.post('/questions', questionController.createQuestion);

// Leaderboard Routes
app.get('/leaderboard', leaderboardController.getLeaderboard);
app.post('/leaderboard', leaderboardController.addScore);

// Start the server
const port = 3000;

app.listen(port, async () => {
    try {
      // Connect to the database
      await sql.connect(dbConfig);
      console.log("Database connection established successfully");
    } catch (err) {
      console.error("Database connection error:", err);
      // Terminate the application with an error code (optional)
      process.exit(1); // Exit with code 1 indicating an error
    }
  
    console.log(`Server listening on port ${port}`);
  });
  
  // Close the connection pool on SIGINT signal
  process.on("SIGINT", async () => {
    console.log("Server is gracefully shutting down");
    // Perform cleanup tasks (e.g., close database connections)
    await sql.close();
    console.log("Database connection closed");
    process.exit(0); // Exit with code 0 indicating successful shutdown
  });
