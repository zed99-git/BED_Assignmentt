const express = require("express");
const eventsController = require("./controllers/eventsController");
const sessionsController = require("./controllers/sessionsController");
const sql = require("mssql"); // Assuming you've installed mssql
const dbConfig = require("./dbConfig");
const bodyParser = require("body-parser"); // Import body-parser
const validateEvent = require("./middlewares/validateEvent");

const app = express();
const port = process.env.PORT || 3001; // Use environment variable or default port
const staticMiddleware = express.static("public"); // Path to the public folder

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // For form data handling
app.use(staticMiddleware);

app.get("/events", eventsController.getAllEvents);
app.get("/events/:id", eventsController.getEventById);
app.post("/events", validateEvent, eventsController.createEvent); // POST for creating events (can handle JSON data)
app.put("/events/:id", eventsController.updateEvent); // PUT for updating events
app.delete("/events/:id", eventsController.deleteEvent); // DELETE for deleting events

app.post("/sessions/book", sessionsController.bookSession);

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