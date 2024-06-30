module.exports = {
    user: "bed", // Replace with your SQL Server login username
    password: "bed", // Replace with your SQL Server login password
    server: "localhost",
    database: "infection_record",
    trustServerCertificate: true,
    options: {
      port: 1433, // Default SQL Server port, or manually set in sql settings
      connectionTimeout: 60000, // Connection timeout in milliseconds
    },
};
