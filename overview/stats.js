const express = require("express");
const controller = require("./controller/controller");
const sql = require("mssql"); 
const dbConfig = require("./dbConfig");

const app = express();
const port = process.env.PORT || 3000; 

app.get("/data", controller.getAllDRS);
app.get("/data/:weekly", controller.getDRSByWeekly);

app.listen(port, async () => {
  try {
    // Connect to the database
    await sql.connect(dbConfig);
    console.log("Database connection established successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }

  console.log(`Server listening on port ${port}`);
});


process.on("SIGINT", async () => {
  console.log("Server is shutting down");

  await sql.close();
  console.log("Database connection closed");
  process.exit(0); 
});