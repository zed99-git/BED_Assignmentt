const express = require("express");
const controller = require("./controller/controller"); 
const sql = require("mssql"); 
const dbConfig = require("./dbConfig");
const bodyParser = require("body-parser");
const cors = require('cors');

const app = express();
const port = 3000; 

app.use(cors());

const staticMiddleware = express.static("public");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(staticMiddleware);

app.get("/data", controller.getAllDRS);
app.get("/data/:weekly", controller.getDRSByWeekly);
app.post("/data",controller.createDRS);
app.delete("/data/:weekly",controller.deleteDRS);
app.put("/data/:weekly",controller.updateDRS);

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

