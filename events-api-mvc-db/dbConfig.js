module.exports = {
    user: "eventsapi_user", // Replace with your SQL Server login username
    password: "12345@@@", // Replace with your SQL Server login password
    server: "localhost",
    database: "bed_assignment",
    trustServerCertificate: true,
    options: {
      port: 1433, // Default SQL Server port
      connectionTimeout: 60000, // Connection timeout in milliseconds
    },
  };